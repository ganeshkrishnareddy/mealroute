import { Code, Terminal, Cpu, ShieldCheck, User } from 'lucide-react';

export default function Developer() {
    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>Developer Insights</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Technical architecture and engineering background of MealRoute Admin.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                {/* Tech Stack Card */}
                <div className="glass-card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', color: 'var(--accent-primary)' }}>
                        <Terminal size={24} style={{ marginRight: '12px' }} />
                        <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Engineering Stack</h2>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {['React', 'Firebase', 'Node.js', 'Vite', 'Lucide Icons', 'Vanilla CSS', 'REST APIs'].map(tech => (
                            <span key={tech} style={{
                                padding: '6px 12px',
                                background: 'var(--input-bg)',
                                border: '1px solid var(--input-border)',
                                borderRadius: '6px',
                                fontSize: '13px',
                                color: 'var(--text-secondary)'
                            }}>
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Security Focus Card */}
                <div className="glass-card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', color: '#4ade80' }}>
                        <ShieldCheck size={24} style={{ marginRight: '12px' }} />
                        <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Security Hardening</h2>
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>
                        <li style={{ marginBottom: '10px' }}>• Role-Based Access Control (RBAC)</li>
                        <li style={{ marginBottom: '10px' }}>• Secure Firebase Firestore Rules</li>
                        <li style={{ marginBottom: '10px' }}>• Sanitize input for threat prevention</li>
                        <li>• JWT-based session management</li>
                    </ul>
                </div>

                {/* Developer Profile Card */}
                <div className="glass-card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', color: 'var(--accent-secondary)' }}>
                        <User size={24} style={{ marginRight: '12px' }} />
                        <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Lead Developer</h2>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(45deg, #ff9933, #c47f18)', marginRight: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white' }}>PG</div>
                        <div>
                            <div style={{ color: 'var(--text-primary)', fontWeight: '600' }}>P Ganesh Krishna Reddy</div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Secure Software Engineer</div>
                        </div>
                    </div>
                    <p style={{ marginTop: '16px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                        Specializing in the intersection of scalable full-stack development and robust cybersecurity.
                    </p>
                </div>
            </div>

            {/* Architecture Details */}
            <div className="glass-card" style={{ padding: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', color: 'var(--text-primary)' }}>
                    <Cpu size={24} style={{ marginRight: '12px' }} />
                    <h2 style={{ fontSize: '20px', fontWeight: '600' }}>System Architecture</h2>
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.8' }}>
                    <p style={{ marginBottom: '16px' }}>
                        MealRoute is designed as a modular **Single Page Application (SPA)** utilizing **React 18** and **Vite** for optimized development and production builds. The backend infrastructure is powered by **Firebase**, providing real-time data synchronization across clients, staff, and admin dashboards.
                    </p>
                    <p>
                        The data layer uses **Firestore** in a document-based structure, allowing for flexible schema evolution. All administrative actions are protected by a custom authentication context, ensuring that sensitive operational data remains secured and encrypted in transit.
                    </p>
                </div>
            </div>
        </div>
    );
}
