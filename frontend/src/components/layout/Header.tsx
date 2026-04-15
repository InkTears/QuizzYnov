import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "../../css/header.css";

const MotionLink = motion(Link);

function QuizHeader() {
  const playerName = localStorage.getItem("userName") || "Joueur";

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="qy-header"
    >
      <div className="qy-header__inner">
        <Link className="qy-header__brand" to="/quiz" aria-label="Retour au quiz">
          <img src="/QuizzYnov1.png" alt="QuizzYnov" className="qy-header__logo" />
        </Link>

        <nav className="qy-header__nav" aria-label="Navigation principale">
          <Link to="/quiz" className="qy-header__link">Quiz du jour</Link>
          <Link to="/leaderboard" className="qy-header__link">Classements</Link>
          <Link to="/profile" className="qy-header__link">Stats</Link>
          <Link to="/payment" className="qy-header__link">Abonnement</Link>
        </nav>

        <MotionLink
          to="/profile"
          className="qy-header__profile"
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.99 }}
        >
          Profil ({playerName})
        </MotionLink>
      </div>
    </motion.header>
  );
}

export default QuizHeader;
