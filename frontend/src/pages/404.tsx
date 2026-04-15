import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../css/notfound.css";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    const historyIndex = typeof window.history.state?.idx === "number" ? window.history.state.idx : 0;
    if (historyIndex > 0) {
      navigate(-1);
      return;
    }
    navigate("/quiz", { replace: true });
  };

  return (
    <main className="notfound-page">
      <motion.section
        className="notfound-card"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>404</h1>
        <h2>Page introuvable</h2>
        <p>La page demandée n'existe pas ou a été déplacée.</p>
        <button type="button" onClick={handleBack}>
          Retour arrière
        </button>
      </motion.section>
    </main>
  );
};

export default NotFoundPage;
