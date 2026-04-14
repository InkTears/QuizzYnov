import Header from "../components/layout/Header";
import Quiz from "../modules/quiz/Quiz";

interface QuizPageProps {
  onNavigate: (page: "quiz" | "leaderboard" | "home") => void;
}

export default function QuizPage({ onNavigate }: QuizPageProps) {
  return (
    <>
      <Header onNavigate={onNavigate} currentPage="quiz" isQuizActive={true} />
      <Quiz onNavigate={onNavigate} />
    </>
  );
}