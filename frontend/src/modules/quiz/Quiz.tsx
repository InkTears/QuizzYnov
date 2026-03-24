import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Question } from "./Question";
import { Result } from "./Result";
import { questions } from "../../services/quizService"; 

export const Quiz = () => {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);

  const isFinished = index === questions.length;

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) setScore((prev) => prev + 1);
    setIndex((prev) => prev + 1);
  };

  const resetQuiz = () => {
    setIndex(0);
    setScore(0);
  };

  return (
    <div className="w-full max-w-xl mx-auto mt-10">
      <AnimatePresence mode="wait">
        {!isFinished ? (
          <Question 
            key={index}
            data={questions[index]} 
            onAnswer={handleAnswer} 
          />
        ) : (
          <Result 
            score={score} 
            total={questions.length} 
            onRestart={resetQuiz} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Quiz;