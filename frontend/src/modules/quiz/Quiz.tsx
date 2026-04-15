import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Question } from "./Question";
import { Result } from "./Result";
import { fetchQuestions } from "../../services/quizService";
import quizService from "../../api/quizApi";
import type { QuizQuestion } from "../../types/Question";

interface QuizProps {
  // Component handles its own navigation based on user role
}

export const Quiz = ({}: QuizProps) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    const loadQuestions = async () => {
      const data = await fetchQuestions();
      setQuestions(data);
      setLoading(false);
      setStartTime(Date.now());
    };
    loadQuestions();
  }, []);

  const isFinished = index === questions.length;

  const handleAnswer = (isCorrect: boolean, selectedLetter: string) => {
    if (isCorrect) setScore((prev) => prev + 1);
    setAnswers((prev) => ({ ...prev, [questions[index].id]: selectedLetter }));
    setIndex((prev) => prev + 1);
  };

  const resetQuiz = () => {
    setIndex(0);
    setScore(0);
    setAnswers({});
    setStartTime(Date.now());
  };

  useEffect(() => {
    if (isFinished && Object.keys(answers).length > 0) {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      // Soumettre le quiz avec un utilisateur invité non présent dans les sessions du jour
      quizService.submitQuiz(5, answers, duration).catch(console.error);
    }
  }, [isFinished, answers, startTime]);

  if (loading) {
    return <div>Chargement des questions...</div>;
  }

  if (!loading && questions.length === 0) {
    return <div>Aucune question disponible pour le moment. Vérifiez que le backend est démarré et que l'API de quiz fonctionne.</div>;
  }

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      width: "100%",
      marginTop: "3rem",
      padding: "0 1rem"
    }}>
      <div style={{ width: "100%", maxWidth: "800px" }}>
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
    </div>
  );
};

export default Quiz;