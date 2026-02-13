import { useEffect, useState } from 'react'

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
        <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
            <h1>Utilisateurs depuis Filess 🚀</h1>
            <pre style={{ background: '#f4f4f4', padding: '1rem' }}>
        {JSON.stringify(users, null, 2)}
      </pre>
        </div>
    )
}

export default App