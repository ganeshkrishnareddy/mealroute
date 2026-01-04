import { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, Utensils } from 'lucide-react';
import { StorageService } from '../services/storage';
import Modal from '../components/Modal';

export default function Catering() {
    const [events, setEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        clientName: '',
        address: '',
        date: '',
        time: '',
        pax: '',
        amount: '',
        advance: '',
        description: ''
    });

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = () => {
        setEvents(StorageService.get('mealroute_events') || []);
    };

    const handleSave = (e) => {
        e.preventDefault();
        const newEvent = {
            id: Date.now().toString(),
            ...formData,
            amount: Number(formData.amount),
            advance: Number(formData.advance),
            pax: Number(formData.pax)
        };
        const updated = [...events, newEvent];
        setEvents(updated);
        StorageService.set('mealroute_events', updated);
        setIsModalOpen(false);
        setFormData({ name: '', clientName: '', address: '', date: '', time: '', pax: '', amount: '', advance: '', description: '' });
    };

    const handleDelete = (id) => {
        if (window.confirm('Delete this event?')) {
            const updated = events.filter(e => e.id !== id);
            setEvents(updated);
            StorageService.set('mealroute_events', updated);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Catering Services</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage special events and orders</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center' }}>
                    <Plus size={18} style={{ marginRight: '8px' }} /> New Event
                </button>
            </div>

            <div className="glass-card">
                {events.length === 0 ? (
                    <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>No upcoming catering events.</div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', padding: '16px' }}>
                        {events.map(event => {
                            const balance = event.amount - event.advance;
                            return (
                                <div key={event.id} style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    border: '1px solid rgba(255,255,255,0.05)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <h3 style={{ fontWeight: 600 }}>{event.name}</h3>
                                        <button onClick={() => handleDelete(event.id)} style={{ color: 'var(--text-secondary)', background: 'transparent' }}><Trash2 size={16} /></button>
                                    </div>

                                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                                            <Calendar size={14} style={{ marginRight: '6px' }} />
                                            {event.date} at {event.time}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <Utensils size={14} style={{ marginRight: '6px' }} />
                                            {event.pax} Guests • {event.clientName}
                                        </div>
                                    </div>

                                    <div style={{ fontSize: '13px', marginBottom: '12px' }}>
                                        {event.address}
                                    </div>

                                    <div style={{ padding: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                                        <div>Total: ₹{event.amount}</div>
                                        <div style={{ color: balance > 0 ? 'var(--accent-warning)' : 'var(--accent-success)' }}>
                                            {balance > 0 ? `Bal: ₹${balance}` : 'Paid'}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Catering Event">
                <form onSubmit={handleSave}>
                    <div className="grid-2-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px' }}>Event Name</label>
                            <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Wedding Lunch" />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px' }}>Client Name</label>
                            <input required value={formData.clientName} onChange={e => setFormData({ ...formData, clientName: e.target.value })} />
                        </div>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px' }}>Venue Address</label>
                        <textarea required rows="2" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                    </div>

                    <div className="grid-2-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px' }}>Date</label>
                            <input required type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px' }}>Time</label>
                            <input required type="time" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px' }}>Guests (Pax)</label>
                            <input required type="number" value={formData.pax} onChange={e => setFormData({ ...formData, pax: e.target.value })} />
                        </div>
                    </div>

                    <div className="grid-2-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px' }}>Total Amount</label>
                            <input required type="number" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px' }}>Advance Paid</label>
                            <input required type="number" value={formData.advance} onChange={e => setFormData({ ...formData, advance: e.target.value })} />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%' }}>Create Event</button>
                </form>
            </Modal>
        </div>
    );
}
