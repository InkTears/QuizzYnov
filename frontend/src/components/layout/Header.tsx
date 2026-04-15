import { motion } from "framer-motion";
import authService from "../../services/authService";

interface HeaderProps {
  onNavigate: (page: "quiz" | "leaderboard" | "home") => void;
  currentPage?: "quiz" | "leaderboard" | "home";
  isQuizActive?: boolean;
}

function HeaderLink({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -2, color: "#e0e7ff" }}
      style={{
        cursor: "pointer",
        color: "white",
        fontSize: "1rem",
        fontWeight: "500",
        transition: "color 0.2s"
      }}
    >
      {label}
    </motion.div>
  );
}

// 2. Le composant principal
function QuizHeader({ onNavigate, currentPage, isQuizActive }: HeaderProps) {
  const isAuthenticated = authService.isAuthenticated();
  const isAdmin = authService.isAdmin();

  const handleLogoClick = () => {
    const homePath = authService.getHomePageByRole();
    const path = homePath === '/admin' ? 'home' : 'home';
    onNavigate(path as "quiz" | "leaderboard" | "home");
  };

  const handleAuthAction = () => {
    if (isAuthenticated) {
      authService.logout();
      window.location.href = "/";
      return;
    }

    window.location.href = "/login";
  };

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "0.8rem 2rem",
        backgroundColor: "#4f46e5",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        position: "sticky",
        top: 0,
        left: 0,
        zIndex: 1000
      }}
    >
      <motion.div 
        whileHover={{ scale: 1.05 }}
        onClick={handleLogoClick}
        style={{ fontSize: "1.5rem", fontWeight: "bold", cursor: "pointer" }}
      >
        QuizzYnov {isAdmin && <span style={{ fontSize: "0.7rem", marginLeft: "0.5rem" }}>[ADMIN]</span>}
      </motion.div>

      <nav style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          {/* Navigation USER */}
          {!isAdmin && (
            <>
              {currentPage !== "home" && (
                <HeaderLink label="Accueil" onClick={() => onNavigate("home")} />
              )}
              {!isQuizActive && (
                <HeaderLink label="Jouer" onClick={() => onNavigate("quiz")} />
              )}
              <HeaderLink label="Classement" onClick={() => onNavigate("leaderboard")} />
            </>
          )}

          {/* Navigation ADMIN */}
          {isAdmin && (
            <>
              {currentPage !== "home" && (
                <HeaderLink label="Administration" onClick={() => window.location.href = "/admin"} />
              )}
              <HeaderLink label="Gérer Questions" onClick={() => window.location.href = "/admin/questions"} />
            </>
          )}
        </div>
        
        <div style={{ width: "1px", height: "20px", backgroundColor: "rgba(255,255,255,0.3)" }} />

        <motion.button
          type="button"
          onClick={handleAuthAction}
          whileHover={{ scale: 1.05, backgroundColor: "#f8fafc" }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: "0.5rem 1.5rem",
            backgroundColor: "white",
            color: "#4f46e5",
            border: "none",
            borderRadius: "8px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          {isAuthenticated ? "Déconnexion" : "Connexion"}
        </motion.button>
      </nav>
    </motion.header>
  );
}

export default QuizHeader;
