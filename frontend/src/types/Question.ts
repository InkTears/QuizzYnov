export type AnswerOption = "A" | "B" | "C" | "D";

export interface Question {
  id: number;
  content: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
}