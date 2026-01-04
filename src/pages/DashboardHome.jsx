import { Users, TriangleAlert, Truck, Banknote } from 'lucide-react';
import { useState, useEffect } from 'react';
import { DatabaseService } from '../services/db';
import { differenceInDays, parseISO } from 'date-fns';

const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
  <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center' }}>
    <div style={{
      background: `rgba(${color}, 0.1)`,
      padding: '16px',
      borderRadius: '12px',
      marginRight: '16px',
      color: `rgb(${color})`
    }}>
      <Icon size={24} />
    </div>
    <div>
      <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{title}</h3>
      <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{value}</div>
      {subtext && <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{subtext}</div>}
    </div>
  </div>
);

export default function DashboardHome() {
  const [stats, setStats] = useState({
    activeClients: 0,
    expiringSoon: 0,
    totalStaff: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Real-time listeners
    const unsubClients = DatabaseService.subscribeToClients((clients) => {
      const active = clients.filter(c => c.status === 'active' || !c.status).length;

      const today = new Date();
      const expiring = clients.filter(c => {
        if (!c.endDate) return false;
        const days = differenceInDays(parseISO(c.endDate), today);
        return days >= 0 && days <= 3;
      }).length;

      setStats(prev => ({ ...prev, activeClients: active, expiringSoon: expiring }));
    });

    const unsubStaff = DatabaseService.subscribeToStaff((staff) => {
      setStats(prev => ({ ...prev, totalStaff: staff.length }));
    });

    setLoading(false);

    return () => {
      if (unsubClients) unsubClients();
      if (unsubStaff) unsubStaff();
    };
  }, []);

  const { activeClients, expiringSoon, totalStaff } = stats;

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading dashboard...</div>;


  return (
    <div>
      <h1 style={{ fontSize: '28px', marginBottom: '8px', color: 'var(--accent-primary)' }}>Brahmana Vantillu</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Pure Vegetarian Home-Style Meals</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
        <StatCard
          title="Active Clients"
          value={activeClients}
          icon={Users}
          color="0, 212, 255" // Cyan
          subtext="Total subscribers"
        />
        <StatCard
          title="Expiring Soon"
          value={expiringSoon}
          icon={TriangleAlert}
          color="255, 68, 68" // Red
          subtext="In next 3 days"
        />
        <StatCard
          title="Delivery Partners"
          value={totalStaff}
          icon={Truck}
          color="255, 136, 0" // Orange
          subtext="On duty"
        />
        <StatCard
          title="Pending Payments"
          value="₹0"
          icon={Banknote}
          color="0, 204, 102" // Green
          subtext="To be collected"
        />
      </div>

      <div style={{ marginTop: '32px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {/* Quick action buttons can go here */}
        </div>
      </div>
    </div>
  );
}
