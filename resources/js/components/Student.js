import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import ArchivedFiles from "../ArchivedFiles";

function ActionIcons() {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <button title="View" style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 16 }}>👁</button>
      <button title="Edit" style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 16 }}>✏️</button>
      <button title="Delete" style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 16 }}>🗑</button>
    </div>
  );
}

export default function StudentList() {
  const ACCENT = '#ff8a2b';
  const TEAL = '#9be7ff';
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchStudents() {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/api/students');
      setStudents(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchStudents(); }, []);

  const [query, setQuery] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // editing handled via separate page/modal in future; keep stub for edit button
  function startEdit(s){
    // navigate to edit page which reuses AddStudent in edit mode
    if (s && s.id) {
      window.location.hash = `#/students/${s.id}/edit`;
    }
  }

  const filtered = useMemo(() => {
    let data = students.slice();
    if (yearFilter) data = data.filter((d) => d.year === yearFilter || d.class === yearFilter);
    if (query) {
      const q = query.toLowerCase();
      data = data.filter((d) => (d.name || '').toLowerCase().includes(q) || (d.roll || '').toLowerCase().includes(q));
    }
    return data;
  }, [students, query, yearFilter]);

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  function goto(p) {
    setPage(Math.max(1, Math.min(p, pages)));
  }

  return (
    <div style={{ maxWidth: 980, margin: "20px auto", background: "white", borderRadius: 8, padding: 18, border: '1px solid #e6e9ee' }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h3 style={{ margin: 0, color: '#22343a' }}>Students</h3>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <select value={yearFilter} onChange={(e) => { setYearFilter(e.target.value); setPage(1); }} style={{ padding: 8, borderRadius: 6, border: '1px solid #e6eef2' }}>
            <option value="">All Year</option>
            <option value="I">I Year</option>
            <option value="II">II Year</option>
            <option value="III">III Year</option>
            <option value="IV">IV Year</option>
          </select>
          <input placeholder="Search" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} style={{ padding: 8, borderRadius: 6, border: "1px solid #e6eef2" }} />
          <button onClick={()=>{ window.location.hash = '#/students/add'; }} style={{ background: ACCENT, color: "white", padding: "8px 14px", borderRadius: 18, border: "none", fontWeight:700 }}>Add</button>
        </div>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left", color: "#627985" }}>
            <th style={{ padding: "12px 8px", borderBottom: '1px solid #e6e9ee' }}><input type="checkbox" onChange={(e)=>{
              // bulk select toggle
              if(e.target.checked){
                filtered.forEach(s=>ArchivedFiles.toggle('students', s.id));
              } else {
                ArchivedFiles.clear('students');
              }
            }} /></th>
            <th style={{ padding: "12px 8px", borderBottom: '1px solid #e6e9ee' }}>Name</th>
              <th style={{ padding: "12px 8px", borderBottom: '1px solid #e6e9ee' }}>Student ID</th>
            <th style={{ padding: "12px 8px", borderBottom: '1px solid #e6e9ee' }}>Year</th>
            <th style={{ padding: "12px 8px", borderBottom: '1px solid #e6e9ee' }}>Semester</th>
            <th style={{ padding: "12px 8px", borderBottom: '1px solid #e6e9ee' }}>Batch</th>
            <th style={{ padding: "12px 8px", borderBottom: '1px solid #e6e9ee' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {visible.map((s) => (
            <tr key={s.id}>
              <td style={{ padding: "12px 8px", borderBottom: '1px solid #f1f3f5' }}><input type="checkbox" checked={ArchivedFiles.isSelected('students', s.id)} onChange={()=>ArchivedFiles.toggle('students', s.id)} /></td>
              <td style={{ padding: "12px 8px", borderBottom: '1px solid #f1f3f5' }}>{s.name || `${s.first_name || ''} ${s.last_name || ''}`}</td>
              <td style={{ padding: "12px 8px", borderBottom: '1px solid #f1f3f5' }}>{s.roll}</td>
              <td style={{ padding: "12px 8px", borderBottom: '1px solid #f1f3f5' }}>{s.year || s.class}</td>
              <td style={{ padding: "12px 8px", borderBottom: '1px solid #f1f3f5' }}>{s.semester}</td>
              <td style={{ padding: "12px 8px", borderBottom: '1px solid #f1f3f5' }}>{s.batch}</td>
              <td style={{ padding: "12px 8px", borderBottom: '1px solid #f1f3f5' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button title="View" style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${TEAL}`, background: 'white', color: ACCENT }}>👁</button>
                    <button title="Edit" onClick={()=>startEdit(s)} style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid #e6e9ee`, background: 'white' }}>✏️</button>
                    <button title="Delete" onClick={async ()=>{ if(confirm('Delete permanently?')){ try{ await axios.delete(`/api/students/${s.id}`); await fetchStudents(); } catch(e){ alert('Delete failed'); } } }} style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid #f1c0b0`, background: '#fff' }}>🗑</button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add/Edit form moved to separate page: #/students/add */}

        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <button onClick={async ()=>{ try{ await ArchivedFiles.bulkArchive('students'); await fetchStudents(); alert('Archived selected'); } catch(e){ alert(e.message); } }} style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${ACCENT}`, color: ACCENT, background: 'white' }}>Archive Selected</button>
        <button onClick={async ()=>{ try{ await ArchivedFiles.bulkDelete('students'); await fetchStudents(); alert('Deleted selected'); } catch(e){ alert(e.message); } }} style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid #e6e9ee`, background: 'white' }}>Delete Selected</button>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
        <div>
          <button onClick={() => goto(page - 1)} disabled={page <= 1} style={{ padding: "6px 10px", borderRadius: 6, border: `1px solid #e6e9ee`, background: "white" }}>{"<"}</button>
          <span style={{ margin: "0 8px", color: "#6c757d" }}>Page {page} of {pages}</span>
          <button onClick={() => goto(page + 1)} disabled={page >= pages} style={{ padding: "6px 10px", borderRadius: 6, border: `1px solid ${ACCENT}`, background: "white", color: ACCENT }}>{">"}</button>
        </div>

        <div style={{ color: "#6c757d" }}>Total Students: {students.length}</div>
      </div>
    </div>
  );
}
