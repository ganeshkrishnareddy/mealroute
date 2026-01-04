import { useState } from 'react';
import { Download, Upload, AlertTriangle, Lock, Save, User, Key, Database, RefreshCw } from 'lucide-react';
import { StorageService } from '../services/storage';
import { DatabaseService } from '../services/db';

export default function Settings() {
   const [importStatus, setImportStatus] = useState('');

   // Password Change State
   const [pwdForm, setPwdForm] = useState({ current: '', new: '', confirm: '' });
   const [pwdStatus, setPwdStatus] = useState({ msg: '', type: '' });

   const handleExport = () => {
      const data = StorageService.exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `MealRoute_Backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
   };

   const handleImport = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
         try {
            const success = StorageService.importData(event.target.result);
            if (success) {
               setImportStatus('Data restored successfully! Please refresh the page.');
               setTimeout(() => window.location.reload(), 2000);
            } else {
               setImportStatus('Invalid backup file.');
            }
         } catch (err) {
            setImportStatus('Error reading file.');
         }
      };
      reader.readAsText(file);
   };

   const handlePasswordChange = (e) => {
      e.preventDefault();
      setPwdStatus({ msg: '', type: '' });

      const admin = StorageService.getAdminProfile();

      if (pwdForm.current !== admin.password) {
         setPwdStatus({ msg: 'Current password is incorrect.', type: 'error' });
         return;
      }

      if (pwdForm.new.length < 6) {
         setPwdStatus({ msg: 'New password must be at least 6 characters.', type: 'error' });
         return;
      }

      if (pwdForm.new !== pwdForm.confirm) {
         setPwdStatus({ msg: 'New passwords do not match.', type: 'error' });
         return;
      }

      // Update Password
      const updatedProfile = { ...admin, password: pwdForm.new };
      StorageService.updateAdminProfile(updatedProfile);
      setPwdStatus({ msg: 'Password updated successfully!', type: 'success' });
      setPwdForm({ current: '', new: '', confirm: '' });
   };

   return (
      <div>
         <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Settings</h1>

         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>

            {/* Data Management Section */}
            <div className="glass-card" style={{ padding: '24px' }}>
               <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Data Backup & Restore</h2>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px' }}>
                     <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', color: 'var(--accent-primary)' }}>
                        <Download style={{ marginRight: '8px' }} />
                        <span style={{ fontWeight: '600' }}>Backup Data</span>
                     </div>
                     <button onClick={handleExport} className="btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        Download JSON
                     </button>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px' }}>
                     <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', color: 'var(--accent-secondary)' }}>
                        <Upload style={{ marginRight: '8px' }} />
                        <span style={{ fontWeight: '600' }}>Restore Data</span>
                     </div>
                     <div style={{ position: 'relative' }}>
                        <input type="file" accept=".json" onChange={handleImport} style={{ opacity: 0, position: 'absolute', inset: 0, cursor: 'pointer' }} />
                        <button className="btn-primary" style={{ width: '100%', background: 'var(--bg-card-hover)', border: '1px solid var(--glass-border)' }}>
                           Select File
                        </button>
                     </div>
                     {importStatus && (
                        <div style={{ marginTop: '12px', fontSize: '13px', color: importStatus.includes('success') ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
                           {importStatus}
                        </div>
                     )}
                  </div>
               </div>
            </div>

            {/* Security Section */}
            <div className="glass-card" style={{ padding: '24px' }}>
               <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                  <Lock size={20} style={{ marginRight: '8px' }} /> Security
               </h2>
               <form onSubmit={handlePasswordChange}>
                  <div style={{ marginBottom: '16px' }}>
                     <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px' }}>Current Password</label>
                     <input
                        type="password"
                        required
                        value={pwdForm.current}
                        onChange={e => setPwdForm({ ...pwdForm, current: e.target.value })}
                     />
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                     <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px' }}>New Password</label>
                     <input
                        type="password"
                        required
                        value={pwdForm.new}
                        onChange={e => setPwdForm({ ...pwdForm, new: e.target.value })}
                     />
                  </div>
                  <div style={{ marginBottom: '24px' }}>
                     <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px' }}>Confirm New Password</label>
                     <input
                        type="password"
                        required
                        value={pwdForm.confirm}
                        onChange={e => setPwdForm({ ...pwdForm, confirm: e.target.value })}
                     />
                  </div>

                  {pwdStatus.msg && (
                     <div style={{
                        marginBottom: '16px',
                        padding: '12px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        background: pwdStatus.type === 'error' ? 'rgba(255, 68, 68, 0.1)' : 'rgba(0, 204, 102, 0.1)',
                        color: pwdStatus.type === 'error' ? 'var(--accent-danger)' : 'var(--accent-success)'
                     }}>
                        {pwdStatus.msg}
                     </div>
                  )}

                  <button type="submit" className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <Save size={18} style={{ marginRight: '8px' }} /> Update Password
                  </button>
               </form>
            </div>

         </div>

         <div className="glass-card" style={{ padding: '16px', marginTop: '24px', display: 'flex', alignItems: 'center', color: 'var(--accent-warning)', border: '1px solid rgba(255, 204, 0, 0.3)' }}>
            <AlertTriangle size={20} style={{ marginRight: '16px' }} />
            <div style={{ fontSize: '13px' }}>
               <strong>Note:</strong> Clearing your browser history/cache will delete all local data unless you have a backup.
            </div>
         </div>
      </div>
   );
}
