import { Rocket, Shield, Globe, Award, Layers } from 'lucide-react';
import progvisionImg from '../assets/progvision.png';

export default function ProgVision() {
    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '60px' }}>
            {/* Hero Section */}
            <div className="glass-card" style={{ padding: '0', marginBottom: '40px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                <div style={{ height: '300px', width: '100%', position: 'relative', background: '#000' }}>
                    <img
                        src={progvisionImg}
                        alt="ProgVision Hero"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: '0.8' }}
                    />
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '40px',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)'
                    }}>
                        <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#fff', marginBottom: '8px' }}>ProgVision</h1>
                        <p style={{ color: 'var(--accent-primary)', fontSize: '18px', fontWeight: '600' }}>Enterprise Deployment & Secure Engineering</p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                <div className="glass-card" style={{ padding: '24px' }}>
                    <div style={{ color: 'var(--accent-primary)', marginBottom: '16px' }}><Rocket size={32} /></div>
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>Our Mission</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
                        To bridge the gap between complex software engineering and seamless production deployment. We empower businesses with scalable, high-performance digital infrastructure.
                    </p>
                </div>

                <div className="glass-card" style={{ padding: '24px' }}>
                    <div style={{ color: '#4ade80', marginBottom: '16px' }}><Shield size={32} /></div>
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>Secure Core</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
                        Security is not a plugin; it's our foundation. Every line of code and every deployment configuration is hardened following industry-leading security benchmarks.
                    </p>
                </div>

                <div className="glass-card" style={{ padding: '24px' }}>
                    <div style={{ color: 'var(--accent-secondary)', marginBottom: '16px' }}><Globe size={32} /></div>
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>Global Scale</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
                        Specializing in cloud-native solutions that scale effortlessly. From local logistics to global e-commerce, we build for growth.
                    </p>
                </div>
            </div>

            <div className="glass-card" style={{ padding: '32px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', display: 'flex', alignItems: 'center' }}>
                    <Layers style={{ marginRight: '12px', color: 'var(--accent-primary)' }} />
                    Specializations
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                    {[
                        { title: 'Full-Stack Mastery', desc: 'React, Node.js, and Python expertise.' },
                        { title: 'Cloud Infrastructure', desc: 'AWS, Firebase, and Docker deployment.' },
                        { title: 'Security Auditing', desc: 'Pentesting and secure code reviews.' },
                        { title: 'Real-time Systems', desc: 'WebSocket and high-frequency data sync.' }
                    ].map((item, i) => (
                        <div key={i} style={{ borderLeft: '3px solid var(--accent-primary)', paddingLeft: '16px' }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '4px', fontSize: '15px' }}>{item.title}</div>
                            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{item.desc}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ marginTop: '40px', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>© 2026 ProgVision. All rights reserved.</p>
                <div style={{ fontSize: '12px', color: 'var(--accent-primary)', marginTop: '8px', fontWeight: '600', letterSpacing: '1px' }}>PROGVISION.IN</div>
            </div>
        </div>
    );
}
