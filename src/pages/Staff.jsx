import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Truck } from 'lucide-react';
import { DatabaseService } from '../services/db';
import Modal from '../components/Modal';

export default function Staff() {
    const [staff, setStaff] = useState([]);
    const [zones, setZones] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);

    const initialForm = {
        name: '',
        phone: '',
        vehicleNo: '',
        licenseNo: '',
        address: '',
        assignedZoneIds: [] // Array for multiple zones
    };
    const [formData, setFormData] = useState(initialForm);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const [staffData, zonesData] = await Promise.all([
            DatabaseService.getStaff(),
            DatabaseService.getZones()
        ]);
        setStaff(staffData);
        setZones(zonesData);
        setLoading(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        // Exclude ID from payload to avoid issues
        const { id, ...rest } = formData;
        const newStaff = { ...rest };

        if (editingId) {
            await DatabaseService.update('staff', editingId, newStaff);
        } else {
            await DatabaseService.saveStaff(newStaff);
        }

        loadData();
        setIsModalOpen(false);
    };

    const handleDelete = async (id) => {
        if (!id) {
            alert("Error: Invalid ID");
            return;
        }
        if (window.confirm('Delete this staff member?')) {
            try {
                await DatabaseService.deleteStaff(id);
                loadData();
            } catch (error) {
                console.error(error);
                alert(`Failed to delete: ${error.message}`);
            }
        }
    };

    const openAddModal = () => {
        setEditingId(null);
        setFormData(initialForm);
        setIsModalOpen(true);
    };

    const openEditModal = (member) => {
        setEditingId(member.id);
        setFormData({ ...member });
        setIsModalOpen(true);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Delivery Staff</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage your delivery boys</p>
                </div>
                <button onClick={openAddModal} className="btn-primary" style={{ display: 'flex', alignItems: 'center' }}>
                    <Plus size={18} style={{ marginRight: '8px' }} />
                    Add Staff
                </button>
            </div>

            <div className="glass-card">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                            <th style={{ padding: '16px', color: 'var(--text-secondary)' }}>Name</th>
                            <th style={{ padding: '16px', color: 'var(--text-secondary)' }}>Contact</th>
                            <th style={{ padding: '16px', color: 'var(--text-secondary)' }}>Vehicle/License</th>
                            <th style={{ padding: '16px', color: 'var(--text-secondary)' }}>Assigned Zone</th>
                            <th style={{ padding: '16px', color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {staff.map(member => {
                            // Support both old single zone (assignedZoneId) and new multi-zone (assignedZoneIds)
                            const zoneIds = member.assignedZoneIds || (member.assignedZoneId ? [member.assignedZoneId] : []);
                            const zoneNames = zoneIds.map(zid => zones.find(z => z.id === zid)?.name).filter(Boolean);

                            return (
                                <tr key={member.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '16px', fontWeight: 600 }}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <Truck size={16} style={{ marginRight: '8px', color: 'var(--accent-primary)' }} />
                                            {member.name}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px' }}>{member.phone}</td>
                                    <td style={{ padding: '16px' }}>
                                        <div>{member.vehicleNo}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{member.licenseNo}</div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                            {zoneNames.length > 0 ? zoneNames.map((name, i) => (
                                                <span key={i} style={{
                                                    background: 'rgba(255,136,0,0.15)',
                                                    color: 'var(--accent-primary)',
                                                    padding: '2px 8px',
                                                    borderRadius: '4px',
                                                    fontSize: '11px',
                                                    border: '1px solid rgba(255,136,0,0.3)'
                                                }}>
                                                    {name}
                                                </span>
                                            )) : (
                                                <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Unassigned</span>
                                            )}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                        <button onClick={() => openEditModal(member)} style={{ background: 'transparent', color: 'var(--accent-secondary)', marginRight: '12px' }}>
                                            <Edit size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(member.id)} style={{ background: 'transparent', color: 'var(--accent-danger)' }}>
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Staff' : 'Add Staff'}>
                <form onSubmit={handleSave}>
                    <div className="grid-2-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px' }}>Name *</label>
                            <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px' }}>Phone *</label>
                            <input required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                        </div>
                    </div>

                    <div className="grid-2-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px' }}>Vehicle No</label>
                            <input value={formData.vehicleNo} onChange={e => setFormData({ ...formData, vehicleNo: e.target.value })} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px' }}>Driving License</label>
                            <input value={formData.licenseNo} onChange={e => setFormData({ ...formData, licenseNo: e.target.value })} />
                        </div>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px' }}>Assigned Zones (Select one or more)</label>
                        <div style={{
                            maxHeight: '200px',
                            overflowY: 'auto',
                            background: 'rgba(255,255,255,0.05)',
                            padding: '12px',
                            borderRadius: '8px',
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '8px'
                        }}>
                            {zones.map(z => (
                                <label key={z.id} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '13px' }}>
                                    <input
                                        type="checkbox"
                                        style={{ width: 'auto', marginRight: '8px' }}
                                        checked={formData.assignedZoneIds?.includes(z.id)}
                                        onChange={(e) => {
                                            const current = formData.assignedZoneIds || [];
                                            if (e.target.checked) {
                                                setFormData({ ...formData, assignedZoneIds: [...current, z.id] });
                                            } else {
                                                setFormData({ ...formData, assignedZoneIds: current.filter(id => id !== z.id) });
                                            }
                                        }}
                                    />
                                    {z.name}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px' }}>Full Address</label>
                        <textarea rows="2" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                        {editingId ? 'Update Staff' : 'Add Staff Member'}
                    </button>
                </form>
            </Modal>
        </div>
    );
}
