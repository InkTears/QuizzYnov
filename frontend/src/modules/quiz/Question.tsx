import { motion } from "framer-motion";
import type { AnswerOption, Question as QuestionType } from "../../types/Question";
import "../../css/quiz.css";

interface QuestionProps {
  data: QuestionType;
  onAnswer: (selected: AnswerOption) => void;
}

export const Question = ({ data, onAnswer }: QuestionProps) => {
  const options: Array<{ key: AnswerOption; label: string }> = [
    { key: "A", label: data.optionA },
    { key: "B", label: data.optionB },
    { key: "C", label: data.optionC },
    { key: "D", label: data.optionD },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="quiz-question"
    >
      <h2 className="quiz-question__title">
        {data.content}
      </h2>

      <div className="quiz-question__grid">
        {options.map((opt) => (
          <motion.button
            key={opt.key}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAnswer(opt.key)}
            className="quiz-question__option"
          >
            {opt.label}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default Question;
