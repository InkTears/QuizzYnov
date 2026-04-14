import QuizPage from './pages/Quiz_page'
import { Leaderboard } from './pages/Leaderboard';
import Home from './pages/Home';
import { useState } from 'react';

function App() {
    const [page, setPage] = useState<"quiz" | "leaderboard" | "home">("home");

return (
  <div style={{ fontFamily: 'sans-serif', minHeight: '100vh' }}>
    
    {page === "home" && <Home onNavigate={setPage} />}
    {page === "quiz" && ( <QuizPage key="quiz" onNavigate={setPage} /> )}
    {page === "leaderboard" && <Leaderboard onNavigate={setPage} />}

  </div>
)
}

export default App;
