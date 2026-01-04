import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at center, #2e1a0f 0%, #12100e 100%)', // Branded gradient
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Orbs */}
            <div style={{
                position: 'absolute',
                top: '20%',
                left: '20%',
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                background: '#ff9933', // Saffron
                filter: 'blur(120px)',
                opacity: 0.15
            }} />
            <div style={{
                position: 'absolute',
                bottom: '20%',
                right: '25%',
                width: '250px',
                height: '250px',
                borderRadius: '50%',
                background: '#c47f18', // Gold
                filter: 'blur(100px)',
                opacity: 0.1
            }} />

            <div className="glass-card" style={{ padding: '48px', width: '100%', maxWidth: '400px', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,153,51,0.2)' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <img src="/logo.png" alt="Logo" style={{ width: '80px', height: '80px', borderRadius: '16px', marginBottom: '16px', objectFit: 'cover', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }} />
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: '#ff9933' }}>Brahmana Vantillu</h1>
                    <p style={{ color: '#d0c0b0', fontSize: '14px' }}>Pure Vegetarian Home-Style Meals</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '12px', color: '#a0a0b0', marginBottom: '8px' }}>EMAIL ADDRESS</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@mealroute.in"
                            required
                            style={{ background: 'rgba(0,0,0,0.2)', borderColor: 'rgba(255,153,51,0.2)' }}
                        />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontSize: '12px', color: '#a0a0b0', marginBottom: '8px' }}>PASSWORD</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            style={{ background: 'rgba(0,0,0,0.2)', borderColor: 'rgba(255,153,51,0.2)' }}
                        />
                    </div>

                    {error && (
                        <div style={{
                            background: 'rgba(239, 83, 80, 0.15)',
                            color: '#ef5350',
                            padding: '12px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            marginBottom: '20px',
                            textAlign: 'center'
                        }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn-primary"
                        style={{ width: '100%', color: 'white' }}
                        disabled={loading}
                    >
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>

                    <div style={{ margin: '20px 0', display: 'flex', alignItems: 'center', color: 'rgba(255,153,51,0.3)' }}>
                        <div style={{ flex: 1, height: '1px', background: 'currentColor' }} />
                        <span style={{ padding: '0 12px', fontSize: '12px' }}>OR</span>
                        <div style={{ flex: 1, height: '1px', background: 'currentColor' }} />
                    </div>

                    <button
                        type="button"
                        onClick={async () => {
                            setEmail('admin@mealroute.in');
                            setPassword('MealRoute@1332');
                            setError('');
                            setLoading(true);
                            try {
                                await login('admin@mealroute.in', 'MealRoute@1332');
                                navigate('/');
                            } catch (err) {
                                setError('One-Click login failed. Please try manual entry.');
                            } finally {
                                setLoading(false);
                            }
                        }}
                        style={{
                            width: '100%',
                            padding: '12px',
                            background: 'rgba(255,153,51,0.1)',
                            border: '1px solid rgba(255,153,51,0.3)',
                            borderRadius: '8px',
                            color: '#ff9933',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => e.target.style.background = 'rgba(255,153,51,0.2)'}
                        onMouseLeave={(e) => e.target.style.background = 'rgba(255,153,51,0.1)'}
                    >
                        One-Click Demo Login
                    </button>
                </form>
            </div>
        </div>
    );
}
