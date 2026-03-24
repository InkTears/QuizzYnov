import { motion } from "framer-motion";

interface HeroProps {
  onStart: () => void;
}

function Hero({ onStart }: HeroProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ textAlign: "center", padding: "4rem 1rem" }}
    >
      <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>
        Prêt pour le défi <span style={{ color: "#4f46e5" }}>QuizzYnov</span> ?
      </h1>
      <p style={{ marginBottom: "2rem", color: "#666" }}>
        Testez vos compétences et devenez le major de promo !
      </p>

      <motion.button
        onClick={onStart}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          padding: "1rem 2rem",
          backgroundColor: "#4f46e5",
          color: "white",
          borderRadius: "12px",
          border: "none",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Démarrer le Quiz
      </motion.button>
    </motion.section>
  );
}

export default Hero;