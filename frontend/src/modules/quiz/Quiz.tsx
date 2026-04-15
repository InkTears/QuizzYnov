import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Question } from "./Question";
import { Result } from "./Result";
import quizService from "../../services/quizService";
import type { AnswerOption, Question as QuestionType } from "../../types/Question";
import "../../css/quiz.css";

export const Quiz = () => {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<Record<number, AnswerOption>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState<number>(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await quizService.getSessionQuestions(10);
        setQuestions(data);
        setStartedAt(Date.now());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur de chargement du quiz");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const isFinished = index === questions.length;

  const handleAnswer = (selected: AnswerOption) => {
    const current = questions[index];
    if (!current) {
      return;
    }

    setAnswers((prev) => ({ ...prev, [current.id]: selected }));
    setIndex((prev) => prev + 1);
  };

  useEffect(() => {
    const submit = async () => {
      if (!isFinished || questions.length === 0 || isSubmitting || hasSubmitted) {
        return;
      }

      const rawUserId = localStorage.getItem("userId");
      const userId = rawUserId ? Number(rawUserId) : NaN;
      if (!Number.isFinite(userId) || userId <= 0) {
        setError("Utilisateur invalide. Reconnecte-toi.");
        return;
      }

      try {
        setIsSubmitting(true);
        const duration = Math.max(0, Math.round((Date.now() - startedAt) / 1000));
        const result = await quizService.submitSession({
          userId,
          answers,
          duration,
        });
        setScore(result.score);
        setHasSubmitted(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur pendant l'envoi du quiz");
      } finally {
        setIsSubmitting(false);
      }
    };

    submit();
  }, [answers, hasSubmitted, isFinished, isSubmitting, questions.length, startedAt]);

  const total = useMemo(() => questions.length, [questions.length]);

  if (isLoading) {
    return <p className="quiz-page__status">Chargement des questions...</p>;
  }

  if (error && questions.length === 0) {
    return <p className="quiz-page__status quiz-page__status--error">{error}</p>;
  }

return (
  <div className="quiz-session">
    <div className="quiz-session__inner">
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
            total={total}
          />
        )}
      </AnimatePresence>
      {error && questions.length > 0 ? (
        <p className="quiz-page__status quiz-page__status--error">{error}</p>
      ) : null}
    </div>
  </div>
);
};

export default Quiz;
