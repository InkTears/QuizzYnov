import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import '../css/payment.css';

type PlanKey = 'starter' | 'pro' | 'team';

const PLAN_DETAILS: Record<PlanKey, { name: string; price: string; description: string }> = {
    starter: {
        name: 'Starter',
        price: '0 EUR / mois',
        description: 'Accès de base pour découvrir QuizzYnov.'
    },
    pro: {
        name: 'Pro',
        price: '12 EUR / mois',
        description: 'Le plan le plus choisi pour une pratique régulière.'
    },
    team: {
        name: 'Team',
        price: '29 EUR / mois',
        description: 'Conçu pour les équipes, classes et organisations.'
    }
};

const isPlanKey = (value: string | null): value is PlanKey => {
    return value === 'starter' || value === 'pro' || value === 'team';
};

const SIMULATION_CARD = {
    success: '4242 4242 4242 4242',
    decline: '4000 0000 0000 0002'
} as const;

const PaymentPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const requestedPlan = searchParams.get('plan');
    const selectedPlan: PlanKey = isPlanKey(requestedPlan) ? requestedPlan : 'pro';
    const plan = PLAN_DETAILS[selectedPlan];
    const [cardholderName, setCardholderName] = useState('');
    const [cardNumber, setCardNumber] = useState<string>(SIMULATION_CARD.success);
    const [expiry, setExpiry] = useState('12/34');
    const [cvc, setCvc] = useState('123');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const isStarterPlan = selectedPlan === 'starter';
    const normalizedCardNumber = useMemo(
        () => cardNumber.replace(/\s+/g, '').trim(),
        [cardNumber]
    );

    const handleSimulatedPayment = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage('');

        if (!cardholderName.trim()) {
            setErrorMessage('Ajoutez un nom de titulaire pour lancer la simulation.');
            return;
        }

        if (!expiry.trim() || !cvc.trim()) {
            setErrorMessage("Complétez la date d'expiration et le CVC.");
            return;
        }

        setIsSubmitting(true);

        await new Promise((resolve) => {
            window.setTimeout(resolve, 1200);
        });

        if (normalizedCardNumber === '4000000000000002') {
            setIsSubmitting(false);
            setErrorMessage('Simulation refusée: utilisez 4242 4242 4242 4242 pour un paiement test valide.');
            return;
        }

        sessionStorage.setItem(
            'paymentSimulationSuccess',
            JSON.stringify({
                plan: plan.name,
                price: plan.price
            })
        );

        navigate('/login');
    };

    return (
        <main className="payment-page">
            <section className="payment-card">
                <header className="payment-hero">
                    <p className="payment-kicker">Paiement sécurisé Stripe</p>
                    <h1>Finaliser votre abonnement</h1>
                    <p className="payment-plan-name">{plan.name}</p>
                    <p className="payment-price">{plan.price}</p>
                    <p className="payment-description">{plan.description}</p>
                    <p className="payment-note">
                        Mode simulation: aucun débit réel n&apos;est effectué. Cette page imite un paiement Stripe
                        test puis vous renvoie vers la connexion.
                    </p>
                </header>

                <form className="payment-form" onSubmit={handleSimulatedPayment}>
                    <label className="payment-field">
                        <span>Nom du titulaire</span>
                        <input
                            type="text"
                            value={cardholderName}
                            onChange={(event) => setCardholderName(event.target.value)}
                            placeholder="Ex: Nahte Martin"
                            autoComplete="cc-name"
                        />
                    </label>

                    <label className="payment-field">
                        <span>Numéro de carte de test</span>
                        <input
                            type="text"
                            value={cardNumber}
                            onChange={(event) => setCardNumber(event.target.value)}
                            placeholder={SIMULATION_CARD.success}
                            autoComplete="cc-number"
                            inputMode="numeric"
                        />
                    </label>

                    <div className="payment-field-row">
                        <label className="payment-field">
                            <span>Expiration</span>
                            <input
                                type="text"
                                value={expiry}
                                onChange={(event) => setExpiry(event.target.value)}
                                placeholder="12/34"
                                autoComplete="cc-exp"
                                inputMode="numeric"
                            />
                        </label>

                        <label className="payment-field">
                            <span>CVC</span>
                            <input
                                type="text"
                                value={cvc}
                                onChange={(event) => setCvc(event.target.value)}
                                placeholder="123"
                                autoComplete="cc-csc"
                                inputMode="numeric"
                            />
                        </label>
                    </div>

                    <div className="payment-test-cards" aria-label="Cartes de test">
                        <p>Cartes de simulation Stripe:</p>
                        <button
                            type="button"
                            className="payment-chip"
                            onClick={() => setCardNumber(SIMULATION_CARD.success)}
                        >
                            4242 4242 4242 4242 = Succès
                        </button>
                        <button
                            type="button"
                            className="payment-chip payment-chip-muted"
                            onClick={() => setCardNumber(SIMULATION_CARD.decline)}
                        >
                            4000 0000 0000 0002 = Refus
                        </button>
                    </div>

                    {isStarterPlan ? (
                        <p className="payment-warning">
                            Le plan Starter est gratuit. La simulation valide simplement l'activation puis renvoie
                            vers la connexion.
                        </p>
                    ) : null}

                    {errorMessage ? <p className="payment-error">{errorMessage}</p> : null}

                    <button className="payment-stripe-btn" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Simulation en cours...' : 'Simuler un paiement Stripe'}
                    </button>
                </form>

                <div className="payment-links">
                    <Link className="payment-back-link" to="/pricing">Retour aux forfaits</Link>
                </div>
            </section>
        </main>
    );
};

export default PaymentPage;
