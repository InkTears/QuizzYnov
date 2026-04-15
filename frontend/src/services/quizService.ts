import type { QuizQuestion } from '../types/Question';
import axios from 'axios';
 
const API_URL = '/api/quiz/today';
 
export const fetchQuestions = async (): Promise<QuizQuestion[]> => {
    try {
        const response = await axios.get(API_URL);
        const data = response.data;
        return data.map((q: any) => ({
            id: q.id,
            text: q.content,
            options: [q.optionA, q.optionB, q.optionC, q.optionD],
            correctAnswers: q.correctAnswers,
        }));
    } catch (error) {
        console.error('Erreur lors de la récupération des questions:', error);
        return [];
    }
};
 
export const questions: QuizQuestion[] = [];
