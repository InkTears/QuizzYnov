import { authApi, type LoginCredentials } from '../api/authApi';

type RegisterFormPayload = {
    pseudo: string;
    email: string;
    password: string;
    confirmPassword: string;
};

const authService = {
    login: async (credentials: LoginCredentials) => {
        const data = await authApi.login(credentials);

        if (data.accessToken) {
            localStorage.setItem('userToken', data.accessToken);

            if (data.user?.role) {
                localStorage.setItem('userRole', data.user.role);
            }
        }

        return data;
    },

    register: async (payload: RegisterFormPayload) => {
        if (payload.password !== payload.confirmPassword) {
            throw new Error('Les mots de passe ne correspondent pas');
        }

        const data = await authApi.register({
            name: payload.pseudo,
            email: payload.email,
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
