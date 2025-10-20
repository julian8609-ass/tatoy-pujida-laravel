import React, { useState, useEffect } from "react";
import axios from "axios";

export default function CourseManager() {
  const ACCENT = '#ff8a2b';
  const TEAL = '#9be7ff';
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");

  async function fetchCourses(){
    try{
      const res = await axios.get('/api/courses');
      setCourses(res.data || []);
    } catch(e){ console.error(e); }
  }

  useEffect(()=>{ fetchCourses(); }, []);

  async function addCourse(e){
    e.preventDefault();
    if(!title.trim()) return;
    try{
      await axios.post('/api/courses', { title, code });
      setTitle(''); setCode('');
      fetchCourses();
    } catch(e){ console.error(e); }
  }

  async function removeCourse(id){
    try{
      await axios.delete(`/api/courses/${id}`);
      fetchCourses();
    } catch(e){ console.error(e); }
  }

  return (
    <div style={{ maxWidth: 900, margin: "20px auto", background: "white", borderRadius: 8, padding: 18, border: '1px solid #e6e9ee' }}>
      <h3 style={{ color: '#22343a' }}>Courses</h3>
      <form onSubmit={addCourse} style={{ display: "flex", gap: 8, marginTop: 12, marginBottom: 12 }}>
        <input placeholder="Course Title" value={title} onChange={(e) => setTitle(e.target.value)} style={{ flex: 1, padding: 10, borderRadius: 8, border: `1px solid #e6e9ee` }} />
        <input placeholder="Code" value={code} onChange={(e) => setCode(e.target.value)} style={{ width: 160, padding: 10, borderRadius: 8, border: `1px solid #e6e9ee` }} />
        <button style={{ background: ACCENT, color: "white", border: "none", padding: "8px 16px", borderRadius: 20, fontWeight: 700, boxShadow: `0 0 0 6px ${TEAL}22`, border: `2px solid ${TEAL}` }}>Add</button>
      </form>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left", color: "#627985" }}>
            <th style={{ padding: "12px 8px", borderBottom: '1px solid #e6e9ee' }}>Title</th>
            <th style={{ padding: "12px 8px", borderBottom: '1px solid #e6e9ee' }}>Code</th>
            <th style={{ padding: "12px 8px", borderBottom: '1px solid #e6e9ee' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c) => (
            <tr key={c.id}>
              <td style={{ padding: "12px 8px", borderBottom: '1px solid #f1f3f5' }}>{c.title}</td>
              <td style={{ padding: "12px 8px", borderBottom: '1px solid #f1f3f5' }}>{c.code}</td>
              <td style={{ padding: "12px 8px", borderBottom: '1px solid #f1f3f5' }}>
                <button onClick={() => removeCourse(c.id)} style={{ background: 'transparent', border: `1px solid #f1c0b0`, color: '#c0392b', padding: '6px 10px', borderRadius: 8 }}>🗑 Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
