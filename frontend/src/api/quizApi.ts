import axios from 'axios';
import type { Question } from '../types/Question';

const API_URL = '/api/questions';
const QUIZ_URL = '/api/quiz';

type BackendQuestion = {
    id: number;
    content: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctAnswers: ('A' | 'B' | 'C' | 'D')[];
};

const answerMap = ['A', 'B', 'C', 'D'] as const;

const convertBackendToFrontend = (backend: BackendQuestion): Question => ({
    id: backend.id,
    text: backend.content,
    options: [backend.optionA, backend.optionB, backend.optionC, backend.optionD],
    correctAnswers: backend.correctAnswers.map((answer) => answerMap.indexOf(answer)),
});

const convertFrontendToBackend = (frontend: Question) => ({
    content: frontend.text,
    optionA: frontend.options[0],
    optionB: frontend.options[1],
    optionC: frontend.options[2],
    optionD: frontend.options[3],
    correctAnswers: frontend.correctAnswers.map((index) => answerMap[index]),
});

export const quizApi = {
    fetchQuestions: async () => {
        const response = await axios.get(API_URL);
        return response.data.map((q: BackendQuestion) => convertBackendToFrontend(q));
    },

    postQuestion: async (questionData: Question) => {
        const backendData = convertFrontendToBackend(questionData);
        const response = await axios.post(API_URL, backendData);
        return response.data;
    },

    deleteQuestion: async (id: string | number) => {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    },

    submitQuiz: async (userId: number, answers: Record<number, string>, duration: number) => {
        const response = await axios.post(`${QUIZ_URL}/submit`, { userId, answers, duration });
        return response.data;
    }
};

const quizService = {
    getAllQuestions: async () => quizApi.fetchQuestions(),
    createQuestion: async (questionData: Question) => quizApi.postQuestion(questionData),
    deleteQuestion: async (id: string | number) => quizApi.deleteQuestion(id),
    submitQuiz: async (userId: number, answers: Record<number, string>, duration: number) => quizApi.submitQuiz(userId, answers, duration),
};

export default quizService;
