import { authApi, type LoginCredentials, type RegisterRequest } from '../api/authApi';

const authService = {
    login: async (credentials: LoginCredentials) => {
        const data = await authApi.login(credentials);

        if (data.token) {
            localStorage.setItem('userToken', data.token);

            if (data.role) {
                localStorage.setItem('userRole', data.role);
            }
        }

        return data;
    },

    register: async (payload: RegisterRequest & { confirmPassword: string }) => {
        if (payload.password !== payload.confirmPassword) {
            throw new Error('Les mots de passe ne correspondent pas');
        }

        const data = await authApi.register({
            pseudo: payload.pseudo,
            email: payload.email,
            role: payload.role,
            password: payload.password
        });

        return data;
    },

    logout: () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userRole');
        window.location.href = '/login';
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('userToken');
    }
};

export default authService;
