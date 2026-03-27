import { useState } from 'react';
import { useAuth } from '../contexts/useAuth';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const redirectPath = location.state?.from?.pathname || '/dashboard';

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            await login(email, password);
            navigate(redirectPath, { replace: true });
        } catch (error) {
            setError('Failed to sign in: ' + error.message);
        }
        setLoading(false);
    }

    async function handleGoogleLogin() {
        try {
            setError('');
            setLoading(true);
            await loginWithGoogle();
            navigate(redirectPath, { replace: true });
        } catch (error) {
            setError('Failed to sign in with Google: ' + error.message);
        }
        setLoading(false);
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Login</h2>
                <p className="login-subtitle">
                    Sign in to manage favorites, applications, and your profile.
                </p>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="login-form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="login-form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button disabled={loading} type="submit" className="login-button">
                        Log In
                    </button>
                </form>
                <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="google-login-button"
                >
                    Sign in with Google
                </button>
                <p className="login-footer">
                    New here? <Link to="/register">Create an account</Link>
                </p>
            </div>
        </div>
    );
}
