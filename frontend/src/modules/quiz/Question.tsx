import { motion } from "framer-motion";
import type { Question as QuestionType } from "../../types/Question";

interface QuestionProps {
  data: QuestionType;
  onAnswer: (isCorrect: boolean) => void;
}

export const Question = ({ data, onAnswer }: QuestionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white p-6 rounded-xl shadow-md"
    >
      <h2 className="text-xl font-bold mb-6">{data.text}</h2>
      <div className="flex flex-col gap-3">
        {data.options.map((opt: string) => (
          <button
            key={opt}
            onClick={() => onAnswer(opt === data.correctAnswer)}
            className="p-3 text-left border rounded-lg hover:bg-indigo-50 transition-colors"
          >
            {opt}
          </button>
        ))}
      </div>
    </motion.div>
  );
};