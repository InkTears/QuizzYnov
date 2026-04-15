import { Routes, Route } from 'react-router-dom';
import QuizPage from './pages/Quiz_page'
import { Leaderboard } from './pages/Leaderboard';
import Home from './pages/Home';
import LoginPage from './pages/Login_page';
import RegisterPage from './pages/Register_page_user';
import PaymentPage from './pages/Payment_page';
import PricingPage from './pages/Pricing_page';
import AdminDashboard from './pages/Tableau_de_board_admin';
import CRUDQuestionAdmin from './pages/CRUD_question_admin';
import NotFound from './pages/404';

function App() {
  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh' }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/paiement" element={<PaymentPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/questions" element={<CRUDQuestionAdmin />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
