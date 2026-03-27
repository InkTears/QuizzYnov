import { motion } from "framer-motion";

interface HeroProps {
  onStart: () => void;
}

function Hero({ onStart }: HeroProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        width: "100%",           // Force la largeur totale
        minHeight: "70vh",       // Donne de la hauteur pour centrer verticalement
        padding: "2rem",
        boxSizing: "border-box"
      }}
    >
      <div style={{ maxWidth: "800px" }}> {/* Conteneur pour limiter la largeur du texte */}
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", marginBottom: "1rem", lineHeight: 1.2 }}>
          Prêt pour le défi <span style={{ color: "#4f46e5" }}>QuizzYnov</span> ?
        </h1>
        <p style={{ marginBottom: "2.5rem", color: "#666", fontSize: "1.2rem" }}>
          Testez vos compétences et devenez le major de promo !
        </p>

        <motion.button
          onClick={onStart}
          whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.4)" }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: "1rem 2.5rem",
            backgroundColor: "#4f46e5",
            color: "white",
            borderRadius: "12px",
            border: "none",
            fontWeight: "bold",
            fontSize: "1.1rem",
            cursor: "pointer",
          }}
        >
          Démarrer le Quiz
        </motion.button>
      </div>
    </motion.section>
  );
}

export default Hero;