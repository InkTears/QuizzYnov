import { authApi, type LoginCredentials, type SessionUser } from '../api/authApi';

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

            if (data.user?.name) {
                localStorage.setItem('userName', data.user.name);
            }

            if (typeof data.user?.id === 'number') {
                localStorage.setItem('userId', String(data.user.id));
            }

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
        localStorage.removeItem('userName');
        localStorage.removeItem('userId');
        window.location.href = '/login';
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('userToken');
    },

    syncSessionUser: async (): Promise<SessionUser | null> => {
        const token = localStorage.getItem('userToken');
        if (!token) {
            return null;
        }

        try {
            const user = await authApi.me(token);
            localStorage.setItem('userRole', user.role);
            localStorage.setItem('userName', user.name);
            localStorage.setItem('userId', String(user.id));

            return user;
        } catch {
            return null;
        }
    }
};

export default authService;
