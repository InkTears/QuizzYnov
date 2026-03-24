import axios from 'axios';

// Remplace par l'URL de ton backend
const API_URL = 'http://localhost:5000/api/auth';

export const authApi = {
    // Envoi des identifiants au serveur
    login: async (credentials: any) => {
        try {
            const response = await axios.post(`${API_URL}/login`, credentials);
            return response.data; // Retourne souvent { token: '...', user: {...} }
        } catch (error: any) {
            throw error.response?.data?.message || "Erreur de connexion au serveur";
        }
    },

    // Optionnel : si tu as une route de déconnexion
    logout: async () => {
        // Logique de logout côté API si nécessaire
    }
};