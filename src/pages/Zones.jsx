import { useState, useEffect } from 'react';
import { Plus, Trash2, MapPin } from 'lucide-react';
import { DatabaseService } from '../services/db';
import Modal from '../components/Modal';

export default function Zones() {
    const [zones, setZones] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newZoneName, setNewZoneName] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadZones();
    }, []);

    const loadZones = async () => {
        setLoading(true);
        const data = await DatabaseService.getZones();
        setZones(data);
        setLoading(false);
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        const newZone = { name: newZoneName };
        await DatabaseService.saveZone(newZone);
        setNewZoneName('');
        loadZones();
        setIsModalOpen(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this zone? Clients in this zone might be affected.')) {
            await DatabaseService.deleteZone(id);
            loadZones();
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Zone Management</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Delivery areas in Hyderabad</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center' }}>
                    <Plus size={18} style={{ marginRight: '8px' }} />
                    Add Zone
                </button>
            </div>

            <div className="glass-card">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                            <th style={{ padding: '16px', color: 'var(--text-secondary)' }}>Zone Name</th>
                            <th style={{ padding: '16px', color: 'var(--text-secondary)' }}>ID</th>
                            <th style={{ padding: '16px', color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {zones.map(zone => (
                            <tr key={zone.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '16px', fontWeight: 600 }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <MapPin size={16} style={{ marginRight: '8px', color: 'var(--accent-secondary)' }} />
                                        {zone.name}
                                    </div>
                                </td>
                                <td style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '12px' }}>{zone.id}</td>
                                <td style={{ padding: '16px', textAlign: 'right' }}>
                                    <button onClick={() => handleDelete(zone.id)} style={{ background: 'transparent', color: 'var(--accent-danger)' }}>
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Zone">
                <form onSubmit={handleAdd}>
                    <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px' }}>Zone Name</label>
                    <input required value={newZoneName} onChange={e => setNewZoneName(e.target.value)} placeholder="e.g. Kondapur" />
                    <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '16px' }}>Add Zone</button>
                </form>
            </Modal>
        </div>
    );
}
