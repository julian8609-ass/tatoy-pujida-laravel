import React from "react";

export default function Sidebar({ active = "dashboard" }) {
  const ACCENT = '#ff7a00';
  const linkStyle = (name) => ({
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 12px",
    borderRadius: 8,
    background: active === name ? `${ACCENT}11` : "transparent",
    color: active === name ? ACCENT : "#385562",
    cursor: "pointer",
    textDecoration: "none",
    fontWeight: active === name ? 700 : 500
  });

  return (
    <aside style={{ width: 220, background: "white", borderRadius: 8, padding: 12, boxShadow: "0 2px 6px rgba(0,0,0,0.04)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 20, background: "#ffd9c7", color: ACCENT, display: "flex", alignItems: "center", justifyContent: "center", fontWeight:700 }}>A</div>
        <div>
          <div style={{ fontWeight: 700 }}>admin</div>
          <div style={{ fontSize: 12, color: "#6c757d" }}>admin@met.com</div>
        </div>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <a href="#/dashboard" style={linkStyle("dashboard")}><span style={{display:'inline-block', width:22}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 13h8V3H3v10zM13 21h8V11h-8v10zM13 3v6h8V3h-8zM3 21h8v-6H3v6z" fill={active==='dashboard'?ACCENT:'#6c757d'} /></svg>
        </span> Overview</a>
        <a href="#/students" style={linkStyle("students")}>🎓 Students</a>
  <a href="#/faculty" style={linkStyle("faculty")}>👩‍🏫 Teachers</a>
  <a href="#/courses" style={linkStyle("courses")}>📚 Courses</a>
  <a href="#/settings" style={linkStyle("settings")}>⚙️ Settings</a>
      </nav>
      
      <div style={{ marginTop: 14, borderTop: '1px solid #eef3f6', paddingTop: 12 }}>
        <button
          onClick={() => { localStorage.removeItem('auth_token'); window.location.hash = '#/login'; }}
          style={{ width: '100%', background: ACCENT, color: 'white', padding: '10px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight:700 }}
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
