import axios from 'axios';

const API_URL = '/api/questions';

// Types
interface FrontendQuestion {
    id?: string | number;
    text: string;
    options: string[];
    correctAnswers: number[];
}

interface BackendQuestion {
    id: number;
    content: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctAnswers: ('A' | 'B' | 'C' | 'D')[];
}

// Convertir backend → frontend
const convertBackendToFrontend = (backend: BackendQuestion): FrontendQuestion => {
    const optionsMap: Record<string, number> = {
        A: 0,
        B: 1,
        C: 2,
        D: 3
    };
    return {
        id: backend.id,
        text: backend.content,
        options: [backend.optionA, backend.optionB, backend.optionC, backend.optionD],
        correctAnswers: backend.correctAnswers.map(answer => optionsMap[answer])
    };
};

// Convertir frontend → backend
const convertFrontendToBackend = (frontend: FrontendQuestion) => {
    const answerMap = ['A', 'B', 'C', 'D'] as const;
    return {
        content: frontend.text,
        optionA: frontend.options[0],
        optionB: frontend.options[1],
        optionC: frontend.options[2],
        optionD: frontend.options[3],
        correctAnswers: frontend.correctAnswers.map(idx => answerMap[idx])
    };
};

export const quizApi = {
    fetchQuestions: async () => {
        try {
            const response = await axios.get<BackendQuestion[]>(API_URL);
            return response.data.map(convertBackendToFrontend);
        } catch (error: unknown) {
            const axiosError = error as { response?: { data?: { message?: string; error?: string } } };
            throw new Error(axiosError.response?.data?.message || axiosError.response?.data?.error || 'Erreur de recuperation des questions');
        }
    },

    postQuestion: async (questionData: FrontendQuestion) => {
        try {
            const backendData = convertFrontendToBackend(questionData);
            const response = await axios.post<BackendQuestion>(API_URL, backendData);
            return convertBackendToFrontend(response.data);
        } catch (error: unknown) {
            const axiosError = error as { response?: { data?: { message?: string; error?: string } } };
            throw new Error(axiosError.response?.data?.message || axiosError.response?.data?.error || 'Erreur lors de la creation de la question');
        }
    },

    deleteQuestion: async (id: string | number) => {
        const numId = typeof id === 'string' ? parseInt(id, 10) : id;
        try {
            const response = await axios.delete(`${API_URL}/${numId}`);
            return response.data;
        } catch (error: unknown) {
            const axiosError = error as { response?: { data?: { message?: string; error?: string } } };
            throw new Error(axiosError.response?.data?.message || axiosError.response?.data?.error || 'Erreur lors de la suppression de la question');
        }
    }
};

const quizService = {
    getAllQuestions: async () => quizApi.fetchQuestions(),
    createQuestion: async (questionData: FrontendQuestion) => quizApi.postQuestion(questionData),
    deleteQuestion: async (id: string | number) => quizApi.deleteQuestion(id)
};

export default quizService;
