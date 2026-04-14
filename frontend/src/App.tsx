import QuizPage from './pages/Quiz_page'
import { Leaderboard } from './pages/Leaderboard';
import Home from './pages/Home';
import { useEffect, useState } from 'react';

interface User {
    id: number;
    name: string;
}

function App() {
    const [users, setUsers] = useState<User[]>([])
    const [page, setPage] = useState<"quiz" | "leaderboard" | "home">("home");

    useEffect(() => {
        fetch('/api/users')
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(err => console.error(err))
    }, [])

return (
  <div style={{ fontFamily: 'sans-serif', minHeight: '100vh' }}>
    
    {page === "home" && <Home onNavigate={setPage} />}
    {page === "quiz" && ( <QuizPage key="quiz" onNavigate={setPage} /> )}
    {page === "leaderboard" && <Leaderboard onNavigate={setPage} />}

    <div style={{ padding: '2rem', borderTop: '1px solid #eee', marginTop: '2rem' }}>
      <pre style={{ background: '#f4f4f4', padding: '1rem', borderRadius: '8px', fontSize: '0.8rem' }}>
        {JSON.stringify(users, null, 2)}
      </pre>
    </div>
  </div>
)
}

export default App;
