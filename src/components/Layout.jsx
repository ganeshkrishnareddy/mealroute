import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Users,
    MapPin,
    Truck,
    ClipboardList,
    CalendarCheck,
    PiggyBank,
    Settings,
    LogOut,
    Utensils,
    Sun,
    Moon,
    Code
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, path, active }) => (
    <Link
        to={path}
        style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '4px',
            color: active ? 'white' : 'var(--text-secondary)',
            background: active ? 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))' : 'transparent',
            textDecoration: 'none',
            boxShadow: active ? '0 4px 12px rgba(255, 153, 51, 0.3)' : 'none',
            transition: 'all 0.2s',
            fontWeight: active ? 600 : 400
        }}
    >
        <Icon size={20} style={{ marginRight: '12px', color: active ? 'white' : 'inherit' }} />
        <span>{label}</span>
    </Link>
);

export default function Layout({ children }) {
    const { logout, user } = useAuth();
    const location = useLocation();
    const [theme, setTheme] = useState(localStorage.getItem('mealroute_theme') || 'dark');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('mealroute_theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const menuItems = [
        { label: 'Overview', path: '/', icon: LayoutDashboard },
        { label: 'Clients', path: '/clients', icon: Users },
        { label: 'Daily Tasks', path: '/tasks', icon: ClipboardList },
        { label: 'Zones', path: '/zones', icon: MapPin },
        { label: 'Staff', path: '/staff', icon: Truck },
        { label: 'Catering', path: '/catering', icon: Utensils },
        { label: 'Finance', path: '/finance', icon: PiggyBank },
        { label: 'Plans', path: '/plans', icon: ClipboardList },
        { label: 'Settings', path: '/settings', icon: Settings },
        { label: 'Developer', path: '/developer', icon: Code },
    ];

    return (
        <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-dark)', transition: 'background 0.3s ease' }}>
            {/* Sidebar */}
            <aside style={{
                width: '260px',
                background: 'var(--bg-card)',
                borderRight: 'var(--glass-border)',
                display: 'flex',
                flexDirection: 'column',
                padding: '24px',
                transition: 'background 0.3s ease, border-color 0.3s ease'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px', paddingLeft: '8px' }}>
                    <img src="/logo.png" alt="Logo" style={{ width: '40px', height: '40px', borderRadius: '8px', marginRight: '12px', objectFit: 'cover' }} />
                    <div>
                        <h1 style={{ fontSize: '16px', fontWeight: 'bold', lineHeight: '1.2', color: 'var(--text-primary)' }}>Brahmana</h1>
                        <h1 style={{ fontSize: '16px', fontWeight: 'bold', lineHeight: '1.2', color: 'var(--accent-primary)' }}>Vantillu</h1>
                    </div>
                </div>

                <nav style={{ flex: 1 }}>
                    {menuItems.map(item => (
                        <SidebarItem
                            key={item.path}
                            {...item}
                            active={location.pathname === item.path}
                        />
                    ))}
                </nav>

                <div style={{ paddingTop: '20px', borderTop: '1px solid var(--input-border)' }}>
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '8px',
                            marginBottom: '16px',
                            background: 'var(--input-bg)',
                            border: '1px solid var(--input-border)',
                            borderRadius: '8px',
                            color: 'var(--text-secondary)'
                        }}
                    >
                        {theme === 'dark' ? <Sun size={18} style={{ marginRight: '8px' }} /> : <Moon size={18} style={{ marginRight: '8px' }} />}
                        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', paddingLeft: '8px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-secondary)', marginRight: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>
                            A
                        </div>
                        <div>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>{user?.name || 'Admin'}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Administrator</div>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            color: 'var(--accent-danger)',
                            background: 'transparent',
                            fontSize: '14px'
                        }}
                    >
                        <LogOut size={18} style={{ marginRight: '12px' }} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
                {children}
            </main>
        </div>
    );
}
