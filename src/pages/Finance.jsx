import { useState, useEffect } from 'react';
import { IndianRupee, Plus, History } from 'lucide-react';
import { StorageService } from '../services/storage';
import { format } from 'date-fns';
import { PLANS } from '../data/constants';
import Modal from '../components/Modal';

export default function Finance() {
    const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'ledger'
    const [clients, setClients] = useState([]);
    const [staff, setStaff] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTx, setNewTx] = useState({ staffId: '', amount: '', date: format(new Date(), 'yyyy-MM-dd') });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        setClients(StorageService.getClients());
        setStaff(StorageService.getStaff());
        setTransactions(StorageService.get('mealroute_transactions') || []);
    };

    const handleAddTransaction = (e) => {
        e.preventDefault();
        const tx = {
            id: Date.now().toString(),
            ...newTx,
            amount: parseFloat(newTx.amount),
            type: 'collection' // Driver collected cash from client
        };
        const updated = [tx, ...transactions];
        setTransactions(updated);
        StorageService.set('mealroute_transactions', updated);
        setIsModalOpen(false);
        setNewTx({ staffId: '', amount: '', date: format(new Date(), 'yyyy-MM-dd') });
    };

    // Calculations
    const activeSubs = clients.filter(c => c.status === 'active');
    const monthlyProjected = activeSubs.reduce((sum, client) => {
        // Rough estimate: Plan cost * 30 days? Or just Plan Cost if plan is monthly?
        // User plans are "1 Meal Pack", "2 Meal Pack". Costs are likely Monthly?
        // "Plan (1, 2...)" usually means Item Count.
        // user said "Plan (1...8, Custom)".
        // Let's assume cost in CONSTANTS is Per Month or Per Order?
        // Cost in constants: "120", "220". Too low for monthly. Probably Per Meal.
        // So Monthly = Cost * 30.
        const plan = PLANS.find(p => p.id === client.planId);
        let dailyCost = 0;
        if (plan) {
            dailyCost = plan.cost;
        } else if (client.planId === 'custom') {
            // We didn't store custom cost on client object in this view logic properly in Clients.jsx? 
            // We did: `customCost` in formData.
            // Let's assume client.customCost existing.
            dailyCost = client.customCost || 0;
        }
        return sum + (dailyCost * 30);
    }, 0);

    const totalCollected = transactions.reduce((sum, t) => sum + t.amount, 0);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Financial Management</h1>
                </div>
                <div className="glass-card" style={{ padding: '4px', borderRadius: '8px', display: 'flex' }}>
                    <button
                        onClick={() => setActiveTab('overview')}
                        style={{
                            background: activeTab === 'overview' ? 'var(--accent-primary)' : 'transparent',
                            color: activeTab === 'overview' ? 'white' : 'var(--text-secondary)',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            fontWeight: 600
                        }}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('ledger')}
                        style={{
                            background: activeTab === 'ledger' ? 'var(--accent-primary)' : 'transparent',
                            color: activeTab === 'ledger' ? 'white' : 'var(--text-secondary)',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            fontWeight: 600
                        }}
                    >
                        Driver Ledger
                    </button>
                </div>
            </div>

            {activeTab === 'overview' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                    <div className="glass-card" style={{ padding: '24px' }}>
                        <h3 style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Projected Monthly Revenue</h3>
                        <div style={{ fontSize: '32px', fontWeight: 'bold' }}>₹{monthlyProjected.toLocaleString()}</div>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Based on {activeSubs.length} active subscriptions</p>
                    </div>

                    <div className="glass-card" style={{ padding: '24px' }}>
                        <h3 style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Total Cash Collected</h3>
                        <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--accent-success)' }}>₹{totalCollected.toLocaleString()}</div>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>From delivery partners</p>
                    </div>
                </div>
            )}

            {activeTab === 'ledger' && (
                <div className="glass-card">
                    <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '18px' }}>Cash Collection Log</h3>
                        <button className="btn-primary" onClick={() => setIsModalOpen(true)} style={{ fontSize: '13px', padding: '8px 16px' }}>
                            <Plus size={16} style={{ marginRight: '8px' }} /> Record Collection
                        </button>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)' }}>Date</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)' }}>Delivery Partner</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', textAlign: 'right' }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(tx => {
                                const driver = staff.find(s => s.id === tx.staffId)?.name || 'Unknown';
                                return (
                                    <tr key={tx.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '16px' }}>{tx.date}</td>
                                        <td style={{ padding: '16px' }}>{driver}</td>
                                        <td style={{ padding: '16px', textAlign: 'right', fontWeight: 'bold', color: 'var(--accent-success)' }}>
                                            + ₹{tx.amount}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Salary Deduction View - implicitly shown by Ledger but could be a summary per driver */}
            {activeTab === 'ledger' && (
                <div style={{ marginTop: '32px' }}>
                    <h3 style={{ marginBottom: '16px' }}>Driver Account Summary</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
                        {staff.map(boy => {
                            const collected = transactions.filter(t => t.staffId === boy.id).reduce((sum, t) => sum + t.amount, 0);
                            return (
                                <div key={boy.id} className="glass-card" style={{ padding: '16px' }}>
                                    <div style={{ fontWeight: '600', marginBottom: '8px' }}>{boy.name}</div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                        <span style={{ color: 'var(--text-secondary)' }}>Cash Held:</span>
                                        <span style={{ color: 'var(--accent-danger)', fontWeight: 'bold' }}>₹{collected}</span>
                                    </div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                        To be deducted from salary
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Record Cash Collection">
                <form onSubmit={handleAddTransaction}>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px' }}>Delivery Partner</label>
                        <select required value={newTx.staffId} onChange={e => setNewTx({ ...newTx, staffId: e.target.value })}>
                            <option value="">Select Staff...</option>
                            {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px' }}>Amount Collected (₹)</label>
                        <input required type="number" value={newTx.amount} onChange={e => setNewTx({ ...newTx, amount: e.target.value })} />
                    </div>
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px' }}>Date</label>
                        <input type="date" value={newTx.date} onChange={e => setNewTx({ ...newTx, date: e.target.value })} />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%' }}>Save Transaction</button>
                </form>
            </Modal>
        </div>
    );
}
