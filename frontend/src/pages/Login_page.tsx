import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Login from '../modules/auth/Login';
import authService from '../services/authService';
import '../css/auth.css';

const LoginPageUser: React.FC = () => {
    const navigate = useNavigate();
    const pageRef = useRef<HTMLDivElement | null>(null);
    const footerRef = useRef<HTMLDivElement | null>(null);
    const shouldReduceMotion = useReducedMotion();
    const [registerToast, setRegisterToast] = useState<string | null>(null);
    const [paymentToast, setPaymentToast] = useState<{ plan: string; price: string } | null>(null);

    useEffect(() => {
        const pseudo = sessionStorage.getItem('registerSuccess');
        if (pseudo) {
            sessionStorage.removeItem('registerSuccess');
            setRegisterToast(pseudo);
            setTimeout(() => setRegisterToast(null), 3000);
        }

        const paymentSuccess = sessionStorage.getItem('paymentSimulationSuccess');
        if (paymentSuccess) {
            sessionStorage.removeItem('paymentSimulationSuccess');

            try {
                const parsedPayment = JSON.parse(paymentSuccess) as { plan?: string; price?: string };
                setPaymentToast({
                    plan: parsedPayment.plan || 'Abonnement',
                    price: parsedPayment.price || ''
                });
                setTimeout(() => setPaymentToast(null), 4000);
            } catch {
                setPaymentToast({ plan: 'Abonnement', price: '' });
                setTimeout(() => setPaymentToast(null), 4000);
            }
        }
    }, []);

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
                const name = response.user?.name || response.user?.pseudo || '';

                sessionStorage.setItem('loginSuccess', JSON.stringify({ name, role }));

                if (role === 'admin') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/home');
                }
                return;
            }
            throw new Error('Token non reçu');
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

            <AnimatePresence>
                {registerToast && (
                    <motion.div
                        className="login-toast-success login-toast-register"
                        initial={{ opacity: 0, y: -24, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -16, scale: 0.97 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        role="status"
                        aria-live="polite"
                    >
                        <span className="login-toast-icon">✓</span>
                        <span>
                            Compte créé avec succès, {registerToast} !
                            <br />
                            <small>Vous pouvez maintenant vous connecter</small>
                        </span>
                    </motion.div>
                )}
                {paymentToast && (
                    <motion.div
                        className="login-toast-success login-toast-register"
                        initial={{ opacity: 0, y: -24, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -16, scale: 0.97 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        role="status"
                        aria-live="polite"
                    >
                        <span className="login-toast-icon">✓</span>
                        <span>
                            Simulation Stripe validee pour {paymentToast.plan}
                            {paymentToast.price ? ` (${paymentToast.price})` : ''}.
                            <br />
                            <small>Connectez-vous pour finaliser l activation de votre acces</small>
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

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
