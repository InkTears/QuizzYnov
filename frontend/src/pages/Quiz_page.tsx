import React from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const QuizPage: React.FC = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem('userRole') || 'user';

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'sans-serif' }}>
            <h1>Tableau de bord élève</h1>
            <p>Connecté en tant que : <strong>{role}</strong></p>
            <p>Page quiz - à compléter</p>
            <button onClick={handleLogout} style={{ marginTop: 24, padding: '10px 24px', cursor: 'pointer' }}>
                Se déconnecter
            </button>
        </div>
    );
};

export default QuizPage;
