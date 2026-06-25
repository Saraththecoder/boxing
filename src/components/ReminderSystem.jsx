import React, { useState, useMemo } from 'react';
import { 
  Bell, 
  Send, 
  MessageSquare, 
  Mail, 
  AlertTriangle, 
  Check, 
  Clock, 
  Smartphone 
} from 'lucide-react';

export default function ReminderSystem({ students, payments, onTriggerReminder }) {
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'overdue', 'due', 'upcoming'
  const [selectedTemplate, setSelectedTemplate] = useState('sms'); // 'sms', 'whatsapp', 'email'

  // Calculate current June 2026 payment states
  const remindersList = useMemo(() => {
    const active = students.filter(s => s.status === 'Active');
    const junePayments = payments.filter(p => p.monthFor === '2026-06' && p.status === 'Paid');
    const paidStudentIds = junePayments.map(p => p.studentId);

    const list = [];

    active.forEach(student => {
      const isPaid = paidStudentIds.includes(student.id);
      
      if (!isPaid) {
        // Evaluate if due or overdue based on joinDate
        const joinDate = new Date(student.joinDate);
        const thresholdDate = new Date("2026-05-15");
        const statusType = joinDate < thresholdDate ? 'Overdue' : 'Due';
        const daysOverdue = statusType === 'Overdue' ? 10 : 0; // Simulated overdue days

        list.push({
          id: student.id,
          name: student.name,
          phone: student.phone,
          email: student.email,
          feeAmount: student.feeAmount,
          status: statusType,
          daysOverdue,
          message: statusType === 'Overdue' 
            ? `URGENT ALERT: Fighter ${student.name}, your membership payment of $${student.feeAmount} is ${daysOverdue} days OVERDUE. Sparring privileges will be suspended. Please clear immediately at the ringside reception.`
            : `NOTICE: Fighter ${student.name}, your membership fee of $${student.feeAmount} is due. Please process payment online or at the academy.`
        });
      } else {
        // If paid, they are classified under 'Upcoming' for next month July 2026
        list.push({
          id: student.id,
          name: student.name,
          phone: student.phone,
          email: student.email,
          feeAmount: student.feeAmount,
          status: 'Upcoming',
          daysOverdue: 0,
          message: `INFO: Fighter ${student.name}, your membership fee of $${student.feeAmount} is scheduled to renew for July 2026 cycle on 2026-07-01.`
        });
      }
    });

    return list;
  }, [students, payments]);

  // Count summaries
  const counts = useMemo(() => {
    let overdue = 0;
    let due = 0;
    let upcoming = 0;

    remindersList.forEach(r => {
      if (r.status === 'Overdue') overdue++;
      else if (r.status === 'Due') due++;
      else upcoming++;
    });

    return { overdue, due, upcoming };
  }, [remindersList]);

  // Filter list
  const filteredReminders = useMemo(() => {
    return remindersList.filter(r => {
      if (activeFilter === 'all') return true;
      return r.status.toLowerCase() === activeFilter;
    });
  }, [remindersList, activeFilter]);

  // Get message template preview based on type
  const getMessageTemplate = (recipientName, fee, status, days) => {
    if (selectedTemplate === 'sms') {
      if (status === 'Overdue') {
        return `[Apex Boxing Alert] Hi ${recipientName}, your fee of $${fee} is ${days} days overdue. Please clear it today to avoid sparring session blocks. Call (555) RING-SIDE.`;
      }
      return `[Apex Boxing Notice] Hi ${recipientName}, your training fee of $${fee} is due. You can pay via credit card, cash, or UPI. Thank you!`;
    } else if (selectedTemplate === 'whatsapp') {
      if (status === 'Overdue') {
        return `🥊 *APEX BOXING ACADEMY* 🥊\n\nHi *${recipientName}*,\n\nOur records show your quarterly/monthly membership fee of *$${fee}* is currently *${days} days OVERDUE*.\n\n⚠️ Please clear this at reception before your next sparring session.\n\n_Keep training, stay champions!_`;
      }
      return `🥊 *APEX BOXING ACADEMY* 🥊\n\nHi *${recipientName}*,\n\nThis is a friendly reminder that your training fee of *$${fee}* is due for this cycle.\n\n💳 You can pay at the reception or via the payment link. Thank you!`;
    } else {
      // Email template
      if (status === 'Overdue') {
        return `Subject: URGENT: Overdue Membership Payment - Apex Boxing Academy\n\nDear ${recipientName},\n\nThis is an automated security notice. Your training fee of $${fee} has passed its due date by ${days} days.\n\nPlease note that sparring privileges and academy access will be suspended if the account remains unresolved.\n\nSincerely,\nAcademy Administration`;
      }
      return `Subject: Monthly Training Fee Reminder - Apex Boxing Academy\n\nDear ${recipientName},\n\nWe hope your training is progressing well! This email is a friendly reminder that your monthly membership subscription of $${fee} is due for this billing cycle.\n\nPayments can be completed at the main desk via credit card, cash, UPI, or through online bank transfer.\n\nBest Regards,\nApex Boxing Academy`;
    }
  };

  const handleSendReminder = (reminder, channel) => {
    const formattedMsg = getMessageTemplate(
      reminder.name, 
      reminder.feeAmount, 
      reminder.status, 
      reminder.daysOverdue
    );

    // Call callback to inject action toast
    onTriggerReminder(reminder, channel, formattedMsg);
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>Automated Fee Reminders</h1>
          <p>Deploy instant alerts directly to student devices via SMS, WhatsApp, or Email channels.</p>
        </div>
      </div>

      {/* Selector Filters */}
      <div className="reminders-split-layout">
        {/* Left Card: Channel Selector & Live Templates */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
            Template Channel
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button 
              className={`btn ${selectedTemplate === 'sms' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedTemplate('sms')}
              style={{ justifyContent: 'flex-start' }}
            >
              <Smartphone size={16} />
              Short SMS Template
            </button>
            <button 
              className={`btn ${selectedTemplate === 'whatsapp' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedTemplate('whatsapp')}
              style={{ 
                justifyContent: 'flex-start',
                backgroundColor: selectedTemplate === 'whatsapp' ? '#25d366' : undefined,
                borderColor: selectedTemplate === 'whatsapp' ? '#25d366' : undefined
              }}
            >
              <MessageSquare size={16} />
              WhatsApp Template
            </button>
            <button 
              className={`btn ${selectedTemplate === 'email' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedTemplate('email')}
              style={{ justifyContent: 'flex-start' }}
            >
              <Mail size={16} />
              Formal Email Template
            </button>
          </div>

          <div style={{
            backgroundColor: 'rgba(0,0,0,0.2)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            marginTop: '12px'
          }}>
            <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>
              Preview Output (Overdue sample)
            </h4>
            <div style={{ 
              fontSize: '0.75rem', 
              fontFamily: 'monospace', 
              whiteSpace: 'pre-wrap', 
              color: 'var(--text-primary)',
              lineHeight: '1.4'
            }}>
              {getMessageTemplate("Fighter Name", 150, "Overdue", 10)}
            </div>
          </div>
        </div>

        {/* Right Card: Alerts List */}
        <div className="card">
          <div className="section-card-title">
            <h2>Payment Status Reminders Queue</h2>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className={`btn btn-sm ${activeFilter === 'all' ? 'btn-outline' : 'btn-secondary'}`}
                onClick={() => setActiveFilter('all')}
              >
                All ({remindersList.length})
              </button>
              <button 
                className={`btn btn-sm ${activeFilter === 'overdue' ? 'btn-outline' : 'btn-secondary'}`}
                onClick={() => setActiveFilter('overdue')}
                style={{ color: '#f87171', borderColor: activeFilter === 'overdue' ? '#f87171' : undefined }}
              >
                Overdue ({counts.overdue})
              </button>
              <button 
                className={`btn btn-sm ${activeFilter === 'due' ? 'btn-outline' : 'btn-secondary'}`}
                onClick={() => setActiveFilter('due')}
                style={{ color: '#ffb703', borderColor: activeFilter === 'due' ? '#ffb703' : undefined }}
              >
                Due ({counts.due})
              </button>
              <button 
                className={`btn btn-sm ${activeFilter === 'upcoming' ? 'btn-outline' : 'btn-secondary'}`}
                onClick={() => setActiveFilter('upcoming')}
                style={{ color: '#60a5fa', borderColor: activeFilter === 'upcoming' ? '#60a5fa' : undefined }}
              >
                Upcoming ({counts.upcoming})
              </button>
            </div>
          </div>

          <div className="reminder-grid" style={{ marginTop: '20px' }}>
            {filteredReminders.length > 0 ? (
              filteredReminders.map(rem => (
                <div key={rem.id} className="card reminder-card" style={{ 
                  backgroundColor: 'rgba(255,255,255,0.01)',
                  borderColor: rem.status === 'Overdue' 
                    ? 'rgba(230, 57, 70, 0.25)' 
                    : rem.status === 'Due' 
                      ? 'rgba(255, 183, 3, 0.25)' 
                      : 'var(--border-color)'
                }}>
                  <div className="reminder-header-row">
                    <div>
                      <h3>{rem.name}</h3>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {rem.id}</span>
                    </div>
                    <span className={`badge ${
                      rem.status === 'Overdue' 
                        ? 'badge-overdue' 
                        : rem.status === 'Due' 
                          ? 'badge-due' 
                          : 'badge-active'
                    }`}>
                      {rem.status}
                    </span>
                  </div>

                  <div className="reminder-meta-list">
                    <div className="reminder-meta-item">
                      <span>Contract Fee:</span>
                      <span>${rem.feeAmount}</span>
                    </div>
                    <div className="reminder-meta-item">
                      <span>Contact:</span>
                      <span>{rem.phone}</span>
                    </div>
                    {rem.status === 'Overdue' && (
                      <div className="reminder-meta-item">
                        <span style={{ color: 'var(--accent-red)' }}>Days Past Due:</span>
                        <span style={{ color: 'var(--accent-red)' }}>{rem.daysOverdue} Days</span>
                      </div>
                    )}
                  </div>

                  <div className="reminder-actions">
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleSendReminder(rem, 'SMS')}
                      title="Send SMS notification alert"
                    >
                      <Send size={12} />
                      SMS
                    </button>
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleSendReminder(rem, 'WhatsApp')}
                      title="Send WhatsApp notification alert"
                      style={{ 
                        color: '#2ec4b6'
                      }}
                    >
                      <MessageSquare size={12} />
                      WhatsApp
                    </button>
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleSendReminder(rem, 'Email')}
                      title="Send Email notification alert"
                    >
                      <Mail size={12} />
                      Email
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                No records listed in this reminder queue.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
