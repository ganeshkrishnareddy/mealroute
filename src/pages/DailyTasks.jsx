import { useState, useEffect } from 'react';
import { Calendar, Download, FileText, Printer } from 'lucide-react';
import { format } from 'date-fns';
import { TaskGenerator } from '../utils/taskGenerator';
import { exportToPDF, exportToExcel } from '../utils/exporters';

import { DatabaseService } from '../services/db';

export default function DailyTasks() {
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [tasks, setTasks] = useState({}); // { boyId: { boyName, items: [] } }
    const [loading, setLoading] = useState(false);

    const generate = async () => {
        setLoading(true);
        const [clients, staff, plans] = await Promise.all([
            DatabaseService.getClients(),
            DatabaseService.getStaff(),
            DatabaseService.getPlans()
        ]);

        const data = TaskGenerator.generate(selectedDate, clients, staff, plans);
        setTasks(data);
        setLoading(false);
    };

    useEffect(() => {
        generate();
    }, [selectedDate]);

    const handleExportPDF = async () => {
        // Regenerate to ensure fresh data
        const [clients, staff, plans] = await Promise.all([
            DatabaseService.getClients(),
            DatabaseService.getStaff(),
            DatabaseService.getPlans()
        ]);
        const latestTasks = TaskGenerator.generate(selectedDate, clients, staff, plans);
        setTasks(latestTasks); // Update UI too
        exportToPDF(latestTasks, selectedDate);
    };

    const handleExportExcel = async () => {
        const [clients, staff, plans] = await Promise.all([
            DatabaseService.getClients(),
            DatabaseService.getStaff(),
            DatabaseService.getPlans()
        ]);
        const latestTasks = TaskGenerator.generate(selectedDate, clients, staff, plans);
        setTasks(latestTasks);
        exportToExcel(latestTasks, selectedDate);
    };

    const driverIds = Object.keys(tasks);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Daily Delivery Tasks</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Logistics for {format(new Date(selectedDate), 'dd MMM yyyy')}</p>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <div className="glass-card" style={{ display: 'flex', alignItems: 'center', padding: '8px 16px', borderRadius: '8px' }}>
                        <Calendar size={18} style={{ marginRight: '8px', color: 'var(--accent-primary)' }} />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            style={{ border: 'none', background: 'transparent', width: 'auto', padding: 0 }}
                        />
                    </div>
                    <button onClick={handleExportPDF} className="btn-primary" style={{ background: '#e74c3c' }}>
                        <FileText size={18} style={{ marginRight: '8px' }} /> PDF
                    </button>
                    <button onClick={handleExportExcel} className="btn-primary" style={{ background: '#27ae60' }}>
                        <Download size={18} style={{ marginRight: '8px' }} /> Excel
                    </button>
                </div>
            </div>

            {loading && <div style={{ padding: '20px', textAlign: 'center' }}>Generating tasks...</div>}

            {!loading && driverIds.length === 0 && (
                <div className="glass-card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No deliveries found for this date. Check active subscriptions or staff assignments.
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '24px' }}>
                {driverIds.map(boyId => {
                    const { boyName, items, summary } = tasks[boyId];
                    if (items.length === 0) return null;

                    return (
                        <div key={boyId} className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                            <div style={{
                                padding: '16px',
                                background: 'rgba(255, 107, 0, 0.1)',
                                borderBottom: '1px solid rgba(255,255,255,0.1)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <h3 style={{ fontWeight: '600' }}>{boyName}</h3>
                                <div style={{ display: 'flex', gap: '12px', fontSize: '12px' }}>
                                    <span style={{ color: 'var(--accent-success)' }}>Deliver: {summary.tiffins}</span>
                                    <span style={{ color: 'var(--accent-warning)' }}>Collect: {summary.emptyBoxes}</span>
                                </div>
                            </div>

                            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                {items.map((item, idx) => (
                                    <div key={idx} style={{
                                        padding: '16px',
                                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                                        display: 'flex',
                                        justifyContent: 'space-between'
                                    }}>
                                        <div>
                                            <div style={{ fontWeight: '500', marginBottom: '4px' }}>{item.clientName}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                                                {item.address} (Ph: {item.clientPhone})
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right', minWidth: '100px' }}>
                                            <div style={{ fontWeight: 'bold', color: 'var(--accent-primary)' }}>
                                                {item.toDeliver} Box{item.toDeliver > 1 ? 'es' : ''}
                                            </div>
                                            {item.hasRice && <div style={{ fontSize: '12px', color: 'var(--accent-warning)' }}>+ Rice ({item.riceQty})</div>}
                                            {item.toPickup > 0 && (
                                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                                    Collect: {item.toPickup}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
