import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import '../css/payment.css';

type PlanKey = 'starter' | 'pro' | 'team';

const STRIPE_LINKS: Record<PlanKey, string> = {
    starter: import.meta.env.VITE_STRIPE_PAYMENT_LINK_STARTER || '',
    pro: import.meta.env.VITE_STRIPE_PAYMENT_LINK_PRO || '',
    team: import.meta.env.VITE_STRIPE_PAYMENT_LINK_TEAM || ''
};

const PLAN_DETAILS: Record<PlanKey, { name: string; price: string; description: string }> = {
    starter: {
        name: 'Starter',
        price: '0 EUR / mois',
        description: 'Acces de base pour decouvrir QuizzYnov.'
    },
    pro: {
        name: 'Pro',
        price: '12 EUR / mois',
        description: 'Le plan le plus choisi pour une pratique reguliere.'
    },
    team: {
        name: 'Team',
        price: '29 EUR / mois',
        description: 'Concu pour les equipes, classes et organisations.'
    }
};

const isPlanKey = (value: string | null): value is PlanKey => {
    return value === 'starter' || value === 'pro' || value === 'team';
};

const PaymentPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const requestedPlan = searchParams.get('plan');
    const selectedPlan: PlanKey = isPlanKey(requestedPlan) ? requestedPlan : 'pro';

    const stripeUrl = STRIPE_LINKS[selectedPlan];
    const plan = PLAN_DETAILS[selectedPlan];

    const handleRedirectToStripe = () => {
        if (!stripeUrl) {
            return;
        }

        window.location.href = stripeUrl;
    };

    return (
        <main className="payment-page">
            <section className="payment-card">
                <p className="payment-kicker">Paiement securise Stripe</p>
                <h1>Finaliser votre abonnement</h1>
                <p className="payment-plan-name">{plan.name}</p>
                <p className="payment-price">{plan.price}</p>
                <p className="payment-description">{plan.description}</p>

                {stripeUrl ? (
                    <button className="payment-stripe-btn" onClick={handleRedirectToStripe}>
                        Continuer vers Stripe
                    </button>
                ) : (
                    <p className="payment-warning">
                        Lien Stripe manquant. Configurez
                        {' '}
                        <code>VITE_STRIPE_PAYMENT_LINK_{selectedPlan.toUpperCase()}</code>
                        {' '}
                        dans votre fichier <code>.env</code>.
                    </p>
                )}

                <div className="payment-links">
                    <Link to="/forfaits">Retour aux forfaits</Link>
                    <Link to="/login">Se connecter</Link>
                </div>
            </section>
        </main>
    );
};

export default PaymentPage;
