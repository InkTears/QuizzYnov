import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Login from '../modules/auth/Login';
import authService from '../services/authService';
import '../css/auth.css';

const LoginPageUser: React.FC = () => {
    const navigate = useNavigate();
    const pageRef = useRef<HTMLDivElement | null>(null);
    const footerRef = useRef<HTMLDivElement | null>(null);
    const shouldReduceMotion = useReducedMotion();

    const { scrollYProgress } = useScroll({
        target: pageRef,
        offset: ['start start', 'end end']
    });
    const progressScaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26 });
    const orbY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);
    const orbOpacity = useTransform(scrollYProgress, [0, 1], [0.24, 0.36]);
    const footerInView = useInView(footerRef, { amount: 0.7, once: true });

    const handleUserLogin = async (credentials: { email: string; password: string }) => {
        try {
            const response = await authService.login(credentials);
            if (response.accessToken) {
                const role = String(response.role || response.user?.role || localStorage.getItem('userRole') || '')
                    .toLowerCase()
                    .trim();

                if (role === 'admin') {
                    navigate('/admin/dashboard');
                    return;
                }

                navigate('/dashboard');
                return;
            }
            throw new Error('Token non recu');
        } catch (error) {
            throw new Error(`Erreur de connexion: ${String(error)}`);
        }
    };

    return (
        <motion.div
            ref={pageRef}
            className="auth-page-wrapper auth-page-user"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
        >
            <motion.div
                className="auth-progress"
                style={shouldReduceMotion ? undefined : { scaleX: progressScaleX }}
                aria-hidden="true"
            />
            <motion.div
                className="auth-orb"
                style={shouldReduceMotion ? undefined : { y: orbY, opacity: orbOpacity }}
                aria-hidden="true"
            />

            <Login
                title="Connexion"
                onLogin={handleUserLogin}
                theme="user"
                helperText="Connectez-vous pour accéder à votre espace personnalisé."
            />

            <motion.div
                ref={footerRef}
                className="login-footer"
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
                animate={footerInView || shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                transition={{ duration: 0.32 }}
            >
                <p>
                    Pas encore de compte ? <Link to="/register">S'inscrire</Link>
                </p>
                <p>
                    Voir les offres quiz : <Link to="/forfaits">Forfaits et abonnements</Link>
                </p>
            </motion.div>
        </motion.div>
    );
};

export default LoginPageUser;
