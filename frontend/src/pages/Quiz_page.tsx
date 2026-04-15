import { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import Hero from "../components/layout/Hero";
import Quiz from "../modules/quiz/Quiz";
import quizService from "../services/quizService";
import "../css/quiz.css";

export default function QuizPage() {
  const [hasStarted, setHasStarted] = useState(false);
  const [hasParticipatedToday, setHasParticipatedToday] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const status = await quizService.getTodayStatus();
        setHasParticipatedToday(status.hasParticipated);
      } catch {
        // En cas d'erreur API, on laisse le joueur tenter de lancer le quiz.
        setHasParticipatedToday(false);
      } finally {
        setIsCheckingStatus(false);
      }
    };

    loadStatus();
  }, []);

  if (isCheckingStatus) {
    return (
      <div className="quiz-page">
        <Header />
        <p className="quiz-page__status">Vérification de votre session...</p>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <Header />
      {!hasStarted ? (
        <Hero
          onStart={() => {
            if (!hasParticipatedToday) {
              setHasStarted(true);
            }
          }}
          disabled={hasParticipatedToday}
          disabledText="Reviens demain pour une nouvelle session."
        />
      ) : (
        <Quiz />
      )}
    </div>
  );
}
