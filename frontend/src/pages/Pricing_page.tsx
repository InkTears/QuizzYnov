import React from 'react';
import { Link } from 'react-router-dom';
import '../css/plans.css';

const plans = [
    {
        id: 'starter',
        name: 'Starter',
        price: '0 EUR',
        period: '/mois',
        description: 'Ideal pour tester la plateforme et lancer vos premiers quiz.',
        features: ['5 quiz par mois', 'Acces au classement public', 'Support standard']
    },
    {
        id: 'pro',
        name: 'Pro',
        price: '12 EUR',
        period: '/mois',
        description: 'Pour les joueurs reguliers qui veulent progresser rapidement.',
        features: ['Quiz illimites', 'Statistiques detaillees', 'Themes exclusifs'],
        highlighted: true
    },
    {
        id: 'team',
        name: 'Team',
        price: '29 EUR',
        period: '/mois',
        description: 'Concu pour les groupes, classes ou equipes en entreprise.',
        features: ['Jusqu a 25 comptes', 'Tableau de bord equipe', 'Support prioritaire']
    }
];

const PricingPage: React.FC = () => {
    return (
        <main className="plans-page">
            <section className="plans-hero">
                <p className="plans-kicker">Abonnements QuizzYnov</p>
                <h1>Choisis le forfait quiz qui te correspond</h1>
                <p className="plans-subtitle">
                    Passe du mode decouverte a une experience complete avec analyses, objectifs et competition.
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
                <p>Tu as deja un compte ?</p>
                <Link to="/login">Se connecter</Link>
            </section>
        </main>
    );
};

export default PricingPage;
