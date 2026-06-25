import React, { useState, useMemo } from 'react';
import { 
  Check, 
  X, 
  Calendar, 
  Users, 
  Award, 
  History,
  ClipboardList
} from 'lucide-react';

export default function AttendanceManager({ 
  students, 
  trainers, 
  attendance, 
  trainerAttendance, 
  onSaveAttendance, 
  onSaveTrainerAttendance 
}) {
  const [activeTab, setActiveTab] = useState('daily'); // 'daily', 'trainers', 'history', 'reports'
  const [selectedDate, setSelectedDate] = useState('2026-06-25'); // Default to current mock date

  // Daily Student Check-In Filtering (only active students are rostered)
  const activeStudents = useMemo(() => {
    return students.filter(s => s.status === 'Active');
  }, [students]);

  // Map student attendance status for selectedDate
  const dailyAttendanceMap = useMemo(() => {
    const map = {};
    attendance.forEach(rec => {
      if (rec.date === selectedDate) {
        map[rec.studentId] = rec.status;
      }
    });
    return map;
  }, [attendance, selectedDate]);

  // Trainer attendance map
  const trainerAttendanceMap = useMemo(() => {
    const map = {};
    trainerAttendance.forEach(rec => {
      if (rec.date === selectedDate) {
        map[rec.trainerId] = rec.status;
      }
    });
    return map;
  }, [trainerAttendance, selectedDate]);

  // Summary Metrics for selectedDate
  const metrics = useMemo(() => {
    const totalRostered = activeStudents.length;
    let present = 0;
    let absent = 0;
    let unmarked = 0;

    activeStudents.forEach(s => {
      const status = dailyAttendanceMap[s.id];
      if (status === 'Present') present++;
      else if (status === 'Absent') absent++;
      else unmarked++;
    });

    const rate = (present + absent) > 0 ? Math.round((present / (present + absent)) * 100) : 0;

    return {
      totalRostered,
      present,
      absent,
      unmarked,
      rate
    };
  }, [activeStudents, dailyAttendanceMap]);

  // Mark student attendance
  const handleMarkStudent = (studentId, status) => {
    onSaveAttendance({
      studentId,
      date: selectedDate,
      status
    });
  };

  // Mark trainer attendance
  const handleMarkTrainer = (trainerId, status) => {
    onSaveTrainerAttendance({
      trainerId,
      date: selectedDate,
      status
    });
  };

  // Mark all rostered students as present (convenience helper)
  const handleMarkAllPresent = () => {
    activeStudents.forEach(s => {
      if (!dailyAttendanceMap[s.id]) {
        handleMarkStudent(s.id, 'Present');
      }
    });
  };

  // Monthly Attendance Reports calculations
  const monthlyReports = useMemo(() => {
    const reportList = [];
    
    // Group attendance records by student
    const studentRecords = {};
    attendance.forEach(rec => {
      if (!studentRecords[rec.studentId]) {
        studentRecords[rec.studentId] = [];
      }
      studentRecords[rec.studentId].push(rec);
    });

    activeStudents.forEach(student => {
      const recs = studentRecords[student.id] || [];
      const presentCount = recs.filter(r => r.status === 'Present').length;
      const absentCount = recs.filter(r => r.status === 'Absent').length;
      const total = presentCount + absentCount;
      const rate = total > 0 ? Math.round((presentCount / total) * 100) : 0;

      reportList.push({
        id: student.id,
        name: student.name,
        batch: student.batch,
        present: presentCount,
        absent: absentCount,
        totalClasses: total,
        rate
      });
    });

    return reportList;
  }, [students, attendance, activeStudents]);

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>Attendance Management</h1>
          <p>Track student and trainer daily attendance, view historic logs, and analyze monthly ratios.</p>
        </div>
        <div className="header-actions">
          <div className="form-group" style={{ margin: 0, flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} style={{ color: 'var(--accent-red)' }} />
            <input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{ padding: '8px 12px' }}
              aria-label="Attendance Date Selector"
            />
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-color)', marginBottom: '24px' }}>
        <button 
          onClick={() => setActiveTab('daily')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'daily' ? '2px solid var(--accent-red)' : '2px solid transparent',
            color: activeTab === 'daily' ? 'var(--text-primary)' : 'var(--text-secondary)',
            padding: '12px 16px',
            cursor: 'pointer',
            fontWeight: '600',
            fontFamily: 'var(--font-headings)'
          }}
        >
          Student Check-In
        </button>
        <button 
          onClick={() => setActiveTab('trainers')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'trainers' ? '2px solid var(--accent-red)' : '2px solid transparent',
            color: activeTab === 'trainers' ? 'var(--text-primary)' : 'var(--text-secondary)',
            padding: '12px 16px',
            cursor: 'pointer',
            fontWeight: '600',
            fontFamily: 'var(--font-headings)'
          }}
        >
          Trainer Check-In
        </button>
        <button 
          onClick={() => setActiveTab('reports')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'reports' ? '2px solid var(--accent-red)' : '2px solid transparent',
            color: activeTab === 'reports' ? 'var(--text-primary)' : 'var(--text-secondary)',
            padding: '12px 16px',
            cursor: 'pointer',
            fontWeight: '600',
            fontFamily: 'var(--font-headings)'
          }}
        >
          Monthly Ratios Report
        </button>
      </div>

      {/* Tab 1: Student Check-In */}
      {activeTab === 'daily' && (
        <div>
          {/* Quick Metrics Grid */}
          <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '24px' }}>
            <div className="card kpi-card" style={{ padding: '16px' }}>
              <div className="kpi-details">
                <h3 style={{ fontSize: '0.75rem' }}>Rostered Boxers</h3>
                <div className="kpi-value" style={{ fontSize: '1.5rem' }}>{metrics.totalRostered}</div>
              </div>
              <Users size={18} style={{ color: 'var(--text-muted)' }} />
            </div>

            <div className="card kpi-card" style={{ padding: '16px' }}>
              <div className="kpi-details">
                <h3 style={{ fontSize: '0.75rem', color: 'var(--accent-green)' }}>Present Today</h3>
                <div className="kpi-value" style={{ fontSize: '1.5rem', color: 'var(--accent-green)' }}>{metrics.present}</div>
              </div>
              <Check size={18} style={{ color: 'var(--accent-green)' }} />
            </div>

            <div className="card kpi-card" style={{ padding: '16px' }}>
              <div className="kpi-details">
                <h3 style={{ fontSize: '0.75rem', color: 'var(--accent-red)' }}>Absent Today</h3>
                <div className="kpi-value" style={{ fontSize: '1.5rem', color: 'var(--accent-red)' }}>{metrics.absent}</div>
              </div>
              <X size={18} style={{ color: 'var(--accent-red)' }} />
            </div>

            <div className="card kpi-card" style={{ padding: '16px' }}>
              <div className="kpi-details">
                <h3 style={{ fontSize: '0.75rem', color: 'var(--accent-gold)' }}>Daily Attendance Rate</h3>
                <div className="kpi-value" style={{ fontSize: '1.5rem', color: 'var(--accent-gold)' }}>{metrics.rate}%</div>
              </div>
              <Award size={18} style={{ color: 'var(--accent-gold)' }} />
            </div>
          </div>

          {/* Daily Sheet Card */}
          <div className="card">
            <div className="section-card-title">
              <h2>
                <ClipboardList size={20} style={{ color: 'var(--accent-red)' }} />
                Roster Sheet for {selectedDate}
              </h2>
              {metrics.unmarked > 0 && (
                <button className="btn btn-secondary btn-sm" onClick={handleMarkAllPresent}>
                  Mark All Remaining Present
                </button>
              )}
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Fighter Name</th>
                    <th>Batch Allocation</th>
                    <th>Weight Class</th>
                    <th>Attendance Status</th>
                    <th style={{ textAlign: 'right' }}>Logging Action</th>
                  </tr>
                </thead>
                <tbody>
                  {activeStudents.map(student => {
                    const status = dailyAttendanceMap[student.id];
                    return (
                      <tr key={student.id}>
                        <td>
                          <div style={{ fontWeight: '600' }}>{student.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {student.id}</div>
                        </td>
                        <td>{student.batch}</td>
                        <td>{student.weight} kg</td>
                        <td>
                          {status ? (
                            <span className={`badge ${status === 'Present' ? 'badge-present' : 'badge-absent'}`}>
                              {status}
                            </span>
                          ) : (
                            <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.03)', color: 'var(--text-muted)' }}>
                              Unmarked
                            </span>
                          )}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button
                              className={`btn btn-sm ${status === 'Present' ? 'btn-primary' : 'btn-secondary'}`}
                              onClick={() => handleMarkStudent(student.id, 'Present')}
                              style={{ 
                                backgroundColor: status === 'Present' ? 'var(--accent-green)' : undefined,
                                borderColor: status === 'Present' ? 'var(--accent-green)' : undefined,
                                padding: '6px 12px'
                              }}
                            >
                              <Check size={14} />
                              Present
                            </button>
                            <button
                              className={`btn btn-sm ${status === 'Absent' ? 'btn-primary' : 'btn-secondary'}`}
                              onClick={() => handleMarkStudent(student.id, 'Absent')}
                              style={{ 
                                backgroundColor: status === 'Absent' ? 'var(--accent-red)' : undefined,
                                borderColor: status === 'Absent' ? 'var(--accent-red)' : undefined,
                                padding: '6px 12px'
                              }}
                            >
                              <X size={14} />
                              Absent
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Trainer Check-In */}
      {activeTab === 'trainers' && (
        <div className="card">
          <div className="section-card-title">
            <h2>Trainer Staff Roster: {selectedDate}</h2>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Trainer Name</th>
                  <th>Academy Role</th>
                  <th>System Status</th>
                  <th>Attendance Status</th>
                  <th style={{ textAlign: 'right' }}>Logging Action</th>
                </tr>
              </thead>
              <tbody>
                {trainers.map(trainer => {
                  const status = trainerAttendanceMap[trainer.id];
                  return (
                    <tr key={trainer.id}>
                      <td>
                        <div style={{ fontWeight: '600' }}>{trainer.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {trainer.id}</div>
                      </td>
                      <td style={{ fontWeight: '600', color: 'var(--accent-gold)' }}>{trainer.role}</td>
                      <td>
                        <span className="badge badge-active">{trainer.status}</span>
                      </td>
                      <td>
                        {status ? (
                          <span className={`badge ${status === 'Present' ? 'badge-present' : 'badge-absent'}`}>
                            {status}
                          </span>
                        ) : (
                          <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.03)', color: 'var(--text-muted)' }}>
                            Unmarked
                          </span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button
                            className={`btn btn-sm ${status === 'Present' ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => handleMarkTrainer(trainer.id, 'Present')}
                            style={{ 
                              backgroundColor: status === 'Present' ? 'var(--accent-green)' : undefined,
                              borderColor: status === 'Present' ? 'var(--accent-green)' : undefined,
                              padding: '6px 12px'
                            }}
                          >
                            <Check size={14} />
                            Present
                          </button>
                          <button
                            className={`btn btn-sm ${status === 'Absent' ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => handleMarkTrainer(trainer.id, 'Absent')}
                            style={{ 
                              backgroundColor: status === 'Absent' ? 'var(--accent-red)' : undefined,
                              borderColor: status === 'Absent' ? 'var(--accent-red)' : undefined,
                              padding: '6px 12px'
                            }}
                          >
                            <X size={14} />
                            Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Monthly Ratios Report */}
      {activeTab === 'reports' && (
        <div className="card">
          <div className="section-card-title">
            <h2>Fighter Attendance Ratio (Monthly Breakdown)</h2>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Fighter Name</th>
                  <th>Batch Allocation</th>
                  <th style={{ textAlign: 'center' }}>Present Classes</th>
                  <th style={{ textAlign: 'center' }}>Absent Classes</th>
                  <th style={{ textAlign: 'center' }}>Total Classes</th>
                  <th style={{ textAlign: 'right' }}>Attendance Rate</th>
                </tr>
              </thead>
              <tbody>
                {monthlyReports.map(rep => (
                  <tr key={rep.id}>
                    <td>
                      <div style={{ fontWeight: '600' }}>{rep.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {rep.id}</div>
                    </td>
                    <td>{rep.batch}</td>
                    <td style={{ textAlign: 'center', color: 'var(--accent-green)', fontWeight: '600' }}>{rep.present}</td>
                    <td style={{ textAlign: 'center', color: 'var(--accent-red)', fontWeight: '600' }}>{rep.absent}</td>
                    <td style={{ textAlign: 'center', fontWeight: '600' }}>{rep.totalClasses}</td>
                    <td style={{ textAlign: 'right', fontWeight: '800' }}>
                      <span style={{
                        color: rep.rate >= 80 ? 'var(--accent-green)' : rep.rate >= 50 ? 'var(--accent-gold)' : 'var(--accent-red)'
                      }}>
                        {rep.rate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
