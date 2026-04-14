<<<<<<< HEAD
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
=======
import { useEffect, useState } from 'react'
<<<<<<< HEAD
import Header from './components/layout/Header'
import Hero from './components/layout/Hero';
>>>>>>> c91ad24 (add homepage)
=======
import QuizPage from './pages/Quiz_page'
<<<<<<< HEAD
>>>>>>> a396cad (add logic quiz)

// Import de tes pages
=======
>>>>>>> e0a0503 (Add 404 Not Found page and update routing in App component)
import LoginPageUser from './pages/Login_page.tsx';
import RegisterPageUser from './pages/Register_page_user';
import TableauDeBoardAdmin from './pages/Tableau_de_board_admin';
import CRUDQuestionAdmin from './pages/CRUD_question_admin.tsx'
import Leaderboard from './pages/Leaderboard';
import NotFoundPage from './pages/404';
import './App.css';

function App() {
    return (
<<<<<<< HEAD
<<<<<<< HEAD
        <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
<<<<<<< HEAD
            <h1>Utilisateurs depuis Filess 🚀</h1>
=======
            <h1>Utilisateurs depuis Files 🚀</h1>
>>>>>>> 6350595 (update_frontend_archi)
            <pre style={{ background: '#f4f4f4', padding: '1rem' }}>
        {JSON.stringify(users, null, 2)}
      </pre>
=======
        <div style={{ fontFamily: 'sans-serif', minHeight: '100vh' }}>
            <QuizPage />

            <div style={{ padding: '2rem', borderTop: '1px solid #eee', marginTop: '2rem' }}>
                <h2 style={{ fontSize: '1.2rem' }}>Debug : Utilisateurs API 🚀</h2>
                <pre style={{ background: '#f4f4f4', padding: '1rem', borderRadius: '8px', fontSize: '0.8rem' }}>
                    {JSON.stringify(users, null, 2)}
                </pre>
            </div>
>>>>>>> c91ad24 (add homepage)
        </div>
    )
=======
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />

                    <Route path="/login" element={<LoginPageUser />} />
                    <Route path="/register" element={<RegisterPageUser />} />
                    <Route path="/admin/login" element={<Navigate to="/login" replace />} />

                    <Route path="/admin/dashboard" element={<TableauDeBoardAdmin />} />
                    <Route path="/admin/questions" element={<CRUDQuestionAdmin />} />
                    <Route path="/quiz" element={<QuizPage />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </div>
        </Router>
    );
>>>>>>> ef62aa0 (css + prototype v1 du visuel de l'admin)
}

export default App;
