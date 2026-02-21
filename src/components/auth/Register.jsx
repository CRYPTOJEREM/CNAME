import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { CheckCircle2, Rocket, Sparkles, XCircle } from 'lucide-react';

const Register = ({ setActiveTab }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        telegramUsername: '',
        bitunixUid: '',
        newsletterOptIn: true
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const { register } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation frontend
        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        if (formData.password.length < 8) {
            setError('Le mot de passe doit contenir au moins 8 caractères');
            return;
        }

        if (!/^\d{6,12}$/.test(formData.bitunixUid)) {
            setError('Le Bitunix UID doit contenir entre 6 et 12 chiffres');
            return;
        }

        setLoading(true);

        const { confirmPassword, ...dataToSend } = formData;
        const result = await register(dataToSend);

        if (result.success) {
            setSuccess(true);
            setTimeout(() => {
                setActiveTab('login');
            }, 3000);
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    if (success) {
        return (
            <div className="auth-container">
                <div className="auth-card success-card">
                    <div className="success-icon"><CheckCircle2 size={16} /></div>
                    <h2>Inscription réussie !</h2>
                    <p>Un email de vérification a été envoyé à <strong>{formData.email}</strong></p>
                    <p className="success-note">
                        Veuillez vérifier votre boîte de réception et cliquer sur le lien de vérification
                        avant de vous connecter.
                    </p>
                    <p className="redirect-note">Redirection vers la page de connexion...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1><Sparkles size={14} /> Inscription</h1>
                    <p>Créez votre compte La Sphere</p>
                </div>

                {error && (
                    <div className="alert alert-error">
                        <span className="alert-icon"><XCircle size={16} /></span>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="firstName">Prénom</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="John"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="lastName">Nom</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Doe"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="votre-email@example.com"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="telegramUsername">
                            Pseudo Telegram
                            <span className="label-hint">(optionnel)</span>
                        </label>
                        <input
                            type="text"
                            id="telegramUsername"
                            name="telegramUsername"
                            value={formData.telegramUsername}
                            onChange={handleChange}
                            placeholder="@votre_pseudo"
                            disabled={loading}
                        />
                        <small className="form-hint">
                            Nécessaire pour accéder au groupe Telegram VIP après paiement
                        </small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="bitunixUid">
                            Bitunix UID
                            <span className="label-required">*</span>
                        </label>
                        <input
                            type="text"
                            id="bitunixUid"
                            name="bitunixUid"
                            value={formData.bitunixUid}
                            onChange={handleChange}
                            placeholder="Ex: 12345678"
                            required
                            disabled={loading}
                        />
                        <small className="form-hint">
                            Votre identifiant Bitunix (6-12 chiffres). Trouvez-le dans Parametres &gt; Profil sur Bitunix.
                            <br />Participez gratuitement au concours hebdomadaire de $1,000 de coupon trading Bitunix !
                        </small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Mot de passe</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                            disabled={loading}
                        />
                        <small className="form-hint">
                            Min. 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial
                        </small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="newsletter-checkbox">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={formData.newsletterOptIn}
                                onChange={(e) => setFormData({ ...formData, newsletterOptIn: e.target.checked })}
                                disabled={loading}
                            />
                            <span className="checkbox-custom"></span>
                            <span className="checkbox-text">Recevoir nos analyses et actualités crypto par email</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-block"
                        disabled={loading}
                    >
                        {loading ? 'Inscription en cours...' : <><Rocket size={20} /> Créer mon compte</>}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Déjà un compte ?{' '}
                        <button
                            onClick={() => setActiveTab('login')}
                            className="link-button"
                        >
                            Se connecter
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
