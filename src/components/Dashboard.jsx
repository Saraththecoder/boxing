import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  DollarSign, 
  CalendarCheck, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  Activity, 
  Award,
  Zap,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Megaphone
} from 'lucide-react';

export default function Dashboard({ 
  students, 
  payments, 
  attendance, 
  activities,
  onNavigate 
}) {
  
  // --- Round-Bell Timer State & Loop ---
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes (180s)
  const [timerRunning, setTimerRunning] = useState(false);
  const [bellTriggered, setBellTriggered] = useState(false);

  useEffect(() => {
    let interval = null;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Bell Rings! Round increments
      setTimerRunning(false);
      setBellTriggered(true);
      
      // Auto reset bell animation after 3 seconds
      setTimeout(() => {
        setBellTriggered(false);
      }, 3000);

      // Increment Round (up to 3, then wrap)
      setRound(prev => (prev >= 3 ? 1 : prev + 1));
      setTimeLeft(180); // Reset to 3 minutes
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, timeLeft]);

  // Formatter: Seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Reset Timer
  const handleResetTimer = () => {
    setTimerRunning(false);
    setTimeLeft(180);
    setRound(1);
    setBellTriggered(false);
  };

  // --- Dynamic Stats Calculations ---
  const stats = useMemo(() => {
    const total = students.length;
    const active = students.filter(s => s.status === 'Active').length;
    const activeRate = total > 0 ? Math.round((active / total) * 100) : 0;
    
    const junePayments = payments.filter(p => p.monthFor === "2026-06" && p.status === 'Paid');
    const currentRevenue = junePayments.reduce((sum, p) => sum + p.amount, 0);
    
    const mayPayments = payments.filter(p => p.monthFor === "2026-05" && p.status === 'Paid');
    const mayRevenue = mayPayments.reduce((sum, p) => sum + p.amount, 0);
    const revenueGrowth = mayRevenue > 0 ? Math.round(((currentRevenue - mayRevenue) / mayRevenue) * 100) : 0;
    
    const todayStr = "2026-06-25";
    const todayRecords = attendance.filter(a => a.date === todayStr);
    const presentToday = todayRecords.filter(a => a.status === 'Present').length;
    const todayTotalChecked = todayRecords.length;
    const todayAttendanceRate = todayTotalChecked > 0 ? Math.round((presentToday / todayTotalChecked) * 100) : 0;

    const paidStudentIdsInJune = junePayments.map(p => p.studentId);
    let pendingCount = 0;
    let pendingAmount = 0;
    
    students.forEach(s => {
      if (s.status === 'Active' && !paidStudentIdsInJune.includes(s.id)) {
        pendingCount++;
        pendingAmount += (s.feeAmount || 80);
      }
    });

    return {
      total,
      active,
      activeRate,
      currentRevenue,
      revenueGrowth,
      todayAttendanceRate,
      presentToday,
      todayTotalChecked,
      pendingCount,
      pendingAmount
    };
  }, [students, payments, attendance]);

  // --- Revenue Chart Rendering Data ---
  const monthlyRevenueChartData = useMemo(() => {
    const months = [
      { label: "Jan", key: "2026-01", amount: 480 },
      { label: "Feb", key: "2026-02", amount: 620 },
      { label: "Mar", key: "2026-03", amount: 550 },
      { label: "Apr", key: "2026-04", amount: 780 },
      { label: "May", key: "2026-05", amount: 980 },
      { label: "Jun", key: "2026-06", amount: 0 }
    ];

    const juneTotal = payments
      .filter(p => p.monthFor === "2026-06" && p.status === 'Paid')
      .reduce((sum, p) => sum + p.amount, 0);
    
    months[5].amount = juneTotal;
    
    months.forEach((m, idx) => {
      if (idx < 5) {
        const matchingPayments = payments.filter(p => p.monthFor === m.key && p.status === 'Paid');
        if (matchingPayments.length > 0) {
          m.amount = matchingPayments.reduce((sum, p) => sum + p.amount, 0);
        }
      }
    });

    const maxVal = Math.max(...months.map(m => m.amount), 1000);

    return {
      months,
      maxVal
    };
  }, [payments]);

  // --- Squad Splits breakdown ---
  const batchStats = useMemo(() => {
    const batches = {
      "Morning Warriors": 0,
      "Elite Competitors": 0,
      "Evening Beginners": 0
    };
    
    students.forEach(s => {
      if (s.status === 'Active' && batches[s.batch] !== undefined) {
        batches[s.batch]++;
      }
    });

    return Object.entries(batches);
  }, [students]);

  return (
    <div>
      {/* 1. Animated Broadcast Alert Ticker */}
      <div className="arena-ticker-wrap">
        <div className="arena-ticker-badge">
          <Megaphone size={12} style={{ marginRight: '6px', transform: 'skewX(-10deg)' }} />
          Broadcast Alerts
        </div>
        <div className="arena-ticker">
          <div className="arena-ticker-item">
            🏆 <span>SPARRING GALAS ENTRIES:</span> SUBMIT MEDICAL WEIGHT CLAIMS TO OFFICE BY FRIDAY 06 PM
          </div>
          <div className="arena-ticker-item">
            ⚡ <span>RANKINGS UPDATE:</span> APEX ATHLETES CAPTURE 5 REGIONAL BELTS IN DIVISIONALS
          </div>
          <div className="arena-ticker-item">
            📅 <span>HOLIDAY SCHEDULING:</span> GYM CLOSED ON JULY 4TH FOR INDEPENDENCE DAY CELEBRATIONS
          </div>
          <div className="arena-ticker-item">
            🔥 <span>TKO VICTORY:</span> CONGRATS TO MARCUS 'THE HAMMER' VANCE ON HIS SECOND ROUND KNOCKOUT
          </div>
          {/* Loop duplicate to guarantee continuous scroll */}
          <div className="arena-ticker-item">
            🏆 <span>SPARRING GALAS ENTRIES:</span> SUBMIT MEDICAL WEIGHT CLAIMS TO OFFICE BY FRIDAY 06 PM
          </div>
          <div className="arena-ticker-item">
            ⚡ <span>RANKINGS UPDATE:</span> APEX ATHLETES CAPTURE 5 REGIONAL BELTS IN DIVISIONALS
          </div>
        </div>
      </div>

      {/* Page Header */}
      <div className="page-header" style={{ marginTop: '10px' }}>
        <div className="page-title">
          <h1>Apex Arena Console</h1>
          <p>Real-time visual monitoring of fighters, schedules, and collections.</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-outline" 
            onClick={() => onNavigate('attendance')}
            style={{ borderColor: 'var(--accent-green)', color: 'var(--accent-green)' }}
          >
            <CalendarCheck size={18} />
            Check-In Roster
          </button>
          <button className="btn btn-primary" onClick={() => onNavigate('students')}>
            <Users size={18} />
            Register Student
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="kpi-grid">
        <div className="card kpi-card red">
          <div className="kpi-details">
            <h3>Active Fighters</h3>
            <div className="kpi-value">{stats.active} <span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>/ {stats.total}</span></div>
            <div className="kpi-subtext">
              <span className="trend-up"><TrendingUp size={12} /> {stats.activeRate}% squad rate</span>
            </div>
          </div>
          <div className="kpi-icon">
            <Users size={24} />
          </div>
        </div>

        <div className="card kpi-card green">
          <div className="kpi-details">
            <h3>Revenue Collections</h3>
            <div className="kpi-value">${stats.currentRevenue}</div>
            <div className="kpi-subtext">
              <span className={stats.revenueGrowth >= 0 ? "trend-up" : "trend-down"}>
                <TrendingUp size={12} style={{ transform: stats.revenueGrowth < 0 ? 'rotate(180deg)' : 'none' }} /> 
                {stats.revenueGrowth >= 0 ? '+' : ''}{stats.revenueGrowth}% vs May
              </span>
            </div>
          </div>
          <div className="kpi-icon">
            <DollarSign size={24} />
          </div>
        </div>

        <div className="card kpi-card blue">
          <div className="kpi-details">
            <h3>Rostered Check-Ins</h3>
            <div className="kpi-value">{stats.todayAttendanceRate}%</div>
            <div className="kpi-subtext">
              <span className="trend-neutral">
                {stats.presentToday} present / {stats.todayTotalChecked} total
              </span>
            </div>
          </div>
          <div className="kpi-icon">
            <CalendarCheck size={24} />
          </div>
        </div>

        <div className="card kpi-card gold">
          <div className="kpi-details">
            <h3>Outstanding Debts</h3>
            <div className="kpi-value">${stats.pendingAmount}</div>
            <div className="kpi-subtext">
              <span className="trend-down" style={{ color: 'var(--accent-gold)' }}>
                <AlertTriangle size={12} /> {stats.pendingCount} rosters due
              </span>
            </div>
          </div>
          <div className="kpi-icon">
            <AlertTriangle size={24} />
          </div>
        </div>
      </div>

      {/* Main Charts & Activity Row */}
      <div className="dashboard-layout">
        {/* Left Card: Revenue Stream Chart */}
        <div className="card">
          <div className="section-card-title">
            <h2>
              <DollarSign size={20} style={{ color: 'var(--accent-red)' }} />
              Academy Financial Stream
            </h2>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('reports')}>
              Financial Ledger
            </button>
          </div>

          <div className="chart-container">
            <div className="chart-y-axis">
              <span>${Math.round(monthlyRevenueChartData.maxVal)}</span>
              <span>${Math.round(monthlyRevenueChartData.maxVal / 2)}</span>
              <span>$0</span>
            </div>
            
            <div className="bar-chart" style={{ paddingLeft: '50px' }}>
              {monthlyRevenueChartData.months.map((m) => {
                const pct = (m.amount / monthlyRevenueChartData.maxVal) * 100;
                return (
                  <div key={m.label} className="chart-bar-wrapper">
                    <div 
                      className="chart-bar" 
                      style={{ 
                        height: `${pct}%`,
                        background: m.label === 'Jun' 
                          ? 'linear-gradient(180deg, var(--accent-gold) 0%, rgba(255, 215, 0, 0.2) 100%)'
                          : undefined
                      }}
                    >
                      <div className="chart-tooltip">${m.amount}</div>
                    </div>
                    <div className="chart-label">{m.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Card: Interactive Round Bell Timer */}
        <div className="card timer-widget">
          {bellTriggered && (
            <div style={{
              position: 'absolute',
              top: '10px',
              backgroundColor: 'var(--accent-gold)',
              color: 'black',
              padding: '4px 12px',
              borderRadius: '4px',
              fontFamily: 'var(--font-headings)',
              fontWeight: '900',
              fontStyle: 'italic',
              fontSize: '0.8rem',
              animation: 'pulseLight 0.5s infinite alternate',
              zIndex: 5
            }}>
              🔔 DING DING DING! ROUND OVER
            </div>
          )}
          
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '1rem', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Volume2 size={16} style={{ color: 'var(--accent-red)' }} />
              Ringside Sparring Timer
            </h2>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className="timer-light" style={{
                backgroundColor: timerRunning ? 'var(--accent-red)' : 'var(--text-muted)',
                boxShadow: timerRunning ? '0 0 10px var(--accent-red)' : 'none',
                animation: timerRunning ? 'pulseLight 0.6s infinite alternate' : 'none'
              }}></div>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase' }}>
                {timerRunning ? 'Session Live' : 'Paused'}
              </span>
            </div>
          </div>

          <div className="timer-led-screen">
            <div className="timer-round-indicator">ROUND {round} / 3</div>
            <div className="timer-digits">{formatTime(timeLeft)}</div>
          </div>

          <div style={{ display: 'flex', gap: '10px', width: '100%', marginTop: '16px' }}>
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={() => setTimerRunning(!timerRunning)}
              style={{ flexGrow: 1, gap: '6px' }}
            >
              {timerRunning ? <Pause size={12} /> : <Play size={12} />}
              {timerRunning ? 'Pause' : 'Start'}
            </button>
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={handleResetTimer}
              style={{ padding: '6px 12px' }}
              title="Reset Round-Bell Timer"
            >
              <RotateCcw size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Row 3: Squad Splits & Activity Feed Split */}
      <div className="dashboard-split-layout">
        {/* Left Side: Squad Splits */}
        <div className="card">
          <div className="section-card-title">
            <h2>
              <Zap size={20} style={{ color: 'var(--accent-gold)' }} />
              Active Splits
            </h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '12px' }}>
            {batchStats.map(([batchName, count]) => {
              const totalActive = stats.active || 1;
              const percent = Math.round((count / totalActive) * 100);
              return (
                <div key={batchName}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.8rem' }}>
                    <span style={{ fontWeight: '700' }}>{batchName}</span>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>{count} Fighters</span>
                  </div>
                  <div style={{ 
                    height: '6px', 
                    backgroundColor: 'rgba(255,255,255,0.02)', 
                    borderRadius: '3px',
                    overflow: 'hidden',
                    border: '1px solid var(--border-color)'
                  }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${percent}%`,
                      borderRadius: '3px',
                      background: batchName === 'Elite Competitors' 
                        ? 'var(--accent-red)' 
                        : batchName === 'Morning Warriors' 
                          ? 'var(--accent-blue)' 
                          : 'var(--accent-gold)',
                    }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Recent Activity Feed */}
        <div className="card">
          <div className="section-card-title">
            <h2>
              <Activity size={20} style={{ color: 'var(--accent-blue)' }} />
              Gym Log feed
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              <Clock size={10} />
              Synced live
            </div>
          </div>

          <div className="activity-list">
            {activities.length > 0 ? (
              activities.map((act) => (
                <div key={act.id} className={`activity-item ${act.type}`}>
                  <div className="activity-icon-indicator">
                    {act.type === 'success' && <DollarSign size={12} />}
                    {act.type === 'info' && <Activity size={12} />}
                    {act.type === 'danger' && <AlertTriangle size={12} />}
                    {act.type === 'warning' && <Clock size={12} />}
                  </div>
                  <div className="activity-details">
                    <p>{act.text}</p>
                    <div className="activity-time">{act.time}</div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                No active events logged today.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
