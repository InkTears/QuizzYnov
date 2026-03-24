<<<<<<< HEAD
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
=======
import { useEffect, useState } from 'react'
import Header from './components/layout/Header'
import Hero from './components/layout/Hero';
>>>>>>> c91ad24 (add homepage)

// Import de tes pages
import LoginPageUser from './pages/Login_page.tsx';
import RegisterPageUser from './pages/Register_page_user';
import TableauDeBoardAdmin from './pages/Tableau_de_board_admin';
import CRUDQuestionAdmin from './pages/CRUD_question_admin.tsx'
/*import QuizPage from './pages/Quiz_page';

import Leaderboard from './pages/Leaderboard';*/
//import ProtectedRoute from './components/ProtectedRoute'; // Ajuste le chemin selon ton choix
//import Navbar from './modules/Navbar';
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
            <Header />
            <Hero />

            <div style={{ padding: '2rem' }}>
                <h1>Utilisateurs depuis Files 🚀</h1>
                <pre style={{ background: '#f4f4f4', padding: '1rem' }}>
                    {JSON.stringify(users, null, 2)}
                </pre>
            </div>
>>>>>>> c91ad24 (add homepage)
        </div>
    )
=======
        <Router>
            <div className="App">
                {/*<Navbar />*/}
                <Routes>
                    {/* Route par défaut : redirige vers le login utilisateur */}
                    <Route path="/" element={<Navigate to="/login" />} />

                    {/* Routes publiques */}
                    <Route path="/login" element={<LoginPageUser />} />
                    <Route path="/register" element={<RegisterPageUser />} />
                    <Route path="/admin/login" element={<Navigate to="/login" replace />} />

                    {/* Routes de l'application (à protéger plus tard) */}
                    {/*<Route element={<ProtectedRoute />}>*/}

                    <Route path="/admin/dashboard" element={<TableauDeBoardAdmin />} />
                    <Route path="/admin/questions" element={<CRUDQuestionAdmin />} />
                    {/* <Route path="/quiz" element={<QuizPage />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                </Route> */}

                    {/* Page 404 ou redirection si la route n'existe pas */}
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
>>>>>>> ef62aa0 (css + prototype v1 du visuel de l'admin)
}

export default App;
