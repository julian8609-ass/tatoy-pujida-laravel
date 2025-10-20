import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AddStudent({ onCreated, studentId }) {
    const [form, setForm] = useState({ first_name: '', last_name: '', email: '', roll: '', year: '', semester: '', batch: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        let mounted = true;
        async function load() {
            if (!studentId) return;
            setLoading(true);
            try {
                const res = await axios.get(`/api/students/${studentId}`);
                if (mounted && res.data) {
                    // map backend fields to form
                    const s = res.data;
                    setForm({
                        first_name: s.first_name || s.firstName || '',
                        last_name: s.last_name || s.lastName || '',
                        email: s.email || '',
                        roll: s.roll || s.student_id || '',
                        year: s.year || s.class || '',
                        semester: s.semester || '',
                        batch: s.batch || '',
                    });
                    setIsEdit(true);
                }
            } catch (e) {
                console.error('Failed to load student', e);
                setError('Failed to load student data');
            } finally {
                setLoading(false);
            }
        }
        load();
        return () => { mounted = false; };
    }, [studentId]);

    async function save() {
        setLoading(true);
        setError(null);
        try {
            if (isEdit && studentId) {
                await axios.put(`/api/students/${studentId}`, form);
            } else {
                await axios.post('/api/students', form);
            }
            setForm({ first_name: '', last_name: '', email: '', roll: '', year: '', semester: '', batch: '' });
            if (typeof onCreated === 'function') onCreated();
            // notify dashboard and other listeners that a student was created/updated
            try {
                // fetch the created/updated student from response by requesting the list item we just added/updated
                // but better: if backend returned location or object, we could use it; here we'll attempt to fetch the student by roll if provided
                const createdItem = studentId ? (await axios.get(`/api/students/${studentId}`)).data : null;
                window.dispatchEvent(new CustomEvent('resource:created', { detail: { resource: 'students', action: studentId ? 'updated' : 'created', item: createdItem } }));
            } catch(e) {
                // fallback to simple event when fetch fails
                try { window.dispatchEvent(new CustomEvent('resource:created', { detail: { resource: 'students', action: studentId ? 'updated' : 'created' } })); } catch(e) {}
            }
            // navigate back to students list
            window.location.hash = '#/students';
        } catch (e) {
            console.error(e);
            setError(e.response?.data?.message || e.message || 'Failed to create');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ maxWidth: 900, margin: '20px auto', background: 'white', borderRadius: 8, padding: 18, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h3>{isEdit ? 'Edit Student' : 'Add Student'}</h3>
            {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                    <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>First Name</label>
                    <input value={form.first_name} onChange={(e)=>setForm({...form, first_name: e.target.value})} style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #e6eef2' }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Last Name</label>
                    <input value={form.last_name} onChange={(e)=>setForm({...form, last_name: e.target.value})} style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #e6eef2' }} />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Email</label>
                    <input value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})} style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #e6eef2' }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>ID Number</label>
                    <input value={form.roll} onChange={(e)=>setForm({...form, roll: e.target.value})} style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #e6eef2' }} />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Year</label>
                    <input value={form.year} onChange={(e)=>setForm({...form, year: e.target.value})} style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #e6eef2' }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Semester</label>
                    <input value={form.semester} onChange={(e)=>setForm({...form, semester: e.target.value})} style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #e6eef2' }} />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Batch</label>
                    <input value={form.batch} onChange={(e)=>setForm({...form, batch: e.target.value})} style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #e6eef2' }} />
                </div>
                <div />
            </div>

            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button onClick={()=>{ window.location.hash = '#/students'; }} style={{ background: '#6c757d', color: 'white', padding: '8px 18px', borderRadius: 6, border: 'none' }}>Cancel</button>
                <button onClick={save} disabled={loading} style={{ background: '#007bff', color: 'white', padding: '8px 18px', borderRadius: 6, border: 'none' }}>{loading ? (isEdit ? 'Updating...' : 'Saving...') : (isEdit ? 'Update' : 'Save')}</button>
            </div>
        </div>
    );
}
