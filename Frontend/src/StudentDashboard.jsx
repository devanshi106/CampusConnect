import { useEffect, useState, useMemo } from 'react'
import campusConnectLogo from './assets/campusconnect-logo.png'

const Arrow = () => <span aria-hidden="true">→</span>
const Logo = () => <img className="logo-mark" src={campusConnectLogo} alt="" />
const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

const defaultMockEvents = [
  {
    id: 1,
    title: 'CodeQuest 2026: 24-Hour Campus Hackathon',
    category: 'Hackathons',
    organizer: 'Devs & Hackers Society',
    location: 'Innovation Center & Virtual Hub',
    eventDate: 'Oct 24-25, 2026 • 9:00 AM',
    description:
      'CodeQuest 2026 is our flagship annual 24-hour campus hackathon bringing together programmers, designers, and innovators from all departments. Build solutions for Smart Campus, AI & Accessibility, or Sustainability. Teams of up to 4 members are supported by dedicated industry mentors from top tech companies. Enjoy midnight snacks, high-speed WiFi, hardware lab access, sponsor swag, and compete for a $1,500 prize pool.',
  },
  {
    id: 2,
    title: 'AI Sprint: Agentic AI Hackathon',
    category: 'Hackathons',
    organizer: 'AI Research Group',
    location: 'CS Seminar Hall 2',
    eventDate: 'Nov 07, 2026 • 10:00 AM',
    description:
      'A fast-paced builder sprint focused on autonomous agent workflows, LLM applications, and multimodal tools. Participants will receive free API cloud credits and access to GPU compute clusters. Tackle real challenges in education tech and campus automation. Submissions are judged on novelty, architecture robustness, and practical usability.',
  },
  {
    id: 3,
    title: 'Robotics Club: BattleBot Arena & Recruitment',
    category: 'Clubs',
    organizer: 'Robotics & Automation Club',
    location: 'Campus Amphitheatre',
    eventDate: 'Oct 18, 2026 • 4:00 PM',
    description:
      'Witness custom high-torque combat bots clash live in the reinforced arena! The Robotics & Automation Club is opening recruitment across mechanical engineering, embedded systems, and firmware divisions. No prior hardware background required—hands-on starter bootcamps will be hosted for all accepted inductees.',
  },
  {
    id: 4,
    title: 'Design Guild: UI/UX Portfolio Jam & Critique',
    category: 'Clubs',
    organizer: 'Creative Design Guild',
    location: 'Design Studio, Block B',
    eventDate: 'Oct 21, 2026 • 3:30 PM',
    description:
      'Join senior student designers and alumni mentors for an interactive design review and Figma jam. Bring your mobile app designs, web wireframes, or graphic illustrations to receive constructive 1-on-1 critique. Network with peers who share an obsession for typography, clean layouts, and intuitive micro-interactions.',
  },
  {
    id: 5,
    title: 'Full-Stack Web Development: React & Spring Boot',
    category: 'Workshops',
    organizer: 'ACM Student Chapter',
    location: 'Computer Lab 4',
    eventDate: 'Oct 16, 2026 • 2:00 PM',
    description:
      'An intensive hands-on masterclass taking you through modern enterprise web architecture. Learn how to design RESTful APIs with Spring Boot, connect PostgreSQL via Spring Data JPA, handle password hashing with BCrypt, and build a reactive user interface in React. All attendees receive downloadable project templates and a certificate of completion.',
  },
  {
    id: 6,
    title: 'Cloud DevOps & Kubernetes Crash Course',
    category: 'Workshops',
    organizer: 'Cloud Computing Society',
    location: 'Virtual (Google Meet)',
    eventDate: 'Oct 29, 2026 • 6:00 PM',
    description:
      'Bridge the gap between coding on localhost and shipping reliable apps to the cloud. This interactive workshop covers containerizing applications with Docker, orchestrating clusters with Kubernetes, and setting up automated CI/CD deployment pipelines on AWS.',
  },
  {
    id: 7,
    title: 'AlgoClash: Speed Coding Championship',
    category: 'Competitions',
    organizer: 'Competitive Programming Wing',
    location: 'Computer Center 1 & 2',
    eventDate: 'Nov 02, 2026 • 5:00 PM',
    description:
      'Sharpen your competitive programming instincts! Solve 6 algorithmic problems of escalating difficulty within 2 hours. Problems span graph theory, dynamic programming, and greedy optimization. Live real-time leaderboard display, sponsor prizes, and direct invites to the regional inter-college ICPC training camp.',
  },
  {
    id: 8,
    title: 'Campus PitchDeck 2026: Startup Battle',
    category: 'Competitions',
    organizer: 'E-Cell (Entrepreneurship Cell)',
    location: 'Management Auditorium',
    eventDate: 'Nov 12, 2026 • 11:00 AM',
    description:
      'Got an innovative business idea or technology venture? Pitch your 5-minute slide deck to a jury of alumni founders and early-stage venture capitalists. Top 3 teams receive micro-grant funding of $500, incubator co-working desks, and complimentary legal mentorship.',
  },
  {
    id: 9,
    title: 'Student Council',
    category: 'Committees',
    organizer: 'Student Organizers Body',
    location: 'Senate Hall & Council Office Rm 204',
    eventDate: 'Weekly Assembly • Wed 4:00 PM',
    description:
      'The apex student governing committee representing the student community. Student organizers lead campus policy dialogues with university administration, manage campus club funds, organize flagship fests, and champion student rights and campus welfare. Open to all students wishing to join or stand for student elections.',
  },
  {
    id: 10,
    title: 'CSI Committee',
    category: 'Committees',
    organizer: 'Computer Society of India',
    location: 'Auditorium Hall 1 & CS Labs',
    eventDate: 'Bi-Weekly Tech Sprints • Fri 3:30 PM',
    description:
      'The Computer Society of India (CSI) student committee is the premier technical body of student organizers on campus. Directs annual hackathons, technical conferences, coding bootcamps, and open-source research wings. Members gain access to national CSI publications, tech certifications, and executive organizing roles.',
  },
  {
    id: 11,
    title: 'Airnova',
    category: 'Committees',
    organizer: 'Aviation & Aeromodelling Committee',
    location: 'College Sports Grounds & Aero Hangar',
    eventDate: 'Weekly Build & Trials • Sat 10:00 AM',
    description:
      'Airnova is the official student aviation, aeromodelling, and drone engineering committee. Student organizers build autonomous quadcopters, FPV racing drones, and fixed-wing RC aircraft. Join as a student pilot, avionics researcher, CAD designer, or lead organizer for national aero championships and drone expos.',
  },
  {
    id: 12,
    title: 'Sports Committee',
    category: 'Committees',
    organizer: 'Athletics & Games Committee',
    location: 'Indoor Sports Complex & Track Grounds',
    eventDate: 'Daily Practice & League Trials • 4:30 PM',
    description:
      'The Sports Committee of student organizers spearheads all campus athletics, inter-department tournaments, and university varsity teams in Football, Basketball, Cricket, Badminton, and Table Tennis. Student members manage tournament fixtures, referee matches, maintain sports facilities, and lead the annual sports fest.',
  },
]

