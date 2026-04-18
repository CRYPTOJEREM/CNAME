import { Component } from 'react';

/**
 * Error Boundary - Attrape les erreurs React et affiche un fallback
 * Empêche le crash complet de l'application
 */
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Met à jour le state pour afficher le fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log l'erreur pour le debugging
        console.error('❌ Error Boundary caught an error:', error, errorInfo);

        // Mettre à jour le state avec les détails de l'erreur
        this.setState({
            error,
            errorInfo
        });

        // En production, vous pourriez envoyer l'erreur à un service de monitoring
        // comme Sentry, LogRocket, etc.
        if (import.meta.env.PROD) {
            // Exemple: Sentry.captureException(error);
        }
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        // Optionnel: recharger la page
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
                    color: '#fff',
                    fontFamily: 'Arial, sans-serif',
                    padding: '20px'
                }}>
                    <div style={{
                        maxWidth: '600px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        padding: '40px',
                        textAlign: 'center',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                    }}>
                        <div style={{ fontSize: '64px', marginBottom: '20px' }}>⚠️</div>
                        <h1 style={{ fontSize: '28px', marginBottom: '16px' }}>
                            Oups, une erreur est survenue
                        </h1>
                        <p style={{
                            fontSize: '16px',
                            color: '#b8b9c1',
                            marginBottom: '30px',
                            lineHeight: '1.6'
                        }}>
                            Une erreur inattendue s'est produite. Nos équipes ont été notifiées
                            et travaillent sur le problème.
                        </p>

                        {import.meta.env.DEV && this.state.error && (
                            <details style={{
                                textAlign: 'left',
                                background: 'rgba(0, 0, 0, 0.3)',
                                padding: '20px',
                                borderRadius: '8px',
                                marginBottom: '20px',
                                fontSize: '14px',
                                fontFamily: 'monospace',
                                cursor: 'pointer'
                            }}>
                                <summary style={{ marginBottom: '10px', cursor: 'pointer' }}>
                                    Détails de l'erreur (dev)
                                </summary>
                                <pre style={{
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word',
                                    color: '#ff6b6b'
                                }}>
                                    {this.state.error.toString()}
                                    {'\n\n'}
                                    {this.state.errorInfo?.componentStack}
                                </pre>
                            </details>
                        )}

                        <button
                            onClick={this.handleReset}
                            style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: '#fff',
                                border: 'none',
                                padding: '14px 32px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'transform 0.2s',
                                outline: 'none'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            Retour à l'accueil
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
