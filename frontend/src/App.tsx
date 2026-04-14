import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import QuizPage from './pages/Quiz_page';
import { Leaderboard } from './pages/Leaderboard';
import LoginPageUser from './pages/Login_page';
import RegisterPageUser from './pages/Register_page_user';
import PricingPage from './pages/Pricing_page';
import PaymentPage from './pages/Payment_page';
import TableauDeBoardAdmin from './pages/Tableau_de_board_admin';
import CRUDQuestionAdmin from './pages/CRUD_question_admin';
import './App.css';

function AppRoutes() {
    const navigate = useNavigate();

    const handleNavigate = (page: 'quiz' | 'leaderboard' | 'home') => {
        const routeByPage = {
            home: '/home',
            quiz: '/quiz',
            leaderboard: '/leaderboard'
        } as const;

        navigate(routeByPage[page]);
    };

    return (
        <div style={{ fontFamily: 'sans-serif', minHeight: '100vh' }}>
            <Routes>
                {/* Redirection par dÃ©faut */}
                <Route path="/" element={<Navigate to="/login" />} />

                {/* Routes publiques */}
                <Route path="/login" element={<LoginPageUser />} />
                <Route path="/register" element={<RegisterPageUser />} />
                <Route path="/forfaits" element={<PricingPage />} />
                <Route path="/paiement" element={<PaymentPage />} />

                {/* App utilisateur */}
                <Route path="/home" element={<Home onNavigate={handleNavigate} />} />
                <Route path="/quiz" element={<QuizPage onNavigate={handleNavigate} />} />
                <Route path="/leaderboard" element={<Leaderboard onNavigate={handleNavigate} />} />

                {/* Admin */}
                <Route path="/admin/dashboard" element={<TableauDeBoardAdmin />} />
                <Route path="/admin/questions" element={<CRUDQuestionAdmin />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </div>
    );
}

function App() {
    return (
        <Router>
            <AppRoutes />
        </Router>
    );
}

export default App;
