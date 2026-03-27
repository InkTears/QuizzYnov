import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterRequest {
    pseudo: string;
    email: string;
    role: string;
    password: string;
}

export const authApi = {
    login: async (credentials: LoginCredentials) => {
        try {
            const response = await axios.post(`${API_URL}/login`, credentials);
            return response.data;
        } catch (error: unknown) {
            const axiosError = error as { response?: { data?: { message?: string } } };
            throw axiosError.response?.data?.message || 'Erreur de connexion au serveur';
        }
    },

    register: async (payload: RegisterRequest) => {
        try {
            const response = await axios.post(`${API_URL}/register`, payload);
            return response.data;
        } catch (error: unknown) {
            const axiosError = error as { response?: { data?: { message?: string } } };
            throw axiosError.response?.data?.message || "Erreur d'inscription au serveur";
        }
    },

    logout: async () => {}
};
