import { useEffect, useMemo, useState } from 'react'
import campusConnectLogo from './assets/campusconnect-logo.png'

const Arrow = () => <span aria-hidden="true">→</span>
const Logo = () => <img className="logo-mark" src={campusConnectLogo} alt="" />
const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

const recognizedOrganizations = [
  { name: 'Student Council', icon: '🏛️', type: 'Apex Student Body' },
  { name: 'CSI Committee', icon: '💻', type: 'Technical Committee' },
  { name: 'Airnova', icon: '✈️', type: 'Aviation & Aeromodelling' },
  { name: 'Sports Committee', icon: '🏅', type: 'Athletics & Games' },
  { name: 'Devs & Hackers Society', icon: '⚡', type: 'Hackathons Club' },
  { name: 'Robotics & Automation Club', icon: '🤖', type: 'Hardware & Bots' },
  { name: 'Creative Design Guild', icon: '🎨', type: 'UI/UX & Design' },
  { name: 'ACM Student Chapter', icon: '🛠️', type: 'Computing & Workshops' },
  { name: 'E-Cell (Entrepreneurship Cell)', icon: '💼', type: 'Startup & Competitions' },
]

export default function OrganizerDashboard({ onHome, onLogout }) {
  const [user] = useState(() => {
    try {
      const stored = localStorage.getItem('campusconnect-user')
      return stored
        ? JSON.parse(stored)
        : { email: 'csi@campusconnect.demo', role: 'ORGANISER', organization: 'CSI Committee' }
    } catch {
      return { email: 'csi@campusconnect.demo', role: 'ORGANISER', organization: 'CSI Committee' }
    }
  })

  // Selected organization workspace
  const [activeOrg, setActiveOrg] = useState(() => {
    return user.organization || 'CSI Committee'
  })

  const [events, setEvents] = useState([])
  const [registrationCounts, setRegistrationCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [toastMessage, setToastMessage] = useState('')

  // Create event modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [createForm, setCreateForm] = useState({
    title: '',
    category: 'Workshops',
    eventDate: '',
    location: '',
    description: '',
  })

  // View attendees modal state
  const [selectedAttendeesEvent, setSelectedAttendeesEvent] = useState(null)
  const [attendeesList, setAttendeesList] = useState([])
  const [loadingAttendees, setLoadingAttendees] = useState(false)

  const showToast = (message) => {
    setToastMessage(message)
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
  }, [activeOrg])

  // Filter events strictly scoped to activeOrg
  const scopedEvents = useMemo(() => {
    const orgLower = activeOrg.toLowerCase()
    return events.filter((ev) => {
      const matchOrg =
        ev.organizer?.toLowerCase().includes(orgLower) ||
        orgLower.includes(ev.organizer?.toLowerCase() || '') ||
        ev.title?.toLowerCase().includes(orgLower)
      return matchOrg
    })
  }, [events, activeOrg])

  // Filter by status and search query
  const filteredEvents = useMemo(() => {
    return scopedEvents.filter((ev) => {
      // Status filter
      if (statusFilter !== 'ALL') {
        const evStatus = (ev.status || 'APPROVED').toUpperCase()
        if (evStatus !== statusFilter) return false
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchTitle = ev.title?.toLowerCase().includes(q)
        const matchLoc = ev.location?.toLowerCase().includes(q)
        const matchCat = ev.category?.toLowerCase().includes(q)
        return matchTitle || matchLoc || matchCat
      }

      return true
    })
  }, [scopedEvents, statusFilter, searchQuery])

  // Calculate live stats
  const totalRegistrations = useMemo(() => {
    return scopedEvents.reduce((sum, ev) => sum + (registrationCounts[ev.id] || 0), 0)
  }, [scopedEvents, registrationCounts])

  const approvedCount = useMemo(() => {
    return scopedEvents.filter((e) => (e.status || 'APPROVED').toUpperCase() === 'APPROVED').length
  }, [scopedEvents])

  const pendingCount = useMemo(() => {
    return scopedEvents.filter((e) => (e.status || '').toUpperCase() === 'PENDING').length
  }, [scopedEvents])

  // Create new event
  const handleSubmitNewEvent = async (e) => {
    e.preventDefault()
    if (!createForm.title.trim() || !createForm.description.trim()) {
      showToast('Please provide an event title and full description.')
      return
    }

    setCreating(true)
    try {
      const payload = {
        title: createForm.title.trim(),
        category: createForm.category,
        eventDate: createForm.eventDate.trim() || 'TBA',
        location: createForm.location.trim() || 'Campus Center',
        description: createForm.description.trim(),
        organizer: activeOrg,
        status: 'PENDING', // Awaiting Admin Approval
      }

      const response = await fetch(`${apiUrl}/api/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        const created = await response.json()
        setEvents((prev) => [created, ...prev])
        setIsCreateModalOpen(false)
        setCreateForm({
          title: '',
          category: 'Workshops',
          eventDate: '',
          location: '',
          description: '',
        })
        showToast(`🎉 "${created.title}" submitted for Admin Approval!`)
      } else {
        showToast('Error submitting event. Please try again.')
      }
    } catch {
      showToast('Could not connect to backend server.')
    } finally {
      setCreating(false)
    }
  }

  // View attendees for an event
  const handleOpenAttendees = async (eventItem) => {
    setSelectedAttendeesEvent(eventItem)
    setLoadingAttendees(true)
    try {
      const response = await fetch(`${apiUrl}/api/events/${eventItem.id}/attendees`)
      if (response.ok) {
        const emails = await response.json()
        setAttendeesList(Array.isArray(emails) ? emails : [])
      } else {
        setAttendeesList([])
      }
    } catch {
      setAttendeesList([])
    } finally {
      setLoadingAttendees(false)
    }
  }

  // Delete event
  const handleDeleteEvent = async (eventItem) => {
    if (!window.confirm(`Are you sure you want to cancel and delete "${eventItem.title}"?`)) {
      return
    }

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
    }
  }

  const currentOrgMeta =
    recognizedOrganizations.find((o) => o.name.toLowerCase() === activeOrg.toLowerCase()) || {
      name: activeOrg,
      icon: '🏛️',
      type: 'Student Organization',
    }

  return (
    <div className="organizer-dashboard">
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
            <div className="org-switcher" title="Active Organization Workspace">
              <span className="org-switcher-icon">{currentOrgMeta.icon}</span>
              <select
                className="org-select"
                value={activeOrg}
                onChange={(e) => setActiveOrg(e.target.value)}
                aria-label="Switch Committee Workspace"
              >
                {recognizedOrganizations.map((org) => (
                  <option key={org.name} value={org.name}>
                    {org.icon} {org.name}
                  </option>
                ))}
              </select>
            </div>

            <span className="user-badge organizer-badge">Organizer</span>
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

      {/* Organizer Banner */}
      <section className="dashboard-banner organizer-banner">
        <div className="banner-content">
          <div className="banner-copy">
            <p className="eyebrow">
              <i /> {currentOrgMeta.type.toUpperCase()} • ORGANIZER WORKSPACE
            </p>
            <h1>
              <span>{currentOrgMeta.icon}</span> {activeOrg} <em>Portal.</em>
            </h1>
            <p className="banner-subtitle">
              Manage your committee’s campus presence. Propose new events for admin approval and track student registrations live.
            </p>
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <strong>{scopedEvents.length}</strong>
              <span>Total Events</span>
            </div>
            <div className="stat-card stat-registered">
              <strong>{totalRegistrations}</strong>
              <span>Student Registrations</span>
            </div>
            <div className="stat-card">
              <strong style={{ color: '#15803d' }}>{approvedCount}</strong>
              <span>Live on Feed</span>
            </div>
            <div className="stat-card">
              <strong style={{ color: pendingCount > 0 ? '#b45309' : '#64748b' }}>{pendingCount}</strong>
              <span>Pending Review</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Workspace */}
      <main className="organizer-workspace">
        <div className="workspace-toolbar">
          <div className="toolbar-left">
            <div className="filter-pill-group" role="tablist">
              <button
                type="button"
                className={`filter-pill ${statusFilter === 'ALL' ? 'active' : ''}`}
                onClick={() => setStatusFilter('ALL')}
              >
                All Events ({scopedEvents.length})
              </button>
              <button
                type="button"
                className={`filter-pill ${statusFilter === 'APPROVED' ? 'active' : ''}`}
                onClick={() => setStatusFilter('APPROVED')}
              >
                ✅ Live on Feed ({approvedCount})
              </button>
              <button
                type="button"
                className={`filter-pill ${statusFilter === 'PENDING' ? 'active' : ''}`}
                onClick={() => setStatusFilter('PENDING')}
              >
                ⏳ Pending Approval ({pendingCount})
              </button>
            </div>

            <div className="search-box">
              <input
                type="text"
                placeholder="Search your events…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="clear-search" onClick={() => setSearchQuery('')}>
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="toolbar-right">
            <button
              type="button"
              className="button button-primary create-event-btn"
              onClick={() => setIsCreateModalOpen(true)}
            >
              + Create New Event <Arrow />
            </button>
          </div>
        </div>

        {/* Notice on Isolation */}
        <div className="isolation-notice">
          <span className="notice-icon">🔒</span>
          <div>
            <strong>Organization Scoped Access:</strong> You are currently viewing events, attendee rosters, and draft proposals owned specifically by <em>{activeOrg}</em>.
          </div>
        </div>

        {/* Event Cards Grid */}
        {loading ? (
          <div className="loading-state">Loading your events…</div>
        ) : filteredEvents.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📂</span>
            <h3>No events found for {activeOrg}</h3>
            <p>
              {statusFilter === 'PENDING'
                ? 'No events currently awaiting administrator approval.'
                : statusFilter === 'APPROVED'
                ? 'No live events yet. Click below to create your first event!'
                : 'Click "Create New Event" to submit a new campus event for administrator approval.'}
            </p>
            <button
              type="button"
              className="button button-primary"
              onClick={() => setIsCreateModalOpen(true)}
            >
              + Create First Event
            </button>
          </div>
        ) : (
          <div className="organizer-event-grid">
            {filteredEvents.map((item) => {
              const regCount = registrationCounts[item.id] || 0
              const status = (item.status || 'APPROVED').toUpperCase()

              return (
                <article key={item.id} className={`organizer-card status-${status.toLowerCase()}`}>
                  <div className="card-top-row">
                    <span className="category-tag">{item.category}</span>
                    {status === 'APPROVED' && (
                      <span className="status-badge status-approved">✅ Live on Student Feed</span>
                    )}
                    {status === 'PENDING' && (
                      <span className="status-badge status-pending">⏳ Pending Admin Approval</span>
                    )}
                    {status === 'REJECTED' && (
                      <span className="status-badge status-rejected">❌ Rejected by Admin</span>
                    )}
                  </div>

                  <h3 className="card-title">{item.title}</h3>

                  <div className="card-meta-list">
                    <div className="meta-row">
                      <span className="meta-icon">📅</span>
                      <span>{item.eventDate || 'Date TBA'}</span>
                    </div>
                    <div className="meta-row">
                      <span className="meta-icon">📍</span>
                      <span>{item.location || 'Campus Center'}</span>
                    </div>
                    <div className="meta-row">
                      <span className="meta-icon">◈</span>
                      <span>{item.organizer}</span>
                    </div>
                  </div>

                  <p className="card-snippet">
                    {item.description
                      ? item.description.length > 140
                        ? item.description.slice(0, 140) + '…'
                        : item.description
                      : 'No description provided.'}
                  </p>

                  <div className="card-attendees-bar">
                    <div className="attendees-count-box">
                      <span className="count-number">{regCount}</span>
                      <span className="count-label">Students Registered</span>
                    </div>

                    <button
                      type="button"
                      className="button button-secondary view-attendees-btn"
                      onClick={() => handleOpenAttendees(item)}
                    >
                      View Attendees ({regCount})
                    </button>
                  </div>

                  <div className="card-actions">
                    <button
                      type="button"
                      className="card-delete-link"
                      onClick={() => handleDeleteEvent(item)}
                    >
                      Delete Event
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </main>

      {/* CREATE EVENT MODAL */}
      {isCreateModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsCreateModalOpen(false)}>
          <div
            className="modal-dialog modal-create-dialog"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="modal-header">
              <div>
                <span className="modal-eyebrow">SUBMIT FOR ADMIN APPROVAL</span>
                <h2 className="modal-title">Propose New Campus Event</h2>
              </div>
              <button
                type="button"
                className="modal-close"
                onClick={() => setIsCreateModalOpen(false)}
              >
                ✕
              </button>
            </header>

            <form className="create-event-form" onSubmit={handleSubmitNewEvent}>
              <div className="form-info-callout">
                <span>ℹ️</span>
                <p>
                  <strong>Approval Process:</strong> Your event will be sent to the College Administration queue. Once approved in the Admin Dashboard, it will immediately appear on the Student Dashboard.
                </p>
              </div>

              <label>
                Event Title *
                <input
                  type="text"
                  placeholder="e.g. Drone Tech Workshop & Flight Trials"
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  required
                />
              </label>

              <div className="form-row-2">
                <label>
                  Category *
                  <select
                    value={createForm.category}
                    onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                  >
                    <option value="Workshops">Workshops</option>
                    <option value="Hackathons">Hackathons</option>
                    <option value="Clubs">Clubs</option>
                    <option value="Competitions">Competitions</option>
                    <option value="Committees">Committees</option>
                  </select>
                </label>

                <label>
                  Organizing Body (Locked)
                  <input type="text" value={activeOrg} disabled readOnly className="input-locked" />
                </label>
              </div>

              <div className="form-row-2">
                <label>
                  Schedule / Date &amp; Time *
                  <input
                    type="text"
                    placeholder="e.g. Nov 24, 2026 • 2:30 PM"
                    value={createForm.eventDate}
                    onChange={(e) => setCreateForm({ ...createForm, eventDate: e.target.value })}
                    required
                  />
                </label>

                <label>
                  Campus Venue / Location *
                  <input
                    type="text"
                    placeholder="e.g. Auditorium Hall 2 &amp; Quad"
                    value={createForm.location}
                    onChange={(e) => setCreateForm({ ...createForm, location: e.target.value })}
                    required
                  />
                </label>
              </div>

              <label>
                Full Event Description &amp; Details *
                <textarea
                  rows={4}
                  placeholder="Detail the agenda, prerequisites, student perks, certificates, or speaker information..."
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  required
                />
              </label>

              <div className="modal-footer">
                <button
                  type="submit"
                  className="button button-primary"
                  disabled={creating}
                >
                  {creating ? 'Submitting…' : 'Submit for Admin Approval →'}
                </button>
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW ATTENDEES MODAL */}
      {selectedAttendeesEvent && (
        <div className="modal-backdrop" onClick={() => setSelectedAttendeesEvent(null)}>
          <div
            className="modal-dialog modal-attendees-dialog"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="modal-header">
              <div>
                <span className="modal-eyebrow">REGISTERED ATTENDEE ROSTER</span>
                <h2 className="modal-title">{selectedAttendeesEvent.title}</h2>
              </div>
              <button
                type="button"
                className="modal-close"
                onClick={() => setSelectedAttendeesEvent(null)}
              >
                ✕
              </button>
            </header>

            <div className="attendees-summary-card">
              <div className="summary-col">
                <strong>Total Students Registered</strong>
                <span className="large-stat">{attendeesList.length}</span>
              </div>
              <div className="summary-col">
                <strong>Event Venue</strong>
                <span>{selectedAttendeesEvent.location}</span>
              </div>
              <div className="summary-col">
                <strong>Schedule</strong>
                <span>{selectedAttendeesEvent.eventDate}</span>
              </div>
            </div>

            <div className="attendees-list-section">
              <h4>Registered Student Emails</h4>
              {loadingAttendees ? (
                <p>Loading attendees list…</p>
              ) : attendeesList.length === 0 ? (
                <div className="empty-attendees">
                  <p>No students have registered for this event yet.</p>
                </div>
              ) : (
                <div className="emails-scroll-box">
                  <ul className="attendee-emails-list">
                    {attendeesList.map((email, idx) => (
                      <li key={idx} className="attendee-email-row">
                        <span className="attendee-idx">{idx + 1}.</span>
                        <span className="attendee-email-text">{email}</span>
                        <span className="attendee-status-tag">Confirmed Attendee</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="modal-footer">
              {attendeesList.length > 0 && (
                <button
                  type="button"
                  className="button button-primary"
                  onClick={() => {
                    navigator.clipboard?.writeText(attendeesList.join(', '))
                    showToast('Copied email list to clipboard!')
                  }}
                >
                  Copy All Emails
                </button>
              )}
              <button
                type="button"
                className="button button-secondary"
                onClick={() => setSelectedAttendeesEvent(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
