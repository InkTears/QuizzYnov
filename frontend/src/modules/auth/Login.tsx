import React, { useState } from 'react';
import {
    AnimatePresence,
    motion,
    useReducedMotion
} from 'framer-motion';

interface LoginProps {
    onLogin: (credentials: { email: string; password: string }) => Promise<void> | void;
    title: string;
    theme: 'user' | 'admin';
    helperText?: string;
}

const Login: React.FC<LoginProps> = ({ onLogin, title, theme, helperText }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const shouldReduceMotion = useReducedMotion();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        setIsSubmitting(true);
        try {
            await onLogin({ email, password });
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error || 'Erreur de connexion');
            setErrorMessage(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            className={`login-container theme-${theme}`}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.98 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
        >
            <motion.h2 initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                {title}
            </motion.h2>
            {helperText && <p className="login-helper">{helperText}</p>}

            <AnimatePresence mode="wait" initial={false}>
                {errorMessage && (
                    <motion.p
                        key={errorMessage}
                        className="login-error"
                        initial={{ opacity: 0, y: -8, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -6, height: 0 }}
                        transition={{ duration: 0.22 }}
                    >
                        {errorMessage}
                    </motion.p>
                )}
            </AnimatePresence>

            <form onSubmit={handleSubmit}>
                <motion.div
                    className="form-group"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.16 }}
                >
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isSubmitting}
                        required
                    />
                </motion.div>

                <motion.div
                    className="form-group"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.22 }}
                >
                    <label>Mot de passe</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isSubmitting}
                        required
                    />
                </motion.div>

                <motion.button
                    type="submit"
                    className="btn-login"
                    disabled={isSubmitting}
                    whileHover={shouldReduceMotion ? undefined : { y: -1, scale: 1.01 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
                    transition={{ duration: 0.15 }}
                >
                    {isSubmitting ? 'Connexion...' : 'Se connecter'}
                </motion.button>
            </form>
        </motion.div>
    );
};

export default Login;
