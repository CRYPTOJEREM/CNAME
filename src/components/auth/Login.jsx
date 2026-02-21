import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { CheckCircle2, Lock, Mail, Rocket, XCircle } from 'lucide-react';

const Login = ({ setActiveTab }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [emailNotVerified, setEmailNotVerified] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);

    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setEmailNotVerified(false);
        setResendSuccess(false);
        setLoading(true);

        const result = await login(email, password);

        if (result.success) {
            setActiveTab('membre');
        } else {
            if (result.error === 'Email non vérifié') {
                setEmailNotVerified(true);
            }
            setError(result.error);
        }

        setLoading(false);
    };

    const handleResendVerification = async () => {
        setResendLoading(true);
        try {
            await api.post('/auth/resend-verification', { email });
            setResendSuccess(true);
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur lors du renvoi');
        }
        setResendLoading(false);
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1><Lock size={14} /> Connexion</h1>
                    <p>Connectez-vous à votre compte La Sphere</p>
                </div>

                {error && (
                    <div className="alert alert-error">
                        <span className="alert-icon"><XCircle size={16} /></span>
                        <span>{error}</span>
                    </div>
                )}

                {emailNotVerified && !resendSuccess && (
                    <div className="alert alert-warning" style={{ background: 'rgba(255, 193, 7, 0.1)', border: '1px solid rgba(255, 193, 7, 0.3)', borderRadius: '8px', padding: '15px', marginBottom: '20px', color: '#FFC107' }}>
                        <p style={{ margin: '0 0 10px 0' }}><Mail size={16} /> Vérifiez votre boîte mail pour activer votre compte.</p>
                        <button
                            onClick={handleResendVerification}
                            disabled={resendLoading}
                            style={{ background: 'linear-gradient(135deg, #00D9FF, #7B2FF7)', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '5px', cursor: 'pointer', fontSize: '14px' }}
                        >
                            {resendLoading ? 'Envoi en cours...' : <><Mail size={16} /> Renvoyer l'email de vérification</>}
                        </button>
                    </div>
                )}

                {resendSuccess && (
                    <div className="alert alert-success" style={{ background: 'rgba(0, 200, 83, 0.1)', border: '1px solid rgba(0, 200, 83, 0.3)', borderRadius: '8px', padding: '15px', marginBottom: '20px', color: '#00C853' }}>
                        <CheckCircle2 size={16} /> Email de vérification renvoyé ! Vérifiez votre boîte de réception.
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="votre-email@example.com"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Mot de passe</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-block"
                        disabled={loading}
                    >
                        {loading ? 'Connexion en cours...' : <><Rocket size={16} /> Se connecter</>}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Pas encore de compte ?{' '}
                        <button
                            onClick={() => setActiveTab('register')}
                            className="link-button"
                        >
                            Créer un compte
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
