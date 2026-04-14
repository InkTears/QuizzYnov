import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import '../css/questions.css';
import quizService from '../api/quizApi';

interface Question {
    id?: string | number;
    text: string;
    options: string[];
    correctAnswers: number[];
}

const EMPTY_QUESTION: Question = {
    text: '',
    options: ['', '', '', ''],
    correctAnswers: []
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

const CRUDQuestionAdmin: React.FC = () => {
    const shouldReduceMotion = useReducedMotion();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [newQuestion, setNewQuestion] = useState<Question>(EMPTY_QUESTION);
    const [isImporting, setIsImporting] = useState(false);
    const [importMessage, setImportMessage] = useState('');
    const [expandedQuestions, setExpandedQuestions] = useState<Set<string | number>>(new Set());

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const data = await quizService.getAllQuestions();
            setQuestions(data || []);
        } catch (err) {
            console.error('Erreur recuperation', err);
        }
    };

    const handleToggleCorrect = (index: number) => {
        setNewQuestion((prev) => {
            const currentAnswers = [...prev.correctAnswers];
            if (currentAnswers.includes(index)) {
                return { ...prev, correctAnswers: currentAnswers.filter((i) => i !== index) };
            }
            return { ...prev, correctAnswers: [...currentAnswers, index] };
        });
    };

    const handleAddQuestion = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newQuestion.correctAnswers.length === 0) {
            alert('Veuillez cocher au moins une bonne réponse.');
            return;
        }
        try {
            await quizService.createQuestion(newQuestion);
            setNewQuestion(EMPTY_QUESTION);
            await fetchQuestions();
        } catch (err) {
            alert("Erreur lors de l'ajout");
        }
    };

    const handleDelete = async (id: string | number | undefined) => {
        if (!id) return;
        if (window.confirm('Supprimer cette question ?')) {
            await quizService.deleteQuestion(id);
            await fetchQuestions();
        }
    };

    const toggleQuestionExpanded = (id: string | number | undefined) => {
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

    const normalizeCorrectAnswers = (raw: string): number[] =>
        raw
            .split(/[|,;]/)
            .map((part) => Number.parseInt(part.trim(), 10))
            .filter((value) => Number.isInteger(value) && value >= 1 && value <= 4)
            .map((value) => value - 1);

    const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImportMessage('');

        if (!file.name.toLowerCase().endsWith('.csv')) {
            setImportMessage('Format non pris en charge. Utilisez un CSV exporte depuis Excel.');
            e.target.value = '';
            return;
        }

        setIsImporting(true);
        try {
            const content = await file.text();
            const lines = content
                .split(/\r?\n/)
                .map((line) => line.trim())
                .filter((line) => line.length > 0);

            if (lines.length <= 1) {
                setImportMessage('Le fichier est vide ou ne contient pas de donnees importables.');
                return;
            }

            let successCount = 0;
            let failedCount = 0;

            for (let i = 1; i < lines.length; i += 1) {
                const cols = splitCsvLine(lines[i]);
                if (cols.length < 6) {
                    failedCount += 1;
                    continue;
                }

                const [text, o1, o2, o3, o4, correctRaw] = cols;
                const payload: Question = {
                    text: text?.trim() || '',
                    options: [o1?.trim() || '', o2?.trim() || '', o3?.trim() || '', o4?.trim() || ''],
                    correctAnswers: normalizeCorrectAnswers(correctRaw || '')
                };

                if (!payload.text || payload.options.some((opt) => !opt) || payload.correctAnswers.length === 0) {
                    failedCount += 1;
                    continue;
                }

                try {
                    await quizService.createQuestion(payload);
                    successCount += 1;
                } catch (error) {
                    failedCount += 1;
                }
            }

            setImportMessage(`Import termine: ${successCount} ajoutees, ${failedCount} ignorees.`);
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
            'question;option1;option2;option3;option4;correctAnswers',
            '"Quelle est la capitale de la France ?";"Paris";"Lyon";"Marseille";"Nice";"1"',
            '"Quels nombres sont pairs ?";"1";"2";"3";"4";"2|4"'
        ];

        const csvContent = `\uFEFF${csvRows.join('\n')}`;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'template_questions_quizynov.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

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
                <h3>Nouvelle Question (choix multiples possibles)</h3>
                <form onSubmit={handleAddQuestion}>
                    <motion.input
                        className="main-input"
                        placeholder="Enoncez votre question ici..."
                        value={newQuestion.text}
                        onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                        required
                        whileFocus={shouldReduceMotion ? undefined : { scale: 1.005 }}
                    />

                    <div className="options-grid">
                        {newQuestion.options.map((opt, i) => {
                            const isSelected = newQuestion.correctAnswers.includes(i);
                            return (
                                <motion.div
                                    key={i}
                                    className={`option-field ${isSelected ? 'is-correct' : 'is-incorrect'}`}
                                    layout
                                    whileHover={shouldReduceMotion ? undefined : { y: -1 }}
                                >
                                    <input
                                        type="checkbox"
                                        id={`opt-${i}`}
                                        checked={isSelected}
                                        onChange={() => handleToggleCorrect(i)}
                                    />
                                    <input
                                        type="text"
                                        placeholder={`Réponse ${i + 1}`}
                                        value={opt}
                                        onChange={(e) => {
                                            const newOpts = [...newQuestion.options];
                                            newOpts[i] = e.target.value;
                                            setNewQuestion({ ...newQuestion, options: newOpts });
                                        }}
                                        required
                                    />
                                    <label htmlFor={`opt-${i}`} className="radio-label">
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
                    Colonnes: question ; option1 ; option2 ; option3 ; option4 ; correctAnswers (ex: 1|3)
                </p>
                <motion.button
                    type="button"
                    className="btn-template"
                    onClick={handleDownloadTemplate}
                    whileHover={shouldReduceMotion ? undefined : { y: -1 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
                >
                    Telecharger le template CSV
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
                <h3>Base de donnees ({questions.length})</h3>
                <div className="questions-list-wrapper">
                    <AnimatePresence initial={false}>
                        {questions.map((q) => {
                            const isExpanded = expandedQuestions.has(q.id || q.text);
                            return (
                                <motion.div
                                    key={q.id || q.text}
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
                                                <p className="question-title">{q.text}</p>
                                                <p className="question-stats">
                                                    {q.options.length} options • {q.correctAnswers?.length || 0} correctes
                                                </p>
                                            </div>
                                        </div>
                                        <motion.button
                                            className="btn-delete"
                                            onClick={() => q.id && handleDelete(q.id)}
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
                                                    {q.options.map((option, idx) => (
                                                        <div
                                                            key={idx}
                                                            className={`answer-row ${q.correctAnswers.includes(idx) ? 'correct' : 'incorrect'}`}
                                                        >
                                                            <span className="answer-badge">
                                                                {q.correctAnswers.includes(idx) ? '✓' : '✗'}
                                                            </span>
                                                            <span className="option-letter">
                                                                {String.fromCharCode(65 + idx)}.
                                                            </span>
                                                            <span className="answer-text">{option}</span>
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
