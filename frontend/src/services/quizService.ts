import axios from "axios";
import type { AnswerOption, Question } from "../types/Question";

type SubmitQuizResult = {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  duration: number;
};

const quizService = {
  async getTodayStatus(): Promise<{ hasParticipated: boolean }> {
    const token = localStorage.getItem("userToken");
    const response = await axios.get<{ hasParticipated: boolean }>("/api/quiz/today/status", {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return response.data;
  },

  async getSessionQuestions(limit = 10): Promise<Question[]> {
    const token = localStorage.getItem("userToken");
    const response = await axios.get<Question[]>(`/api/quiz/today?limit=${limit}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return response.data;
  },

  async submitSession(payload: {
    userId: number;
    answers: Record<number, AnswerOption>;
    duration: number;
  }): Promise<SubmitQuizResult> {
    const token = localStorage.getItem("userToken");
    const response = await axios.post<SubmitQuizResult>("/api/quiz/submit", payload, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return response.data;
  },
};

export default quizService;
