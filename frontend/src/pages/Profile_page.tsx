import { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import authService from '../services/authService';
import profileService from '../services/profileService';
import type { PlayerSession } from '../types/Profile';
import '../css/profile.css';

function formatSessionDate(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

export default function ProfilePage() {
    const navigate = useNavigate();
    const shouldReduceMotion = useReducedMotion();
    const [sessions, setSessions] = useState<PlayerSession[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [role, setRole] = useState<string>((localStorage.getItem('userRole') || '').toLowerCase().trim());

    useEffect(() => {
        if (!authService.isAuthenticated()) {
            navigate('/login', { replace: true });
            return;
        }

        const loadSessions = async () => {
            try {
                const sessionUser = await authService.syncSessionUser();
                if (sessionUser?.role) {
                    setRole(sessionUser.role.toLowerCase());
                }
            } catch {
                // On garde les donnees locales si la synchro echoue.
            }

            try {
                const data = await profileService.getMySessions();
                setSessions(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erreur de chargement du profil');
            } finally {
                setIsLoading(false);
            }
        };

        loadSessions();
    }, [navigate]);

    const playerName = useMemo(() => {
        if (sessions.length > 0 && sessions[0].userName) {
            return sessions[0].userName;
        }

        return localStorage.getItem('userName') || 'Joueur';
    }, [sessions]);

    const isAdmin = role === 'admin';

    return (
        <div className="profile-page">
            <Header />

            <motion.main
                className="profile-container"
                initial={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.28 }}
            >
                <section className="profile-card">
                    <h1>Profil</h1>
                    <p className="profile-subtitle">Joueur: {playerName}</p>
                </section>

                <section className="profile-card">
                    <h2>Historique des parties</h2>

                    {isLoading ? <p className="profile-info">Chargement de votre historique...</p> : null}
                    {!isLoading && error ? <p className="profile-error">{error}</p> : null}
                    {!isLoading && !error && sessions.length === 0 ? (
                        <p className="profile-info">Aucune partie enregistree pour le moment.</p>
                    ) : null}

                    {!isLoading && !error && sessions.length > 0 ? (
                        <div className="profile-table-wrapper">
                            <table className="profile-table" aria-label="Historique des parties">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Score</th>
                                        <th>Duree (s)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sessions.map((session) => (
                                        <tr key={session.id}>
                                            <td>{formatSessionDate(session.completedAt || session.date)}</td>
                                            <td>{session.score}</td>
                                            <td>{session.duration ?? 0}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : null}
                </section>

                <section className="profile-actions">
                    {isAdmin ? (
                        <button type="button" className="profile-btn profile-btn-primary" onClick={() => navigate('/admin/dashboard')}>
                            Acceder a l'administration
                        </button>
                    ) : null}

                    <button type="button" className="profile-btn profile-btn-danger" onClick={() => authService.logout()}>
                        Deconnexion
                    </button>
                </section>
            </motion.main>
        </div>
    );
}
