import { motion } from "framer-motion";

interface ScoreEntry {
  name: string;
  score: number;
}

interface LeaderboardProps {
  onNavigate: (page: "leaderboard" | "home") => void;
}

const dummyScores: ScoreEntry[] = [
  { name: "YnovMaster", score: 10 },
  { name: "ReactLover", score: 9 },
  { name: "FramerExpert", score: 7 },
];

export const Leaderboard = ({ onNavigate }: LeaderboardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      style={{
        backgroundColor: "white",
        padding: "2.5rem",
        borderRadius: "1.5rem",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "500px",
        margin: "2rem auto",
        textAlign: "center"
      }}
    >
      <h2 style={{ marginBottom: "2rem", fontSize: "1.8rem", color: "#1f2937" }}>
        Classement Global
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
        {dummyScores.map((s, index) => (
          <motion.div
            key={index}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "1rem 1.5rem",
              backgroundColor: index === 0 ? "#fffbeb" : "#f9fafb",
              borderRadius: "0.75rem",
              border: index === 0 ? "2px solid #fcd34d" : "1px solid #e5e7eb",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <span style={{ fontWeight: 800, color: index === 0 ? "#b45309" : "#6b7280" }}>
                #{index + 1}
              </span>
              <span style={{ fontWeight: 600, color: "#374151" }}>{s.name}</span>
            </div>
            <span style={{ fontWeight: 800, color: "#4f46e5", fontSize: "1.1rem" }}>
              {s.score} pts
            </span>
          </motion.div>
        ))}
      </div>

      <motion.button
        onClick={() => onNavigate("home")}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          padding: "0.8rem 1.5rem",
          backgroundColor: "#4f46e5",
          color: "white",
          border: "none",
          borderRadius: "10px",
          fontWeight: "600",
          cursor: "pointer"
        }}
      >
        Retour à l'accueil
      </motion.button>
    </motion.div>
  );
};