import React from 'react';
import Login from '../modules/auth/Login';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';
import '../css/auth.css';

const LoginPageAdmin: React.FC = () => {
    const navigate = useNavigate();

    const handleAdminLogin = async (credentials: any) => {
        try {
            // Appel à ton service existant
            const response = await authService.login(credentials);
            if (response.token) {
                // Redirection vers le tableau de bord admin après succès
                navigate('/admin/dashboard');
            }
        } catch (error) {
            alert("Erreur de connexion Admin : " + error);
        }
    };

    return (
        <div className="page-wrapper">
            <Login title="Connexion Administration" onLogin={handleAdminLogin} />
        </div>
    );
};

export default LoginPageAdmin;