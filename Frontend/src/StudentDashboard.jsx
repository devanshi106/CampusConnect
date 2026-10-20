import { useEffect, useState, useMemo } from 'react'
import Logo from './components/Logo'
import { API_URL as apiUrl } from './config/api'
import { normalizeCategory, categoryColorClass } from './utils/categories'
import { defaultMockEvents } from './data/defaultMockEvents'

const Arrow = () => <span aria-hidden="true">→</span>

const INITIAL_BLANK_PROFILE = {
  fullName: '',
  phone: '',
  college: '',
  department: '',
  year: '',
  rollNo: '',
  portfolio: '',
  skills: '',
  bio: '',
}

function getEventRequirements(eventItem) {
  if (!eventItem) return []
  if (eventItem.registrationRequirements && eventItem.registrationRequirements.trim()) {
    return eventItem.registrationRequirements
      .split(';')
      .map((q) => q.trim())
      .filter(Boolean)
  }
  const cat = (eventItem.category || '').toLowerCase()
  if (cat.includes('hackathon')) {
    return [
      'Number of Team Members (e.g. Solo, 2 Members, 4 Members)',
      'Topic / Track Selected for Hackathon',
      'Project Idea / GitHub / Tech Stack',
    ]
  } else if (cat.includes('workshop')) {
    return [
      'Prior Experience Level in Topic (Beginner / Intermediate / Advanced)',
      'What do you hope to learn or build in this workshop?',
    ]
  } else if (cat.includes('committee') || cat.includes('club')) {
    return [
      'Statement of Purpose (Why do you wish to join?)',
      'Relevant Leadership or Technical Experience',
      'Available Hours per Week for Committee Activities',
    ]
  } else if (cat.includes('competition')) {
    return [
      'Participation Mode (Solo or Team Entry)',
      'Chosen Competition Track / Idea Summary',
    ]
  } else if (cat.includes('seminar') || cat.includes('webinar')) {
    return [
      'Topic of Primary Interest',
      'Questions for the Speaker or Panelists',
    ]
  }
  return [
    'Statement of Interest / Why do you want to attend?',
    'Relevant Background or Skills',
  ]
}

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

  // Criteria-based registration form modal states
  const [registrationModalEvent, setRegistrationModalEvent] = useState(() => {
    try {
      const regParam = new URLSearchParams(window.location.search).get('register')
      if (regParam) {
        return defaultMockEvents.find(
          (e) => String(e.id) === regParam || e.title?.toLowerCase().includes(regParam.toLowerCase())
        ) || null
      }
    } catch {
      // fallback
    }
    return null
  })

  const [registrationAnswers, setRegistrationAnswers] = useState(() => {
    try {
      const regParam = new URLSearchParams(window.location.search).get('register')
      if (regParam) {
        const found = defaultMockEvents.find(
          (e) => String(e.id) === regParam || e.title?.toLowerCase().includes(regParam.toLowerCase())
        )
        if (found) {
          const reqs = getEventRequirements(found)
          const initial = {}
          reqs.forEach((r) => {
            initial[r] = ''
          })
          return initial
        }
      }
    } catch {
      // fallback
    }
    return {}
  })

  const [incompleteProfileAlert, setIncompleteProfileAlert] = useState(false)

  const [currentView, setCurrentView] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      if (params.get('view') === 'profile') return 'profile'
    } catch {
      // fallback
    }
    return 'feed'
  }) // 'feed' | 'profile'

  const defaultProfile = useMemo(() => ({
    ...INITIAL_BLANK_PROFILE,
    email: user.email || '',
  }), [user?.email])

  const [profile, setProfile] = useState(() => {
    try {
      const stored = localStorage.getItem(`campusconnect-profile-${user.email}`)
      if (stored) {
        const parsed = JSON.parse(stored)
        // If it was the previous mock profile with Aarav Sharma, reset to blank
        if (parsed.fullName === 'Aarav Sharma') {
          return defaultProfile
        }
        return { ...defaultProfile, ...parsed, email: user.email || '' }
      }
      return defaultProfile
    } catch {
      return defaultProfile
    }
  })

  const handleProfileChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    try {
      localStorage.setItem(`campusconnect-profile-${user.email}`, JSON.stringify(profile))
      await fetch(`${apiUrl}/api/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })
      showToast('✅ Profile updated and saved to database!')
    } catch {
      showToast('Profile saved locally.')
    }
  }

  // Dynamically derive categories from all events loaded from DB
  const categories = useMemo(() => {
    const baseList = [
      { id: 'all', label: 'All Events', icon: '✦' },
      { id: 'Hackathons', label: 'Hackathons', icon: '⚡' },
      { id: 'Clubs', label: 'Clubs', icon: '◒' },
      { id: 'Workshops', label: 'Workshops', icon: '🛠️' },
      { id: 'Competitions', label: 'Competitions', icon: '🏆' },
      { id: 'Committees', label: 'Committees', icon: '🏛️' },
      { id: 'Seminars & Webinars', label: 'Seminars & Webinars', icon: '🎤' },
      { id: 'Virtual Events', label: 'Virtual Events', icon: '🌐' },
    ]

    const customIcons = {
      Hackathons: '⚡',
      Clubs: '◒',
      Workshops: '🛠️',
      Competitions: '🏆',
      Committees: '🏛️',
      'Seminars & Webinars': '🎤',
      'Virtual Events': '🌐',
    }

    const presentCategories = new Set(events.map((e) => normalizeCategory(e.category)))
    const result = [{ id: 'all', label: 'All Events', icon: '✦' }]

    baseList.slice(1).forEach((cat) => {
      if (presentCategories.has(cat.id)) {
        result.push(cat)
        presentCategories.delete(cat.id)
      }
    })

    // Any other custom category in database reflects dynamically!
    presentCategories.forEach((catName) => {
      if (catName && catName !== 'General') {
        result.push({
          id: catName,
          label: catName,
          icon: customIcons[catName] || '📌',
        })
      }
    })

    result.push({ id: 'registered', label: 'My Registrations', icon: '✓' })
    return result
  }, [events])

  // Reset committee sub-filter when category switches
  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId)
    setCommitteeSubFilter('')
    setCurrentView('feed')
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

    async function fetchProfileFromDb() {
      if (!user?.email) return
      try {
        const response = await fetch(`${apiUrl}/api/profile?email=${encodeURIComponent(user.email)}`)
        if (response.ok) {
          const data = await response.json()
          if (data && (data.fullName || data.department || data.year || data.phone || data.college || data.rollNo || data.portfolio || data.skills || data.bio)) {
            setProfile((prev) => ({
              ...defaultProfile,
              ...prev,
              ...data,
              email: user.email,
            }))
            localStorage.setItem(`campusconnect-profile-${user.email}`, JSON.stringify({ ...data, email: user.email }))
          }
        }
      } catch {
        // Fall back to local storage
      }
    }

    fetchEvents()
    fetchRegistrations()
    fetchProfileFromDb()
  }, [user?.email, defaultProfile])

  const showToast = (message) => {
    setToastMessage(message)
    setTimeout(() => setToastMessage(''), 3500)
  }

  // Opens the criteria-based registration modal or prompts to unregister/complete profile
  const handleOpenRegistrationModal = (eventItem) => {
    const isRegistered = registeredIds.includes(eventItem.id)
    if (isRegistered) {
      if (window.confirm(`Are you sure you want to cancel your registration for "${eventItem.title}"?`)) {
        handleCancelRegistration(eventItem)
      }
      return
    }

    // Require essential locked credentials from profile
    if (!profile.fullName?.trim() || !profile.year || !profile.department) {
      setIncompleteProfileAlert(true)
      return
    }

    // Pre-populate requirements
    const reqs = getEventRequirements(eventItem)
    const initialAnswers = {}
    reqs.forEach((r) => {
      initialAnswers[r] = ''
    })
    setRegistrationAnswers(initialAnswers)
    setRegistrationModalEvent(eventItem)
  }

  const handleCancelRegistration = async (eventItem) => {
    const isCommittee = normalizeCategory(eventItem.category).toLowerCase() === 'committees'
    setRegisteringId(eventItem.id)
    try {
      await fetch(`${apiUrl}/api/events/${eventItem.id}/register?email=${encodeURIComponent(user.email)}`, {
        method: 'DELETE',
      })
    } catch {
      // offline fallback
    }
    const updated = registeredIds.filter((id) => id !== eventItem.id)
    setRegisteredIds(updated)
    localStorage.setItem(`campusconnect-reg-${user.email}`, JSON.stringify(updated))
    setRegisteringId(null)
    showToast(
      isCommittee
        ? `Left the "${eventItem.title}" committee.`
        : `Registration cancelled for "${eventItem.title}".`
    )
  }

  const handleSubmitRegistration = async (e) => {
    e.preventDefault()
    if (!registrationModalEvent) return
    const ev = registrationModalEvent
    const isCommittee = normalizeCategory(ev.category).toLowerCase() === 'committees'

    setRegisteringId(ev.id)
    try {
      const payload = {
        email: user.email,
        studentName: profile.fullName,
        department: profile.department,
        year: profile.year,
        answers: JSON.stringify(registrationAnswers),
      }

      const response = await fetch(`${apiUrl}/api/events/${ev.id}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.ok || response.status === 201) {
        const updated = [...registeredIds, ev.id]
        setRegisteredIds(updated)
        localStorage.setItem(`campusconnect-reg-${user.email}`, JSON.stringify(updated))
        setRegistrationModalEvent(null)
        showToast(
          isCommittee
            ? `🎉 Successfully submitted application and joined "${ev.title}"!`
            : `🎉 Registration confirmed for "${ev.title}"!`
        )
      } else {
        const err = await response.json().catch(() => null)
        showToast(err?.message || 'Error submitting registration. Please try again.')
      }
    } catch {
      const updated = [...registeredIds, ev.id]
      setRegisteredIds(updated)
      localStorage.setItem(`campusconnect-reg-${user.email}`, JSON.stringify(updated))
      setRegistrationModalEvent(null)
      showToast(`🎉 Registration saved for "${ev.title}"!`)
    } finally {
      setRegisteringId(null)
    }
  }

  // Alias for backward compatibility
  const handleRegister = (eventItem) => {
    handleOpenRegistrationModal(eventItem)
  }

  // Filter events
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      // Category filter
      if (selectedCategory === 'registered') {
        if (!registeredIds.includes(ev.id)) return false
      } else if (selectedCategory !== 'all') {
        if (normalizeCategory(ev.category).toLowerCase() !== selectedCategory.toLowerCase()) {
          return false
        }
      }

      // Committee sub-filter (when in Committees category)
      if (normalizeCategory(selectedCategory).toLowerCase() === 'committees' && committeeSubFilter) {
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
        const matchDept = ev.department?.toLowerCase().includes(query)
        const matchCat = ev.category?.toLowerCase().includes(query)
        return matchTitle || matchDesc || matchOrg || matchLoc || matchDept || matchCat
      }

      return true
    })
  }, [events, selectedCategory, committeeSubFilter, registeredIds, searchQuery])

  const getCommitteeIcon = (item) => {
    if (normalizeCategory(item.category).toLowerCase() === 'committees') {
      const t = item.title?.toLowerCase() || ''
      if (t.includes('council')) return '🏛️'
      if (t.includes('csi')) return '💻'
      if (t.includes('airnova')) return '✈️'
      if (t.includes('sports')) return '🏅'
      return '🏛️'
    }
    return null
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
            <button
              type="button"
              className={`button nav-btn ${currentView === 'profile' ? 'button-primary' : 'button-secondary'}`}
              onClick={() => setCurrentView((prev) => (prev === 'profile' ? 'feed' : 'profile'))}
            >
              👤 My Profile
            </button>
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
      {currentView === 'profile' ? (
        <section className="dashboard-banner">
          <div className="banner-content">
            <div className="banner-copy">
              <p className="eyebrow">
                <i /> STUDENT PROFILE &amp; ACADEMIC CREDENTIALS
              </p>
              <h1>
                Student <em>Profile.</em>
              </h1>
              <p className="banner-subtitle">
                Manage your official university credentials. These verified details directly auto-fill and lock required criteria when registering for campus events.
              </p>
            </div>

            <div className="stats-row">
              <div className="stat-card">
                <strong>{profile.year ? (profile.year.match(/\((.*?)\)/)?.[1] || profile.year) : '—'}</strong>
                <span>Academic Year</span>
              </div>
              <div className="stat-card">
                <strong style={{ fontSize: '18px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={profile.department || 'Not specified'}>
                  {profile.department ? profile.department.split(' ')[0] : '—'}
                </strong>
                <span>Department</span>
              </div>
              <div className="stat-card stat-registered">
                <strong>{registeredIds.length}</strong>
                <span>My Registrations</span>
              </div>
            </div>
          </div>
        </section>
      ) : (
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
                Explore hackathons, workshops, club drives, webinars, and student committees directly synced with campus data.
              </p>
            </div>

            <div className="stats-row">
              <div className="stat-card">
                <strong>{events.length}</strong>
                <span>Campus Events</span>
              </div>
              <div className="stat-card">
                <strong>{categories.length - 2}</strong>
                <span>Categories</span>
              </div>
              <div className="stat-card stat-registered">
                <strong>{registeredIds.length}</strong>
                <span>My Registrations</span>
              </div>
            </div>
          </div>
        </section>
      )}

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
                    : events.filter(
                        (e) => normalizeCategory(e.category).toLowerCase() === cat.id.toLowerCase()
                      ).length

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

            <button
              type="button"
              className={`sidebar-nav-item ${currentView === 'profile' ? 'active' : ''}`}
              onClick={() => setCurrentView('profile')}
            >
              <span className="sidebar-item-icon">👤</span>
              <span className="sidebar-item-label">My Profile</span>
              <span className="sidebar-item-count">Edit</span>
            </button>

            <div className="sidebar-divider" />

            <div className="sidebar-quick-stats">
              <p className="quick-stats-label">My Registration Stats</p>
              <div className="quick-stats-row">
                <div className="quick-stat-box">
                  <strong>{registeredIds.length}</strong>
                  <span>Registered</span>
                </div>
                <div className="quick-stat-box">
                  <strong>{Math.max(0, events.length - registeredIds.length)}</strong>
                  <span>Available</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Events Feed Area */}
        <main className="dashboard-content">
          {currentView === 'profile' ? (
            <div className="profile-card">
              <div className="profile-top-banner">
                <div className="profile-user-summary">
                  <div className="profile-avatar-circle">
                    {profile.fullName && profile.fullName.trim()
                      ? profile.fullName
                          .trim()
                          .split(' ')
                          .filter(Boolean)
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase()
                      : '👤'}
                  </div>
                  <div className="profile-name-block">
                    <h2>{profile.fullName || 'Student Profile'}</h2>
                    <p>
                      {profile.year || profile.department
                        ? `${profile.year || 'Student'} • ${profile.department || 'Department'}`
                        : 'Please complete your student profile details below'}
                    </p>
                  </div>
                </div>

                <div className="profile-badge-row">
                  <span className="verified-student-tag">✓ Verified Student Profile</span>
                  <button
                    type="button"
                    className="button button-secondary"
                    onClick={() => setCurrentView('feed')}
                  >
                    ← Back to Events Feed
                  </button>
                </div>
              </div>

              <form onSubmit={handleSaveProfile}>
                <div className="profile-grid-sections">
                  {/* Left Column: Academic Credentials */}
                  <div className="profile-section-col">
                    <h3 className="profile-col-header">🎓 Academic Credentials</h3>

                    <div className="profile-input-group">
                      <label>Full Name *</label>
                      <input
                        type="text"
                        required
                        value={profile.fullName}
                        onChange={(e) => handleProfileChange('fullName', e.target.value)}
                        placeholder="e.g. John Doe"
                      />
                    </div>

                    <div className="profile-input-group">
                      <label>Student Email</label>
                      <input
                        type="email"
                        readOnly
                        className="readonly-field"
                        value={profile.email}
                        title="Email address is tied to your student account login"
                      />
                    </div>

                    <div className="profile-input-group">
                      <label>Academic Year *</label>
                      <select
                        required
                        value={profile.year}
                        onChange={(e) => handleProfileChange('year', e.target.value)}
                      >
                        <option value="">-- Select Academic Year --</option>
                        <option value="First Year (FE)">First Year (FE)</option>
                        <option value="Second Year (SE)">Second Year (SE)</option>
                        <option value="Third Year (TE)">Third Year (TE)</option>
                        <option value="Final Year (BE)">Final Year (BE)</option>
                      </select>
                    </div>

                    <div className="profile-input-group">
                      <label>Department / Branch *</label>
                      <select
                        required
                        value={profile.department}
                        onChange={(e) => handleProfileChange('department', e.target.value)}
                      >
                        <option value="">-- Select Department --</option>
                        <option value="Computer Engineering">Computer Engineering</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Computer Science (Data Science)">Computer Science (Data Science)</option>
                        <option value="Artificial Intelligence & Data Science">Artificial Intelligence &amp; Data Science</option>
                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                        <option value="Electronics & Telecommunication">Electronics &amp; Telecommunication</option>
                        <option value="Civil Engineering">Civil Engineering</option>
                        <option value="First Year Engineering">First Year Engineering</option>
                      </select>
                    </div>

                    <div className="profile-input-group">
                      <label>Student Roll Number / PRN</label>
                      <input
                        type="text"
                        value={profile.rollNo}
                        onChange={(e) => handleProfileChange('rollNo', e.target.value)}
                        placeholder="e.g. 2024-CS-042"
                      />
                    </div>

                    <div className="profile-input-group">
                      <label>College / University</label>
                      <input
                        type="text"
                        value={profile.college}
                        onChange={(e) => handleProfileChange('college', e.target.value)}
                        placeholder="e.g. Vidyavardhini's College of Engineering and Technology (VCET)"
                      />
                    </div>
                  </div>

                  {/* Right Column: Contact & Professional Details */}
                  <div className="profile-section-col">
                    <div className="profile-input-group">
                      <label>Mobile / WhatsApp Number</label>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => handleProfileChange('phone', e.target.value)}
                        placeholder="+91 98765 43210"
                      />
                    </div>

                    <div className="profile-input-group">
                      <label>GitHub / Portfolio Link</label>
                      <input
                        type="url"
                        value={profile.portfolio}
                        onChange={(e) => handleProfileChange('portfolio', e.target.value)}
                        placeholder="https://github.com/your-username"
                      />
                    </div>

                    <div className="profile-input-group">
                      <label>Skills &amp; Technical Interests</label>
                      <input
                        type="text"
                        value={profile.skills}
                        onChange={(e) => handleProfileChange('skills', e.target.value)}
                        placeholder="e.g. Full-Stack Web, Python, ML, UI/UX"
                      />
                    </div>

                    <div className="profile-input-group">
                      <label>Student Bio</label>
                      <textarea
                        rows="4"
                        value={profile.bio}
                        onChange={(e) => handleProfileChange('bio', e.target.value)}
                        placeholder="Brief summary about your projects, skills, or interests…"
                      />
                    </div>
                  </div>
                </div>

                <div className="profile-form-footer">
                  <button
                    type="button"
                    className="button button-secondary"
                    onClick={() => setCurrentView('feed')}
                  >
                    Cancel
                  </button>

                  <button type="submit" className="button button-primary profile-save-btn">
                    💾 Save Profile Changes
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>

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
                {selectedCategory === 'Competitions' && 'Showcase your skills, pitch startup ideas, and win rewards.'}
                {selectedCategory === 'Committees' && 'Browse active student committees, attend assembly meetings, or join as a student organizer.'}
                {selectedCategory === 'Seminars & Webinars' && 'Expert tech talks, industry insights, and career growth sessions.'}
                {selectedCategory === 'Virtual Events' && 'Online technical challenges, quizzes, and simulations.'}
                {selectedCategory === 'registered' && 'Events and committees you have signed up for.'}
              </p>
            </div>

            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search events, departments, topics…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search events"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="clear-search"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Sub-committee Quick Filter Buttons */}
          {normalizeCategory(selectedCategory).toLowerCase() === 'committees' && (
            <div className="committee-subfilter-bar">
              <span className="subfilter-label">Quick Committee Filter:</span>
              {[
                { label: 'All Committees', filter: '' },
                { label: '🏛️ Student Council', filter: 'Student Council' },
                { label: '💻 CSI Committee', filter: 'CSI' },
                { label: '✈️ Airnova', filter: 'Airnova' },
                { label: '🏅 Sports Committee', filter: 'Sports' },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className={`committee-filter-pill ${
                    committeeSubFilter === item.filter ? 'active' : ''
                  }`}
                  onClick={() => setCommitteeSubFilter(item.filter)}
                >
                  {item.label}
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
                const isCommittee = normalizeCategory(item.category).toLowerCase() === 'committees'
                const committeeIcon = getCommitteeIcon(item)

                return (
                  <article
                    key={item.id}
                    className={`event-tile ${isRegistered ? 'is-registered' : ''} ${
                      isCommittee ? 'committee-tile' : ''
                    }`}
                  >
                    <div className="event-tile-header">
                      <div className="tile-badge-group">
                        <span className={`category-pill ${categoryColorClass(item.category)}`}>
                          {isCommittee ? '🏛️ Committee' : normalizeCategory(item.category)}
                        </span>
                        {item.department && (
                          <span className="department-pill" title={item.department}>
                            🏢 {item.department}
                          </span>
                        )}
                      </div>
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
                        <span>
                          {item.eventDate || 'Coming soon'}
                          {item.eventTime ? ` • ${item.eventTime}` : ''}
                        </span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-icon">📍</span>
                        <span>{item.location || 'Campus Center / Online'}</span>
                      </div>
                      {item.organizer && (
                        <div className="meta-item organizer-item">
                          <span className="meta-icon">◈</span>
                          <span>{item.organizer}</span>
                        </div>
                      )}
                      {(item.fee || item.prize) && (
                        <div className="meta-item-extra-row">
                          {item.fee && (
                            <span className="meta-mini-badge fee-badge">
                              🏷️ {item.fee}
                            </span>
                          )}
                          {item.prize && (
                            <span className="meta-mini-badge prize-badge" title={item.prize}>
                              🏆 {item.prize.length > 25 ? item.prize.slice(0, 25) + '…' : item.prize}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <p className="event-tile-snippet">
                      {item.description
                        ? item.description.length > 130
                          ? item.description.slice(0, 130) + '…'
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

                      <div className="tile-action-buttons">
                        {item.registrationLink && (
                          <a
                            href={item.registrationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="external-form-link"
                            title="Open official registration form/portal"
                          >
                            Link ↗
                          </a>
                        )}
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
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      
            </>
          )
        }
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
              <div className="modal-header-badges">
                <span className={`category-pill ${categoryColorClass(activeModalEvent.category)}`}>
                  {normalizeCategory(activeModalEvent.category).toLowerCase() === 'committees'
                    ? '🏛️ Committee • Student Organizers'
                    : normalizeCategory(activeModalEvent.category)}
                </span>
                {activeModalEvent.department && (
                  <span className="department-pill">
                    🏢 {activeModalEvent.department}
                  </span>
                )}
              </div>
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
                <strong>{normalizeCategory(activeModalEvent.category).toLowerCase() === 'committees' ? 'Meeting Schedule' : 'Schedule'}</strong>
                <span>
                  {activeModalEvent.eventDate || 'TBA'}
                  {activeModalEvent.eventTime ? ` • ${activeModalEvent.eventTime}` : ''}
                </span>
              </div>
              <div className="modal-meta-card">
                <strong>{normalizeCategory(activeModalEvent.category).toLowerCase() === 'committees' ? 'Office / Venue' : 'Venue'}</strong>
                <span>{activeModalEvent.location || 'Campus Center / Online'}</span>
              </div>
              <div className="modal-meta-card">
                <strong>{normalizeCategory(activeModalEvent.category).toLowerCase() === 'committees' ? 'Committee Body' : 'Organized By'}</strong>
                <span>{activeModalEvent.organizer || 'Student Committee'}</span>
              </div>

              {activeModalEvent.fee && (
                <div className="modal-meta-card">
                  <strong>Registration Fee</strong>
                  <span>{activeModalEvent.fee}</span>
                </div>
              )}
              {activeModalEvent.deadline && (
                <div className="modal-meta-card">
                  <strong>Deadline</strong>
                  <span>{activeModalEvent.deadline}</span>
                </div>
              )}
              {activeModalEvent.teamSize && (
                <div className="modal-meta-card">
                  <strong>Team Size</strong>
                  <span>{activeModalEvent.teamSize}</span>
                </div>
              )}
              {activeModalEvent.prize && (
                <div className="modal-meta-card">
                  <strong>Prizes & Awards</strong>
                  <span>{activeModalEvent.prize}</span>
                </div>
              )}
            </div>

            <div className="modal-body">
              <h4>
                {normalizeCategory(activeModalEvent.category).toLowerCase() === 'committees'
                  ? 'About this Committee & Organizer Opportunities'
                  : 'Full Event Description'}
              </h4>
              <p className="modal-description">{activeModalEvent.description || 'No description provided.'}</p>
            </div>

            <footer className="modal-footer">
              {activeModalEvent.registrationLink && (
                <a
                  href={activeModalEvent.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button button-secondary external-modal-btn"
                >
                  🌐 Open Official Portal / Form ↗
                </a>
              )}
              <button
                type="button"
                className={`button ${
                  registeredIds.includes(activeModalEvent.id) ? 'button-registered' : 'button-primary'
                } modal-action-btn`}
                disabled={registeringId === activeModalEvent.id}
                onClick={() => {
                  const ev = activeModalEvent
                  setActiveModalEvent(null)
                  handleOpenRegistrationModal(ev)
                }}
              >
                {registeringId === activeModalEvent.id
                  ? 'Processing…'
                  : registeredIds.includes(activeModalEvent.id)
                  ? normalizeCategory(activeModalEvent.category).toLowerCase() === 'committees'
                    ? 'Joined Committee ✓ (Click to Leave)'
                    : 'Registered ✓ (Click to Cancel)'
                  : normalizeCategory(activeModalEvent.category).toLowerCase() === 'committees'
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

      {/* Criteria-Based Event Registration Modal */}
      {registrationModalEvent && (
        <div className="modal-backdrop" onClick={() => setRegistrationModalEvent(null)}>
          <div
            className="modal-dialog registration-form-dialog"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="modal-header">
              <div className="modal-header-badges">
                <span className={`category-pill ${categoryColorClass(registrationModalEvent.category)}`}>
                  {normalizeCategory(registrationModalEvent.category)}
                </span>
                {registrationModalEvent.organizer && (
                  <span className="organizer-badge-pill">
                    ◈ {registrationModalEvent.organizer}
                  </span>
                )}
              </div>
              <button
                type="button"
                className="modal-close"
                onClick={() => setRegistrationModalEvent(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </header>

            <div className="reg-modal-intro">
              <h2>Register for {registrationModalEvent.title}</h2>
              <p>Review your verified academic credentials and provide the required information requested by the organizers.</p>
            </div>

            <form onSubmit={handleSubmitRegistration} className="reg-modal-form">
              {/* Section 1: Locked Student Credentials */}
              <div className="reg-form-section">
                <h4 className="reg-section-title">
                  <span>👤</span> Verified Student Credentials (Autofilled &amp; Locked)
                </h4>
                <div className="reg-locked-grid">
                  <div className="reg-locked-field">
                    <label>Full Name</label>
                    <input type="text" readOnly className="readonly-locked-input" value={profile.fullName} />
                  </div>
                  <div className="reg-locked-field">
                    <label>Student Email</label>
                    <input type="email" readOnly className="readonly-locked-input" value={profile.email} />
                  </div>
                  <div className="reg-locked-field">
                    <label>Academic Year</label>
                    <input type="text" readOnly className="readonly-locked-input" value={profile.year} />
                  </div>
                  <div className="reg-locked-field">
                    <label>Department / Branch</label>
                    <input type="text" readOnly className="readonly-locked-input" value={profile.department} />
                  </div>
                </div>
              </div>

              {/* Section 2: Organizer Requirements */}
              <div className="reg-form-section">
                <h4 className="reg-section-title">
                  <span>📋</span> Organizer Requirements ({normalizeCategory(registrationModalEvent.category)})
                </h4>
                <div className="reg-questions-list">
                  {getEventRequirements(registrationModalEvent).map((question, idx) => (
                    <div key={idx} className="reg-question-item">
                      <label className="reg-question-label">
                        {question} <span className="required-star">*</span>
                      </label>
                      {question.toLowerCase().includes('team member') || question.toLowerCase().includes('team size') ? (
                        <select
                          required
                          value={registrationAnswers[question] || ''}
                          onChange={(e) =>
                            setRegistrationAnswers((prev) => ({ ...prev, [question]: e.target.value }))
                          }
                        >
                          <option value="">-- Select Team Size --</option>
                          <option value="1 Member (Solo Participation)">1 Member (Solo Participation)</option>
                          <option value="2 Members">2 Members</option>
                          <option value="3 Members">3 Members</option>
                          <option value="4 Members (Full Team)">4 Members (Full Team)</option>
                        </select>
                      ) : question.toLowerCase().includes('statement') || question.toLowerCase().includes('why') || question.toLowerCase().includes('hope to learn') ? (
                        <textarea
                          required
                          rows={3}
                          placeholder="Please enter your response..."
                          value={registrationAnswers[question] || ''}
                          onChange={(e) =>
                            setRegistrationAnswers((prev) => ({ ...prev, [question]: e.target.value }))
                          }
                        />
                      ) : (
                        <input
                          type="text"
                          required
                          placeholder="Enter your response..."
                          value={registrationAnswers[question] || ''}
                          onChange={(e) =>
                            setRegistrationAnswers((prev) => ({ ...prev, [question]: e.target.value }))
                          }
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() => setRegistrationModalEvent(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="button button-primary"
                  disabled={registeringId === registrationModalEvent.id}
                >
                  {registeringId === registrationModalEvent.id ? 'Submitting…' : 'Confirm Registration →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Incomplete Profile Alert Modal */}
      {incompleteProfileAlert && (
        <div className="modal-backdrop" onClick={() => setIncompleteProfileAlert(false)}>
          <div
            className="modal-dialog modal-profile-alert-dialog"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="modal-header">
              <h3 style={{ margin: 0 }}>⚠️ Profile Incomplete</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setIncompleteProfileAlert(false)}
              >
                ✕
              </button>
            </header>
            <div style={{ padding: '20px 0', lineHeight: 1.6, color: '#334155' }}>
              <p>
                Before registering for campus events, please complete your <strong>Full Name</strong>, <strong>Academic Year</strong>, and <strong>Department</strong> in your Student Profile.
              </p>
              <p style={{ margin: '8px 0 0', fontSize: '13px', color: '#64748b' }}>
                These verified details are required by event organizers and will automatically autofill and lock your registration submissions.
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="button button-secondary"
                onClick={() => setIncompleteProfileAlert(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="button button-primary"
                onClick={() => {
                  setIncompleteProfileAlert(false)
                  setCurrentView('profile')
                }}
              >
                Go to My Profile →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
