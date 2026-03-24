import { useEffect, useState } from 'react'
import Header from './components/layout/Header'
import Hero from './components/layout/Hero';

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
            <Header />
            <Hero />

            <div style={{ padding: '2rem' }}>
                <h1>Utilisateurs depuis Files 🚀</h1>
                <pre style={{ background: '#f4f4f4', padding: '1rem' }}>
                    {JSON.stringify(users, null, 2)}
                </pre>
            </div>
        </div>
    )
}

export default App