import { authApi } from '../api/authApi';

const authService = {
    login: async (credentials: any) => {
        const data = await authApi.login(credentials);

        if (data.token) {
            // On sauvegarde le token pour rester connecté après un refresh
            localStorage.setItem('userToken', data.token);

            // Si tu as des rôles, tu peux aussi les stocker
            if (data.role) {
                localStorage.setItem('userRole', data.role);
            }
        }

        return data;
    },

    logout: () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userRole');
        window.location.href = '/login'; // Redirection propre
    },

    // Petite fonction utilitaire pour vérifier si on est connecté
    isAuthenticated: () => {
        return !!localStorage.getItem('userToken');
    }
};

export default authService;