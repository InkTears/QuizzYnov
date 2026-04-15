import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import '../css/questions.css';
import quizService from '../api/quizApi';

type AdminQuestion = {
    id: number;
    content: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
};

type CorrectAnswer = 'A' | 'B' | 'C' | 'D';

type CsvQuestionRow = {
    content: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_answers: CorrectAnswer;
};

const BATCH_SIZE = 100;

const EMPTY_QUESTION = {
    content: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 'A' as CorrectAnswer
};

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.08
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.28 }
    }
};

const splitCsvLine = (line: string): string[] => {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i += 1) {
        const char = line[i];
        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                current += '"';
                i += 1;
            } else {
                inQuotes = !inQuotes;
            }
        } else if ((char === ';' || char === ',') && !inQuotes) {
            values.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }

    values.push(current.trim());
    return values.map((value) => value.replace(/^"(.*)"$/, '$1').trim());
};

const parseCsv = (content: string): { rows: CsvQuestionRow[]; invalidCount: number } => {
    const lines = content
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

    if (lines.length < 2) {
        return { rows: [], invalidCount: 0 };
    }

    const header = splitCsvLine(lines[0]).map((col) => col.toLowerCase());
    const requiredHeader = ['content', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_answers'];
    const hasValidHeader = requiredHeader.every((column, index) => header[index] === column);

    if (!hasValidHeader) {
        throw new Error('En-tetes invalides. Attendu: content,option_a,option_b,option_c,option_d,correct_answers');
    }

    const rows: CsvQuestionRow[] = [];
    let invalidCount = 0;

    for (let i = 1; i < lines.length; i += 1) {
        const columns = splitCsvLine(lines[i]);
        if (columns.length < 6) {
            invalidCount += 1;
            continue;
        }

        const [contentCell, a, b, c, d, correctRaw] = columns;
        const correct = (correctRaw || '').toUpperCase() as CorrectAnswer;

        if (!contentCell || !a || !b || !c || !d || !['A', 'B', 'C', 'D'].includes(correct)) {
            invalidCount += 1;
            continue;
        }

        rows.push({
            content: contentCell,
            option_a: a,
            option_b: b,
            option_c: c,
            option_d: d,
            correct_answers: correct
        });
    }

    return { rows, invalidCount };
};

const toBatches = <T,>(items: T[], size: number): T[][] => {
    const batches: T[][] = [];
    for (let i = 0; i < items.length; i += size) {
        batches.push(items.slice(i, i + size));
    }
    return batches;
};

const CRUDQuestionAdmin: React.FC = () => {
    const shouldReduceMotion = useReducedMotion();
    const navigate = useNavigate();

    const [questions, setQuestions] = useState<AdminQuestion[]>([]);
    const [newQuestion, setNewQuestion] = useState(EMPTY_QUESTION);
    const [isImporting, setIsImporting] = useState(false);
    const [importMessage, setImportMessage] = useState('');
    const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());

    const expectedHeader = useMemo(
        () => 'content,option_a,option_b,option_c,option_d,correct_answers',
        []
    );

    const fetchQuestions = async () => {
        try {
            const data = await quizService.getAllQuestions();
            setQuestions(Array.isArray(data) ? data as AdminQuestion[] : []);
        } catch (err) {
            console.error('Erreur lors de la récupération des questions', err);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    const handleAddQuestion = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await quizService.createQuestion(newQuestion);
            setNewQuestion(EMPTY_QUESTION);
            await fetchQuestions();
        } catch (err) {
            const message = err instanceof Error ? err.message : "Erreur lors de l'ajout";
            alert(message);
        }
    };

    const handleDelete = async (id: number | undefined) => {
        if (!id) return;
        if (window.confirm('Supprimer cette question ?')) {
            await quizService.deleteQuestion(String(id));
            await fetchQuestions();
        }
    };

    const toggleQuestionExpanded = (id: number | undefined) => {
        if (!id) return;
        setExpandedQuestions((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImportMessage('');

        if (!file.name.toLowerCase().endsWith('.csv')) {
            setImportMessage('Format non pris en charge. Utilisez un CSV.');
            e.target.value = '';
            return;
        }

        setIsImporting(true);
        try {
            const content = await file.text();
            const { rows, invalidCount } = parseCsv(content);

            if (rows.length === 0) {
                setImportMessage('Aucune ligne valide dans le CSV.');
                return;
            }

            const batches = toBatches(rows, BATCH_SIZE);
            let inserted = 0;

            for (let i = 0; i < batches.length; i += 1) {
                const batch = batches[i];
                await quizService.importBatch(batch);
                inserted += batch.length;
            }

            setImportMessage(
                `Import termine: ${inserted} questions ajoutees. ${invalidCount} ligne(s) ignoree(s).`
            );
            await fetchQuestions();
        } catch (error) {
            console.error(error);
            setImportMessage("Erreur pendant l'import du fichier.");
        } finally {
            setIsImporting(false);
            e.target.value = '';
        }
    };

    const handleDownloadTemplate = () => {
        const csvRows = [
            expectedHeader,
            '"Quelle est la capitale de la France ?";"Paris";"Lyon";"Marseille";"Nice";"A"',
            '"Quel langage est utilisé pour typer React ?";"PHP";"TypeScript";"Ruby";"Lua";"B"'
        ];

        const csvContent = `\uFEFF${csvRows.join('\n')}`;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'template_questions_quizzynov.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const questionOptions = (q: AdminQuestion) => [
        { key: 'A' as CorrectAnswer, value: q.optionA },
        { key: 'B' as CorrectAnswer, value: q.optionB },
        { key: 'C' as CorrectAnswer, value: q.optionC },
        { key: 'D' as CorrectAnswer, value: q.optionD }
    ];

    return (
        <motion.div className="crud-container" initial="hidden" animate="show" variants={containerVariants}>
            <motion.div className="crud-header" variants={itemVariants}>
                <h1>Gestion des Questions</h1>
                <motion.button
                    type="button"
                    className="btn-back-dashboard"
                    onClick={() => navigate('/admin/dashboard')}
                    whileHover={shouldReduceMotion ? undefined : { y: -1 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
                >
                    Retour au dashboard
                </motion.button>
            </motion.div>

            <motion.section className="card" variants={itemVariants}>
                <h3>Nouvelle Question</h3>
                <form onSubmit={handleAddQuestion}>
                    <motion.input
                        className="main-input"
                        placeholder="Enoncez votre question ici..."
                        value={newQuestion.content}
                        onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
                        required
                        whileFocus={shouldReduceMotion ? undefined : { scale: 1.005 }}
                    />

                    <div className="options-grid">
                        {([
                            { label: 'A', field: 'optionA' },
                            { label: 'B', field: 'optionB' },
                            { label: 'C', field: 'optionC' },
                            { label: 'D', field: 'optionD' }
                        ] as const).map((opt) => {
                            const isSelected = newQuestion.correctAnswer === opt.label;
                            return (
                                <motion.div
                                    key={opt.label}
                                    className={`option-field ${isSelected ? 'is-correct' : 'is-incorrect'}`}
                                    layout
                                    whileHover={shouldReduceMotion ? undefined : { y: -1 }}
                                >
                                    <input
                                        type="radio"
                                        name="correctAnswer"
                                        id={`opt-${opt.label}`}
                                        checked={isSelected}
                                        onChange={() => setNewQuestion({ ...newQuestion, correctAnswer: opt.label })}
                                    />
                                    <input
                                        type="text"
                                        placeholder={`Réponse ${opt.label}`}
                                        value={newQuestion[opt.field]}
                                        onChange={(e) => setNewQuestion({ ...newQuestion, [opt.field]: e.target.value })}
                                        required
                                    />
                                    <label htmlFor={`opt-${opt.label}`} className="radio-label">
                                        {isSelected ? 'CORRECTE' : 'INCORRECTE'}
                                    </label>
                                </motion.div>
                            );
                        })}
                    </div>

                    <motion.button
                        type="submit"
                        className="btn-save"
                        whileHover={shouldReduceMotion ? undefined : { y: -1 }}
                        whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
                    >
                        Enregistrer la question
                    </motion.button>
                </form>
            </motion.section>

            <motion.section className="card import-card" variants={itemVariants}>
                <h3>Importer via Excel (CSV)</h3>
                <p className="import-help">
                    En-tete attendu: <code>{expectedHeader}</code>
                </p>
                <motion.button
                    type="button"
                    className="btn-template"
                    onClick={handleDownloadTemplate}
                    whileHover={shouldReduceMotion ? undefined : { y: -1 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
                >
                    Télécharger le template CSV
                </motion.button>
                <div className="import-row">
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleImportFile}
                        disabled={isImporting}
                        className="file-input"
                    />
                </div>
                <AnimatePresence mode="wait" initial={false}>
                    {importMessage && (
                        <motion.p
                            key={importMessage}
                            className="import-message"
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.2 }}
                        >
                            {importMessage}
                        </motion.p>
                    )}
                </AnimatePresence>
            </motion.section>

            <motion.section className="card questions-list-card" variants={itemVariants}>
                <h3>Base de données ({questions.length})</h3>
                <div className="questions-list-wrapper">
                    <AnimatePresence initial={false}>
                        {questions.map((q) => {
                            const isExpanded = expandedQuestions.has(q.id);
                            return (
                                <motion.div
                                    key={q.id}
                                    className="question-card"
                                    layout
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.22 }}
                                >
                                    <div className="question-row">
                                        <div className="question-content">
                                            <motion.button
                                                type="button"
                                                className="btn-expand"
                                                onClick={() => toggleQuestionExpanded(q.id)}
                                                whileHover={shouldReduceMotion ? undefined : { scale: 1.1 }}
                                                whileTap={shouldReduceMotion ? undefined : { scale: 0.9 }}
                                            >
                                                {isExpanded ? '▼' : '▶'}
                                            </motion.button>
                                            <div className="question-text">
                                                <p className="question-title">{q.content}</p>
                                                <p className="question-stats">4 options • 1 correcte</p>
                                            </div>
                                        </div>
                                        <motion.button
                                            className="btn-delete"
                                            onClick={() => handleDelete(q.id)}
                                            whileHover={shouldReduceMotion ? undefined : { y: -1 }}
                                            whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
                                        >
                                            Supprimer
                                        </motion.button>
                                    </div>

                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                className="question-details"
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <div className="answers-section">
                                                    {questionOptions(q).map((option) => (
                                                        <div
                                                            key={option.key}
                                                            className="answer-row neutral"
                                                        >
                                                            <span className="answer-badge">•</span>
                                                            <span className="option-letter">{option.key}.</span>
                                                            <span className="answer-text">{option.value}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {questions.length === 0 && (
                    <motion.div
                        className="empty-state"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <p>Aucune question pour le moment. Créez-en une!</p>
                    </motion.div>
                )}
            </motion.section>
        </motion.div>
    );
};

export default CRUDQuestionAdmin;
