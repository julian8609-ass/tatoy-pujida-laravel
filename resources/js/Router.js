import React, { useEffect, useState } from "react";
import Dashboard from "./components/Dashboard";
import StudentList from "./components/Student";
import AddStudent from "./components/AddStudent";
import FacultyList from "./components/Faculty";
import CourseManager from "./components/Course";
import Sidebar from "./components/Sidebar";
import SettingsPage from "./components/SettingsPage";
import Login from "./components/Login";

// Simple hash-based router with sidebar layout
export default function Router() {
  const [route, setRoute] = useState(getRoute());

  useEffect(() => {
    function onHash() {
      const next = getRoute();
      // auth guard: if not authenticated and not on login, redirect to login
      const token = localStorage.getItem('auth_token');
      if (!token && next !== 'login') {
        window.location.hash = '#/login';
        return;
      }
      // if authenticated and visiting login, redirect to dashboard
      if (token && next === 'login') {
        window.location.hash = '#/dashboard';
        return;
      }
      setRoute(next);
    }
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // ensure initial route respects auth guard
  useEffect(() => {
    const initial = getRoute();
    const token = localStorage.getItem('auth_token');
    if (!token && initial !== 'login') {
      window.location.hash = '#/login';
      return;
    }
    if (token && initial === 'login') {
      window.location.hash = '#/dashboard';
      return;
    }
    setRoute(initial);
  }, []);

  let Content = Dashboard;
  let contentProps = {};
  let useSidebar = true;
  if (route === "students") Content = StudentList;
  else if (route === "students/add") Content = AddStudent;
  else if (route.startsWith("students/") && route.endsWith("/edit")) {
    // route -> students/:id/edit
    Content = AddStudent;
    const parts = route.split('/');
    if (parts.length >= 3) contentProps.studentId = parts[1];
  } else if (route === "faculty/add") {
    const AddFaculty = require("./components/AddFaculty").default;
    Content = AddFaculty;
  } else if (route.startsWith("faculty/") && route.endsWith("/edit")) {
    const AddFaculty = require("./components/AddFaculty").default;
    Content = AddFaculty;
    const parts = route.split('/');
    if (parts.length >= 3) contentProps.facultyId = parts[1];
  } else if (route === "faculty") Content = FacultyList;
  else if (route === "courses") Content = CourseManager;
  else if (route === "settings") Content = SettingsPage;
  else if (route === "login") { Content = Login; useSidebar = false; }

  return (
    <div style={{ display: "flex", gap: 12, padding: 18, background: "#f1f5f9", minHeight: "100vh" }}>
      {useSidebar && <Sidebar active={route} />}
      <div style={{ flex: 1 }}>
        {React.createElement(Content, contentProps)}
      </div>
    </div>
  );
}

function getRoute() {
  const hash = (window.location.hash || "").replace(/^#\/?/, "");
  return hash || "dashboard";
}
