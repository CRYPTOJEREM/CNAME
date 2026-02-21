import { useState, useEffect } from 'react';
import { authService } from '../../services/authService';
import { CheckCircle2, XCircle } from 'lucide-react';

const EmailVerification = ({ setActiveTab }) => {
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        verifyEmail();
    }, []);

    const verifyEmail = async () => {
        try {
            // Extraire le token de l'URL
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('token');

            if (!token) {
                setStatus('error');
                setMessage('Token de vérification manquant');
                return;
            }

            // Appeler l'API de vérification
            const result = await authService.verifyEmail(token);

            setStatus('success');
            setMessage(result.message);

            // Rediriger vers login après 3 secondes
            setTimeout(() => {
                setActiveTab('login');
            }, 3000);

        } catch (error) {
            setStatus('error');
            setMessage(error.response?.data?.error || 'Erreur lors de la vérification');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card verification-card">
                {status === 'verifying' && (
                    <>
                        <div className="verification-icon loading">
                            <div className="spinner"></div>
                        </div>
                        <h2>Vérification en cours...</h2>
                        <p>Veuillez patienter pendant que nous vérifions votre email.</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="verification-icon success"><CheckCircle2 size={16} /></div>
                        <h2>Email vérifié !</h2>
                        <p>{message}</p>
                        <p className="redirect-note">
                            Redirection vers la page de connexion dans quelques secondes...
                        </p>
                        <button
                            onClick={() => setActiveTab('login')}
                            className="btn btn-primary"
                        >
                            Se connecter maintenant
                        </button>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="verification-icon error"><XCircle size={16} /></div>
                        <h2>Erreur de vérification</h2>
                        <p>{message}</p>
                        <div className="error-actions">
                            <button
                                onClick={() => setActiveTab('login')}
                                className="btn btn-secondary"
                            >
                                Retour à la connexion
                            </button>
                            <button
                                onClick={() => setActiveTab('register')}
                                className="btn btn-primary"
                            >
                                Créer un nouveau compte
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default EmailVerification;
