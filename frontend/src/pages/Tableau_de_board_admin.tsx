import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import '../css/dashboard.css';
import '../css/auth.css';
import quizService from '../api/quizApi';

// Configuration de l'animation du conteneur (apparition en fondu)
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08, // Délai entre l'apparition de chaque enfant
            delayChildren: 0.08
        }
    }
};

// Configuration de l'animation des éléments (glissement vers le haut + fondu)
const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.32 }
    }
};

const TableauDeBoardAdmin: React.FC = () => {
    const navigate = useNavigate();
    const shouldReduceMotion = useReducedMotion(); // Détecte si l'utilisateur préfère moins d'animations

    // Stocke les statistiques globales (total questions, parties jouées)
    const [stats, setStats] = useState({ totalQuestions: 0, totalParties: 0 });

    // Gère l'affichage du petit message de succès ("Toast") après la connexion
    const [loginToast, setLoginToast] = useState<{ name: string; role: string } | null>(null);


    useEffect(() => {
        //  Gestion du message de bienvenue de l'utilisateur
        const raw = sessionStorage.getItem('loginSuccess');
        if (raw) {
            sessionStorage.removeItem('loginSuccess');
            setLoginToast(JSON.parse(raw));
            setTimeout(() => setLoginToast(null), 3000);
        }

        // Chargement des données réelles depuis l'API
        const loadDashboardData = async () => {
            try {
                const questions = await quizService.getAllQuestions();
                setStats((prev) => ({
                    ...prev,
                    totalQuestions: questions.length // On compte combien de questions existent en base
                }));
            } catch (error) {
                console.error('Erreur chargement stats', error);
            }
        };
        loadDashboardData();
    }, []);

    //  Déconnexion de l'utilisateur
    const handleLogout = () => {
        sessionStorage.clear();
        localStorage.clear();
        navigate('/login');
    };

    return (
        <motion.div
            className="dashboard-container"
            initial="hidden"
            animate="show"
            variants={containerVariants}
        >
            {/* MESSAGE DE SUCCÈS : Apparaît en haut de l'écran juste après le login */}
            <AnimatePresence>
                {loginToast && (
                    <motion.div
                        className="login-toast-success login-toast-admin"
                        initial={{ opacity: 0, y: -24, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -16, scale: 0.97 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        role="status"
                        aria-live="polite"
                    >
                        <span className="login-toast-icon">✓</span>
                        <span>
                            {loginToast.name ? `Bienvenue, ${loginToast.name} !` : 'Connexion réussie !'}
                            <br />
                            <small>Connecté en tant qu'administrateur</small>
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* EN-TÊTE : Titre et boutons d'action principaux */}
            <motion.header className="dashboard-header" variants={itemVariants}>
                <h1>Tableau de Bord Admin</h1>
                <div className="header-actions">
                    <motion.button
                        className="btn-add"
                        onClick={() => navigate('/admin/questions')}
                        whileHover={shouldReduceMotion ? undefined : { y: -1, scale: 1.01 }}
                        whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
                    >
                        + Ajouter une Question
                    </motion.button>
                    <motion.button
                        className="btn-add btn-logout"
                        onClick={handleLogout}
                        whileHover={shouldReduceMotion ? undefined : { y: -1, scale: 1.01 }}
                        whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
                    >
                        Déconnexion
                    </motion.button>
                </div>
            </motion.header>

            {/* GRILLE DE STATISTIQUES : Les chiffres clés du quiz */}
            <motion.div className="stats-grid" variants={containerVariants}>
                <motion.div
                    className="stat-card"
                    variants={itemVariants}
                    whileHover={shouldReduceMotion ? undefined : { y: -6 }}
                >
                    <h3>Questions</h3>
                    <p className="stat-number">{stats.totalQuestions}</p>
                </motion.div>

                <motion.div
                    className="stat-card"
                    variants={itemVariants}
                    whileHover={shouldReduceMotion ? undefined : { y: -6 }}
                >
                    <h3>Parties Jouées</h3>
                    <p className="stat-number">{stats.totalParties}</p>
                </motion.div>

                <motion.div
                    className="stat-card"
                    variants={itemVariants}
                    whileHover={shouldReduceMotion ? undefined : { y: -6 }}
                >
                    <h3>Taux de reussite</h3>
                    <p className="stat-number">68%</p> {/* Note : Ici c'est une valeur fixe pour l'exemple */}
                </motion.div>
            </motion.div>

            {/* SECTION ACTIONS RAPIDES : Liens vers les autres parties de l'admin */}
            <motion.section className="quick-actions" variants={itemVariants}>
                <h2>Gestion rapide</h2>
                <motion.div className="action-buttons" variants={containerVariants}>
                    <motion.button
                        className="btn-action btn-primary"
                        variants={itemVariants}
                        whileHover={shouldReduceMotion ? undefined : { y: -1 }}
                        whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
                        onClick={() => navigate('/admin/questions')}
                    >
                        Gérer la base de questions
                    </motion.button>
                    <motion.button
                        className="btn-action btn-outline"
                        variants={itemVariants}
                        whileHover={shouldReduceMotion ? undefined : { y: -1 }}
                        whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
                        onClick={() => navigate('/leaderboard')}
                    >
                        Voir le classement général
                    </motion.button>
                    <motion.button
                        className="btn-action btn-danger"
                        variants={itemVariants}
                        whileHover={shouldReduceMotion ? undefined : { y: -1 }}
                        whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
                    >
                        Réinitialiser les scores
                    </motion.button>
                </motion.div>
            </motion.section>
        </motion.div>
    );
};

export default TableauDeBoardAdmin;