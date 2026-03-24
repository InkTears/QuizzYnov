import React from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const isAuthenticated = authService.isAuthenticated();

    const handleLogout = () => {
        authService.logout(); // Supprime le token
        navigate('/login');   // Redirige vers la connexion
    };

    if (!isAuthenticated) return null; // Ne pas afficher la barre si on n'est pas connecté

    return (
        <nav style={{ padding: '10px', background: '#333', color: 'white', display: 'flex', justifyContent: 'space-between' }}>
            <span>Mon Application Quiz</span>
            <button
                onClick={handleLogout}
                style={{ background: '#ff4d4d', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}
            >
                Déconnexion
            </button>
        </nav>
    );
};

export default Navbar;