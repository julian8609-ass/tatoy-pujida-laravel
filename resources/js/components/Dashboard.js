import React, { useEffect, useState } from "react";
import axios from 'axios';

function StatCard({ title, value, icon }) {
	return (
		<div style={{ flex: 1, minWidth: 180, background: "white", padding: 18, borderRadius: 10, boxShadow: "0 2px 6px rgba(0,0,0,0.08)", margin: 8 }}>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
				<div>
					<div style={{ color: "#6c757d", fontSize: 14, marginBottom: 6 }}>{title}</div>
					<div style={{ fontSize: 22, fontWeight: 700 }}>{value}</div>
				</div>
				<div style={{ background: "#e9f7ff", padding: 12, borderRadius: 10 }}>{icon}</div>
			</div>
		</div>
	);
}

function BatchTable({ batches }) {
	return (
		<div style={{ background: "white", padding: 18, borderRadius: 8, boxShadow: "0 2px 6px rgba(0,0,0,0.06)", marginRight: 12, flex: 1 }}>
			<h3 style={{ marginTop: 0, marginBottom: 12 }}>Batch Overview</h3>
			<table style={{ width: "100%", borderCollapse: "collapse" }}>
				<thead>
					<tr style={{ textAlign: "left", color: "#6c757d" }}>
						<th style={{ padding: "8px 6px" }}>Year</th>
						<th style={{ padding: "8px 6px" }}>Batch</th>
						<th style={{ padding: "8px 6px" }}>Pass Percentage</th>
					</tr>
				</thead>
				<tbody>
					{batches.map((b, i) => (
						<tr key={i} style={{ borderTop: "1px solid #f1f3f5" }}>
							<td style={{ padding: "10px 6px" }}>{b.year}</td>
							<td style={{ padding: "10px 6px" }}>{b.batch}</td>
							<td style={{ padding: "10px 6px" }}>{b.pass}%</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

function PieLegend({ items }) {
	return (
		<div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
			{items.map((it, idx) => (
				<div key={idx} style={{ display: "flex", alignItems: "center", gap: 8 }}>
					<div style={{ width: 12, height: 12, background: it.color, borderRadius: 3 }} />
					<div style={{ color: "#6c757d", fontSize: 13 }}>{it.label}</div>
				</div>
			))}
		</div>
	);
}

function PieChart({ items }) {
	const total = items.reduce((s, it) => s + it.value, 0) || 1;
	let angle = 0;
	const cx = 80,
		cy = 80,
		r = 60;
	const paths = items.map((it) => {
		const start = angle;
		const portion = (it.value / total) * 2 * Math.PI;
		const end = start + portion;
		const x1 = cx + r * Math.cos(start - Math.PI / 2);
		const y1 = cy + r * Math.sin(start - Math.PI / 2);
		const x2 = cx + r * Math.cos(end - Math.PI / 2);
		const y2 = cy + r * Math.sin(end - Math.PI / 2);
		const large = portion > Math.PI ? 1 : 0;
		const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
		angle = end;
		return <path key={it.label} d={d} fill={it.color} stroke="#fff" strokeWidth="1" />;
	});

	return (
		<div style={{ background: "white", padding: 18, borderRadius: 8, boxShadow: "0 2px 6px rgba(0,0,0,0.06)", flex: 1 }}>
			<h3 style={{ marginTop: 0, marginBottom: 12 }}>Assignment Submission Status</h3>
			<div style={{ display: "flex", alignItems: "center" }}>
				<svg width={160} height={160} viewBox="0 0 160 160" style={{ flex: "0 0 160px" }}>
					{paths}
				</svg>
				<div style={{ marginLeft: 12, flex: 1 }}>
					<PieLegend items={items.map((it) => ({ label: `${it.label} ${it.value}%`, color: it.color }))} />
				</div>
			</div>
		</div>
	);
}

export default function Dashboard() {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [students, setStudents] = useState([]);
	const [archivedStudents, setArchivedStudents] = useState([]);
	const [faculty, setFaculty] = useState([]);
	const [courses, setCourses] = useState([]);

	useEffect(() => {
		let mounted = true;
		setLoading(true);
		setError(null);

		Promise.all([
			axios.get('/api/students'),
			axios.get('/api/students/archived'),
			axios.get('/api/faculty'),
			axios.get('/api/courses')
		]).then(([sRes, aRes, fRes, cRes]) => {
			if (!mounted) return;
			setStudents(Array.isArray(sRes.data) ? sRes.data : []);
			setArchivedStudents(Array.isArray(aRes.data) ? aRes.data : []);
			setFaculty(Array.isArray(fRes.data) ? fRes.data : []);
			setCourses(Array.isArray(cRes.data) ? cRes.data : []);
		}).catch((err) => {
			console.error('Dashboard fetch error', err);
			if (!mounted) return;
			setError('Failed to load dashboard data');
		}).finally(() => {
			if (!mounted) return;
			setLoading(false);
		});

		return () => { mounted = false; };
	}, []);

	// compute display values
	const totalStudents = students.length;
	const archivedCount = archivedStudents.length;
	const totalFaculty = faculty.length;
	const totalCourses = courses.length;

	// compute pie distribution by year (if students have `year` field)
	const yearCounts = students.reduce((acc, s) => {
		const y = s.year || 'Unknown';
		acc[y] = (acc[y] || 0) + 1;
		return acc;
	}, {});

	const colorMap = { 'I': '#4e73df', 'II': '#20c997', 'III': '#ffb020', 'IV': '#a755f7', 'Unknown': '#ced4da' };
	const pieItems = Object.keys(yearCounts).map((k) => ({ label: `${k} Year`, value: Math.round((yearCounts[k] / Math.max(1, totalStudents)) * 100), color: colorMap[k] || '#6c757d' }));

	const stats = [
		{ title: 'Total Students', value: loading ? '...' : totalStudents, icon: '🎓' },
		{ title: 'Archived Students', value: loading ? '...' : archivedCount, icon: '🗄️' },
		{ title: 'Total Staff', value: loading ? '...' : totalFaculty, icon: '👩‍🏫' },
		{ title: 'Total Courses', value: loading ? '...' : totalCourses, icon: '📚' }
	];

	const batches = [
		{ year: 'I', batch: '2022-2026', pass: 95 },
		{ year: 'II', batch: '2021-2025', pass: 90 },
		{ year: 'III', batch: '2020-2024', pass: 90 },
		{ year: 'IV', batch: '2019-2023', pass: 85 }
	];

	const ACCENT = '#ff8a2b';
	const TEAL = '#9be7ff';

	// prepare student counts by course and instructor counts by course
	const courseCounts = students.reduce((acc, s) => {
		const course = (s.class || s.course || s.course_name || s.course_title || 'Unknown');
		acc[course] = (acc[course] || 0) + 1;
		return acc;
	}, {});

	const instructorCounts = faculty.reduce((acc, f) => {
		const course = (f.positions || f.role || f.course || 'Unknown');
		acc[course] = (acc[course] || 0) + 1;
		return acc;
	}, {});

	// map known course -> department for display
	const deptMap = {
		'BSIT': 'CSP',
		'BSCS': 'CSP',
		'BSDA': 'CSP',
		'BLIS': 'CSP',
		'BSHM': 'THMP',
	};

	const studentRows = Object.keys(courseCounts).map((course) => ({
		department: deptMap[course] || '-',
		course,
		total: courseCounts[course]
	})).sort((a,b) => b.total - a.total);

	const instructorRows = Object.keys(instructorCounts).map((course) => ({ course, total: instructorCounts[course] })).sort((a,b) => b.total - a.total);

	return (
		<div style={{ fontFamily: 'Inter, Arial, sans-serif', background: '#f1f5f9', minHeight: '100vh', padding: 24 }}>
			<div style={{ maxWidth: 1100, margin: '0 auto' }}>
				{/* Top header bar similar to mock */}
				<div style={{ height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', borderRadius: 6, padding: '6px 12px', boxShadow: '0 1px 0 rgba(0,0,0,0.04)', border: '1px solid #e6e9ee', marginBottom: 14 }}>
					<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
						<div style={{ width: 34, height: 34, borderRadius: 6, background: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>≡</div>
						<div style={{ fontSize: 15, fontWeight: 700, color: '#2b4350' }}>Dashboard</div>
					</div>
					<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
						<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
							<div style={{ width: 36, height: 36, borderRadius: 18, background: '#ffeaa7', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 0 rgba(0,0,0,0.06)' }}>👤</div>
							<div style={{ color: '#2b4350', fontWeight: 600 }}>admin</div>
						</div>
						<button style={{ background: ACCENT, color: 'white', border: 'none', padding: '6px 10px', borderRadius: 6, fontWeight: 700 }}>Logout</button>
					</div>
				</div>

				<div style={{ background: 'white', padding: 18, borderRadius: 8, boxShadow: '0 2px 6px rgba(0,0,0,0.04)', marginBottom: 18, border: '1px solid #e6e9ee' }}>
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						<div>
							<div style={{ fontSize: 16, color: '#2b4350', fontWeight: 700 }}>Welcome Admin</div>
						</div>
						<div style={{ display: 'flex', gap: 12 }}>
							{['Total Students','Faculty','Year'].map((t, i) => {
								const val = t === 'Year' ? '2025 - 2026' : (t === 'Faculty' ? totalFaculty : totalStudents);
								const icon = t === 'Year' ? '📅' : (t === 'Faculty' ? '👩‍🏫' : '🎓');
								return (
									<div key={i} style={{ minWidth: 190, borderRadius: 26, padding: '12px 18px', background: '#fff', display: 'flex', alignItems: 'center', gap: 14, border: `2px solid ${ACCENT}`, boxShadow: `0 0 0 6px ${TEAL}22` }}>
										<div style={{ width: 48, height: 48, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', border: `2px solid ${TEAL}`, color: ACCENT, fontSize: 20 }}>{icon}</div>
										<div>
											<div style={{ fontSize: 13, color: '#6c757d' }}>{t}</div>
											<div style={{ fontSize: 16, fontWeight: 700, color: '#22343a' }}>{val}</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</div>

				<div style={{ display: 'flex', gap: 12 }}>
					<div style={{ flex: 1, background: 'white', padding: 18, borderRadius: 8, boxShadow: 'none', border: '1px solid #e6e9ee' }}>
						<h3 style={{ marginTop: 0, marginBottom: 12, color: '#22343a' }}>Number of students</h3>
						<table style={{ width: '100%', borderCollapse: 'collapse' }}>
							<thead>
								<tr style={{ textAlign: 'left', color: '#6c757d' }}>
									<th style={{ padding: '12px 8px', borderBottom: '1px solid #e6e9ee' }}>Department</th>
									<th style={{ padding: '12px 8px', borderBottom: '1px solid #e6e9ee' }}>Course</th>
									<th style={{ padding: '12px 8px', borderBottom: '1px solid #e6e9ee' }}>Total</th>
								</tr>
							</thead>
							<tbody>
								{studentRows.length ? studentRows.map((r, idx) => (
									<tr key={idx}>
										<td style={{ padding: '12px 8px', borderBottom: '1px solid #f1f3f5' }}>{r.department}</td>
										<td style={{ padding: '12px 8px', borderBottom: '1px solid #f1f3f5' }}>{r.course}</td>
										<td style={{ padding: '12px 8px', borderBottom: '1px solid #f1f3f5', textAlign: 'right' }}>{r.total}</td>
									</tr>
								)) : (
									[0,1,2,3].map((n) => (
										<tr key={n}>
											<td style={{ padding: '12px 8px', borderBottom: '1px solid #f1f3f5' }}>&nbsp;</td>
											<td style={{ padding: '12px 8px', borderBottom: '1px solid #f1f3f5' }}>&nbsp;</td>
											<td style={{ padding: '12px 8px', borderBottom: '1px solid #f1f3f5' }}>&nbsp;</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>

					<div style={{ width: 360, background: 'white', padding: 18, borderRadius: 8, boxShadow: 'none', border: '1px solid #e6e9ee' }}>
						<h3 style={{ marginTop: 0, marginBottom: 12, color: '#22343a' }}>Number of Instructors</h3>
						<table style={{ width: '100%', borderCollapse: 'collapse' }}>
							<thead>
								<tr style={{ textAlign: 'left', color: '#6c757d' }}>
									<th style={{ padding: '12px 8px', borderBottom: '1px solid #e6e9ee' }}>Course</th>
									<th style={{ padding: '12px 8px', borderBottom: '1px solid #e6e9ee', textAlign: 'right' }}>Total</th>
								</tr>
							</thead>
							<tbody>
								{instructorRows.length ? instructorRows.map((r, idx) => (
									<tr key={idx}>
										<td style={{ padding: '12px 8px', borderBottom: '1px solid #f1f3f5' }}>{r.course}</td>
										<td style={{ padding: '12px 8px', borderBottom: '1px solid #f1f3f5', textAlign: 'right' }}>{r.total}</td>
									</tr>
								)) : (
									<tr><td style={{ padding: '12px 8px' }}>No data</td><td style={{ padding: '12px 8px', textAlign: 'right' }}>0</td></tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}
