import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import quizService from '../services/quizService';
//import scoreService from '../services/scoreService';
import '../css/dashboard.css';

const TableauDeBoardAdmin: React.FC = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ totalQuestions: 0, totalParties: 0 });

    useEffect(() => {
        // Simulation d'appel API pour charger les chiffres clés
        const loadDashboardData = async () => {
            try {
                // Idéalement, tu créeras une méthode fetchStats dans tes services
                // const data = await quizService.getStats();
                // setStats(data);
                setStats({ totalQuestions: 24, totalParties: 156 }); // Mock pour l'exemple
            } catch (error) {
                console.error("Erreur chargement stats", error);
            }
        };
        loadDashboardData();
    }, []);

    return (
        <div className="admin-dashboard">
            <header className="dashboard-header">
                <h1>Tableau de Bord Admin</h1>
                <button className="btn-add" onClick={() => navigate('/admin/questions')}>
                    + Ajouter une Question
                </button>
            </header>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Questions</h3>
                    <p className="stat-number">{stats.totalQuestions}</p>
                </div>
                <div className="stat-card">
                    <h3>Parties Jouées</h3>
                    <p className="stat-number">{stats.totalParties}</p>
                </div>
                <div className="stat-card">
                    <h3>Taux de réussite</h3>
                    <p className="stat-number">68%</p>
                </div>
            </div>

            <section className="quick-actions">
                <h2>Gestion rapide</h2>
                <div className="action-buttons">
                    <button onClick={() => navigate('/admin/questions')}>Gérer la base de questions</button>
                    <button onClick={() => navigate('/leaderboard')}>Voir le classement général</button>
                    <button className="btn-danger">Réinitialiser les scores</button>
                </div>
            </section>
        </div>
    );
};

export default TableauDeBoardAdmin;