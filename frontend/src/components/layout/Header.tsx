import { motion } from "framer-motion";

function QuizHeader() {
  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        width: "100%",
        padding: "0.8rem 2rem",
        backgroundColor: "#4f46e5",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        position: "sticky",
        top: 0,
        zIndex: 1000
      }}
    >
      <motion.div 
        whileHover={{ scale: 1.05 }}
        style={{ fontSize: "1.5rem", fontWeight: "bold", cursor: "pointer" }}
      >
        QuizzYnov
      </motion.div>

      <nav style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
        <HeaderLink label="Jouer" href="/quiz" />
        <HeaderLink label="Classement" href="/leaderboard" />
        
        <div style={{ width: "1px", height: "20px", backgroundColor: "rgba(255,255,255,0.3)" }} />

        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: "#4338ca" }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "white",
            color: "#4f46e5",
            border: "none",
            borderRadius: "8px",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          Connexion
        </motion.button>
      </nav>
    </motion.header>
  );
}

function HeaderLink({ label, href }: { label: string; href: string }) {
  return (
    <motion.a
      href={href}
      whileHover={{ y: -2, color: "#e0e7ff" }}
      style={{
        textDecoration: "none",
        color: "white",
        fontSize: "1rem",
        fontWeight: "500",
        transition: "color 0.2s"
      }}
    >
      {label}
    </motion.a>
  );
}

export default QuizHeader;