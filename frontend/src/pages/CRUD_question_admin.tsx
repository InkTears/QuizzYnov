import React, { useState, useEffect } from 'react';
import '../css/questions.css';
//import quizService from '../services/quizService';

interface Question {
    id?: string;
    text: string;
    options: string[];
    correctAnswer: number;
}

const CRUDQuestionAdmin: React.FC = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [newQuestion, setNewQuestion] = useState<Question>({
        text: '',
        options: ['', '', '', ''],
        correctAnswer: 0
    });

    // 1. Charger les questions au démarrage
    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const data = await quizService.getAllQuestions();
            setQuestions(data || []);
        } catch (err) {
            console.error("Erreur lors de la récupération des questions", err);
        }
    };

    // 2. Gérer l'ajout d'une nouvelle question
    const handleAddQuestion = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await quizService.createQuestion(newQuestion);
            // Réinitialisation du formulaire
            setNewQuestion({ text: '', options: ['', '', '', ''], correctAnswer: 0 });
            fetchQuestions(); // Rafraîchir la liste
        } catch (err) {
            alert("Erreur lors de l'ajout de la question");
        }
    };

    // 3. Gérer la suppression d'une question
    const handleDelete = async (id: string) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette question ?")) {
            try {
                await quizService.deleteQuestion(id);
                fetchQuestions();
            } catch (err) {
                alert("Erreur lors de la suppression");
            }
        }
    };

    return (
        <div className="crud-container">
            <h1>Gestion des Questions</h1>

            {/* Formulaire de création */}
            <section className="card">
                <h3>Nouvelle Question</h3>
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
                            // On vérifie si l'index actuel (i) est celui stocké dans correctAnswer
                            const isSelected = newQuestion.correctAnswer === i;

                            return (
                                <div
                                    key={i}
                                    className={`option-field ${isSelected ? 'is-correct' : 'is-incorrect'}`}
                                >
                                    <input
                                        type="radio"
                                        id={`opt-${i}`}
                                        name="correct"
                                        checked={isSelected}
                                        onChange={() => setNewQuestion({...newQuestion, correctAnswer: i})}
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
                                    {/* ICI LA CORRECTION : Affichage dynamique du texte */}
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

            {/* Table d'affichage de la base de données */}
            <section className="questions-list">
                <h3>Base de données ({questions.length})</h3>
                <table className="admin-table">
                    <thead>
                    <tr>
                        <th>Question</th>
                        <th>État</th>
                        <th style={{textAlign: 'right'}}>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {questions.map((q) => (
                        <tr key={q.id}>
                            <td style={{fontWeight: '600'}}>{q.text}</td>
                            <td style={{color: '#718096'}}>{q.options.length} réponses enregistrées</td>
                            <td style={{textAlign: 'right'}}>
                                <button className="btn-delete" onClick={() => q.id && handleDelete(q.id)}>
                                    Supprimer
                                </button>
                            </td>
                        </tr>
                    ))}
                    {questions.length === 0 && (
                        <tr>
                            <td colSpan={3} style={{textAlign: 'center', padding: '40px', color: '#718096'}}>
                                Aucune question disponible dans la base de données.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </section>
        </div>
    );
};

export default CRUDQuestionAdmin;