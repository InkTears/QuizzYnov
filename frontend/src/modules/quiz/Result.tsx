import { motion } from "framer-motion";

interface ResultProps {
  score: number;
  total: number;
  onRestart: () => void;
  onNavigate: (page: "quiz" | "leaderboard" | "home") => void;
}

export const Result = ({ score, total, onRestart, onNavigate }: ResultProps) => {
  const ratio = score / total;
  const message = ratio >= 0.8 ? "Félicitations !" : ratio >= 0.5 ? "Pas mal !" : "Tu peux mieux faire !";

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
        width: "100%",
        minHeight: "70vh",
        padding: "2rem",
        boxSizing: "border-box"
      }}
    >
      <div style={{ maxWidth: "800px", width: "100%" }}>
        <h2 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", marginBottom: "1rem", lineHeight: 1.2, fontWeight: "bold" }}>
          {message}
        </h2>

        <p style={{ marginBottom: "2.5rem", color: "#666", fontSize: "1.5rem" }}>
          Ton score : <span style={{ color: "#4f46e5", fontWeight: "bold", fontSize: "2rem" }}>{score}</span> / {total}
        </p>

        <div style={{ 
          display: "flex", 
          gap: "1.5rem", 
          justifyContent: "center", 
          flexWrap: "wrap" 
        }}>
          
          <motion.button
            onClick={onRestart}
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
              minWidth: "180px"
            }}
          >
            Rejouer
          </motion.button>

          <motion.button
            onClick={() => onNavigate("home")}
            whileHover={{ scale: 1.05, backgroundColor: "#f3f4f6" }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "1rem 2.5rem",
              backgroundColor: "transparent",
              color: "#4b5563",
              borderRadius: "12px",
              border: "2px solid #e5e7eb",
              fontWeight: "bold",
              fontSize: "1.1rem",
              cursor: "pointer",
              minWidth: "180px"
            }}
          >
            Accueil
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
};