import { motion } from "framer-motion";
import "../../css/quiz.css";

interface HeroProps {
  onStart: () => void;
  disabled?: boolean;
  disabledText?: string;
}

function Hero({ onStart, disabled = false, disabledText }: HeroProps) {
  return (
    <motion.section
      className="quiz-hero"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="quiz-hero__content">
        <p className="quiz-hero__eyebrow">Quiz de la semaine</p>
        <h1>
          Prêt pour le défi <span>QuizzYnov</span> ?
        </h1>
        <p className="quiz-hero__subtitle">
          Répondez aux questions du jour, grimpez au classement hebdomadaire et devenez major.
        </p>

        <motion.button
          onClick={onStart}
          disabled={disabled}
          whileHover={disabled ? undefined : { y: -1 }}
          whileTap={disabled ? undefined : { scale: 0.99 }}
          className="quiz-hero__cta"
        >
          {disabled ? "Quiz déjà joué aujourd'hui" : "Démarrer le quiz"}
        </motion.button>

        {disabled && disabledText ? <p className="quiz-hero__hint">{disabledText}</p> : null}
      </div>

      <div className="quiz-hero__visual" aria-hidden="true">
        <img src="/QuizzYnov2.png" alt="" />
      </div>
    </motion.section>
  );
}

export default Hero;
