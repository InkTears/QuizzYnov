import axios from 'axios';

const API_URL = 'http://localhost:5000/api/questions';

export const quizApi = {
    fetchQuestions: async () => {
        const response = await axios.get(API_URL);
        return response.data;
    },

    postQuestion: async (questionData: unknown) => {
        const response = await axios.post(API_URL, questionData);
        return response.data;
    },

    deleteQuestion: async (id: string) => {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    }
};

const quizService = {
    getAllQuestions: async () => quizApi.fetchQuestions(),
    createQuestion: async (questionData: unknown) => quizApi.postQuestion(questionData),
    deleteQuestion: async (id: string) => quizApi.deleteQuestion(id)
};

export default quizService;
