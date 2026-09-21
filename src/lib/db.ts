export type Session = {
  id: string
  label: string
  category: string
  durationMinutes: number
  startedAt: number
  endedAt?: number
  status: 'active' | 'completed' | 'cancelled' | 'paused'
  remainingSeconds?: number
}

export type DailyStats = {
  date: string // YYYY-MM-DD
  totalMinutes: number
  sessions: number
}

const DB_NAME = 'scroll-guard'
const DB_VERSION = 1
const STORE_SESSIONS = 'sessions'
const STORE_META = 'meta'

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE_SESSIONS)) {
        const s = db.createObjectStore(STORE_SESSIONS, { keyPath: 'id' })
        s.createIndex('startedAt', 'startedAt', { unique: false })
      }
      if (!db.objectStoreNames.contains(STORE_META)) {
        db.createObjectStore(STORE_META, { keyPath: 'key' })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export async function putSession(s: Session) {
  const db = await openDB()
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_SESSIONS, 'readwrite')
    tx.objectStore(STORE_SESSIONS).put(s)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function getAllSessions(): Promise<Session[]> {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_SESSIONS, 'readonly')
      const req = tx.objectStore(STORE_SESSIONS).getAll()
      req.onsuccess = () => resolve((req.result as Session[]).sort((a,b)=>b.startedAt-a.startedAt))
      req.onerror = () => reject(req.error)
    })
  } catch {
    return []
  }
}

export async function deleteAllSessions() {
  const db = await openDB()
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_SESSIONS, 'readwrite')
    tx.objectStore(STORE_SESSIONS).clear()
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function putMeta(key: string, value: unknown) {
  const db = await openDB()
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_META, 'readwrite')
    tx.objectStore(STORE_META).put({ key, value })
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function getMeta<T>(key: string, fallback: T): Promise<T> {
  try {
    const db = await openDB()
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_META, 'readonly')
      const req = tx.objectStore(STORE_META).get(key)
      req.onsuccess = () => resolve((req.result?.value as T) ?? fallback)
      req.onerror = () => resolve(fallback)
    })
  } catch {
    return fallback
  }
}

// localStorage helpers for simple settings
export type AppSettings = {
  dailyGoal: number
  quietHours: { enabled: boolean; start: string; end: string }
  appearance: 'light' | 'dark' | 'system'
  sound: boolean
  haptics: boolean
  notifications: boolean
  limits: { id: string; label: string; minutes: number }[]
}

export const defaultSettings: AppSettings = {
  dailyGoal: 60,
  quietHours: { enabled: false, start: '22:00', end: '07:00' },
  appearance: 'system',
  sound: true,
  haptics: true,
  notifications: false,
  limits: [
    { id: '1', label: 'Social media', minutes: 30 },
    { id: '2', label: 'Video', minutes: 45 },
    { id: '3', label: 'News', minutes: 20 },
  ]
}

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem('sg_settings')
    if (!raw) return defaultSettings
    return { ...defaultSettings, ...JSON.parse(raw) }
  } catch { return defaultSettings }
}

export function saveSettings(s: AppSettings) {
  localStorage.setItem('sg_settings', JSON.stringify(s))
}

export function todayKey(d = new Date()) {
  return d.toISOString().slice(0,10)
}

export function formatDuration(sec: number) {
  const m = Math.floor(sec/60)
  const s = sec % 60
  if (m === 0) return `${s}s`
  return `${m}:${String(s).padStart(2,'0')}`
}
export function formatMin(sec: number) {
  const m = Math.floor(sec/60)
  return `${m} min`
}
