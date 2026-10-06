import { useEffect, useMemo, useState } from 'react'
import campusConnectLogo from './assets/campusconnect-logo.png'

const Logo = () => <img className="logo-mark" src={campusConnectLogo} alt="" />
const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

export default function AdminDashboard({ onHome, onLogout }) {
  const [user] = useState(() => {
    try {
      const stored = localStorage.getItem('campusconnect-user')
      return stored ? JSON.parse(stored) : { email: 'admin1@campusconnect.demo', role: 'ADMIN' }
    } catch {
      return { email: 'admin1@campusconnect.demo', role: 'ADMIN' }
    }
  })

  const [events, setEvents] = useState([])
  const [registrationCounts, setRegistrationCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('PENDING')
  const [toastMessage, setToastMessage] = useState('')
  const [actionInProgressId, setActionInProgressId] = useState(null)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 4000)
  }

  useEffect(() => {
    let ignore = false
    async function fetchData() {
      try {
        const [eventsRes, countsRes] = await Promise.all([
          fetch(`${apiUrl}/api/events?all=true`),
          fetch(`${apiUrl}/api/events/registration-counts`).catch(() => null),
        ])

        if (!ignore && eventsRes.ok) {
          const data = await eventsRes.json()
          if (Array.isArray(data)) {
            setEvents(data)
          }
        }

        if (!ignore && countsRes && countsRes.ok) {
          const counts = await countsRes.json()
          setRegistrationCounts(counts || {})
        }
      } catch {
        // Fallback
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    fetchData()
    return () => {
      ignore = true
    }
  }, [])

  const pendingEvents = useMemo(() => {
    return events.filter((e) => (e.status || '').toUpperCase() === 'PENDING')
  }, [events])

  const approvedEvents = useMemo(() => {
    return events.filter((e) => (e.status || 'APPROVED').toUpperCase() === 'APPROVED')
  }, [events])

  const rejectedEvents = useMemo(() => {
    return events.filter((e) => (e.status || '').toUpperCase() === 'REJECTED')
  }, [events])

  const totalRegistrations = useMemo(() => {
    return Object.values(registrationCounts).reduce((a, b) => a + b, 0)
  }, [registrationCounts])

  // Approve event
  const handleApprove = async (eventItem) => {
    setActionInProgressId(eventItem.id)
    try {
      const response = await fetch(`${apiUrl}/api/events/${eventItem.id}/approve`, {
        method: 'POST',
      })
      if (response.ok) {
        const updated = await response.json()
        setEvents((prev) => prev.map((ev) => (ev.id === updated.id ? updated : ev)))
        showToast(`✅ "${eventItem.title}" approved! It is now published live on the Student Dashboard.`)
      } else {
        showToast('Error approving event.')
      }
    } catch {
      showToast('Backend connection failed.')
    } finally {
      setActionInProgressId(null)
    }
  }

  // Reject event
  const handleReject = async (eventItem) => {
    setActionInProgressId(eventItem.id)
    try {
      const response = await fetch(`${apiUrl}/api/events/${eventItem.id}/reject`, {
        method: 'POST',
      })
      if (response.ok) {
        const updated = await response.json()
        setEvents((prev) => prev.map((ev) => (ev.id === updated.id ? updated : ev)))
        showToast(`❌ "${eventItem.title}" marked as rejected.`)
      } else {
        showToast('Error rejecting event.')
      }
    } catch {
      showToast('Backend connection failed.')
    } finally {
      setActionInProgressId(null)
    }
  }

  // Delete event
  const handleDelete = async (eventItem) => {
    if (!window.confirm(`Delete event "${eventItem.title}"?`)) return
    setActionInProgressId(eventItem.id)
    try {
      const response = await fetch(`${apiUrl}/api/events/${eventItem.id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setEvents((prev) => prev.filter((ev) => ev.id !== eventItem.id))
        showToast(`Event "${eventItem.title}" deleted.`)
      }
    } catch {
      showToast('Error deleting event.')
    } finally {
      setActionInProgressId(null)
    }
  }

  return (
    <div className="admin-dashboard">
      {/* Toast Notification */}
      {toastMessage && <div className="dashboard-toast">{toastMessage}</div>}

      {/* Top Header */}
      <header className="dashboard-nav">
        <div className="nav-container">
          <button className="brand brand-button" onClick={onHome}>
            <Logo />
            <span>CampusConnect</span>
          </button>

          <div className="nav-profile">
            <span className="user-badge admin-badge">Campus Administrator</span>
            <span className="user-email">{user?.email}</span>
            <button className="button button-secondary nav-btn" onClick={onHome}>
              Home
            </button>
            <button className="button button-secondary nav-btn logout-btn" onClick={onLogout}>
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Admin Banner */}
      <section className="dashboard-banner admin-banner">
        <div className="banner-content">
          <div className="banner-copy">
            <p className="eyebrow">
              <i /> CAMPUS EVENT GOVERNANCE &amp; APPROVALS
            </p>
            <h1>
              Administrator <em>Control Center.</em>
            </h1>
            <p className="banner-subtitle">
              Review and approve event submissions from student committees, verify campus safety &amp; venues, and oversee student participation.
            </p>
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <strong>{events.length}</strong>
              <span>Total Campus Events</span>
            </div>
            <div className={`stat-card ${pendingEvents.length > 0 ? 'stat-alert' : ''}`}>
              <strong style={{ color: pendingEvents.length > 0 ? '#b91c1c' : '#475569' }}>
                {pendingEvents.length}
              </strong>
              <span>Pending Approvals</span>
            </div>
            <div className="stat-card stat-registered">
              <strong>{totalRegistrations}</strong>
              <span>Campus Registrations</span>
            </div>
            <div className="stat-card">
              <strong style={{ color: '#15803d' }}>{approvedEvents.length}</strong>
              <span>Live Published</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Workspace */}
      <main className="admin-workspace">
        <div className="admin-tabs-bar" role="tablist">
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'PENDING' ? 'active' : ''}`}
            onClick={() => setActiveTab('PENDING')}
          >
            ⏳ Pending Approvals ({pendingEvents.length})
            {pendingEvents.length > 0 && <span className="tab-pill-alert">{pendingEvents.length}</span>}
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'APPROVED' ? 'active' : ''}`}
            onClick={() => setActiveTab('APPROVED')}
          >
            ✅ Live Published Events ({approvedEvents.length})
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'REJECTED' ? 'active' : ''}`}
            onClick={() => setActiveTab('REJECTED')}
          >
            ❌ Rejected ({rejectedEvents.length})
          </button>
        </div>

        {/* Tab 1: PENDING APPROVALS QUEUE */}
        {activeTab === 'PENDING' && (
          <div className="admin-tab-content">
            <div className="tab-section-header">
              <div>
                <h2>Pending Approval Queue</h2>
                <p>
                  Events proposed by student committees. Review venue, schedule, and content before approving for student visibility.
                </p>
              </div>
            </div>

            {loading ? (
              <p>Loading queue…</p>
            ) : pendingEvents.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">🎉</span>
                <h3>All caught up!</h3>
                <p>There are no pending events awaiting administrator review.</p>
              </div>
            ) : (
              <div className="admin-approval-grid">
                {pendingEvents.map((item) => {
                  const isBusy = actionInProgressId === item.id

                  return (
                    <article key={item.id} className="approval-card">
                      <div className="approval-card-header">
                        <div className="organizer-badge-tag">
                          <span>◈ Proposed by:</span>
                          <strong>{item.organizer}</strong>
                        </div>
                        <span className="category-pill cat-default">{item.category}</span>
                      </div>

                      <h3 className="approval-card-title">{item.title}</h3>

                      <div className="approval-meta-grid">
                        <div className="meta-box">
                          <strong>📅 Schedule</strong>
                          <span>{item.eventDate || 'Date TBA'}</span>
                        </div>
                        <div className="meta-box">
                          <strong>📍 Requested Venue</strong>
                          <span>{item.location || 'Campus Center'}</span>
                        </div>
                      </div>

                      <div className="approval-desc-box">
                        <strong>Description &amp; Event Scope:</strong>
                        <p>{item.description}</p>
                      </div>

                      <div className="approval-actions-row">
                        <button
                          type="button"
                          className="button button-primary approve-btn"
                          disabled={isBusy}
                          onClick={() => handleApprove(item)}
                        >
                          {isBusy ? 'Processing…' : '✅ Approve & Publish to Students'}
                        </button>

                        <button
                          type="button"
                          className="button button-secondary reject-btn"
                          disabled={isBusy}
                          onClick={() => handleReject(item)}
                        >
                          ❌ Reject
                        </button>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: LIVE PUBLISHED EVENTS */}
        {activeTab === 'APPROVED' && (
          <div className="admin-tab-content">
            <div className="tab-section-header">
              <div>
                <h2>Live Published Campus Events</h2>
                <p>Events currently visible to students on the Student Dashboard with registration active.</p>
              </div>
            </div>

            <div className="admin-published-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Category</th>
                    <th>Organizing Body</th>
                    <th>Venue</th>
                    <th>Schedule</th>
                    <th>Registrations</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {approvedEvents.map((ev) => {
                    const count = registrationCounts[ev.id] || 0
                    return (
                      <tr key={ev.id}>
                        <td>
                          <strong>{ev.title}</strong>
                        </td>
                        <td>
                          <span className="category-tag">{ev.category}</span>
                        </td>
                        <td>{ev.organizer}</td>
                        <td>{ev.location}</td>
                        <td>{ev.eventDate}</td>
                        <td>
                          <span className="reg-count-badge">👥 {count}</span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="table-delete-btn"
                            onClick={() => handleDelete(ev)}
                            title="Delete event"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: REJECTED EVENTS */}
        {activeTab === 'REJECTED' && (
          <div className="admin-tab-content">
            <div className="tab-section-header">
              <div>
                <h2>Rejected Event Proposals</h2>
                <p>Events that were denied approval.</p>
              </div>
            </div>

            {rejectedEvents.length === 0 ? (
              <div className="empty-state">
                <p>No rejected events.</p>
              </div>
            ) : (
              <div className="admin-approval-grid">
                {rejectedEvents.map((item) => (
                  <article key={item.id} className="approval-card status-rejected-card">
                    <div className="approval-card-header">
                      <div className="organizer-badge-tag">
                        <span>◈ Organized by:</span>
                        <strong>{item.organizer}</strong>
                      </div>
                      <span className="status-badge status-rejected">Rejected</span>
                    </div>
                    <h3 className="approval-card-title">{item.title}</h3>
                    <p className="approval-desc-box">{item.description}</p>
                    <div className="approval-actions-row">
                      <button
                        type="button"
                        className="button button-primary"
                        onClick={() => handleApprove(item)}
                      >
                        Re-evaluate &amp; Approve
                      </button>
                      <button
                        type="button"
                        className="button button-secondary"
                        onClick={() => handleDelete(item)}
                      >
                        Delete Permanently
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
