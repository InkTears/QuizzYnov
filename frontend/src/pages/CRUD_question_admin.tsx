import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import '../css/questions.css';
import quizService from '../api/quizApi';

// Définition de la structure (le "moule") d'une Question
interface Question {
    id?: string | number; // L'ID
    text: string;         // L'énoncé de la question
    options: string[];    // Les 4 choix de réponse
    correctAnswers: number[]; // Les index (0, 1, 2 ou 3) des bonnes réponses
}

// Un modèle de question vide pour réinitialiser le formulaire
const EMPTY_QUESTION: Question = {
    text: '',
    options: ['', '', '', ''],
    correctAnswers: []
};

// Configuration des animations Framer Motion pour le conteneur principal
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08, // Fait apparaître les enfants l'un après l'autre
            delayChildren: 0.08
        }
    }
};

// Configuration des animations pour les éléments individuels (cartes, boutons)
const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.28 }
    }
};

const CRUDQuestionAdmin: React.FC = () => {
    // Vérifie si l'utilisateur a désactivé les animations sur son appareil (accessibilité)
    const shouldReduceMotion = useReducedMotion();
    const navigate = useNavigate();

    // --- VARIABLES D'ÉTAT (La "mémoire" du composant) ---
    const [questions, setQuestions] = useState<Question[]>([]); // Liste de toutes les questions
    const [newQuestion, setNewQuestion] = useState<Question>(EMPTY_QUESTION); // La question en cours de création
    const [isImporting, setIsImporting] = useState(false); // Vrai si un import CSV est en cours
    const [importMessage, setImportMessage] = useState(''); // Message de succès ou d'erreur de l'import
    const [expandedQuestions, setExpandedQuestions] = useState<Set<string | number>>(new Set()); // Liste des questions "dépliées"

    // S'exécute une seule fois au chargement de la page pour récupérer les questions
    useEffect(() => {
        fetchQuestions();
    }, []);

    // Récupérer les questions s'il y en a déjà sur la bdd
    const fetchQuestions = async () => {
        try {
            const data = await quizService.getAllQuestions();
            setQuestions(data || []);
        } catch (err) {
            console.error('Erreur recuperation', err);
        }
    };

    // --- GESTION DU FORMULAIRE ---

    // Ajoute ou retire une réponse de la liste des bonnes réponses (quand on clique sur une case)
    const handleToggleCorrect = (index: number) => {
        setNewQuestion((prev) => {
            const currentAnswers = [...prev.correctAnswers];
            if (currentAnswers.includes(index)) {
                // Si la case était déjà cochée, on la retire
                return { ...prev, correctAnswers: currentAnswers.filter((i) => i !== index) };
            }
            // Sinon, on l'ajoute
            return { ...prev, correctAnswers: [...currentAnswers, index] };
        });
    };

    // Envoie la nouvelle question au serveur
    const handleAddQuestion = async (e: React.FormEvent) => {
        e.preventDefault(); // Empêche la page de se recharger

        // Vérification de sécurité : il faut au moins une bonne réponse
        if (newQuestion.correctAnswers.length === 0) {
            alert('Veuillez cocher au moins une bonne réponse.');
            return;
        }
        try {
            await quizService.createQuestion(newQuestion);
            setNewQuestion(EMPTY_QUESTION); // On vide le formulaire
            await fetchQuestions(); // On met à jour la liste affichée
        } catch (err) {
            const message = err instanceof Error ? err.message : "Erreur lors de l'ajout";
            alert(message);
        }
    };

    // Supprime une question après confirmation
    const handleDelete = async (id: string | number | undefined) => {
        if (!id) return;
        if (window.confirm('Supprimer cette question ?')) {
            await quizService.deleteQuestion(id);
            await fetchQuestions(); // On met à jour la liste affichée
        }
    };

    // Plie ou déplie les détails d'une question dans la liste
    const toggleQuestionExpanded = (id: string | number | undefined) => {
        if (!id) return;
        setExpandedQuestions((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id); // Si dépliée, on la plie
            } else {
                newSet.add(id);    // Si pliée, on la déplie
            }
            return newSet;
        });
    };

    // --- GESTION DE L'IMPORT CSV (EXCEL) ---

    // Fonction utilitaire pour lire proprement une ligne d'un fichier CSV
    const splitCsvLine = (line: string): string[] => {
        const values: string[] = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i += 1) {
            const char = line[i];
            // Gère les guillemets qui peuvent entourer du texte dans un CSV
            if (char === '"') {
                if (inQuotes && line[i + 1] === '"') {
                    current += '"';
                    i += 1;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if ((char === ';' || char === ',') && !inQuotes) {
                // Sépare les colonnes par des points-virgules ou virgules
                values.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }

        values.push(current.trim());
        return values.map((value) => value.replace(/^"(.*)"$/, '$1').trim());
    };

    // Transforme la colonne des bonnes réponses du CSV (ex: "1|3") en vrai tableau de nombres (ex: [0, 2])
    const normalizeCorrectAnswers = (raw: string): number[] =>
        raw
            .split(/[|,;]/) // Coupe s'il y a un | , ou ;
            .map((part) => Number.parseInt(part.trim(), 10)) // Convertit en nombre
            .filter((value) => Number.isInteger(value) && value >= 1 && value <= 4) // Garde que les chiffres de 1 à 4
            .map((value) => value - 1); // Fait -1 car les index en informatique commencent à 0 (Réponse 1 = index 0)

    // S'occupe de lire le fichier importé par l'utilisateur
    const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImportMessage('');

        // Vérifie que c'est bien un fichier .csv
        if (!file.name.toLowerCase().endsWith('.csv')) {
            setImportMessage('Format non pris en charge. Utilisez un CSV exporte depuis Excel.');
            e.target.value = '';
            return;
        }

        setIsImporting(true);
        try {
            const content = await file.text(); // Lit le contenu du fichier
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

            // Boucle sur chaque ligne du fichier (en ignorant la 1ère ligne d'en-tête)
            for (let i = 1; i < lines.length; i += 1) {
                const cols = splitCsvLine(lines[i]);
                if (cols.length < 6) {
                    failedCount += 1;
                    continue; // Ignore si la ligne est mal formée
                }

                // Extrait les données des colonnes
                const [text, o1, o2, o3, o4, correctRaw] = cols;
                const payload: Question = {
                    text: text?.trim() || '',
                    options: [o1?.trim() || '', o2?.trim() || '', o3?.trim() || '', o4?.trim() || ''],
                    correctAnswers: normalizeCorrectAnswers(correctRaw || '')
                };

                // Vérifie que la question est valide avant de l'envoyer
                if (!payload.text || payload.options.some((opt) => !opt) || payload.correctAnswers.length === 0) {
                    failedCount += 1;
                    continue;
                }

                // Envoie au serveur
                try {
                    await quizService.createQuestion(payload);
                    successCount += 1;
                } catch (error) {
                    failedCount += 1;
                }
            }

            setImportMessage(`Import termine: ${successCount} ajoutees, ${failedCount} ignorees.`);
            await fetchQuestions(); // Rafraîchit la liste
        } catch (error) {
            console.error(error);
            setImportMessage("Erreur pendant l'import du fichier.");
        } finally {
            setIsImporting(false);
            e.target.value = ''; // Réinitialise l'input de fichier
        }
    };

    // Génère et fait télécharger un fichier d'exemple pour aider l'utilisateur
    const handleDownloadTemplate = () => {
        const csvRows = [
            'question;option1;option2;option3;option4;correctAnswers',
            '"Quelle est la capitale de la France ?";"Paris";"Lyon";"Marseille";"Nice";"1"',
            '"Quels nombres sont pairs ?";"1";"2";"3";"4";"2|4"'
        ];

        const csvContent = `\uFEFF${csvRows.join('\n')}`;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        // Fait en sorte que le ficher est directement exécuté lorsqu'il est ajouté dans le téléchargement
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'template_questions_quizynov.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // --- L'AFFICHAGE VISUEL (JSX) ---
    return (
        <motion.div className="crud-container" initial="hidden" animate="show" variants={containerVariants}>

            {/* EN-TÊTE : Titre et bouton retour */}
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

            {/* SECTION 1 : Formulaire de création d'une nouvelle question */}
            <motion.section className="card" variants={itemVariants}>
                <h3>Nouvelle Question (choix multiples possibles)</h3>
                <form onSubmit={handleAddQuestion}>
                    {/* Champ pour taper l'énoncé */}
                    <motion.input
                        className="main-input"
                        placeholder="Enoncez votre question ici..."
                        value={newQuestion.text}
                        onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                        required
                        whileFocus={shouldReduceMotion ? undefined : { scale: 1.005 }}
                    />

                    {/* Grille générant les 4 champs de réponse */}
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
                                    {/* Case à cocher pour définir si c'est la bonne réponse */}
                                    <input
                                        type="checkbox"
                                        id={`opt-${i}`}
                                        checked={isSelected}
                                        onChange={() => handleToggleCorrect(i)}
                                    />
                                    {/* Champ texte pour taper la réponse */}
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

            {/* SECTION 2 : Zone d'importation CSV */}
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
                {/* Affichage des messages d'erreur/succès de l'import (avec animation) */}
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

            {/* SECTION 3 : Liste des questions existantes */}
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
                                            {/* Bouton pour plier/déplier la question */}
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
                                        {/* Bouton pour supprimer la question */}
                                        <motion.button
                                            className="btn-delete"
                                            onClick={() => q.id && handleDelete(q.id)}
                                            whileHover={shouldReduceMotion ? undefined : { y: -1 }}
                                            whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
                                        >
                                            Supprimer
                                        </motion.button>
                                    </div>

                                    {/* Zone qui s'affiche seulement si la question est "dépliée" */}
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

                {/* S'affiche si la base de données est vide */}
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
