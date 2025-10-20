import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import ArchivedFiles from "../ArchivedFiles";

function ActionIcons() {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <button title="View" style={{ background: "none", border: "none", cursor: "pointer", color: '#9be7ff' }}>View</button>
      <button title="Edit" style={{ background: "none", border: "none", cursor: "pointer", color: '#ff8a2b' }}>Edit</button>
      <button title="Delete" style={{ background: "none", border: "none", cursor: "pointer", color: '#dc3545' }}>Delete</button>
    </div>
  );
}


export default function FacultyList() {
  const ACCENT = '#ff8a2b';
  const TEAL = '#9be7ff';
  const [faculty, setFaculty] = useState([]);
  const [query, setQuery] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  async function fetchFaculty(){
    try{
      const res = await axios.get('/api/faculty');
      setFaculty(res.data || []);
    } catch(e) { console.error(e); }
  }

  useEffect(()=>{ fetchFaculty(); }, []);

  const filtered = useMemo(() => {
    let data = faculty.slice();
    if (yearFilter) data = data.filter((d) => (d.classes || '').includes(yearFilter));
    if (query) {
      const q = query.toLowerCase();
      data = data.filter((d) => (d.name||'').toLowerCase().includes(q) || (d.role||'').toLowerCase().includes(q));
    }
    return data;
  }, [faculty, query, yearFilter]);

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  function goto(p) {
    setPage(Math.max(1, Math.min(p, pages)));
  }

  return (
    <div style={{ maxWidth: 980, margin: "20px auto", background: "white", borderRadius: 8, padding: 18, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #e9eef2" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h3 style={{ margin: 0 }}>Faculty</h3>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <select value={yearFilter} onChange={(e) => { setYearFilter(e.target.value); setPage(1); }} style={{ padding: 8, borderRadius: 6, border: '1px solid #e6eef2' }}>
            <option value="">All Year</option>
            <option value="I">I Year</option>
            <option value="II">II Year</option>
            <option value="III">III Year</option>
            <option value="IV">IV Year</option>
          </select>
          <input placeholder="Search" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} style={{ padding: 8, borderRadius: 6, border: "1px solid #e3e7eb" }} />
          <a href="#/faculty/add" style={{ textDecoration: 'none' }}>
            <button style={{ background: ACCENT, color: "white", padding: "8px 16px", borderRadius: 18, border: `2px solid ${ACCENT}`, boxShadow: `0 0 0 6px ${TEAL}22`, cursor: 'pointer' }}>+ Add Teacher</button>
          </a>
        </div>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", borderRadius: 6 }}>
        <thead>
          <tr style={{ textAlign: "left", color: "#627985", borderBottom: "1px solid #eef3f6" }}>
            <th style={{ padding: "12px 8px" }}><input type="checkbox" onChange={(e)=>{ if(e.target.checked){ filtered.forEach(f=>ArchivedFiles.toggle('faculty', f.id)); } else { ArchivedFiles.clear('faculty'); } }} /></th>
            <th style={{ padding: "12px 8px" }}>Name</th>
            <th style={{ padding: "12px 8px" }}>Role</th>
            <th style={{ padding: "12px 8px" }}>Total Subjects</th>
            <th style={{ padding: "12px 8px" }}>Total Classes</th>
            <th style={{ padding: "12px 8px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {visible.map((s) => (
            <tr key={s.id} style={{ borderBottom: "1px solid #f1f3f5" }}>
              <td style={{ padding: "12px 8px" }}><input type="checkbox" checked={ArchivedFiles.isSelected('faculty', s.id)} onChange={()=>ArchivedFiles.toggle('faculty', s.id)} /></td>
              <td style={{ padding: "12px 8px" }}>{s.name}</td>
              <td style={{ padding: "12px 8px", color: ACCENT }}>{s.role}</td>
              <td style={{ padding: "12px 8px" }}>{s.subjects}</td>
              <td style={{ padding: "12px 8px" }}>{s.classes}</td>
              <td style={{ padding: "12px 8px", display: 'flex', alignItems: 'center' }}>
                <button title="View" style={{ background: 'none', border: '1px solid #9be7ff33', color: TEAL, padding: '6px 8px', borderRadius: 10, cursor: 'pointer' }}>View</button>
                <button title="Edit" onClick={()=>{ window.location.href = `#/faculty/edit/${s.id}` }} style={{ marginLeft: 8, background: 'none', border: `1px solid ${ACCENT}33`, color: ACCENT, padding: '6px 8px', borderRadius: 10, cursor: 'pointer' }}>Edit</button>
                <button onClick={async ()=>{ await axios.delete(`/api/faculty/${s.id}`); fetchFaculty(); }} style={{ marginLeft: 8, background: '#fff', border: '1px solid #f5c6c6', color: '#dc3545', padding: '6px 8px', borderRadius: 10, cursor: 'pointer' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <button onClick={async ()=>{ try{ await ArchivedFiles.bulkArchive('faculty'); await fetchFaculty(); alert('Archived selected'); } catch(e){ alert(e.message); } }} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e6eef2' }}>Archive Selected</button>
        <button onClick={async ()=>{ try{ await ArchivedFiles.bulkDelete('faculty'); await fetchFaculty(); alert('Deleted selected'); } catch(e){ alert(e.message); } }} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e6eef2' }}>Delete Selected</button>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
        <div>
          <button onClick={() => goto(page - 1)} disabled={page <= 1} style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #e6eef2", background: "white" }}>{"<"}</button>
          <span style={{ margin: "0 8px", color: "#6c757d" }}>Page {page} of {pages}</span>
          <button onClick={() => goto(page + 1)} disabled={page >= pages} style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #e6eef2", background: "white" }}>{">"}</button>
        </div>

        <div style={{ color: "#6c757d" }}>Total Faculty: {faculty.length}</div>
      </div>
    </div>
  );
}
