const LoadingSpinner = ({ fullScreen = false }) => {
    if (fullScreen) {
        return (
            <div className="loading-fullscreen">
                <div className="loading-spinner-large">
                    <div className="spinner"></div>
                    <p>Chargement...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="loading-spinner">
            <div className="spinner"></div>
        </div>
    );
};

export default LoadingSpinner;
