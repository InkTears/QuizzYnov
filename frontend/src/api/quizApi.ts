import axios from 'axios';

const API_URL = '/api/questions';

type CsvQuestionRow = {
    content: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_answers: 'A' | 'B' | 'C' | 'D';
};

type PublicQuestion = {
    id: number;
    content: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
};

const authHeaders = () => {
    const token = localStorage.getItem('userToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const quizApi = {
    fetchQuestions: async () => {
        const response = await axios.get<PublicQuestion[]>(API_URL);
        return response.data;
    },

    postQuestion: async (questionData: unknown) => {
        const response = await axios.post(API_URL, questionData, {
            headers: authHeaders()
        });
        return response.data;
    },

    deleteQuestion: async (id: string) => {
        const response = await axios.delete(`${API_URL}/${id}`, {
            headers: authHeaders()
        });
        return response.data;
    },

    importBatch: async (questions: CsvQuestionRow[]) => {
        const response = await axios.post(
            `${API_URL}/import-batch`,
            { questions },
            { headers: authHeaders() }
        );
        return response.data;
    }
};

const quizService = {
    getAllQuestions: async () => quizApi.fetchQuestions(),
    createQuestion: async (questionData: unknown) => quizApi.postQuestion(questionData),
    deleteQuestion: async (id: string) => quizApi.deleteQuestion(id),
    importBatch: async (questions: CsvQuestionRow[]) => quizApi.importBatch(questions)
};

export default quizService;
