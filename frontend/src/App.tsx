import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import QuizPage from './pages/Quiz_page'
import LoginPageUser from './pages/Login_page.tsx';
import RegisterPageUser from './pages/Register_page_user';
import TableauDeBoardAdmin from './pages/Tableau_de_board_admin';
import CRUDQuestionAdmin from './pages/CRUD_question_admin.tsx'
import Leaderboard from './pages/Leaderboard';
import ProfilePage from './pages/Profile_page';
import PaymentPage from './pages/Payment_page';
import PricingPage from './pages/Pricing_page';
import NotFoundPage from './pages/404';
import ProtectedRoute from './utils/auth';
import AdminRoute from './utils/admin';
import authService from './services/authService';
import './App.css';

function App() {
    useEffect(() => {
        const sync = async () => {
            if (!authService.isAuthenticated()) {
                return;
            }

            await authService.syncSessionUser();
        };

        sync();

        const onFocus = () => {
            sync();
        };

        window.addEventListener('focus', onFocus);

        return () => {
            window.removeEventListener('focus', onFocus);
        };
    }, []);

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />

                    <Route path="/login" element={<LoginPageUser />} />
                    <Route path="/register" element={<RegisterPageUser />} />
                    <Route path="/pricing" element={<PricingPage />} />
                    <Route path="/paiement" element={<PaymentPage />} />
                    <Route path="/payment" element={<Navigate to="/paiement" replace />} />
                    <Route path="/admin/login" element={<Navigate to="/login" replace />} />

                    <Route element={<AdminRoute />}>
                        <Route path="/admin/dashboard" element={<TableauDeBoardAdmin />} />
                        <Route path="/admin/questions" element={<CRUDQuestionAdmin />} />
                    </Route>

                    <Route element={<ProtectedRoute />}>
                        <Route path="/quiz" element={<QuizPage />} />
                        <Route path="/leaderboard" element={<Leaderboard />} />
                        <Route path="/profile" element={<ProfilePage />} />
                    </Route>

                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
