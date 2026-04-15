import React from 'react';
import { Link } from 'react-router-dom';
import '../css/plans.css';

const plans = [
    {
        id: 'starter',
        name: 'Starter',
        price: '0 EUR',
        period: '/mois',
        description: 'Ideal pour tester la plateforme et lancer tes premiers quiz.',
        features: ['5 quiz par mois', 'Accès au classement public', 'Support standard']
    },
    {
        id: 'pro',
        name: 'Pro',
        price: '12 EUR',
        period: '/mois',
        description: 'Pour les joueurs réguliers qui veulent progresser rapidement.',
        features: ['Quiz illimités', 'Statistiques détaillées', 'Thèmes exclusifs'],
        highlighted: true
    },
    {
        id: 'team',
        name: 'Team',
        price: '29 EUR',
        period: '/mois',
        description: 'Conçu pour les groupes, classes ou équipes en entreprise.',
        features: ["Jusqu'à 25 comptes", 'Tableau de bord équipe', 'Support prioritaire']
    }
];

const PricingPage: React.FC = () => {
    return (
        <main className="plans-page">
            <section className="plans-hero">
                <p className="plans-kicker">Abonnements QuizzYnov</p>
                <h1>Choisis le forfait quiz qui te correspond</h1>
                <p className="plans-subtitle">
                    Passe du mode découverte à une expérience complète avec analyses, objectifs et compétition.
                </p>
            </section>

            <section className="plans-grid" aria-label="Forfaits disponibles">
                {plans.map((plan) => (
                    <article
                        key={plan.name}
                        className={`plan-card${plan.highlighted ? ' is-highlighted' : ''}`}
                    >
                        {plan.highlighted ? <span className="plan-badge">Populaire</span> : null}
                        <h2>{plan.name}</h2>
                        <p className="plan-price">
                            <span>{plan.price}</span>
                            {plan.period}
                        </p>
                        <p className="plan-description">{plan.description}</p>
                        <ul>
                            {plan.features.map((feature) => (
                                <li key={feature}>{feature}</li>
                            ))}
                        </ul>
                        <Link className="plan-cta" to={`/paiement?plan=${plan.id}`}>
                            Choisir ce forfait
                        </Link>
                    </article>
                ))}
            </section>

            <section className="plans-footer-cta">
                <p>Tu as déjà un compte? Connecte-toi ici</p>
                <Link to="/login">Se connecter</Link>
            </section>
        </main>
    );
};

export default PricingPage;
