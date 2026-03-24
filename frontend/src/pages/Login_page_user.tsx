import React from 'react';
import Login from '../modules/auth/Login';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';
import '../css/auth.css';

const LoginPageUser: React.FC = () => {
    const navigate = useNavigate();

    const handleUserLogin = async (credentials: any) => {
        try {
            // On utilise le même service d'authentification
            const response = await authService.login(credentials);

            if (response.token) {
                // Une fois connecté, on redirige l'utilisateur vers la page du Quiz
                // ou sa page de résultats selon ta logique
                navigate('/quiz');
            }
        } catch (error) {
            // Petit message d'erreur si les identifiants sont faux
            alert("Erreur de connexion : " + error);
        }
    };

    return (
        <div className="user-page-wrapper">
            <Login
                title="Connexion Joueur"
                onLogin={handleUserLogin}
            />
            <div className="login-footer">
                <p>Pas encore de compte ? Contactez votre administrateur.</p>
            </div>
        </div>
    );
};

export default LoginPageUser;