const categories = [
  { id: 'all', label: 'All Events', icon: '✦' },
  { id: 'Hackathons', label: 'Hackathons', icon: '⚡' },
  { id: 'Clubs', label: 'Clubs', icon: '◒' },
  { id: 'Workshops', label: 'Workshops', icon: '🛠️' },
  { id: 'Competitions', label: 'Competitions', icon: '🏆' },
  { id: 'Committees', label: 'Committees', icon: '🏛️' },
  { id: 'registered', label: 'My Registrations', icon: '✓' },
]

export default function StudentDashboard({ onHome, onLogout }) {
  const [user] = useState(() => {
    try {
      const stored = localStorage.getItem('campusconnect-user')
      return stored ? JSON.parse(stored) : { email: 'student@college.edu', role: 'STUDENT' }
    } catch {
      return { email: 'student@college.edu', role: 'STUDENT' }
    }
  })

  const [events, setEvents] = useState(defaultMockEvents)
  const [registeredIds, setRegisteredIds] = useState(() => {
    try {
      const stored = localStorage.getItem(`campusconnect-reg-${user.email}`)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  const [selectedCategory, setSelectedCategory] = useState('all')
  const [committeeSubFilter, setCommitteeSubFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeModalEvent, setActiveModalEvent] = useState(null)
  const [registeringId, setRegisteringId] = useState(null)
  const [toastMessage, setToastMessage] = useState('')

  // Reset committee sub-filter when category switches
  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId)
    setCommitteeSubFilter('')
  }

  // Load events from backend
  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch(`${apiUrl}/api/events`)
        if (response.ok) {
          const data = await response.json()
          if (Array.isArray(data) && data.length > 0) {
            setEvents(data)
          }
        }
      } catch {
        // Fall back gracefully to default mock events
      }
    }

    async function fetchRegistrations() {
      if (!user?.email) return
      try {
        const response = await fetch(`${apiUrl}/api/events/my-registrations?email=${encodeURIComponent(user.email)}`)
        if (response.ok) {
          const ids = await response.json()
          if (Array.isArray(ids)) {
            setRegisteredIds(ids)
            localStorage.setItem(`campusconnect-reg-${user.email}`, JSON.stringify(ids))
          }
        }
      } catch {
        // Retain local registered IDs
      }
    }

    fetchEvents()
    fetchRegistrations()
  }, [user?.email])

  const showToast = (message) => {
    setToastMessage(message)
    setTimeout(() => setToastMessage(''), 3500)
  }

  const handleRegister = async (eventItem) => {
    const isRegistered = registeredIds.includes(eventItem.id)
    const isCommittee = eventItem.category?.toLowerCase() === 'committees'
    setRegisteringId(eventItem.id)

    try {
      if (isRegistered) {
        // Unregister
        try {
          await fetch(`${apiUrl}/api/events/${eventItem.id}/register?email=${encodeURIComponent(user.email)}`, {
            method: 'DELETE',
          })
        } catch {
          // If offline, still update local state
        }
        const updated = registeredIds.filter((id) => id !== eventItem.id)
        setRegisteredIds(updated)
        localStorage.setItem(`campusconnect-reg-${user.email}`, JSON.stringify(updated))
        showToast(
          isCommittee
            ? `Left the "${eventItem.title}" committee.`
            : `Registration cancelled for "${eventItem.title}".`
        )
      } else {
        // Register
        try {
          await fetch(`${apiUrl}/api/events/${eventItem.id}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email }),
          })
        } catch {
          // If offline, still update local state
        }
        const updated = [...registeredIds, eventItem.id]
        setRegisteredIds(updated)
        localStorage.setItem(`campusconnect-reg-${user.email}`, JSON.stringify(updated))
        showToast(
          isCommittee
            ? `🎉 You have joined the "${eventItem.title}" committee!`
            : `🎉 You are registered for "${eventItem.title}"!`
        )
      }
    } finally {
      setRegisteringId(null)
    }
  }

  // Filter events
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      // Category filter
      if (selectedCategory === 'registered') {
        if (!registeredIds.includes(ev.id)) return false
      } else if (selectedCategory !== 'all') {
        if (ev.category?.toLowerCase() !== selectedCategory.toLowerCase()) return false
      }

      // Committee sub-filter (when in Committees category)
      if (selectedCategory.toLowerCase() === 'committees' && committeeSubFilter) {
        if (!ev.title?.toLowerCase().includes(committeeSubFilter.toLowerCase())) {
          return false
        }
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const matchTitle = ev.title?.toLowerCase().includes(query)
        const matchDesc = ev.description?.toLowerCase().includes(query)
        const matchOrg = ev.organizer?.toLowerCase().includes(query)
        const matchLoc = ev.location?.toLowerCase().includes(query)
        return matchTitle || matchDesc || matchOrg || matchLoc
      }

      return true
    })
  }, [events, selectedCategory, committeeSubFilter, registeredIds, searchQuery])

  const getCommitteeIcon = (item) => {
    if (item.category?.toLowerCase() === 'committees') {
      const t = item.title?.toLowerCase() || ''
      if (t.includes('council')) return '🏛️'
      if (t.includes('csi')) return '💻'
      if (t.includes('airnova')) return '✈️'
      if (t.includes('sports')) return '🏅'
      return '🏛️'
    }
    return null
  }

  const categoryColorClass = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'hackathons':
        return 'cat-hackathons'
      case 'clubs':
        return 'cat-clubs'
      case 'workshops':
        return 'cat-workshops'
      case 'competitions':
        return 'cat-competitions'
      case 'committees':
      case 'committee':
        return 'cat-committees'
      default:
        return 'cat-default'
    }
  }

  return (
    <div className="student-dashboard">
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
            <span className="user-badge">Student</span>
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

      {/* Dashboard Banner & Stats */}
      <section className="dashboard-banner">
        <div className="banner-content">
          <div className="banner-copy">
            <p className="eyebrow">
              <i /> STUDENT DASHBOARD
            </p>
            <h1>
              Campus Events &amp; <em>Opportunities.</em>
            </h1>
            <p className="banner-subtitle">
              Discover workshops, hackathons, club meetings, and competitions tailored for your college experience.
            </p>
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <strong>{events.length}</strong>
              <span>Campus Events</span>
            </div>
            <div className="stat-card">
              <strong>5</strong>
              <span>Active Categories</span>
            </div>
            <div className="stat-card stat-registered">
              <strong>{registeredIds.length}</strong>
              <span>My Registrations</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Dashboard Layout with Sidebar */}
      <div className="dashboard-container">
        {/* Left Categories Sidebar */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-card">
            <div className="sidebar-header">
              <span className="sidebar-eyebrow">Explore</span>
              <h3 className="sidebar-title">Categories</h3>
            </div>

            <nav className="sidebar-nav" aria-label="Event Categories">
              {categories.map((cat) => {
                const count =
                  cat.id === 'all'
                    ? events.length
                    : cat.id === 'registered'
                    ? registeredIds.length
                    : events.filter((e) => e.category?.toLowerCase() === cat.id.toLowerCase()).length

                const isActive = selectedCategory === cat.id

                return (
                  <button
                    key={cat.id}
                    type="button"
                    className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => handleSelectCategory(cat.id)}
                  >
                    <span className="sidebar-item-icon">{cat.icon}</span>
                    <span className="sidebar-item-label">{cat.label}</span>
                    <span className="sidebar-item-count">{count}</span>
                  </button>
                )
              })}
            </nav>

            <div className="sidebar-divider" />

            <div className="sidebar-quick-stats">
              <p className="quick-stats-label">My Registration Stats</p>
              <div className="quick-stats-row">
                <div className="quick-stat-box">
                  <strong>{registeredIds.length}</strong>
                  <span>Registered</span>
                </div>
                <div className="quick-stat-box">
                  <strong>{events.length - registeredIds.length}</strong>
                  <span>Available</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Events Feed Area */}
        <main className="dashboard-content">
          <div className="content-toolbar">
            <div className="content-heading">
              <span className="eyebrow">
                <i /> {selectedCategory === 'all' ? 'ALL EVENTS' : selectedCategory.toUpperCase()}
              </span>
              <h2>
                {categories.find((c) => c.id === selectedCategory)?.label ?? 'Events'}
              </h2>
              <p className="content-subtext">
                {selectedCategory === 'all' && 'Discover all active campus happenings, workshops, hackathons, and gatherings.'}
                {selectedCategory === 'Hackathons' && 'High-energy coding hackathons, prototype sprints, and builder challenges.'}
                {selectedCategory === 'Clubs' && 'Campus society meetings, club recruitments, orientations, and community jams.'}
                {selectedCategory === 'Workshops' && 'Interactive masterclasses, practical coding labs, and technical crash courses.'}
                {selectedCategory === 'Competitions' && 'Competitive programming derbies, pitch deck battles, and student contests.'}
                {(selectedCategory === 'Committees' || selectedCategory === 'committee') &&
                  'Official student organizer committees. Explore each committee block below to view details, meeting schedules, and join.'}
                {selectedCategory === 'registered' && 'Events and committees you have registered for or joined. Your personal campus schedule.'}
              </p>
            </div>

            <div className="search-box">
              <input
                type="text"
                placeholder="Search by title, club, or keyword…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search events"
              />
              {searchQuery && (
                <button className="clear-search" onClick={() => setSearchQuery('')} title="Clear search">
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Quick Sub-Filter Tabs for Committees */}
          {selectedCategory.toLowerCase() === 'committees' && (
            <div className="committee-sub-tabs" role="tablist" aria-label="Filter committees">
              <button
                type="button"
                className={`committee-sub-tab ${!committeeSubFilter ? 'active' : ''}`}
                onClick={() => setCommitteeSubFilter('')}
              >
                All 4 Committees
              </button>
              {[
                { name: 'Student Council', icon: '🏛️' },
                { name: 'CSI Committee', icon: '💻' },
                { name: 'Airnova', icon: '✈️' },
                { name: 'Sports Committee', icon: '🏅' },
              ].map((c) => (
                <button
                  key={c.name}
                  type="button"
                  className={`committee-sub-tab ${committeeSubFilter === c.name ? 'active' : ''}`}
                  onClick={() => setCommitteeSubFilter(committeeSubFilter === c.name ? '' : c.name)}
                >
                  <span className="sub-tab-icon">{c.icon}</span> {c.name}
                </button>
              ))}
            </div>
          )}

          {/* Events Grid */}
          <div className="events-grid-wrapper">
          {filteredEvents.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📂</span>
              <h3>No events found</h3>
              <p>
                {selectedCategory === 'registered'
                  ? "You haven't registered for any events yet. Explore events above and click 'Register'!"
                  : 'Try selecting a different category or clearing your search query.'}
              </p>
              {selectedCategory !== 'all' && (
                <button className="button button-primary" onClick={() => setSelectedCategory('all')}>
                  View all events
                </button>
              )}
            </div>
          ) : (
            <div className="dashboard-event-grid">
              {filteredEvents.map((item) => {
                const isRegistered = registeredIds.includes(item.id)
                const isPending = registeringId === item.id
                const isCommittee = item.category?.toLowerCase() === 'committees'
                const committeeIcon = getCommitteeIcon(item)

                return (
                  <article
                    key={item.id}
                    className={`event-tile ${isRegistered ? 'is-registered' : ''} ${
                      isCommittee ? 'committee-tile' : ''
                    }`}
                  >
                    <div className="event-tile-header">
                      <span className={`category-pill ${categoryColorClass(item.category)}`}>
                        {isCommittee ? '🏛️ Committee' : item.category}
                      </span>
                      {isRegistered && (
                        <span className="registered-badge">
                          {isCommittee ? 'Joined ✓' : 'Registered ✓'}
                        </span>
                      )}
                    </div>

                    <h3 className="event-tile-title">
                      {committeeIcon && <span className="title-inline-icon">{committeeIcon} </span>}
                      {item.title}
                    </h3>

                    <div className="event-tile-meta">
                      <div className="meta-item">
                        <span className="meta-icon">📅</span>
                        <span>{item.eventDate || 'Coming soon'}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-icon">📍</span>
                        <span>{item.location || 'Campus Center'}</span>
                      </div>
                      {item.organizer && (
                        <div className="meta-item organizer-item">
                          <span className="meta-icon">◈</span>
                          <span>{item.organizer}</span>
                        </div>
                      )}
                    </div>

                    <p className="event-tile-snippet">
                      {item.description
                        ? item.description.length > 135
                          ? item.description.slice(0, 135) + '…'
                          : item.description
                        : 'Explore full details to learn more and sign up.'}
                    </p>

                    <div className="event-tile-actions">
                      <button
                        type="button"
                        className="button-link view-details-btn"
                        onClick={() => setActiveModalEvent(item)}
                      >
                        {isCommittee ? 'Committee Details' : 'View Full Details'} <Arrow />
                      </button>

                      <button
                        type="button"
                        className={`button ${isRegistered ? 'button-registered' : 'button-primary'} register-btn`}
                        disabled={isPending}
                        onClick={() => handleRegister(item)}
                      >
                        {isPending
                          ? 'Updating…'
                          : isRegistered
                          ? isCommittee ? 'Joined ✓' : 'Registered ✓'
                          : isCommittee ? 'Join Committee' : 'Register Now'}
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>

      {/* Full Description Detail Modal */}
      {activeModalEvent && (
        <div className="modal-backdrop" onClick={() => setActiveModalEvent(null)}>
          <div
            className="modal-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="modal-header">
              <span className={`category-pill ${categoryColorClass(activeModalEvent.category)}`}>
                {activeModalEvent.category?.toLowerCase() === 'committees'
                  ? '🏛️ Committee • Student Organizers'
                  : activeModalEvent.category}
              </span>
              <button
                type="button"
                className="modal-close"
                onClick={() => setActiveModalEvent(null)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </header>

            <h2 id="modal-title" className="modal-title">
              {getCommitteeIcon(activeModalEvent) && (
                <span className="title-inline-icon">{getCommitteeIcon(activeModalEvent)} </span>
              )}
              {activeModalEvent.title}
            </h2>

            <div className="modal-meta-grid">
              <div className="modal-meta-card">
                <strong>{activeModalEvent.category?.toLowerCase() === 'committees' ? 'Meeting Schedule' : 'Schedule'}</strong>
                <span>{activeModalEvent.eventDate || 'TBA'}</span>
              </div>
              <div className="modal-meta-card">
                <strong>{activeModalEvent.category?.toLowerCase() === 'committees' ? 'Office / Venue' : 'Venue'}</strong>
                <span>{activeModalEvent.location || 'Campus Center'}</span>
              </div>
              <div className="modal-meta-card">
                <strong>{activeModalEvent.category?.toLowerCase() === 'committees' ? 'Committee Body' : 'Organized By'}</strong>
                <span>{activeModalEvent.organizer || 'Student Committee'}</span>
              </div>
            </div>

            <div className="modal-body">
              <h4>
                {activeModalEvent.category?.toLowerCase() === 'committees'
                  ? 'About this Committee & Organizer Opportunities'
                  : 'Full Event Description'}
              </h4>
              <p className="modal-description">{activeModalEvent.description}</p>
            </div>

            <footer className="modal-footer">
              <button
                type="button"
                className={`button ${
                  registeredIds.includes(activeModalEvent.id) ? 'button-registered' : 'button-primary'
                } modal-action-btn`}
                disabled={registeringId === activeModalEvent.id}
                onClick={() => handleRegister(activeModalEvent)}
              >
                {registeringId === activeModalEvent.id
                  ? 'Processing…'
                  : registeredIds.includes(activeModalEvent.id)
                  ? activeModalEvent.category?.toLowerCase() === 'committees'
                    ? 'Joined Committee ✓ (Click to Leave)'
                    : 'Registered ✓ (Click to Cancel)'
                  : activeModalEvent.category?.toLowerCase() === 'committees'
                  ? 'Join this Committee'
                  : 'Register for this Event'}
              </button>
              <button
                type="button"
                className="button button-secondary"
                onClick={() => setActiveModalEvent(null)}
              >
                Close
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  )
}
