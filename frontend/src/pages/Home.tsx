import { useNavigate } from 'react-router-dom';
import Header from "../components/layout/Header";
import Hero from "../components/layout/Hero";

export default function Home() {
  const navigate = useNavigate();

  const handleNavigate = (page: "quiz" | "leaderboard" | "home") => {
    navigate(`/${page}`);
  };

  return (
    <>
      <Header onNavigate={handleNavigate} currentPage="home" />
      <Hero onStart={() => navigate("/quiz")} />
    </>
  );
}