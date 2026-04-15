import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../components/layout/Header";
import { leaderboardApi, type LeaderboardEntry } from "../api/leaderboardApi";
import "../css/leaderboard.css";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(value));

const Leaderboard = () => {
  const navigate = useNavigate();
  const [scores, setScores] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<{ weekStart: string; weekEnd: string } | null>(null);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const data = await leaderboardApi.getLeaderboard();
        setScores(data.leaderboard);
        setPeriod({ weekStart: data.weekStart, weekEnd: data.weekEnd });
      } catch (error) {
        console.error("Erreur chargement leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };
    loadLeaderboard();
  }, []);

  return (
    <div className="leaderboard-page">
      <Header />
      <main className="leaderboard-wrap">
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="leaderboard-card"
        >
          <h1>Classement hebdomadaire</h1>
          {period ? (
            <p className="leaderboard-period">
              Semaine précédente : du {formatDate(period.weekStart)} au {formatDate(period.weekEnd)} (23h59)
            </p>
          ) : null}

          {loading ? <p className="leaderboard-state">Chargement du classement...</p> : null}

          {!loading ? (
            <div className="leaderboard-list">
              {scores.length === 0 ? (
                <p className="leaderboard-state">Aucun score disponible pour la période sélectionnée.</p>
              ) : (
                scores.map((s) => (
                  <motion.article
                    key={s.rank}
                    initial={{ x: -16, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: s.rank * 0.03 }}
                    className={`leaderboard-row ${s.rank === 1 ? "leaderboard-row--first" : ""}`}
                  >
                    <div className="leaderboard-user">
                      <strong>#{s.rank}</strong>
                      <span>{s.userName}</span>
                    </div>
                    <div className="leaderboard-score">
                      <span>{s.totalScore} pts</span>
                      <small>{s.gamesCount} partie(s)</small>
                    </div>
                  </motion.article>
                ))
              )}
            </div>
          ) : null}

          <button type="button" className="leaderboard-btn" onClick={() => navigate("/quiz")}>
            Retour au quiz
          </button>
        </motion.section>
      </main>
    </div>
  );
};

export default Leaderboard;
