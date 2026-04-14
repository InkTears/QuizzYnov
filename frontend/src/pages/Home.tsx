import Header from "../components/layout/Header";
import Hero from "../components/layout/Hero";

interface HomeProps {
  onNavigate: (page: "quiz" | "leaderboard" | "home") => void;
}

export default function Home({ onNavigate }: HomeProps) {
  return (
    <>
      <Header onNavigate={onNavigate} currentPage="home" />
      <Hero onStart={() => onNavigate("quiz")} />
    </>
  );
}