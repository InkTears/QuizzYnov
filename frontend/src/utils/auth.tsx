import { Navigate, Outlet } from 'react-router-dom';
import authService from '../services/authService';

const ProtectedRoute = () => {
    // On utilise la méthode qu'on a créée dans le service
    const isAuth = authService.isAuthenticated();

    // Si l'utilisateur est connecté, on affiche le contenu de la route (Outlet)
    // Sinon, on le redirige vers la page de login
    return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;