import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import '../css/dashboard.css';

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
    hidden: { opacity: 0, y: 14 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.32 }
    }
};

const TableauDeBoardAdmin: React.FC = () => {
    const navigate = useNavigate();
    const shouldReduceMotion = useReducedMotion();
    const [stats, setStats] = useState({ totalQuestions: 0, totalParties: 0 });

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                setStats({ totalQuestions: 24, totalParties: 156 });
            } catch (error) {
                console.error('Erreur chargement stats', error);
            }
        };
        loadDashboardData();
    }, []);

    return (
        <motion.div
            className="dashboard-container"
            initial="hidden"
            animate="show"
            variants={containerVariants}
        >
            <motion.header className="dashboard-header" variants={itemVariants}>
                <h1>Tableau de Bord Admin</h1>
                <motion.button
                    className="btn-add"
                    onClick={() => navigate('/admin/questions')}
                    whileHover={shouldReduceMotion ? undefined : { y: -1, scale: 1.01 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
                >
                    + Ajouter une Question
                </motion.button>
            </motion.header>

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
                    <p className="stat-number">68%</p>
                </motion.div>
            </motion.div>

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
