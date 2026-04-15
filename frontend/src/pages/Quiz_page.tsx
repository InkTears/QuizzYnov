import { useNavigate } from 'react-router-dom';
import Header from "../components/layout/Header";
import Quiz from "../modules/quiz/Quiz";

export default function QuizPage() {
  const navigate = useNavigate();

  const handleNavigate = (page: "quiz" | "leaderboard" | "home") => {
    navigate(`/${page}`);
  };

  return (
    <>
      <Header onNavigate={handleNavigate} currentPage="quiz" isQuizActive={true} />
      <Quiz />
    </>
  );
}