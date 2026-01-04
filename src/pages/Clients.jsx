import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Phone, Calendar, Truck } from 'lucide-react';
import { DatabaseService } from '../services/db';
import { ZONES } from '../data/constants';
import Modal from '../components/Modal';
import { addDays, format, differenceInDays, parseISO, isAfter } from 'date-fns';

export default function Clients() {
    const [clients, setClients] = useState([]);
    const [plans, setPlans] = useState([]);
    const [staffList, setStaffList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [filterZone, setFilterZone] = useState('');
    const [filterExpiry, setFilterExpiry] = useState(''); // '3' for 3 days, etc.

    // Form State
    const initialForm = {
        name: '',
        phone: '',
        email: '',
        address: '',
        zoneId: '', // Default to empty or set in effect
        planId: '', // Will default after loading plans
        assignedDriverId: '', // Optional override
        customCost: 0,
        hasRice: false,
        riceQty: 1,
        isTrial: false,
        startDate: format(new Date(), 'yyyy-MM-dd'),
        endDate: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
    };
    const [formData, setFormData] = useState(initialForm);

    const [zones, setZones] = useState([]);
    const [loading, setLoading] = useState(true);

    // Real-time subscription handles initial load

    useEffect(() => {
        setLoading(true);

        // 1. Subscribe to Clients (Real-time)
        const unsubClients = DatabaseService.subscribeToClients((data) => {
            setClients(data);
            setLoading(false); // First load done
        });

        // 2. Fetch others once (or could be realtime too, but clients is most critical for now)
        const loadOthers = async () => {
            const [plansData, staffData, zonesData] = await Promise.all([
                DatabaseService.getPlans(),
                DatabaseService.getStaff(),
                DatabaseService.getZones()
            ]);
            setPlans(plansData);
            setStaffList(staffData);
            setZones(zonesData);
        };
        loadOthers();

        return () => unsubClients();
    }, []);



    useEffect(() => {
        if (plans.length > 0 && !formData.planId) {
            setFormData(prev => ({ ...prev, planId: plans[0].id }));
        }
        if (zones.length > 0 && !formData.zoneId) {
            setFormData(prev => ({ ...prev, zoneId: zones[0].id }));
        }
    }, [plans, zones]);

    const handleSave = async (e) => {
        try {
            e.preventDefault();
            // Exclude ID from the data we save to Firestore to keep it clean
            const { id, ...rest } = formData;
            const clientData = { ...rest, status: 'active' };

            if (editingId) {
                await DatabaseService.update('clients', editingId, clientData);
            } else {
                await DatabaseService.saveClient(clientData);
            }

            // await loadData(); // Handled by subscription
            closeModal();
        } catch (error) {
            console.error(error);
            alert(`Error saving client: ${error.message}`);
        }
    };

    const handleDelete = async (id) => {
        if (!id) {
            alert("Error: Invalid ID");
            return;
        }
        if (window.confirm('Are you sure you want to delete this client?')) {
            try {
                await DatabaseService.deleteClient(id);
                // await loadData(); // Handled by subscription
            } catch (error) {
                console.error(error);
                alert(`Failed to delete: ${error.message}`);
            }
        }
    };

    const openAddModal = () => {
        setEditingId(null);
        setFormData({
            ...initialForm,
            planId: plans.length > 0 ? plans[0].id : ''
        });
        setIsModalOpen(true);
    };

    const openEditModal = (client) => {
        setEditingId(client.id);
        setFormData({ ...initialForm, ...client });
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    // Filter Logic
    const filteredClients = clients.filter(client => {
        const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.phone.includes(searchTerm);
        const matchesZone = !filterZone || client.zoneId === filterZone;

        let matchesExpiry = true;
        if (filterExpiry) {
            const daysLeft = differenceInDays(parseISO(client.endDate), new Date());
            matchesExpiry = daysLeft >= 0 && daysLeft <= parseInt(filterExpiry);
        }

        return matchesSearch && matchesZone && matchesExpiry;
    });

    return (
        loading ? <div style={{ padding: '20px', textAlign: 'center' }}>Loading clients...</div> :
            <div>
                {/* Header & Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div>
                        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Clients</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>Manage your subscribers</p>
                    </div>
                    <button onClick={openAddModal} className="btn-primary" style={{ display: 'flex', alignItems: 'center' }}>
                        <Plus size={18} style={{ marginRight: '8px' }} />
                        Add New Client
                    </button>
                </div>

                {/* Filters Bar */}
                <div className="glass-card" style={{ padding: '16px', marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        <input
                            placeholder="Search by name or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ paddingLeft: '40px' }}
                        />
                    </div>

                    <select
                        value={filterZone}
                        onChange={(e) => setFilterZone(e.target.value)}
                        style={{ width: '200px' }}
                    >
                        <option value="">All Zones</option>
                        {zones.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
                    </select>

                    <select
                        value={filterExpiry}
                        onChange={(e) => setFilterExpiry(e.target.value)}
                        style={{ width: '200px' }}
                    >
                        <option value="">Expiry: Any Time</option>
                        <option value="3">Expiring in 3 Days</option>
                        <option value="7">Expiring in 7 Days</option>
                    </select>
                </div>

                {/* Clients List */}
                <div className="glass-card" style={{ overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)' }}>Name & Contact</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)' }}>Address/Zone</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)' }}>Plan Details</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)' }}>Expiry</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClients.map(client => {
                                const zoneName = zones.find(z => z.id === client.zoneId)?.name || 'Unknown';
                                const plan = plans.find(p => p.id === client.planId);
                                const daysLeft = differenceInDays(parseISO(client.endDate), new Date());
                                const isExpiring = daysLeft <= 3 && daysLeft >= 0;
                                const assignedDriver = client.assignedDriverId ? staffList.find(s => s.id === client.assignedDriverId) : null;

                                return (
                                    <tr key={client.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ fontWeight: 600 }}>{client.name}</div>
                                            <div style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', marginTop: '4px' }}>
                                                <Phone size={12} style={{ marginRight: '4px' }} /> {client.phone}
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {client.address}
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                                                <div style={{
                                                    display: 'inline-block',
                                                    background: 'rgba(255,255,255,0.1)',
                                                    padding: '2px 8px',
                                                    borderRadius: '4px',
                                                    fontSize: '12px'
                                                }}>
                                                    {zoneName}
                                                </div>
                                                {assignedDriver && (
                                                    <div style={{
                                                        display: 'inline-flex', alignItems: 'center',
                                                        background: 'rgba(255, 107, 0, 0.15)',
                                                        padding: '2px 8px',
                                                        borderRadius: '4px',
                                                        fontSize: '11px',
                                                        color: 'var(--accent-primary)',
                                                        border: '1px solid rgba(255, 107, 0, 0.3)'
                                                    }}>
                                                        <Truck size={10} style={{ marginRight: '4px' }} /> {assignedDriver.name}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <div>{plan?.name || 'Custom Plan'}</div>
                                            {client.hasRice && (
                                                <div style={{ fontSize: '12px', color: 'var(--accent-warning)' }}>
                                                    + Extra Rice ({client.riceQty})
                                                </div>
                                            )}
                                            {client.isTrial && <span style={{ color: 'var(--accent-secondary)', fontSize: '10px', border: '1px solid var(--accent-secondary)', padding: '0 4px', borderRadius: '4px' }}>TRIAL</span>}
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{
                                                color: isExpiring ? 'var(--accent-danger)' : 'inherit',
                                                fontWeight: isExpiring ? 700 : 400
                                            }}>
                                                {format(parseISO(client.endDate), 'dd MMM yyyy')}
                                            </div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                                {daysLeft < 0 ? 'Expired' : `${daysLeft} days left`}
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <button onClick={() => openEditModal(client)} style={{ background: 'transparent', color: 'var(--accent-secondary)', marginRight: '12px' }}>
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(client.id)} style={{ background: 'transparent', color: 'var(--accent-danger)' }}>
                                                <Trash2 size={18} />
                                            </button>
                                            <a href={`https://wa.me/91${client.phone.replace(/\D/g, '')}?text=Hello ${client.name}, your plan is expiring on ${client.endDate}. Please renew.`} target="_blank" rel="noopener noreferrer" style={{ background: 'transparent', color: '#25D366', marginLeft: '12px' }}>
                                                <Phone size={18} />
                                            </a>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredClients.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                        No clients found matching your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Add/Edit Modal */}
                <Modal isOpen={isModalOpen} onClose={closeModal} title={editingId ? 'Edit Client' : 'Add New Client'}>
                    <form onSubmit={handleSave}>
                        <div className="grid-2-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px' }}>Full Name *</label>
                                <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px' }}>Phone Number *</label>
                                <input required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                            </div>
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px' }}>Delivery Address *</label>
                            <textarea required rows="2" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                        </div>

                        <div className="grid-2-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px' }}>Zone *</label>
                                <select value={formData.zoneId} onChange={e => setFormData({ ...formData, zoneId: e.target.value })}>
                                    {zones.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px' }}>Subscription Plan</label>
                                <select value={formData.planId} onChange={e => setFormData({ ...formData, planId: e.target.value })}>
                                    {plans.map(p => <option key={p.id} value={p.id}>{p.name} (₹{p.price})</option>)}
                                    <option value="custom">Custom Plan</option>
                                </select>
                            </div>
                        </div>

                        {/* DRIVER ASSIGNMENT OVERRIDE */}
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px' }}>
                                Assign Specific Driver <span style={{ color: 'var(--text-secondary)' }}>(Optional - Overrides Zone)</span>
                            </label>
                            <select value={formData.assignedDriverId} onChange={e => setFormData({ ...formData, assignedDriverId: e.target.value })}>
                                <option value="">Auto-assign by Zone</option>
                                {staffList.map(s => <option key={s.id} value={s.id}>{s.name} ({zones.find(z => z.id === s.assignedZoneId)?.name})</option>)}
                            </select>
                        </div>

                        {/* Custom Plan Cost */}
                        {formData.planId === 'custom' && (
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px' }}>Custom Cost (₹)</label>
                                <input type="number" value={formData.customCost} onChange={e => setFormData({ ...formData, customCost: Number(e.target.value) })} />
                            </div>
                        )}

                        {/* Add-ons & Trial Settings */}
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                    <input type="checkbox" style={{ width: 'auto', marginRight: '8px' }}
                                        checked={formData.hasRice}
                                        onChange={e => setFormData({ ...formData, hasRice: e.target.checked })}
                                    />
                                    Include Extra Rice
                                </label>
                                {formData.hasRice && (
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <span style={{ fontSize: '12px', marginRight: '8px' }}>Qty:</span>
                                        <input
                                            type="number" min="1" max="5"
                                            value={formData.riceQty}
                                            onChange={e => setFormData({ ...formData, riceQty: Number(e.target.value) })}
                                            style={{ width: '60px', padding: '4px 8px' }}
                                        />
                                    </div>
                                )}
                            </div>

                            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                <input type="checkbox" style={{ width: 'auto', marginRight: '8px' }}
                                    checked={formData.isTrial}
                                    onChange={e => setFormData({ ...formData, isTrial: e.target.checked })}
                                />
                                <span style={{ color: 'var(--accent-secondary)' }}>Mark as Trial Meal</span> (One-off or short duration)
                            </label>
                        </div>

                        {/* Dates */}
                        <div className="grid-2-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px' }}>Start Date</label>
                                <input type="date" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px' }}>End Date</label>
                                <input type="date" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} />
                            </div>
                        </div>

                        <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                            {editingId ? 'Update Client' : 'Create Client'}
                        </button>
                    </form>
                </Modal>
            </div>
    );
}
