import axios from 'axios';

const API_URL = '/api/questions';
const QUIZ_URL = '/api/quiz';

export const quizApi = {
    fetchQuestions: async () => {
        const response = await axios.get(API_URL);
        return response.data.map((q: any) => ({
            id: q.id,
            text: q.content,
            options: [q.optionA, q.optionB, q.optionC, q.optionD],
            correctAnswer: q.correctAnswer,
        }));
    },

    postQuestion: async (questionData: any) => {
        // Transformer les données frontend en format backend
        const backendData = {
            content: questionData.text,
            optionA: questionData.options[0],
            optionB: questionData.options[1],
            optionC: questionData.options[2],
            optionD: questionData.options[3],
            correctAnswer: questionData.correctAnswers.length > 0 ? ['A', 'B', 'C', 'D'][questionData.correctAnswers[0]] : 'A',
        };
        const response = await axios.post(API_URL, backendData);
        return response.data;
    },

    deleteQuestion: async (id: string) => {
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
    createQuestion: async (questionData: any) => quizApi.postQuestion(questionData),
    deleteQuestion: async (id: string) => quizApi.deleteQuestion(id),
    submitQuiz: async (userId: number, answers: Record<number, string>, duration: number) => quizApi.submitQuiz(userId, answers, duration)
};

export default quizService;
