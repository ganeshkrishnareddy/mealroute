import { Users, TriangleAlert, Truck, Banknote } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '40px' }}>
          <button
            className="btn-secondary"
            style={{ width: '100%', padding: '12px', cursor: 'pointer' }}
            onClick={() => navigate('/clients')}
          >
            + New Client
          </button>
          <button
            className="btn-secondary"
            style={{ width: '100%', padding: '12px', cursor: 'pointer' }}
            onClick={() => navigate('/tasks')}
          >
            Generate Tasks
          </button>
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '40px 0' }} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <div
          className="glass-card hover-scale"
          style={{ padding: '24px', border: '1px solid rgba(255, 153, 51, 0.2)', cursor: 'pointer', transition: 'transform 0.2s' }}
          onClick={() => navigate('/developer')}
        >
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', color: 'var(--text-primary)' }}>Developer</h3>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-primary)', marginRight: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white' }}>PG</div>
            <div>
              <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>P Ganesh Krishna Reddy</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>pganeshkrishnareddy@gmail.com</div>
            </div>
          </div>
        </div>

        <div
          className="glass-card hover-scale"
          style={{ padding: '24px', position: 'relative', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s' }}
          onClick={() => navigate('/progvision')}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, padding: '8px 12px', background: 'var(--accent-primary)', color: 'white', fontSize: '10px', fontWeight: 'bold', borderBottomLeftRadius: '12px' }}>DEPLOYED BY PROGVISION</div>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', color: 'var(--text-primary)' }}>ProgVision</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            ProgVision specializes in enterprise-grade application deployment and high-performance secure engineering solutions. Delivering precision at scale.
          </p>
        </div>
      </div>
    </div>
  );
}
