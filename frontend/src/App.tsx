import { useEffect, useState } from 'react'
import QuizPage from './pages/Quiz_page'

interface User {
    id: number;
    name: string;
}

function App() {
    const [users, setUsers] = useState<User[]>([])

    useEffect(() => {
        fetch('/api/users')
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(err => console.error(err))
    }, [])

    return (
        <div style={{ fontFamily: 'sans-serif', minHeight: '100vh' }}>
            <QuizPage />

            <div style={{ padding: '2rem', borderTop: '1px solid #eee', marginTop: '2rem' }}>
                <h2 style={{ fontSize: '1.2rem' }}>Debug : Utilisateurs API 🚀</h2>
                <pre style={{ background: '#f4f4f4', padding: '1rem', borderRadius: '8px', fontSize: '0.8rem' }}>
                    {JSON.stringify(users, null, 2)}
                </pre>
            </div>
        </div>
    )
}

export default App