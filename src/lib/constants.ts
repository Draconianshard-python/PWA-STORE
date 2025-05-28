export const APP_CATEGORIES = [
  { id: 'games', name: 'Games', icon: '🎮' },
  { id: 'productivity', name: 'Productivity', icon: '💼' },
  { id: 'social', name: 'Social', icon: '👥' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
  { id: 'education', name: 'Education', icon: '📚' },
  { id: 'utilities', name: 'Utilities', icon: '🛠' },
  { id: 'health', name: 'Health & Fitness', icon: '💪' },
  { id: 'finance', name: 'Finance', icon: '💰' }
] as const

export const SUPPORTED_BROWSERS = {
  safari: { name: 'Safari', minVersion: '11.3' },
  chrome: { name: 'Chrome', minVersion: '73' },
  firefox: { name: 'Firefox', minVersion: '67' },
  edge: { name: 'Edge', minVersion: '79' }
} as const

export const PWA_FEATURES = {
  OFFLINE: 'offline_support',
  PUSH: 'push_notifications',
  INSTALL: 'installable',
  SHARE: 'share_target',
  FILE_SYSTEM: 'file_system_access',
  BACKGROUND_SYNC: 'background_sync'
} as const

export const CACHE_DURATION = {
  PWA_LIST: 60 * 5, // 5 minutes
  CATEGORIES: 60 * 60, // 1 hour
  REVIEWS: 60 * 2, // 2 minutes
  SEARCH: 60 // 1 minute
} as const
