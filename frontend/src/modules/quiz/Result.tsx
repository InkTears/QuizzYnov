import { motion } from "framer-motion";
import "../../css/quiz.css";

interface ResultProps {
  score: number;
  total: number;
}

export const Result = ({ score, total }: ResultProps) => {
  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="quiz-result"
    >
      <h2>Résultats</h2>
      <p>
        Tu as obtenu <span>{score}</span> sur {total} points !
      </p>
    </motion.div>
  );
};
