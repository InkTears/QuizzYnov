import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Question } from "./Question";
import { Result } from "./Result";
import quizService from "../../services/quizService";
import type { AnswerOption, Question as QuestionType } from "../../types/Question";
import "../../css/quiz.css";

const QUESTION_TIME_LIMIT = 20;

export const Quiz = () => {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<Record<number, AnswerOption | null>>({});
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState<number>(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const timedOutIndexRef = useRef<number | null>(null);

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
    if (questions.length === 0 || isFinished) {
      return;
    }
    setTimeLeft(QUESTION_TIME_LIMIT);
  }, [index, isFinished, questions.length]);

  useEffect(() => {
    if (questions.length === 0 || isFinished) {
      return;
    }

    const timerId = window.setTimeout(() => {
      setTimeLeft((previous) => Math.max(previous - 1, 0));
    }, 1000);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [isFinished, questions.length, timeLeft]);

  useEffect(() => {
    if (timeLeft !== 0 || isFinished) {
      return;
    }

    if (timedOutIndexRef.current === index) {
      return;
    }
    timedOutIndexRef.current = index;

    const current = questions[index];
    if (current) {
      setAnswers((prev) => ({ ...prev, [current.id]: null }));
    }
    setIndex((prev) => prev + 1);
  }, [index, isFinished, questions, timeLeft]);

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
        const submittedAnswers = Object.entries(answers).reduce<Record<number, AnswerOption>>((acc, [questionId, answer]) => {
          if (answer !== null) {
            acc[Number(questionId)] = answer;
          }
          return acc;
        }, {});
        const duration = Math.max(0, Math.round((Date.now() - startedAt) / 1000));
        const result = await quizService.submitSession({
          userId,
          answers: submittedAnswers,
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
      {!isFinished && total > 0 ? (
        <div className="quiz-session__meta">
          <p className="quiz-session__progress">Question {index + 1} / {total}</p>
          <p className="quiz-session__timer">Temps restant : {timeLeft}s</p>
        </div>
      ) : null}
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
            questions={questions}
            answers={answers}
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
