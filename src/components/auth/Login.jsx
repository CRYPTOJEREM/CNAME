import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Login = ({ setActiveTab }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);

        if (result.success) {
            // Rediriger vers l'espace membre
            setActiveTab('membre');
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>🔐 Connexion</h1>
                    <p>Connectez-vous à votre compte La Sphere</p>
                </div>

                {error && (
                    <div className="alert alert-error">
                        <span className="alert-icon">❌</span>
                        <span>{error}</span>
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
                        {loading ? 'Connexion en cours...' : '🚀 Se connecter'}
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
