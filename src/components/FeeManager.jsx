import React, { useState, useMemo } from 'react';
import { 
  DollarSign, 
  Check, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Printer, 
  X, 
  Search, 
  CreditCard 
} from 'lucide-react';

export default function FeeManager({ students, payments, onCollectFee }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('2026-06'); // Current billing cycle
  
  // Modals state
  const [isCollectOpen, setIsCollectOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState(null);
  const [collectingStudent, setCollectingStudent] = useState(null);

  // Collect Fee form state
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');

  // Compute student billing states for the selectedMonth
  const billingRoster = useMemo(() => {
    // Filter active students
    const active = students.filter(s => s.status === 'Active');
    
    // Find all payment records for this month
    const monthPaymentsMap = {};
    payments.forEach(p => {
      if (p.monthFor === selectedMonth && p.status === 'Paid') {
        monthPaymentsMap[p.studentId] = p;
      }
    });

    return active.map(student => {
      const paymentRecord = monthPaymentsMap[student.id];
      let status = 'Due';
      let payId = null;

      if (paymentRecord) {
        status = 'Paid';
        payId = paymentRecord.id;
      } else {
        // Simple mock rule: if they joined before 2026-05, we call them 'Overdue' (over 30 days outstanding)
        const joinDate = new Date(student.joinDate);
        const thresholdDate = new Date("2026-05-15");
        if (joinDate < thresholdDate) {
          status = 'Overdue';
        }
      }

      return {
        ...student,
        billingStatus: status,
        paymentRecordId: payId,
        paymentDate: paymentRecord ? paymentRecord.paymentDate : null,
        paymentMethod: paymentRecord ? paymentRecord.paymentMethod : null,
        receiptNumber: paymentRecord ? paymentRecord.receiptNumber : null
      };
    });
  }, [students, payments, selectedMonth]);

  // Summary figures
  const summary = useMemo(() => {
    let collected = 0;
    let outstanding = 0;
    let paidCount = 0;
    let pendingCount = 0;

    billingRoster.forEach(item => {
      if (item.billingStatus === 'Paid') {
        collected += item.feeAmount;
        paidCount++;
      } else {
        outstanding += item.feeAmount;
        pendingCount++;
      }
    });

    return {
      collected,
      outstanding,
      paidCount,
      pendingCount
    };
  }, [billingRoster]);

  // Filtered Roster
  const filteredRoster = useMemo(() => {
    return billingRoster.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || item.billingStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [billingRoster, searchTerm, statusFilter]);

  // Open collection modal
  const handleCollectOpen = (student) => {
    setCollectingStudent(student);
    setAmount(student.feeAmount);
    setPaymentMethod('Credit Card');
    setIsCollectOpen(true);
  };

  // Submit collected fee
  const handleCollectSubmit = (e) => {
    e.preventDefault();
    if (!collectingStudent) return;

    onCollectFee({
      studentId: collectingStudent.id,
      amount: parseFloat(amount) || collectingStudent.feeAmount,
      monthFor: selectedMonth,
      paymentMethod,
      status: 'Paid'
    });

    setIsCollectOpen(false);
    setCollectingStudent(null);
  };

  // Open receipt view
  const handleViewReceipt = (receiptId) => {
    const record = payments.find(p => p.id === receiptId);
    if (!record) return;

    const student = students.find(s => s.id === record.studentId);
    setActiveReceipt({
      ...record,
      studentName: student ? student.name : 'Unknown Fighter',
      studentEmail: student ? student.email : ''
    });
    setIsReceiptOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>Fee Management Panel</h1>
          <p>Collect monthly membership fees, print retro boxing receipts, and monitor outstanding debts.</p>
        </div>
        <div className="header-actions">
          <div className="form-group" style={{ margin: 0, flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
            <label htmlFor="billing-cycle-select" style={{ margin: 0 }}>Billing Cycle:</label>
            <select 
              id="billing-cycle-select"
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{ padding: '8px 12px' }}
            >
              <option value="2026-06">June 2026</option>
              <option value="2026-05">May 2026</option>
              <option value="2026-04">April 2026</option>
            </select>
          </div>
        </div>
      </div>

      {/* Billing KPI Cards */}
      <div className="kpi-grid-4" style={{ marginBottom: '24px' }}>
        <div className="card kpi-card green" style={{ padding: '16px' }}>
          <div className="kpi-details">
            <h3 style={{ fontSize: '0.75rem' }}>Total Collected</h3>
            <div className="kpi-value" style={{ fontSize: '1.5rem' }}>${summary.collected}</div>
          </div>
          <DollarSign size={18} />
        </div>

        <div className="card kpi-card gold" style={{ padding: '16px' }}>
          <div className="kpi-details">
            <h3 style={{ fontSize: '0.75rem' }}>Outstanding Dues</h3>
            <div className="kpi-value" style={{ fontSize: '1.5rem' }}>${summary.outstanding}</div>
          </div>
          <AlertTriangle size={18} />
        </div>

        <div className="card kpi-card" style={{ padding: '16px', borderLeft: '3px solid var(--accent-green)' }}>
          <div className="kpi-details">
            <h3 style={{ fontSize: '0.75rem' }}>Paid Fighters</h3>
            <div className="kpi-value" style={{ fontSize: '1.5rem' }}>{summary.paidCount}</div>
          </div>
          <Check size={18} style={{ color: 'var(--accent-green)' }} />
        </div>

        <div className="card kpi-card" style={{ padding: '16px', borderLeft: '3px solid var(--accent-red)' }}>
          <div className="kpi-details">
            <h3 style={{ fontSize: '0.75rem' }}>Pending Bills</h3>
            <div className="kpi-value" style={{ fontSize: '1.5rem' }}>{summary.pendingCount}</div>
          </div>
          <Clock size={18} style={{ color: 'var(--accent-red)' }} />
        </div>
      </div>

      {/* Roster & History Grid split */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Roster list */}
        <div className="card">
          <div className="section-card-title">
            <h2>Billing Ledger ({selectedMonth})</h2>
          </div>

          <div className="filters-bar">
            <div className="search-input-wrapper">
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search fighter by name or ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-selects">
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter billing roster by payment status"
              >
                <option value="All">All Transactions</option>
                <option value="Paid">Paid</option>
                <option value="Due">Due</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
          </div>

          <div className="table-container">
            <table className="data-table billing-ledger-table">
              <thead>
                <tr>
                  <th>Fighter Name</th>
                  <th>Contract Rate</th>
                  <th>Status</th>
                  <th>Payment Detail</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoster.length > 0 ? (
                  filteredRoster.map(item => (
                    <tr key={item.id}>
                      <td>
                        <div style={{ fontWeight: '600' }}>{item.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {item.id}</div>
                      </td>
                      <td style={{ fontWeight: '600' }}>${item.feeAmount} / {item.membershipType}</td>
                      <td>
                        <span className={`badge ${
                          item.billingStatus === 'Paid' 
                            ? 'badge-paid' 
                            : item.billingStatus === 'Due' 
                              ? 'badge-due' 
                              : 'badge-overdue'
                        }`}>
                          {item.billingStatus}
                        </span>
                      </td>
                      <td>
                        {item.billingStatus === 'Paid' ? (
                          <div>
                            <div style={{ fontSize: '0.85rem', fontWeight: '500' }}>{item.paymentMethod}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Date: {item.paymentDate}</div>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No transaction recorded</span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          {item.billingStatus === 'Paid' ? (
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleViewReceipt(item.paymentRecordId)}
                            >
                              <FileText size={14} />
                              View Receipt
                            </button>
                          ) : (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleCollectOpen(item)}
                              style={{ padding: '6px 12px' }}
                            >
                              <CreditCard size={14} />
                              Collect Fee
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                      No matching student bills found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* History payments card */}
        <div className="card">
          <div className="section-card-title">
            <h2>Payment Transactions Log (All-Time)</h2>
          </div>
          <div className="table-container">
            <table className="data-table payments-log-table">
              <thead>
                <tr>
                  <th>Receipt No</th>
                  <th>Fighter</th>
                  <th>Fee Cycle</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Paid Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[...payments].reverse().map(pay => {
                  const student = students.find(s => s.id === pay.studentId);
                  return (
                    <tr key={pay.id}>
                      <td style={{ fontFamily: 'monospace', fontWeight: '700' }}>{pay.receiptNumber}</td>
                      <td>{student ? student.name : 'Deleted Student'}</td>
                      <td>{pay.monthFor}</td>
                      <td style={{ fontWeight: '700', color: 'var(--accent-green)' }}>${pay.amount}</td>
                      <td>{pay.paymentMethod}</td>
                      <td>{pay.paymentDate}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleViewReceipt(pay.id)}
                          style={{ padding: '4px 8px' }}
                        >
                          <FileText size={12} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Collect Fee Modal */}
      {isCollectOpen && collectingStudent && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h2>Record Membership Payment</h2>
              <button className="close-btn" onClick={() => setIsCollectOpen(false)} aria-label="Close modal">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCollectSubmit}>
              <div className="modal-body">
                <div style={{
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  marginBottom: '20px'
                }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>COLLECTING FOR</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '700', marginTop: '4px' }}>{collectingStudent.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', marginTop: '2px' }}>
                    Squad: {collectingStudent.batch}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="collect-amount">Billing Amount ($)</label>
                  <input 
                    id="collect-amount"
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="collect-method">Payment Method</label>
                  <select id="collect-method" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Cash">Cash Handover</option>
                    <option value="Bank Transfer">Bank Transfer (Wire)</option>
                    <option value="UPI">UPI Payment</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="collect-cycle">Billing Cycle Period</label>
                  <input 
                    id="collect-cycle"
                    type="text" 
                    value={selectedMonth} 
                    disabled 
                    style={{ opacity: '0.6', cursor: 'not-allowed' }} 
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsCollectOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Record & Generate Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* receipt details modal */}
      {isReceiptOpen && activeReceipt && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '420px', background: '#e2e8f0', padding: '12px' }}>
            <div className="modal-header" style={{ borderBottom: 'none', padding: '10px 10px 0 10px' }}>
              <span style={{ color: '#1e293b', fontWeight: 'bold' }}>SYSTEM RECEIPT FILE</span>
              <button className="close-btn" onClick={() => setIsReceiptOpen(false)} style={{ color: '#1e293b' }} aria-label="Close modal">
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body" style={{ padding: '10px' }}>
              {/* Receipt Template */}
              <div className="receipt-container">
                <div className="receipt-header">
                  <h2>APEX BOXING GYM</h2>
                  <p>108 KNOCKOUT DRIVE, SUITE B</p>
                  <p>TEL: (555) RING-SIDE</p>
                </div>
                
                <div className="receipt-body">
                  <div className="receipt-row">
                    <span>DATE:</span>
                    <span>{activeReceipt.paymentDate}</span>
                  </div>
                  <div className="receipt-row">
                    <span>RECEIPT NO:</span>
                    <span>{activeReceipt.receiptNumber}</span>
                  </div>
                  <div className="receipt-row">
                    <span>FIGHTER:</span>
                    <span>{activeReceipt.studentName}</span>
                  </div>
                  <div className="receipt-row">
                    <span>ID:</span>
                    <span>{activeReceipt.studentId}</span>
                  </div>
                  <div className="receipt-row">
                    <span>EMAIL:</span>
                    <span style={{ fontSize: '0.75rem' }}>{activeReceipt.studentEmail}</span>
                  </div>
                  <div className="receipt-row">
                    <span>METHOD:</span>
                    <span>{activeReceipt.paymentMethod}</span>
                  </div>
                  <div className="receipt-row">
                    <span>CYCLE:</span>
                    <span>{activeReceipt.monthFor}</span>
                  </div>
                  
                  <div className="receipt-total">
                    <span>TOTAL AMOUNT:</span>
                    <span>${activeReceipt.amount}.00</span>
                  </div>
                </div>

                <div className="receipt-footer">
                  <p>*** CHAMPIONS TRAIN HERE ***</p>
                  <p>THANK YOU FOR YOUR PAYMENT</p>
                  <div style={{ marginTop: '16px', fontSize: '0.7rem', color: '#94a3b8' }}>
                    Apex Management Console 1.0
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ borderTop: 'none', padding: '10px' }}>
              <button className="btn btn-secondary" onClick={() => setIsReceiptOpen(false)} style={{ color: '#1e293b', border: '1px solid #94a3b8' }}>
                Close
              </button>
              <button className="btn btn-primary" onClick={handlePrint} style={{ backgroundColor: '#0f172a', borderColor: '#0f172a' }}>
                <Printer size={16} />
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
