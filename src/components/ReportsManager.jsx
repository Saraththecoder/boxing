import React, { useState, useMemo, useRef } from 'react';
import { 
  Download, 
  Upload, 
  RefreshCw, 
  FileSpreadsheet, 
  Printer, 
  AlertTriangle, 
  Users, 
  DollarSign, 
  Award,
  ShieldCheck
} from 'lucide-react';

export default function ReportsManager({ 
  students, 
  payments, 
  attendance, 
  onBackupRestore, 
  onDatabaseReset 
}) {
  const [selectedReport, setSelectedReport] = useState('students'); // 'students', 'attendance', 'finance', 'backup'
  const fileInputRef = useRef(null);

  // --- Report 1: Student Demographics Calculations ---
  const studentReportData = useMemo(() => {
    const active = students.filter(s => s.status === 'Active');
    const avgAge = active.length > 0 
      ? (active.reduce((sum, s) => sum + s.age, 0) / active.length).toFixed(1) 
      : 0;
    const avgWeight = active.length > 0 
      ? (active.reduce((sum, s) => sum + s.weight, 0) / active.length).toFixed(1) 
      : 0;

    return {
      list: students,
      avgAge,
      avgWeight,
      activeCount: active.length,
      inactiveCount: students.filter(s => s.status === 'Inactive').length
    };
  }, [students]);

  // --- Report 2: Attendance Performance Calculations ---
  const attendanceReportData = useMemo(() => {
    const reportList = [];
    const active = students.filter(s => s.status === 'Active');

    // Group attendance records by student
    const studentRecords = {};
    attendance.forEach(rec => {
      if (!studentRecords[rec.studentId]) {
        studentRecords[rec.studentId] = [];
      }
      studentRecords[rec.studentId].push(rec);
    });

    let cumulativeRate = 0;

    active.forEach(student => {
      const recs = studentRecords[student.id] || [];
      const present = recs.filter(r => r.status === 'Present').length;
      const absent = recs.filter(r => r.status === 'Absent').length;
      const total = present + absent;
      const rate = total > 0 ? Math.round((present / total) * 100) : 0;
      cumulativeRate += rate;

      reportList.push({
        id: student.id,
        name: student.name,
        batch: student.batch,
        present,
        absent,
        total,
        rate
      });
    });

    const averageGymAttendance = active.length > 0 
      ? Math.round(cumulativeRate / active.length) 
      : 0;

    return {
      list: reportList,
      averageGymAttendance
    };
  }, [students, attendance]);

  // --- Report 3: Financial Collections Calculations ---
  const financeReportData = useMemo(() => {
    const junePayments = payments.filter(p => p.monthFor === '2026-06' && p.status === 'Paid');
    const juneCollected = junePayments.reduce((sum, p) => sum + p.amount, 0);

    const paidStudentIds = junePayments.map(p => p.studentId);
    let totalOutstanding = 0;
    const dueList = [];

    students.forEach(s => {
      if (s.status === 'Active' && !paidStudentIds.includes(s.id)) {
        totalOutstanding += s.feeAmount;
        dueList.push({
          id: s.id,
          name: s.name,
          batch: s.batch,
          amount: s.feeAmount,
          phone: s.phone
        });
      }
    });

    return {
      juneCollected,
      totalOutstanding,
      dueList,
      paymentsCount: payments.length
    };
  }, [students, payments]);

  // --- Trigger JSON Database Download ---
  const handleBackupDownload = () => {
    const keys = {
      apex_boxing_students: localStorage.getItem('apex_boxing_students'),
      apex_boxing_trainers: localStorage.getItem('apex_boxing_trainers'),
      apex_boxing_trainer_attendance: localStorage.getItem('apex_boxing_trainer_attendance'),
      apex_boxing_attendance: localStorage.getItem('apex_boxing_attendance'),
      apex_boxing_payments: localStorage.getItem('apex_boxing_payments'),
      apex_boxing_announcements: localStorage.getItem('apex_boxing_announcements'),
      apex_boxing_activities: localStorage.getItem('apex_boxing_activities')
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(keys, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `apex_boxing_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // --- Trigger JSON Database Upload/Restore ---
  const handleBackupUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        
        // Format mapping back to db keys
        const dataToRestore = {};
        Object.keys(parsed).forEach(k => {
          dataToRestore[k] = JSON.parse(parsed[k]);
        });

        const success = onBackupRestore(dataToRestore);
        if (success) {
          alert('Database restored successfully! Reloading...');
          window.location.reload();
        } else {
          alert('Failed to restore. Please check if file format is correct.');
        }
      } catch (err) {
        alert('Invalid JSON backup file. Error parsing data.');
        console.error(err);
      }
    };
    reader.readAsText(file);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>Reports & Backup Utility</h1>
          <p>Inspect active rosters, download backup log states, or print academy reports.</p>
        </div>
      </div>

      <div className="reports-grid">
        {/* Left Side: Select Report Card */}
        <div className="card report-controls-card">
          <h3 style={{ fontSize: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
            Academy Reports
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button 
              className={`btn ${selectedReport === 'students' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedReport('students')}
              style={{ justifyContent: 'flex-start' }}
            >
              <Users size={16} />
              Student Demographics
            </button>
            <button 
              className={`btn ${selectedReport === 'attendance' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedReport('attendance')}
              style={{ justifyContent: 'flex-start' }}
            >
              <Award size={16} />
              Attendance Audits
            </button>
            <button 
              className={`btn ${selectedReport === 'finance' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedReport('finance')}
              style={{ justifyContent: 'flex-start' }}
            >
              <DollarSign size={16} />
              Collections Ledger
            </button>
          </div>

          <h3 style={{ fontSize: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginTop: '16px' }}>
            Technical Backups
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button 
              className={`btn ${selectedReport === 'backup' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedReport('backup')}
              style={{ justifyContent: 'flex-start' }}
            >
              <ShieldCheck size={16} />
              Database Backup
            </button>
          </div>
        </div>

        {/* Right Side: Report Details Preview */}
        <div className="card report-preview-card">
          {/* 1. Student Demographics Report */}
          {selectedReport === 'students' && (
            <div>
              <div className="section-card-title">
                <h2>Student Demographics Audit</h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-secondary btn-sm" onClick={handlePrint}>
                    <Printer size={14} /> Print Report
                  </button>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="report-summary-boxes">
                <div className="report-summary-box">
                  <label>Total Registered</label>
                  <span>{studentReportData.list.length}</span>
                </div>
                <div className="report-summary-box">
                  <label>Active / Inactive</label>
                  <span style={{ color: 'var(--accent-green)' }}>{studentReportData.activeCount} <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>/ {studentReportData.inactiveCount}</span></span>
                </div>
                <div className="report-summary-box">
                  <label>Average Age</label>
                  <span>{studentReportData.avgAge} Yrs</span>
                </div>
                <div className="report-summary-box">
                  <label>Average Weight</label>
                  <span>{studentReportData.avgWeight} kg</span>
                </div>
              </div>

              {/* Table details */}
              <div className="table-container">
                <table className="data-table demographics-report-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Age</th>
                      <th>Weight</th>
                      <th>Batch</th>
                      <th>Joined Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentReportData.list.map(s => (
                      <tr key={s.id}>
                        <td style={{ fontWeight: '700' }}>{s.id}</td>
                        <td style={{ fontWeight: '600' }}>{s.name}</td>
                        <td>{s.age}</td>
                        <td>{s.weight} kg</td>
                        <td>{s.batch}</td>
                        <td>{s.joinDate}</td>
                        <td>
                          <span className={`badge ${s.status === 'Active' ? 'badge-active' : 'badge-inactive'}`}>
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 2. Attendance Performance Report */}
          {selectedReport === 'attendance' && (
            <div>
              <div className="section-card-title">
                <h2>Attendance Performance Audits</h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-secondary btn-sm" onClick={handlePrint}>
                    <Printer size={14} /> Print Report
                  </button>
                </div>
              </div>

              <div className="report-summary-boxes" style={{ gridTemplateColumns: '1fr' }}>
                <div className="report-summary-box" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left' }}>
                  <div>
                    <label>Gym-Wide Average Attendance Rate</label>
                    <span style={{ fontSize: '1.75rem', color: 'var(--accent-gold)' }}>{attendanceReportData.averageGymAttendance}%</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '300px' }}>
                    Calculated dynamically from active student classes logged this billing cycle.
                  </div>
                </div>
              </div>

              <div className="table-container">
                <table className="data-table attendance-report-table">
                  <thead>
                    <tr>
                      <th>Fighter Name</th>
                      <th>Batch Allocation</th>
                      <th style={{ textAlign: 'center' }}>Present Logs</th>
                      <th style={{ textAlign: 'center' }}>Absent Logs</th>
                      <th style={{ textAlign: 'center' }}>Total Classes</th>
                      <th style={{ textAlign: 'right' }}>Attendance Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceReportData.list.map(s => (
                      <tr key={s.id}>
                        <td>
                          <div style={{ fontWeight: '600' }}>{s.name}</div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.id}</span>
                        </td>
                        <td>{s.batch}</td>
                        <td style={{ textAlign: 'center', color: 'var(--accent-green)', fontWeight: '600' }}>{s.present}</td>
                        <td style={{ textAlign: 'center', color: 'var(--accent-red)', fontWeight: '600' }}>{s.absent}</td>
                        <td style={{ textAlign: 'center' }}>{s.total}</td>
                        <td style={{ textAlign: 'right', fontWeight: '800' }}>
                          <span style={{
                            color: s.rate >= 80 ? 'var(--accent-green)' : s.rate >= 50 ? 'var(--accent-gold)' : 'var(--accent-red)'
                          }}>
                            {s.rate}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. Financial Collections Report */}
          {selectedReport === 'finance' && (
            <div>
              <div className="section-card-title">
                <h2>June Collections & Outstanding Ledger</h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-secondary btn-sm" onClick={handlePrint}>
                    <Printer size={14} /> Print Report
                  </button>
                </div>
              </div>

              {/* Finance figures */}
              <div className="report-summary-boxes">
                <div className="report-summary-box">
                  <label>June Revenue Collected</label>
                  <span style={{ color: 'var(--accent-green)' }}>${financeReportData.juneCollected}</span>
                </div>
                <div className="report-summary-box">
                  <label>Total Outstanding June Fees</label>
                  <span style={{ color: 'var(--accent-gold)' }}>${financeReportData.totalOutstanding}</span>
                </div>
                <div className="report-summary-box">
                  <label>Total Transactions Logged</label>
                  <span>{financeReportData.paymentsCount}</span>
                </div>
              </div>

              <h3 style={{ fontSize: '1rem', marginBottom: '12px' }}>Outstanding June Debt List</h3>
              <div className="table-container">
                <table className="data-table financial-report-table">
                  <thead>
                    <tr>
                      <th>Fighter Name</th>
                      <th>Batch Allocation</th>
                      <th>Outstanding Fee</th>
                      <th>Contact Phone</th>
                      <th style={{ textAlign: 'right' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {financeReportData.dueList.length > 0 ? (
                      financeReportData.dueList.map(s => (
                        <tr key={s.id}>
                          <td>
                            <div style={{ fontWeight: '600' }}>{s.name}</div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {s.id}</span>
                          </td>
                          <td>{s.batch}</td>
                          <td style={{ fontWeight: '700', color: 'var(--accent-red)' }}>${s.amount}</td>
                          <td>{s.phone}</td>
                          <td style={{ textAlign: 'right' }}>
                            <span className="badge badge-due">Pending Payment</span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                          No outstanding debts for this cycle! All clear.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. Technical Database Backups */}
          {selectedReport === 'backup' && (
            <div style={{ padding: '10px 0' }}>
              <div className="section-card-title">
                <h2>Technical System Backups</h2>
              </div>
              
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '24px' }}>
                Manage local database dumps. Download files to transfer gym logs across devices, or upload previous configuration matrices. Wiping the database resets records back to clean seed details.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Download Card */}
                <div style={{
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255,255,255,0.01)'
                }}>
                  <div>
                    <h4 style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '4px' }}>Export Complete Database</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Downloads student roster, trainer stats, attendance histories, and bills as a JSON payload.</p>
                  </div>
                  <button className="btn btn-primary" onClick={handleBackupDownload}>
                    <Download size={16} />
                    Export Backup File
                  </button>
                </div>

                {/* Upload Card */}
                <div style={{
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255,255,255,0.01)'
                }}>
                  <div>
                    <h4 style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '4px' }}>Import Database Backup</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Upload an exported <code>.json</code> archive file to restore the entire academy state. Warning: overrides active configurations.</p>
                  </div>
                  <div>
                    <input 
                      type="file" 
                      accept=".json" 
                      ref={fileInputRef} 
                      onChange={handleBackupUpload} 
                      style={{ display: 'none' }} 
                    />
                    <button className="btn btn-secondary" onClick={() => fileInputRef.current.click()}>
                      <Upload size={16} />
                      Import Backup File
                    </button>
                  </div>
                </div>

                {/* Wipe Card */}
                <div style={{
                  border: '1px solid rgba(220, 38, 38, 0.3)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: 'rgba(220, 38, 38, 0.03)'
                }}>
                  <div>
                    <h4 style={{ fontWeight: '700', fontSize: '1rem', color: '#f87171', marginBottom: '4px' }}>Danger Zone: Reset System</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Deletes all current modifications, transactions, and check-ins, restoring the clean factory seed database.</p>
                  </div>
                  <button className="btn btn-danger" onClick={() => {
                    if (window.confirm('WARNING: Proceeding will wipe all custom student profiles, payment collections, and check-in logs. Restoring factory settings. Confirm database format?')) {
                      onDatabaseReset();
                    }
                  }}>
                    <RefreshCw size={16} />
                    Factory Reset Database
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
