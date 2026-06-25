import React, { useState, useMemo } from 'react';
import { 
  Bell, 
  Megaphone, 
  Calendar, 
  User, 
  Trash2, 
  Plus, 
  X, 
  Smartphone,
  Info 
} from 'lucide-react';

export default function AnnouncementBoard({ announcements, onSaveAnnouncement, onDeleteAnnouncement }) {
  const [activeTab, setActiveTab] = useState('board'); // 'board', 'mobile'
  const [filterCategory, setFilterCategory] = useState('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Form fields state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Tournament');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('Head Coach Mick');

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveAnnouncement({
      title,
      category,
      description,
      author
    });
    
    // Reset & Close
    setTitle('');
    setCategory('Tournament');
    setDescription('');
    setIsFormOpen(false);
  };

  // Filtered Announcements
  const filteredAnnouncements = useMemo(() => {
    if (filterCategory === 'All') return announcements;
    return announcements.filter(a => a.category === filterCategory);
  }, [announcements, filterCategory]);

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>Events & Announcements</h1>
          <p>Broadcast tournament dates, training camps, gym holidays, and safety updates to the squad.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => setIsFormOpen(true)}>
            <Plus size={18} />
            Post Announcement
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-color)', marginBottom: '24px' }}>
        <button 
          onClick={() => setActiveTab('board')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'board' ? '2px solid var(--accent-red)' : '2px solid transparent',
            color: activeTab === 'board' ? 'var(--text-primary)' : 'var(--text-secondary)',
            padding: '12px 16px',
            cursor: 'pointer',
            fontWeight: '600',
            fontFamily: 'var(--font-headings)'
          }}
        >
          Academy Notice Board
        </button>
        <button 
          onClick={() => setActiveTab('mobile')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'mobile' ? '2px solid var(--accent-red)' : '2px solid transparent',
            color: activeTab === 'mobile' ? 'var(--text-primary)' : 'var(--text-secondary)',
            padding: '12px 16px',
            cursor: 'pointer',
            fontWeight: '600',
            fontFamily: 'var(--font-headings)'
          }}
        >
          Mobile Communication Stream
        </button>
      </div>

      {/* Tab 1: Notice Board */}
      {activeTab === 'board' && (
        <div>
          {/* Categories Filters */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
            {['All', 'Tournament', 'Camp', 'Holiday', 'Notice'].map(cat => (
              <button
                key={cat}
                className={`btn btn-sm ${filterCategory === cat ? 'btn-outline' : 'btn-secondary'}`}
                onClick={() => setFilterCategory(cat)}
              >
                {cat} Notices
              </button>
            ))}
          </div>

          <div className="events-grid">
            {filteredAnnouncements.length > 0 ? (
              filteredAnnouncements.map(ann => (
                <div key={ann.id} className="card event-card">
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span className={`event-tag ${ann.category.toLowerCase()}`}>
                        {ann.category}
                      </span>
                      <button 
                        className="btn logout-btn" 
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this notice?')) {
                            onDeleteAnnouncement(ann.id);
                          }
                        }}
                        style={{ padding: '4px' }}
                        title="Delete announcement"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <h3 className="event-title">{ann.title}</h3>
                    <p className="event-desc">{ann.description}</p>
                  </div>

                  <div className="event-meta">
                    <div className="event-meta-item">
                      <User size={12} />
                      <span>{ann.author}</span>
                    </div>
                    <div className="event-meta-item">
                      <Calendar size={12} />
                      <span>{ann.date} ({ann.time})</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                No active announcements found in this filter tier.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Mobile Communication Simulation */}
      {activeTab === 'mobile' && (
        <div className="events-split-layout">
          {/* Explanation */}
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Student Communication Hub</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>
              Whenever you post an announcement, tournament update, or camp notification in the dashboard, the system automatically pushes real-time notifications to students' smart devices.
            </p>
            <div style={{
              backgroundColor: 'rgba(33, 158, 188, 0.08)',
              border: '1px solid rgba(33, 158, 188, 0.2)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              display: 'flex',
              gap: '12px',
              fontSize: '0.85rem'
            }}>
              <Info size={24} style={{ color: 'var(--accent-blue)', flexShrink: 0 }} />
              <div>
                <strong>Active Synchronization</strong>: Demonstrates the instant syncing between the Admin Dashboard notice records and the athlete interface layout.
              </div>
            </div>
          </div>

          {/* Simulated Glassmorphic Mobile Screen */}
          <div style={{
            width: '320px',
            height: '580px',
            backgroundColor: '#000000',
            borderRadius: '40px',
            border: '8px solid #27272a',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 20px rgba(230, 57, 70, 0.15)',
            margin: '0 auto',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Status bar */}
            <div style={{
              height: '30px',
              backgroundColor: '#0a0e17',
              padding: '0 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.7rem',
              color: 'var(--text-secondary)'
            }}>
              <span>13:54</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span>LTE</span>
                <span>🔋 85%</span>
              </div>
            </div>

            {/* App Header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: 'var(--bg-secondary)'
            }}>
              <div style={{ 
                backgroundColor: 'var(--accent-red)',
                color: 'white',
                padding: '6px',
                borderRadius: '8px'
              }}>
                <Megaphone size={14} />
              </div>
              <div>
                <div style={{ fontWeight: '800', fontSize: '0.85rem' }}>APEX ATHLETE</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--accent-red)', fontWeight: 'bold' }}>SQUAD NOTIFICATIONS</div>
              </div>
            </div>

            {/* Notifications feed */}
            <div style={{ 
              flexGrow: 1, 
              padding: '16px', 
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              backgroundColor: '#0a0e17'
            }}>
              {announcements.map((ann, idx) => (
                <div key={ann.id} style={{
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '12px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.15)',
                  animation: `toastEnter 0.4s ease-out ${idx * 0.1}s both`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ 
                      fontSize: '0.6rem', 
                      fontWeight: '800',
                      textTransform: 'uppercase',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      color: ann.category === 'Tournament' ? 'var(--accent-red)' : ann.category === 'Camp' ? 'var(--accent-blue)' : 'var(--accent-gold)',
                      backgroundColor: ann.category === 'Tournament' ? 'rgba(230,57,70,0.1)' : ann.category === 'Camp' ? 'rgba(33,158,188,0.1)' : 'rgba(255,183,3,0.1)'
                    }}>{ann.category}</span>
                    <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>{ann.date}</span>
                  </div>
                  <h4 style={{ fontSize: '0.75rem', fontWeight: '700', color: 'white', marginBottom: '4px' }}>{ann.title}</h4>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', lineHeight: '1.3' }}>
                    {ann.description.length > 90 ? `${ann.description.substring(0, 90)}...` : ann.description}
                  </p>
                </div>
              ))}
            </div>
            
            {/* Navigation pill */}
            <div style={{
              height: '35px',
              backgroundColor: '#0a0e17',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                width: '100px',
                height: '4px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: '2px'
              }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Post Modal */}
      {isFormOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h2>Post Academy Announcement</h2>
              <button className="close-btn" onClick={() => setIsFormOpen(false)} aria-label="Close modal">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="ann-title">Announcement Title</label>
                  <input 
                    id="ann-title"
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="e.g. Boxing Sparring Gala Registrations" 
                    required 
                  />
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="ann-category">Notice Category</label>
                    <select id="ann-category" value={category} onChange={(e) => setCategory(e.target.value)}>
                      <option value="Tournament">Tournament Broadcast</option>
                      <option value="Camp">Training Camp Notification</option>
                      <option value="Holiday">Gym Holiday Schedule</option>
                      <option value="Notice">Important Notice/Update</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="ann-author">Broadcast Author</label>
                    <input 
                      id="ann-author"
                      type="text" 
                      value={author} 
                      onChange={(e) => setAuthor(e.target.value)} 
                      placeholder="e.g. Head Coach Mick" 
                      required 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="ann-desc">Detailed Announcement Message</label>
                  <textarea 
                    id="ann-desc"
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="Write detailed announcements, schedule changes, or competition requirements here..."
                    rows="5"
                    required 
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Publish & Broadcast Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
