import { quizApi } from '../api/quizApi';

const quizService = {
    getAllQuestions: async () => {
        return await quizApi.fetchQuestions();
    },

    createQuestion: async (questionData: any) => {
        // Logique de validation avant envoi
        return await quizApi.postQuestion(questionData);
    },

    deleteQuestion: async (id: string) => {
        return await quizApi.deleteQuestion(id);
    }
};

export default quizService;