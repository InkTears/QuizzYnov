import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { leaderboardApi, type LeaderboardEntry } from "../api/leaderboardApi";

interface LeaderboardProps {
  onNavigate: (page: "leaderboard" | "home") => void;
}

export const Leaderboard = ({ onNavigate }: LeaderboardProps) => {
  const [scores, setScores] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const data = await leaderboardApi.getLeaderboard();
        setScores(data.leaderboard);
      } catch (error) {
        console.error('Erreur chargement leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };
    loadLeaderboard();
  }, []);

  if (loading) {
    return <div>Chargement du leaderboard...</div>;
  }

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
          {scores.length === 0 ? (
              <div style={{ color: "#6b7280", fontStyle: "italic" }}>
                Aucun score disponible pour le moment.
              </div>
          ) : (
              scores.map((s) => (
                  <motion.div
                      key={s.rank}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: s.rank * 0.1 }}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "1rem 1.5rem",
                        backgroundColor: s.rank === 1 ? "#fffbeb" : "#f9fafb",
                        borderRadius: "0.75rem",
                        border: s.rank === 1 ? "2px solid #fcd34d" : "1px solid #e5e7eb",
                      }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <span style={{ fontWeight: 800, color: s.rank === 1 ? "#b45309" : "#6b7280" }}>
                  #{s.rank}
                </span>
                      <span style={{ fontWeight: 600, color: "#374151" }}>{s.userName}</span>
                    </div>
                    <span style={{ fontWeight: 800, color: "#4f46e5", fontSize: "1.1rem" }}>
                {s.totalScore} pts
              </span>
                  </motion.div>
              ))
          )}
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