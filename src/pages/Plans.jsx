import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { DatabaseService } from '../services/db';
import Modal from '../components/Modal';

export default function Plans() {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const initialForm = {
        name: '',
        price: '',
        deposit: '',
        people: 1,
        description: ''
    };
    const [formData, setFormData] = useState(initialForm);

    useEffect(() => {
        loadPlans();
    }, []);

    const loadPlans = async () => {
        setLoading(true);
        const data = await DatabaseService.getPlans();
        setPlans(data);
        setLoading(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const newPlan = {
            ...formData,
            // Firebase specific: if editing, keep ID, else don't set it (addDoc will generate one)
            // But our UI expects ID. add() returns ID.
            // Let's rely on DatabaseService to handle ID logic.
            id: editingId, // if null, add will gen new
            price: Number(formData.price),
            deposit: Number(formData.deposit),
            people: Number(formData.people)
        };

        // Optimistic UI Update or Wait? Wait is safer for sync.
        if (editingId) {
            await DatabaseService.update('plans', editingId, newPlan);
        } else {
            await DatabaseService.savePlan(newPlan);
        }

        loadPlans();
        closeModal();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this plan? Existing clients with this plan might be affected.')) {
            await DatabaseService.deletePlan(id);
            loadPlans();
        }
    };

    const openAddModal = () => {
        setEditingId(null);
        setFormData(initialForm);
        setIsModalOpen(true);
    };

    const openEditModal = (plan) => {
        setEditingId(plan.id);
        setFormData({ ...plan });
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading plans from cloud...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Subscription Plans</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage pricing and meal packs</p>
                </div>
                <button onClick={openAddModal} className="btn-primary" style={{ display: 'flex', alignItems: 'center' }}>
                    <Plus size={18} style={{ marginRight: '8px' }} />
                    Add New Plan
                </button>
            </div>

            <div className="glass-card">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--input-border)', textAlign: 'left' }}>
                            <th style={{ padding: '16px', color: 'var(--text-secondary)' }}>Plan Name</th>
                            <th style={{ padding: '16px', color: 'var(--text-secondary)' }}>Monthly Price</th>
                            <th style={{ padding: '16px', color: 'var(--text-secondary)' }}>Deposit</th>
                            <th style={{ padding: '16px', color: 'var(--text-secondary)' }}>Total to Start</th>
                            <th style={{ padding: '16px', color: 'var(--text-secondary)' }}>People</th>
                            <th style={{ padding: '16px', color: 'var(--text-secondary)' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {plans.map(plan => (
                            <tr key={plan.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '16px', fontWeight: '600' }}>{plan.name}</td>
                                <td style={{ padding: '16px' }}>₹{plan.price}</td>
                                <td style={{ padding: '16px' }}>₹{plan.deposit}</td>
                                <td style={{ padding: '16px', color: 'var(--accent-success)', fontWeight: 'bold' }}>
                                    ₹{plan.price + plan.deposit}
                                </td>
                                <td style={{ padding: '16px' }}>{plan.people} User(s)</td>
                                <td style={{ padding: '16px' }}>
                                    <button onClick={() => openEditModal(plan)} style={{ background: 'transparent', color: 'var(--accent-secondary)', marginRight: '12px' }}>
                                        <Edit size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(plan.id)} style={{ background: 'transparent', color: 'var(--accent-danger)' }}>
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal} title={editingId ? 'Edit Plan' : 'Create Plan'}>
                <form onSubmit={handleSave}>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px' }}>Plan Name</label>
                        <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. 2 People Pack" />
                    </div>

                    <div className="grid-2-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px' }}>Monthly Price (₹)</label>
                            <input required type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px' }}>Deposit (₹)</label>
                            <input required type="number" value={formData.deposit} onChange={e => setFormData({ ...formData, deposit: e.target.value })} />
                        </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px' }}>For How Many People?</label>
                        <input required type="number" min="1" max="50" value={formData.people} onChange={e => setFormData({ ...formData, people: e.target.value })} />
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Used for calculating deliveries (e.g., 2 people = 2 boxes)</p>
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                        {editingId ? 'Update Plan' : 'Create Plan'}
                    </button>
                </form>
            </Modal>
        </div>
    );
}
