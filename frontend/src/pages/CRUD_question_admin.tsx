import React, { useEffect, useState } from 'react';
import '../css/questions.css';
import quizService from '../api/quizApi';

interface Question {
    id?: string;
    text: string;
    options: string[];
    correctAnswers: number[];
}

const EMPTY_QUESTION: Question = {
    text: '',
    options: ['', '', '', ''],
    correctAnswers: []
};

const CRUDQuestionAdmin: React.FC = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [newQuestion, setNewQuestion] = useState<Question>(EMPTY_QUESTION);
    const [isImporting, setIsImporting] = useState(false);
    const [importMessage, setImportMessage] = useState('');

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
            alert('Veuillez cocher au moins une bonne reponse.');
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

    const handleDelete = async (id: string) => {
        if (window.confirm('Supprimer cette question ?')) {
            await quizService.deleteQuestion(id);
            await fetchQuestions();
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

            // Header expected:
            // question;option1;option2;option3;option4;correctAnswers
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
        <div className="crud-container">
            <h1>Gestion des Questions</h1>

            <section className="card">
                <h3>Nouvelle Question (choix multiples possibles)</h3>
                <form onSubmit={handleAddQuestion}>
                    <input
                        className="main-input"
                        placeholder="Enoncez votre question ici..."
                        value={newQuestion.text}
                        onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                        required
                    />

                    <div className="options-grid">
                        {newQuestion.options.map((opt, i) => {
                            const isSelected = newQuestion.correctAnswers.includes(i);
                            return (
                                <div key={i} className={`option-field ${isSelected ? 'is-correct' : 'is-incorrect'}`}>
                                    <input
                                        type="checkbox"
                                        id={`opt-${i}`}
                                        checked={isSelected}
                                        onChange={() => handleToggleCorrect(i)}
                                    />
                                    <input
                                        type="text"
                                        placeholder={`Reponse ${i + 1}`}
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
                                </div>
                            );
                        })}
                    </div>
                    <button type="submit" className="btn-save">
                        Enregistrer la question
                    </button>
                </form>
            </section>

            <section className="card import-card">
                <h3>Importer via Excel (CSV)</h3>
                <p className="import-help">
                    Colonnes: question ; option1 ; option2 ; option3 ; option4 ; correctAnswers (ex: 1|3)
                </p>
                <button type="button" className="btn-template" onClick={handleDownloadTemplate}>
                    Telecharger le template CSV
                </button>
                <div className="import-row">
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleImportFile}
                        disabled={isImporting}
                        className="file-input"
                    />
                </div>
                {importMessage && <p className="import-message">{importMessage}</p>}
            </section>

            <section className="questions-list">
                <h3>Base de donnees ({questions.length})</h3>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Question</th>
                            <th>Reponses</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questions.map((q) => (
                            <tr key={q.id}>
                                <td style={{ fontWeight: '600' }}>{q.text}</td>
                                <td style={{ color: '#718096' }}>
                                    {q.options.length} options ({q.correctAnswers?.length || 0} correctes)
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                    <button className="btn-delete" onClick={() => q.id && handleDelete(q.id)}>
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
};

export default CRUDQuestionAdmin;
