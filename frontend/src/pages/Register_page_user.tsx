import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import Register, { type RegisterPayload } from '../modules/auth/Register';
import authService from '../services/authService';
import '../css/auth.css';

const RegisterPageUser: React.FC = () => {
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

    const handleRegister = async (payload: RegisterPayload) => {
        try {
            await authService.register(payload);
            sessionStorage.setItem('registerSuccess', payload.pseudo);
            navigate('/login');
        } catch (error) {
            throw new Error(`Erreur d'inscription: ${String(error)}`);
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

            <Register
                title="Inscription"
                onRegister={handleRegister}
                theme="user"
                helperText="Prêt à nous rejoindre ? Remplissez ces quelques informations."
            />

            <motion.div
                ref={footerRef}
                className="login-footer"
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
                animate={footerInView || shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                transition={{ duration: 0.32 }}
            >
                <p>
                    Deja un compte ? <Link to="/login">Se connecter</Link>
                </p>
                <p>
                    Explorer les abonnements : <Link to="/forfaits">Voir les forfaits</Link>
                </p>
            </motion.div>
        </motion.div>
    );
};

export default RegisterPageUser;
