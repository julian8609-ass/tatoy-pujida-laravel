import React, { useState } from 'react';

function AccordionItem({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-lg shadow-sm border mb-4 overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-left focus:outline-none"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className="font-semibold text-gray-700">{title}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{open ? 'Collapse' : 'Expand'}</span>
          <svg className={`w-4 h-4 transform transition-transform ${open ? 'rotate-90' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 4l8 6-8 6V4z" clipRule="evenodd" /></svg>
        </div>
      </button>

      {open && (
        <div className="px-4 py-4 border-t bg-gray-50">
          {children}
        </div>
      )}
    </div>
  );
}

export default function SettingsPage() {
  const [state, setState] = useState({
    schoolName: 'My School',
    academicYear: '2025 - 2026',
    language: 'en',
    timezone: 'UTC',
    rolesPermissionsEnabled: true,
    twoFactorAuth: false,
    loginAttempts: 5,
    classesEnabled: true,
    gradingSystem: 'percentage',
    attendanceRules: 'default',
    feeReminderDays: 7,
    emailHost: '',
    smsProvider: '',
    backupAuto: true,
    dataExport: true,
    darkMode: false,
    widgets: { students: true, attendance: true, finance: false },
    environment: 'development',
    apiEnabled: true,
    developerMode: false,
  });

  function update(key, value) {
    setState(prev => ({ ...prev, [key]: value }));
  }

  function save() {
    // Placeholder: call API to save settings
    alert('Settings saved (not really)');
  }

  function resetDefaults() {
    // Reset to sane defaults
    setState({
      schoolName: 'My School',
      academicYear: '2025 - 2026',
      language: 'en',
      timezone: 'UTC',
      rolesPermissionsEnabled: true,
      twoFactorAuth: false,
      loginAttempts: 5,
      classesEnabled: true,
      gradingSystem: 'percentage',
      attendanceRules: 'default',
      feeReminderDays: 7,
      emailHost: '',
      smsProvider: '',
      backupAuto: true,
      dataExport: true,
      darkMode: false,
      widgets: { students: true, attendance: true, finance: false },
      environment: 'development',
      apiEnabled: true,
      developerMode: false,
    });
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Settings</h2>

      <AccordionItem title="General" defaultOpen>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700">School Name</label>
            <input className="mt-1 block w-full border rounded px-3 py-2" value={state.schoolName} onChange={(e)=>update('schoolName', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Academic Year</label>
            <input className="mt-1 block w-full border rounded px-3 py-2" value={state.academicYear} onChange={(e)=>update('academicYear', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Language</label>
            <select className="mt-1 block w-full border rounded px-3 py-2" value={state.language} onChange={(e)=>update('language', e.target.value)}>
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-700">Timezone</label>
            <select className="mt-1 block w-full border rounded px-3 py-2" value={state.timezone} onChange={(e)=>update('timezone', e.target.value)}>
              <option value="UTC">UTC</option>
              <option value="Africa/Accra">Africa/Accra</option>
              <option value="Asia/Manila">Asia/Manila</option>
            </select>
          </div>
        </div>
      </AccordionItem>

      <AccordionItem title="Users">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={state.rolesPermissionsEnabled} onChange={(e)=>update('rolesPermissionsEnabled', e.target.checked)} />
              <span className="text-sm text-gray-700">Enable Roles & Permissions</span>
            </label>
          </div>
          <div>
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={state.twoFactorAuth} onChange={(e)=>update('twoFactorAuth', e.target.checked)} />
              <span className="text-sm text-gray-700">Two-factor Authentication</span>
            </label>
          </div>
          <div>
            <label className="block text-sm text-gray-700">Allowed Login Attempts</label>
            <input type="number" className="mt-1 block w-full border rounded px-3 py-2" value={state.loginAttempts} onChange={(e)=>update('loginAttempts', Number(e.target.value))} />
          </div>
        </div>
      </AccordionItem>

      <AccordionItem title="Academics">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={state.classesEnabled} onChange={(e)=>update('classesEnabled', e.target.checked)} />
              <span className="text-sm text-gray-700">Enable Classes</span>
            </label>
          </div>
          <div>
            <label className="block text-sm text-gray-700">Grading System</label>
            <select className="mt-1 block w-full border rounded px-3 py-2" value={state.gradingSystem} onChange={(e)=>update('gradingSystem', e.target.value)}>
              <option value="percentage">Percentage</option>
              <option value="gpa">GPA</option>
              <option value="letter">Letter</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-700">Timetable Settings (placeholder)</label>
            <div className="mt-1 p-3 bg-white border rounded">Configure timetables, period lengths, and break schedules here.</div>
          </div>
        </div>
      </AccordionItem>

      <AccordionItem title="Attendance & Fees">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700">Attendance Rules</label>
            <select className="mt-1 block w-full border rounded px-3 py-2" value={state.attendanceRules} onChange={(e)=>update('attendanceRules', e.target.value)}>
              <option value="default">Default</option>
              <option value="strict">Strict</option>
              <option value="lenient">Lenient</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-700">Fee Reminder (days before)</label>
            <input type="number" className="mt-1 block w-full border rounded px-3 py-2" value={state.feeReminderDays} onChange={(e)=>update('feeReminderDays', Number(e.target.value))} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-700">Payment Gateway</label>
            <input className="mt-1 block w-full border rounded px-3 py-2" value={state.smsProvider} onChange={(e)=>update('smsProvider', e.target.value)} placeholder="e.g., stripe, paypal" />
          </div>
        </div>
      </AccordionItem>

      <AccordionItem title="Communication">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700">Email Host</label>
            <input className="mt-1 block w-full border rounded px-3 py-2" value={state.emailHost} onChange={(e)=>update('emailHost', e.target.value)} placeholder="smtp.example.com" />
          </div>
          <div>
            <label className="block text-sm text-gray-700">SMS Provider</label>
            <input className="mt-1 block w-full border rounded px-3 py-2" value={state.smsProvider} onChange={(e)=>update('smsProvider', e.target.value)} placeholder="twilio, nexmo" />
          </div>
          <div className="md:col-span-2">
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={state.apiEnabled} onChange={(e)=>update('apiEnabled', e.target.checked)} />
              <span className="text-sm text-gray-700">Enable Notifications API</span>
            </label>
          </div>
        </div>
      </AccordionItem>

      <AccordionItem title="Security">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={state.backupAuto} onChange={(e)=>update('backupAuto', e.target.checked)} />
              <span className="text-sm text-gray-700">Automatic Backups</span>
            </label>
          </div>
          <div>
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={state.dataExport} onChange={(e)=>update('dataExport', e.target.checked)} />
              <span className="text-sm text-gray-700">Allow Data Export</span>
            </label>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-700">Audit Logs (placeholder)</label>
            <div className="mt-1 p-3 bg-white border rounded">Audit log settings and retention policies.</div>
          </div>
        </div>
      </AccordionItem>

      <AccordionItem title="UI">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={state.darkMode} onChange={(e)=>update('darkMode', e.target.checked)} />
              <span className="text-sm text-gray-700">Enable Dark Mode</span>
            </label>
          </div>
          <div>
            <label className="block text-sm text-gray-700">Dashboard Widgets</label>
            <div className="mt-1 flex gap-2">
              <label className="flex items-center gap-2"><input type="checkbox" checked={state.widgets.students} onChange={(e)=>update('widgets', {...state.widgets, students: e.target.checked})} /> Students</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={state.widgets.attendance} onChange={(e)=>update('widgets', {...state.widgets, attendance: e.target.checked})} /> Attendance</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={state.widgets.finance} onChange={(e)=>update('widgets', {...state.widgets, finance: e.target.checked})} /> Finance</label>
            </div>
          </div>
        </div>
      </AccordionItem>

      <AccordionItem title="Advanced">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700">Environment</label>
            <select className="mt-1 block w-full border rounded px-3 py-2" value={state.environment} onChange={(e)=>update('environment', e.target.value)}>
              <option value="development">Development</option>
              <option value="staging">Staging</option>
              <option value="production">Production</option>
            </select>
          </div>
          <div>
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={state.developerMode} onChange={(e)=>update('developerMode', e.target.checked)} />
              <span className="text-sm text-gray-700">Developer Mode</span>
            </label>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-700">API Settings (placeholder)</label>
            <div className="mt-1 p-3 bg-white border rounded">API keys, rate limits, whitelisting.</div>
          </div>
        </div>
      </AccordionItem>

      <div className="mt-6 flex items-center gap-3">
        <button onClick={save} className="bg-orange-500 text-white px-4 py-2 rounded shadow">Save</button>
        <button onClick={resetDefaults} className="bg-white border px-4 py-2 rounded">Reset to Default</button>
      </div>

    </div>
  );
}
