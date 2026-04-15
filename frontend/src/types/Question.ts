export interface Question {
  id?: string | number;
  text: string;
  options: string[];
  correctAnswers: number[];
}

export interface QuizQuestion {
  id: number;
  text: string;
  options: string[];
  correctAnswers: string[];
  category?: string;
}
