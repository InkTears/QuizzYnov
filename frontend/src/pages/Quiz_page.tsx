import { useState } from "react";
import Header from "../components/layout/Header";
import Hero from "../components/layout/Hero";
import Quiz from "../modules/quiz/Quiz";

export default function QuizPage() {
  const [hasStarted, setHasStarted] = useState(false);

  return (
    <>
      <Header />
      {!hasStarted ? (
        <Hero onStart={() => setHasStarted(true)} />
      ) : (
        <Quiz />
      )}
    </>
  );
}