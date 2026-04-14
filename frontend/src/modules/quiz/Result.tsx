import { motion } from "framer-motion";

interface ResultProps {
  score: number;
  total: number;
}

export const Result = ({ score, total }: ResultProps) => {
  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center p-8 bg-white rounded-xl shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-4">Résultats</h2>
      <p className="text-lg mb-6">
        Tu as obtenu <span className="font-bold text-indigo-600">{score}</span> sur {total} points !
      </p>
    </motion.div>
  );
};