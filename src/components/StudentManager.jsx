import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Eye, 
  Edit3, 
  Trash2, 
  UserPlus, 
  ShieldAlert, 
  User, 
  X, 
  Check,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

export default function StudentManager({ students, onSaveStudent, onDeleteStudent }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBatch, setFilterBatch] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  
  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [viewingStudent, setViewingStudent] = useState(null);

  // Form Fields State
  const initialFormState = {
    name: '',
    email: '',
    phone: '',
    age: '',
    weight: '',
    batch: 'Morning Warriors',
    membershipType: 'Monthly',
    feeAmount: 80,
    status: 'Active',
    emergencyContactName: '',
    emergencyContactRelation: '',
    emergencyContactPhone: ''
  };
  
  const [formData, setFormData] = useState(initialFormState);

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const next = { ...prev, [name]: value };
      
      // Auto-adjust default fee based on membership selection if default fee amount
      if (name === 'membershipType') {
        if (value === 'Monthly') next.feeAmount = 80;
        else if (value === 'Quarterly') next.feeAmount = 220;
        else if (value === 'Annual') next.feeAmount = 750;
      }
      
      return next;
    });
  };

  // Open Form for Adding
  const handleAddOpen = () => {
    setEditingStudent(null);
    setFormData(initialFormState);
    setIsFormOpen(true);
  };

  // Open Form for Editing
  const handleEditOpen = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      phone: student.phone,
      age: student.age,
      weight: student.weight,
      batch: student.batch,
      membershipType: student.membershipType,
      feeAmount: student.feeAmount,
      status: student.status,
      emergencyContactName: student.emergencyContact?.name || '',
      emergencyContactRelation: student.emergencyContact?.relation || '',
      emergencyContactPhone: student.emergencyContact?.phone || ''
    });
    setIsFormOpen(true);
  };

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const studentToSave = {
      id: editingStudent ? editingStudent.id : undefined,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      age: parseInt(formData.age) || 0,
      weight: parseFloat(formData.weight) || 0,
      batch: formData.batch,
      membershipType: formData.membershipType,
      feeAmount: parseFloat(formData.feeAmount) || 80,
      status: formData.status,
      joinDate: editingStudent ? editingStudent.joinDate : undefined,
      emergencyContact: {
        name: formData.emergencyContactName,
        relation: formData.emergencyContactRelation,
        phone: formData.emergencyContactPhone
      }
    };
    
    onSaveStudent(studentToSave);
    setIsFormOpen(false);
    setFormData(initialFormState);
  };

  // Toggle Active/Inactive Status
  const handleToggleStatus = (student) => {
    const updated = {
      ...student,
      status: student.status === 'Active' ? 'Inactive' : 'Active'
    };
    onSaveStudent(updated);
  };

  // Open Profile View Modal
  const handleViewProfile = (student) => {
    setViewingStudent(student);
    setIsProfileOpen(true);
  };

  // Filtered Students List
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesBatch = filterBatch === 'All' || student.batch === filterBatch;
      const matchesStatus = filterStatus === 'All' || student.status === filterStatus;
      
      return matchesSearch && matchesBatch && matchesStatus;
    });
  }, [students, searchTerm, filterBatch, filterStatus]);

  // Extract initials for large profile avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n.replace(/['"]+/g, '')) // remove nicknames
      .filter(n => n.length > 0)
      .slice(0, 2)
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>Student Management</h1>
          <p>Register new fighters, manage active roster details, and allocate training squads.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={handleAddOpen}>
            <UserPlus size={18} />
            Register Student
          </button>
        </div>
      </div>

      {/* Roster Search and Filters Card */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="filters-bar">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by fighter name, ID, or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-selects">
            <select 
              value={filterBatch} 
              onChange={(e) => setFilterBatch(e.target.value)}
              aria-label="Filter by Batch Allocation"
            >
              <option value="All">All Batches</option>
              <option value="Morning Warriors">Morning Warriors</option>
              <option value="Elite Competitors">Elite Competitors</option>
              <option value="Evening Beginners">Evening Beginners</option>
            </select>

            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              aria-label="Filter by Roster Status"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Student Table */}
        <div className="table-container">
          <table className="data-table students-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Batch Allocation</th>
                <th>Membership</th>
                <th>Weight</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td style={{ fontWeight: '700', color: 'var(--text-secondary)' }}>{student.id}</td>
                    <td>
                      <div style={{ fontWeight: '600' }}>{student.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{student.email}</div>
                    </td>
                    <td>{student.batch}</td>
                    <td>
                      <div style={{ fontWeight: '500' }}>{student.membershipType}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>${student.feeAmount}/mo</div>
                    </td>
                    <td>{student.weight} kg</td>
                    <td>
                      <span className={`badge ${student.status === 'Active' ? 'badge-active' : 'badge-inactive'}`}>
                        {student.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button 
                          className="btn btn-secondary btn-sm" 
                          title="View Profile details" 
                          onClick={() => handleViewProfile(student)}
                          style={{ padding: '6px' }}
                        >
                          <Eye size={14} />
                        </button>
                        <button 
                          className="btn btn-secondary btn-sm" 
                          title="Edit Student details" 
                          onClick={() => handleEditOpen(student)}
                          style={{ padding: '6px' }}
                        >
                          <Edit3 size={14} />
                        </button>
                        <button 
                          className="btn btn-secondary btn-sm" 
                          title={student.status === 'Active' ? "Deactivate student" : "Activate student"} 
                          onClick={() => handleToggleStatus(student)}
                          style={{ padding: '6px', color: student.status === 'Active' ? 'var(--accent-gold)' : 'var(--accent-green)' }}
                        >
                          {student.status === 'Active' ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                        </button>
                        <button 
                          className="btn btn-danger btn-sm" 
                          title="Remove student permanently" 
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to permanently delete student ${student.name}?`)) {
                              onDeleteStudent(student.id);
                            }
                          }}
                          style={{ padding: '6px' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                    No student records match search filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Registration/Edit Modal */}
      {isFormOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingStudent ? 'Edit Fighter Profile' : 'Register New Fighter'}</h2>
              <button className="close-btn" onClick={() => setIsFormOpen(false)} aria-label="Close modal">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <h3>Personal Information</h3>
                <hr style={{ borderColor: 'var(--border-color)', margin: '8px 0 16px 0' }} />
                
                <div className="form-group">
                  <label htmlFor="form-name">Full Name / Ring Nickname</label>
                  <input 
                    id="form-name"
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    placeholder="e.g. Marcus 'The Hammer' Vance" 
                    required 
                  />
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="form-email">Email Address</label>
                    <input 
                      id="form-email"
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      placeholder="name@example.com" 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="form-phone">Contact Phone</label>
                    <input 
                      id="form-phone"
                      type="tel" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleInputChange} 
                      placeholder="+1 (555) 000-0000" 
                      required 
                    />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="form-age">Age (Years)</label>
                    <input 
                      id="form-age"
                      type="number" 
                      name="age" 
                      value={formData.age} 
                      onChange={handleInputChange} 
                      placeholder="e.g. 24" 
                      min="8" 
                      max="100" 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="form-weight">Current Weight (kg)</label>
                    <input 
                      id="form-weight"
                      type="number" 
                      step="0.1" 
                      name="weight" 
                      value={formData.weight} 
                      onChange={handleInputChange} 
                      placeholder="e.g. 74.5" 
                      required 
                    />
                  </div>
                </div>

                <h3 style={{ marginTop: '24px' }}>Gym Membership Details</h3>
                <hr style={{ borderColor: 'var(--border-color)', margin: '8px 0 16px 0' }} />

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="form-batch">Squad Batch Allocation</label>
                    <select id="form-batch" name="batch" value={formData.batch} onChange={handleInputChange}>
                      <option value="Morning Warriors">Morning Warriors (06:00 - 08:00 AM)</option>
                      <option value="Elite Competitors">Elite Competitors (04:00 - 06:00 PM)</option>
                      <option value="Evening Beginners">Evening Beginners (07:30 - 09:30 PM)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="form-membershipType">Membership Tier</label>
                    <select id="form-membershipType" name="membershipType" value={formData.membershipType} onChange={handleInputChange}>
                      <option value="Monthly">Monthly Cycle</option>
                      <option value="Quarterly">Quarterly Cycle</option>
                      <option value="Annual">Annual Sparring Contract</option>
                    </select>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="form-feeAmount">Agreed Fee Rate ($/cycle)</label>
                    <input 
                      id="form-feeAmount"
                      type="number" 
                      name="feeAmount" 
                      value={formData.feeAmount} 
                      onChange={handleInputChange} 
                      placeholder="80" 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="form-status">Initial System Status</label>
                    <select id="form-status" name="status" value={formData.status} onChange={handleInputChange}>
                      <option value="Active">Active Fighter</option>
                      <option value="Inactive">Inactive/On Hold</option>
                    </select>
                  </div>
                </div>

                <h3 style={{ marginTop: '24px' }}>Emergency Contact Information</h3>
                <hr style={{ borderColor: 'var(--border-color)', margin: '8px 0 16px 0' }} />

                <div className="form-group">
                  <label htmlFor="form-ec-name">Emergency Contact Name</label>
                  <input 
                    id="form-ec-name"
                    type="text" 
                    name="emergencyContactName" 
                    value={formData.emergencyContactName} 
                    onChange={handleInputChange} 
                    placeholder="Contact full name" 
                    required 
                  />
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="form-ec-relation">Relationship</label>
                    <input 
                      id="form-ec-relation"
                      type="text" 
                      name="emergencyContactRelation" 
                      value={formData.emergencyContactRelation} 
                      onChange={handleInputChange} 
                      placeholder="e.g. Spouse, Parent, Brother" 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="form-ec-phone">Emergency Phone</label>
                    <input 
                      id="form-ec-phone"
                      type="tel" 
                      name="emergencyContactPhone" 
                      value={formData.emergencyContactPhone} 
                      onChange={handleInputChange} 
                      placeholder="+1 (555) 000-0000" 
                      required 
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingStudent ? 'Save Changes' : 'Register Fighter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Profile Detail View Modal */}
      {isProfileOpen && viewingStudent && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <div className="modal-header">
              <h2>Fighter Profile File</h2>
              <button className="close-btn" onClick={() => setIsProfileOpen(false)} aria-label="Close modal">
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="profile-grid">
                <div className="profile-avatar-large">
                  <span style={{ fontSize: '3rem', fontWeight: '800' }}>
                    {getInitials(viewingStudent.name)}
                  </span>
                </div>
                
                <div className="profile-info">
                  <div className="profile-header">
                    <h2>{viewingStudent.name}</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Fighter ID: {viewingStudent.id}</p>
                    <div className="profile-badge-row">
                      <span className={`badge ${viewingStudent.status === 'Active' ? 'badge-active' : 'badge-inactive'}`}>
                        Roster Status: {viewingStudent.status}
                      </span>
                      <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'white' }}>
                        Joined: {viewingStudent.joinDate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <h3 style={{ marginTop: '28px' }}>Physical & Membership Stats</h3>
              <hr style={{ borderColor: 'var(--border-color)', margin: '8px 0 16px 0' }} />

              <div className="profile-details-list">
                <div className="profile-detail-item">
                  <label>Age Profile</label>
                  <p>{viewingStudent.age} Years Old</p>
                </div>
                <div className="profile-detail-item">
                  <label>Weight Class Metric</label>
                  <p>{viewingStudent.weight} kg ({Math.round(viewingStudent.weight * 2.20462)} lbs)</p>
                </div>
                <div className="profile-detail-item">
                  <label>Squad Batch Allocation</label>
                  <p>{viewingStudent.batch}</p>
                </div>
                <div className="profile-detail-item">
                  <label>Membership Contract</label>
                  <p>{viewingStudent.membershipType} Tier (${viewingStudent.feeAmount}/mo)</p>
                </div>
                <div className="profile-detail-item">
                  <label>Contact Phone</label>
                  <p>{viewingStudent.phone}</p>
                </div>
                <div className="profile-detail-item">
                  <label>Email Address</label>
                  <p>{viewingStudent.email}</p>
                </div>
              </div>

              <h3 style={{ marginTop: '28px' }}>Emergency Ringside Contact</h3>
              <hr style={{ borderColor: 'var(--border-color)', margin: '8px 0 16px 0' }} />

              <div style={{
                backgroundColor: 'rgba(230, 57, 70, 0.05)',
                border: '1px solid rgba(230, 57, 70, 0.15)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <ShieldAlert size={28} style={{ color: 'var(--accent-red)', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>
                    {viewingStudent.emergencyContact?.name || 'Not Listed'}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Relationship: {viewingStudent.emergencyContact?.relation || 'N/A'} | Primary Phone: {viewingStudent.emergencyContact?.phone || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setIsProfileOpen(false)}>
                Close Profile
              </button>
              <button className="btn btn-primary" onClick={() => {
                setIsProfileOpen(false);
                handleEditOpen(viewingStudent);
              }}>
                <Edit3 size={16} />
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
