import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AddFaculty({ facultyId }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [subjects, setSubjects] = useState('');
  const [classes, setClasses] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (facultyId) {
      setLoading(true);
      axios.get(`/api/faculty/${facultyId}`)
        .then(res => {
          const f = res.data;
          setName(f.name || '');
          setRole(f.role || '');
          setSubjects(f.subjects || '');
          setClasses(f.classes || '');
        })
        .catch(err => {
          console.error(err);
          setError('Failed to load faculty data');
        })
        .finally(() => setLoading(false));
    }
  }, [facultyId]);

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (!name.trim()) return setError('Name is required');
    if (!role.trim()) return setError('Role is required');
    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        role: role.trim(),
        subjects: subjects.trim(),
        classes: classes.trim(),
      };
      if (facultyId) {
        await axios.put(`/api/faculty/${facultyId}`, payload);
      } else {
        await axios.post('/api/faculty', payload);
      }
      window.location.hash = '#/faculty';
    } catch (err) {
      console.error(err);
      const msg = (err.response && err.response.data && err.response.data.message) || err.message || 'Request failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: '20px auto', background: 'white', borderRadius: 8, padding: 18, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #e9eef2' }}>
      <h3 style={{ marginTop: 0 }}>{facultyId ? 'Edit Teacher' : 'Add Teacher'}</h3>
      <form onSubmit={submit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: '#6c757d', marginBottom: 6 }}>Name</label>
            <input value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #e3e7eb' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, color: '#6c757d', marginBottom: 6 }}>Role</label>
            <input value={role} onChange={e => setRole(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #e3e7eb' }} />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: 13, color: '#6c757d', marginBottom: 6 }}>Subjects (comma separated)</label>
            <input value={subjects} onChange={e => setSubjects(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #e3e7eb' }} />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: 13, color: '#6c757d', marginBottom: 6 }}>Classes (comma separated)</label>
            <input value={classes} onChange={e => setClasses(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #e3e7eb' }} />
          </div>
        </div>

        {error && <div style={{ marginTop: 12, color: '#dc3545' }}>{error}</div>}

        <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
          <button type="submit" disabled={loading} style={{ background: '#ff8a2b', color: 'white', padding: '8px 16px', borderRadius: 18, border: 'none', cursor: 'pointer' }}>{loading ? 'Saving...' : (facultyId ? 'Save Changes' : 'Create Teacher')}</button>
          <button type="button" onClick={() => { window.location.hash = '#/faculty'; }} style={{ background: 'white', border: '1px solid #e6eef2', padding: '8px 12px', borderRadius: 8 }}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
