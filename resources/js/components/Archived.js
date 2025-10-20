import React, { useEffect, useState } from "react";
import { listArchived, unarchiveItem, deleteArchived } from "../archive";

export default function ArchivedList() {
  const [resource, setResource] = useState('students');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetch() {
    setLoading(true);
    try {
      const data = await listArchived(resource);
      setItems(data || []);
    } catch (e) {
      console.error(e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetch(); }, [resource]);

  async function handleUnarchive(id){
    if(!confirm('Restore this item?')) return;
    await unarchiveItem(resource, id);
    fetch();
  }

  async function handleDelete(id){
    if(!confirm('Permanently delete this item? This cannot be undone.')) return;
    await deleteArchived(resource, id);
    fetch();
  }

  return (
    <div style={{ maxWidth: 980, margin: '20px auto', background: 'white', borderRadius: 8, padding: 18, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>Archived</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setResource('students')} style={{ padding: '8px 12px' }}>Students</button>
          <button onClick={() => setResource('faculty')} style={{ padding: '8px 12px' }}>Faculty</button>
          <button onClick={() => setResource('courses')} style={{ padding: '8px 12px' }}>Courses</button>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        {loading ? <div>Loading...</div> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: '#627985', borderBottom: '1px solid #eef3f6' }}>
                <th style={{ padding: '12px 8px' }}>ID</th>
                <th style={{ padding: '12px 8px' }}>Title / Name</th>
                <th style={{ padding: '12px 8px' }}>Meta</th>
                <th style={{ padding: '12px 8px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} style={{ borderBottom: '1px solid #f1f3f5' }}>
                  <td style={{ padding: '12px 8px' }}>{it.id}</td>
                  <td style={{ padding: '12px 8px' }}>{it.name || `${it.first_name || ''} ${it.last_name || ''}` || it.title}</td>
                  <td style={{ padding: '12px 8px' }}>{it.email || it.code || ''}</td>
                  <td style={{ padding: '12px 8px' }}>
                    <button onClick={() => handleUnarchive(it.id)} style={{ marginRight: 8 }}>Restore</button>
                    <button onClick={() => handleDelete(it.id)} style={{ color: '#dc3545' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
