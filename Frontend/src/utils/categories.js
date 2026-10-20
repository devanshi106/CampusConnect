export function normalizeCategory(cat) {
  if (!cat) return 'Other'
  const c = cat.trim()
  if (/hackathon/i.test(c)) return 'Hackathons'
  if (/workshop|bootcamp/i.test(c)) return 'Workshops'
  if (/competition|contest/i.test(c)) return 'Competitions'
  if (/committee|council/i.test(c)) return 'Committees'
  if (/seminar|webinar/i.test(c)) return 'Seminars & Webinars'
  if (/virtual/i.test(c)) return 'Virtual Events'
  if (/club/i.test(c)) return 'Clubs'
  return c
}

export function categoryColorClass(cat) {
  const norm = normalizeCategory(cat)?.toLowerCase()
  switch (norm) {
    case 'hackathons':
      return 'cat-hackathons'
    case 'clubs':
      return 'cat-clubs'
    case 'workshops':
      return 'cat-workshops'
    case 'competitions':
      return 'cat-competitions'
    case 'committees':
      return 'cat-committees'
    case 'seminars & webinars':
      return 'cat-seminars'
    case 'virtual events':
      return 'cat-virtual'
    default:
      return 'cat-default'
  }
}

export const BASE_CATEGORIES = [
  { id: 'all', label: 'All Categories', icon: '✦' },
  { id: 'Hackathons', label: 'Hackathons', icon: '⚡' },
  { id: 'Clubs', label: 'Clubs', icon: '◒' },
  { id: 'Workshops', label: 'Workshops', icon: '🛠️' },
  { id: 'Competitions', label: 'Competitions', icon: '🏆' },
  { id: 'Committees', label: 'Committees', icon: '🏛️' },
  { id: 'Seminars & Webinars', label: 'Seminars & Webinars', icon: '🎤' },
  { id: 'Virtual Events', label: 'Virtual Events', icon: '🌐' },
]

export const CATEGORY_ICONS = {
  Hackathons: '⚡',
  Clubs: '◒',
  Workshops: '🛠️',
  Competitions: '🏆',
  Committees: '🏛️',
  'Seminars & Webinars': '🎤',
  'Virtual Events': '🌐',
}
