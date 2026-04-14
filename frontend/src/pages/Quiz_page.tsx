import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Hero from "../components/layout/Hero";
import Quiz from "../modules/quiz/Quiz";
import quizService from "../services/quizService";

export default function QuizPage() {
  const navigate = useNavigate();
  const [hasStarted, setHasStarted] = useState(false);
  const [hasParticipatedToday, setHasParticipatedToday] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const status = await quizService.getTodayStatus();
        setHasParticipatedToday(status.hasParticipated);
        if (status.hasParticipated) {
          navigate("/profile", { replace: true });
        }
      } catch {
        // En cas d'erreur API, on laisse le joueur tenter de lancer le quiz.
        setHasParticipatedToday(false);
      } finally {
        setIsCheckingStatus(false);
      }
    };

    loadStatus();
  }, [navigate]);

  if (isCheckingStatus) {
    return (
      <>
        <Header />
        <p style={{ textAlign: "center", marginTop: "2rem" }}>Verification de votre session...</p>
      </>
    );
  }

  return (
    <>
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
    </>
  );
}