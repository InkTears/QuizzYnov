import React, { useState, useEffect } from 'react';
import '../css/questions.css';
//import quizService from '../services/quizService';

interface Question {
    id?: string;
    text: string;
    options: string[];
    correctAnswers: number[]; // Changement : c'est maintenant un tableau
}

const CRUDQuestionAdmin: React.FC = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [newQuestion, setNewQuestion] = useState<Question>({
        text: '',
        options: ['', '', '', ''],
        correctAnswers: [] // Initialisé vide
    });

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const data = await quizService.getAllQuestions();
            setQuestions(data || []);
        } catch (err) {
            console.error("Erreur récupération", err);
        }
    };

    // Logique pour ajouter/retirer un index de réponse correcte
    const handleToggleCorrect = (index: number) => {
        setNewQuestion(prev => {
            const currentAnswers = [...prev.correctAnswers];
            if (currentAnswers.includes(index)) {
                // Si déjà présent, on le retire
                return { ...prev, correctAnswers: currentAnswers.filter(i => i !== index) };
            } else {
                // Sinon, on l'ajoute
                return { ...prev, correctAnswers: [...currentAnswers, index] };
            }
        });
    };

    const handleAddQuestion = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newQuestion.correctAnswers.length === 0) {
            alert("Veuillez cocher au moins une bonne réponse.");
            return;
        }
        try {
            await quizService.createQuestion(newQuestion);
            setNewQuestion({ text: '', options: ['', '', '', ''], correctAnswers: [] });
            fetchQuestions();
        } catch (err) {
            alert("Erreur lors de l'ajout");
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Supprimer cette question ?")) {
            await quizService.deleteQuestion(id);
            fetchQuestions();
        }
    };

    return (
        <div className="crud-container">
            <h1>Gestion des Questions</h1>

            <section className="card">
                <h3>Nouvelle Question (Choix multiples possibles)</h3>
                <form onSubmit={handleAddQuestion}>
                    <input
                        className="main-input"
                        placeholder="Énoncez votre question ici..."
                        value={newQuestion.text}
                        onChange={e => setNewQuestion({...newQuestion, text: e.target.value})}
                        required
                    />

                    <div className="options-grid">
                        {newQuestion.options.map((opt, i) => {
                            const isSelected = newQuestion.correctAnswers.includes(i);
                            return (
                                <div
                                    key={i}
                                    className={`option-field ${isSelected ? 'is-correct' : 'is-incorrect'}`}
                                >
                                    <input
                                        type="checkbox" // Changement : radio -> checkbox
                                        id={`opt-${i}`}
                                        checked={isSelected}
                                        onChange={() => handleToggleCorrect(i)}
                                    />
                                    <input
                                        type="text"
                                        placeholder={`Réponse ${i + 1}`}
                                        value={opt}
                                        onChange={e => {
                                            const newOpts = [...newQuestion.options];
                                            newOpts[i] = e.target.value;
                                            setNewQuestion({...newQuestion, options: newOpts});
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
                    <button type="submit" className="btn-save">Enregistrer la question</button>
                </form>
            </section>

            <section className="questions-list">
                <h3>Base de données ({questions.length})</h3>
                <table className="admin-table">
                    <thead>
                    <tr>
                        <th>Question</th>
                        <th>Réponses</th>
                        <th style={{textAlign: 'right'}}>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {questions.map((q) => (
                        <tr key={q.id}>
                            <td style={{fontWeight: '600'}}>{q.text}</td>
                            <td style={{color: '#718096'}}>
                                {q.options.length} options ({q.correctAnswers?.length || 0} correctes)
                            </td>
                            <td style={{textAlign: 'right'}}>
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