import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import '../css/auth.css';

const QuizPage: React.FC = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem('userRole') || 'user';
    const [loginToast, setLoginToast] = useState<{ name: string; role: string } | null>(null);

    useEffect(() => {
        const raw = sessionStorage.getItem('loginSuccess');
        if (raw) {
            sessionStorage.removeItem('loginSuccess');
            setLoginToast(JSON.parse(raw));
            setTimeout(() => setLoginToast(null), 3000);
        }
    }, []);

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'sans-serif' }}>
            <AnimatePresence>
                {loginToast && (
                    <motion.div
                        className="login-toast-success"
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
                            <small>Connecté en tant qu'utilisateur</small>
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
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
