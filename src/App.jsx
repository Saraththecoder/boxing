import React, { useState, useEffect } from 'react';
import { 
  Award, 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  DollarSign, 
  Bell, 
  Megaphone, 
  FileSpreadsheet,
  LogOut,
  Menu,
  X,
  BellOff
} from 'lucide-react';

// Services & Components
import { db, initDatabase } from './services/db';
import AdminAuth from './components/AdminAuth';
import Dashboard from './components/Dashboard';
import StudentManager from './components/StudentManager';
import AttendanceManager from './components/AttendanceManager';
import FeeManager from './components/FeeManager';
import ReminderSystem from './components/ReminderSystem';
import AnnouncementBoard from './components/AnnouncementBoard';
import ReportsManager from './components/ReportsManager';

export default function App() {
  // Authentication State
  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('apex_admin_session');
    return saved ? JSON.parse(saved) : null;
  });

  // Navigation tab
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Core Data States
  const [students, setStudents] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [trainerAttendance, setTrainerAttendance] = useState([]);
  const [payments, setPayments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [activities, setActivities] = useState([]);

  // Toast System State
  const [toast, setToast] = useState({ show: false, type: 'success', title: '', message: '' });

  // Initialize DB and load states
  useEffect(() => {
    initDatabase();
    refreshAllData();
  }, []);

  const refreshAllData = () => {
    setStudents(db.getStudents());
    setTrainers(db.getTrainers());
    setAttendance(db.getAttendance());
    setTrainerAttendance(db.getTrainerAttendance());
    setPayments(db.getPayments());
    setAnnouncements(db.getAnnouncements());
    setActivities(db.getActivities());
  };

  // Toast Helper
  const showToast = (type, title, message) => {
    setToast({ show: true, type, title, message });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  // Auth Handlers
  const handleLogin = (user) => {
    setAdminUser(user);
    localStorage.setItem('apex_admin_session', JSON.stringify(user));
    showToast('success', 'Access Granted', `Welcome back, ${user.name}`);
  };

  const handleLogout = () => {
    setAdminUser(null);
    localStorage.removeItem('apex_admin_session');
    setActiveTab('dashboard');
  };

  // Database Handlers
  const handleSaveStudent = (student) => {
    const saved = db.saveStudent(student);
    refreshAllData();
    showToast(
      'success', 
      student.id ? 'Profile Updated' : 'Fighter Registered', 
      `${saved.name} has been saved in the system roster.`
    );
  };

  const handleDeleteStudent = (id) => {
    db.deleteStudent(id);
    refreshAllData();
    showToast('info', 'Record Deleted', 'Fighter record has been permanently deleted.');
  };

  const handleSaveAttendance = (record) => {
    db.saveAttendanceRecord(record);
    refreshAllData();
  };

  const handleSaveTrainerAttendance = (record) => {
    db.saveTrainerAttendanceRecord(record);
    refreshAllData();
  };

  const handleCollectFee = (payment) => {
    const saved = db.savePayment(payment);
    refreshAllData();
    showToast('success', 'Fee Collected', `Generated receipt ${saved.receiptNumber} for $${saved.amount}.`);
  };

  const handleSaveAnnouncement = (ann) => {
    const saved = db.saveAnnouncement(ann);
    refreshAllData();
    showToast('success', 'Notice Published', `Broadcast alert sent for: ${saved.title}`);
  };

  const handleDeleteAnnouncement = (id) => {
    db.deleteAnnouncement(id);
    refreshAllData();
    showToast('info', 'Notice Wiped', 'Announcement has been removed from the notice board.');
  };

  const handleTriggerReminder = (reminder, channel, formattedMsg) => {
    // Add activity logging
    db.addActivity('warning', `Dispatched fee reminder to ${reminder.name} via ${channel}`);
    refreshAllData();
    showToast(
      'info', 
      'Reminder Dispatched', 
      `Alert sent to ${reminder.phone} using the custom ${channel} template.`
    );
  };

  const handleBackupRestore = (data) => {
    const res = db.restoreCompleteData(data);
    if (res) refreshAllData();
    return res;
  };

  const handleDatabaseReset = () => {
    db.resetDatabase();
    refreshAllData();
    showToast('info', 'System Reset', 'All records reverted to factory seed configurations.');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  // Navigation redirect helper
  const handleDashboardNavigate = (tab) => {
    setActiveTab(tab);
  };

  // Render Login overlay if session is unauthenticated
  if (!adminUser) {
    return <AdminAuth onLoginSuccess={handleLogin} />;
  }

  const menuItems = [
    { id: 'dashboard', label: 'Admin Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'students', label: 'Students Roster', icon: <Users size={18} /> },
    { id: 'attendance', label: 'Attendance Sheet', icon: <CalendarCheck size={18} /> },
    { id: 'fees', label: 'Fee Collections', icon: <DollarSign size={18} /> },
    { id: 'reminders', label: 'Fee Reminders', icon: <Bell size={18} /> },
    { id: 'events', label: 'Announcements', icon: <Megaphone size={18} /> },
    { id: 'reports', label: 'Reports & Utility', icon: <FileSpreadsheet size={18} /> }
  ];

  return (
    <div className="app-container">
      {/* Mobile Top Header */}
      <div style={{
        display: 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
        zIndex: 90,
        padding: '0 20px',
        alignItems: 'center',
        justifyContent: 'space-between'
      }} className="mobile-header-bar">
        <div className="logo-text" style={{ fontSize: '1rem' }}>
          APEX <span>BOXING</span>
        </div>
        <button 
          className="menu-toggle-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* CSS overrides for mobile header visibility */}
      <style>{`
        @media (max-width: 768px) {
          .mobile-header-bar {
            display: flex !important;
          }
          .main-content {
            margin-top: 60px !important;
          }
        }
      `}</style>

      {/* Sidebar Navigation */}
      <aside className={`sidebar ${mobileMenuOpen ? 'active' : ''}`} style={{
        transform: mobileMenuOpen ? 'translateX(0)' : undefined
      }}>
        <div className="sidebar-logo">
          <div className="logo-icon">
            <Award size={22} />
          </div>
          <div className="logo-text">
            APEX <span>BOXING</span>
          </div>
        </div>

        <ul className="sidebar-menu">
          {menuItems.map(item => (
            <li 
              key={item.id} 
              className={`menu-item ${activeTab === item.id ? 'active' : ''}`}
            >
              <button onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}>
                {item.icon}
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="sidebar-footer">
          <div className="user-profile-summary">
            <div className="user-avatar">
              MD
            </div>
            <div className="user-details">
              <div className="user-name">{adminUser.name}</div>
              <div className="user-role">{adminUser.role}</div>
            </div>
            <button 
              className="logout-btn" 
              onClick={handleLogout}
              title="Logout from console"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="main-content">
        {activeTab === 'dashboard' && (
          <Dashboard 
            students={students} 
            payments={payments} 
            attendance={attendance} 
            activities={activities}
            onNavigate={handleDashboardNavigate}
          />
        )}
        
        {activeTab === 'students' && (
          <StudentManager 
            students={students} 
            onSaveStudent={handleSaveStudent} 
            onDeleteStudent={handleDeleteStudent} 
          />
        )}

        {activeTab === 'attendance' && (
          <AttendanceManager 
            students={students}
            trainers={trainers}
            attendance={attendance}
            trainerAttendance={trainerAttendance}
            onSaveAttendance={handleSaveAttendance}
            onSaveTrainerAttendance={handleSaveTrainerAttendance}
          />
        )}

        {activeTab === 'fees' && (
          <FeeManager 
            students={students} 
            payments={payments} 
            onCollectFee={handleCollectFee} 
          />
        )}

        {activeTab === 'reminders' && (
          <ReminderSystem 
            students={students} 
            payments={payments} 
            onTriggerReminder={handleTriggerReminder} 
          />
        )}

        {activeTab === 'events' && (
          <AnnouncementBoard 
            announcements={announcements}
            onSaveAnnouncement={handleSaveAnnouncement}
            onDeleteAnnouncement={handleDeleteAnnouncement}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsManager 
            students={students}
            payments={payments}
            attendance={attendance}
            onBackupRestore={handleBackupRestore}
            onDatabaseReset={handleDatabaseReset}
          />
        )}
      </main>

      {/* Toast Notification Alert Banner */}
      {toast.show && (
        <div className={`notification-toast ${toast.type}`}>
          <div className="toast-content">
            <h4>{toast.title}</h4>
            <p>{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
