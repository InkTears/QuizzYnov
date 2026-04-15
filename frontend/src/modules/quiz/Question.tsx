import { motion } from "framer-motion";
import type { QuizQuestion } from "../../types/Question";

interface QuestionProps {
  data: QuizQuestion;
  onAnswer: (isCorrect: boolean) => void;
}

export const Question = ({ data, onAnswer }: QuestionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{
        backgroundColor: "white",
        padding: "2.5rem",
        borderRadius: "1.5rem",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
        border: "1px solid #f3f4f6",
        width: "100%",
        boxSizing: "border-box"
      }}
    >
      <h2 style={{
        fontSize: "1.6rem",
        fontWeight: 800,
        marginBottom: "2.5rem",
        color: "#1f2937",
        textAlign: "center",
        lineHeight: 1.3
      }}>
        {data.text}
      </h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr", 
        gap: "1.25rem",
        width: "100%"
      }}>
        {data.options.map((opt: string) => (
          <motion.button
            key={opt}
            whileHover={{ 
              scale: 1.02, 
              backgroundColor: "#f9fafb",
              borderColor: "#6366f1"
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAnswer(opt === data.correctAnswer)}
            style={{
              padding: "1.2rem 1rem",
              textAlign: "center",
              border: "2px solid #e5e7eb",
              borderRadius: "0.75rem",
              backgroundColor: "white",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: 600,
              color: "#4b5563",
              transition: "border-color 0.2s ease, background-color 0.2s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "80px"
            }}
          >
            {opt}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default Question;
