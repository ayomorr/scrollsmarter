import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import type { AppSettings, Session } from './db'
import { defaultSettings, getAllSessions, loadSettings, putSession, saveSettings } from './db'

type ActiveSession = Session & { remaining: number; totalSeconds: number; pausedAt?: number | null }

type Store = {
  sessions: Session[]
  active: ActiveSession | null
  settings: AppSettings
  todayMinutes: number
  todayRemaining: number
  streak: number
  startSession: (label: string, category: string, minutes: number) => void
  pauseSession: () => void
  resumeSession: () => void
  addMinutes: (mins: number) => void
  endSession: (status?: 'completed' | 'cancelled') => void
  updateSettings: (patch: Partial<AppSettings>) => void
  deleteAll: () => Promise<void>
  refresh: () => Promise<void>
}

const Ctx = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<Session[]>([])
  const [settings, setSettings] = useState<AppSettings>(defaultSettings)
  const [active, setActive] = useState<ActiveSession | null>(null)

  const refresh = useCallback(async () => {
    const all = await getAllSessions()
    setSessions(all)
    const s = loadSettings()
    setSettings(s)
    // restore active from localStorage
    try {
      const raw = localStorage.getItem('sg_active')
      if (raw) {
        const a = JSON.parse(raw) as ActiveSession
        // validate not expired more than 24h
        if (Date.now() - a.startedAt < 1000*60*60*24 && a.status==='active') {
          setActive(a)
        } else {
          localStorage.removeItem('sg_active')
        }
      }
    } catch {}
  }, [])

  useEffect(() => { refresh() }, [refresh])

  // persist active
  useEffect(() => {
    if (active) localStorage.setItem('sg_active', JSON.stringify(active))
    else localStorage.removeItem('sg_active')
  }, [active])

  // appearance
  useEffect(() => {
    const root = document.documentElement
    const apply = (mode: string) => {
      if (mode==='dark') root.classList.add('dark')
      else if (mode==='light') root.classList.remove('dark')
      else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        if (prefersDark) root.classList.add('dark')
        else root.classList.remove('dark')
      }
      // update theme-color
      const meta = document.querySelector('meta[name="theme-color"]')
      if (meta) meta.setAttribute('content', root.classList.contains('dark') ? '#1A1E1D' : '#5B7A5F')
    }
    apply(settings.appearance)
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => { if (settings.appearance==='system') apply('system') }
    mq.addEventListener?.('change', handler)
    return () => mq.removeEventListener?.('change', handler)
  }, [settings.appearance])

  // ticking active session
  useEffect(() => {
    if (!active || active.pausedAt) return
    if (active.remaining <=0) return
    const id = window.setInterval(() => {
      setActive(prev => {
        if (!prev || prev.pausedAt) return prev
        const next = prev.remaining - 1
        if (next <= 0) {
          // complete
          const completed: Session = { ...prev, status: 'completed', endedAt: Date.now(), remainingSeconds: 0 }
          putSession(completed)
          // notification
          if (Notification && Notification.permission==='granted') {
            try { new Notification('Session complete', { body: `Nice pause. ${prev.label} — ${prev.durationMinutes} min done.`, icon: '/icons/icon-192.png' }) } catch {}
          } else {
            // haptic
            if (navigator.vibrate && loadSettings().haptics) navigator.vibrate(120)
          }
          setSessions(s=> [completed, ...s.filter(x=>x.id!==prev.id)])
          return null
        }
        // gentle reminder at 60s left
        if (next===60 && Notification && Notification.permission==='granted') {
          try { new Notification('One minute left', { body: 'Still want to keep scrolling?', icon:'/icons/icon-192.png' }) } catch {}
        }
        if (next===60 && navigator.vibrate && loadSettings().haptics) navigator.vibrate([80,40,80])
        return { ...prev, remaining: next }
      })
    }, 1000)
    return () => clearInterval(id)
  }, [active?.pausedAt, active?.remaining, active?.id])

  // also need to keep sessions list filtered for today - we compute below

  const startSession = useCallback((label: string, category: string, minutes: number) => {
    const total = minutes*60
    const s: ActiveSession = {
      id: Math.random().toString(36).slice(2,9),
      label, category,
      durationMinutes: minutes,
      startedAt: Date.now(),
      status: 'active',
      remaining: total,
      totalSeconds: total,
      pausedAt: null
    }
    setActive(s)
    // also save a draft session for persistence? we store as active only
  }, [])

  const pauseSession = useCallback(() => {
    setActive(a=> a ? { ...a, pausedAt: Date.now() } : a)
  }, [])
  const resumeSession = useCallback(() => {
    setActive(a=> {
      if (!a || !a.pausedAt) return a
      // adjust startedAt to account for pause duration so remaining stays correct? We keep remaining frozen, so just clear pausedAt
      return { ...a, pausedAt: null }
    })
  }, [])
  const addMinutes = useCallback((mins: number) => {
    setActive(a=> a ? { ...a, durationMinutes: a.durationMinutes+mins, totalSeconds: a.totalSeconds+mins*60, remaining: a.remaining+mins*60 } : a)
  }, [])
  const endSession = useCallback((status: 'completed'| 'cancelled' = 'completed') => {
    setActive(prev => {
      if (!prev) return prev
      const s: Session = {
        id: prev.id,
        label: prev.label,
        category: prev.category,
        durationMinutes: prev.durationMinutes,
        startedAt: prev.startedAt,
        endedAt: Date.now(),
        status: status==='cancelled' ? 'cancelled' : 'completed',
        remainingSeconds: prev.remaining
      }
      // if cancelled but spent >0, we still save as completed with partial? But keep status
      void putSession(s)
      setSessions(cur=>[s, ...cur])
      // persist spent for today stats - sessions already captures
      return null
    })
  }, [])

  const updateSettings = useCallback((patch: Partial<AppSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...patch, quietHours: { ...prev.quietHours, ...(patch.quietHours||{}) } , limits: patch.limits ?? prev.limits }
      saveSettings(next)
      return next
    })
  }, [])

  const deleteAll = useCallback(async () => {
    const { deleteAllSessions } = await import('./db')
    await deleteAllSessions()
    setSessions([])
    setActive(null)
    localStorage.removeItem('sg_active')
  }, [])

  const todayMinutes = useMemo(() => {
    const today = new Date().toISOString().slice(0,10)
    return sessions.filter(s=> new Date(s.startedAt).toISOString().slice(0,10)===today && s.status!=='cancelled')
      .reduce((acc,s)=>{
        if (s.status==='completed' && s.endedAt) {
          const rem = s.remainingSeconds ?? 0
          const tot = s.durationMinutes*60
          const spentSec = tot - rem
          return acc + Math.max(0, Math.ceil(spentSec/60))
        }
        return acc + s.durationMinutes
      }, 0) + (active ? Math.ceil((active.totalSeconds - active.remaining)/60) : 0)
  }, [sessions, active])

  const todayRemaining = Math.max(0, settings.dailyGoal - todayMinutes)
  const streak = useMemo(()=> {
    // simple streak: count consecutive days with at least one completed session
    const dates = new Set(sessions.filter(s=>s.status==='completed').map(s=> new Date(s.startedAt).toISOString().slice(0,10)))
    let cur = 0
    let d = new Date()
    for (let i=0;i<30;i++) {
      const key = d.toISOString().slice(0,10)
      if (dates.has(key)) cur++
      else if (i===0) {
        // today may not have yet, don't break
        if (active) { cur++; }
        else if (cur===0) { /* allow gap?*/ }
        else break
      } else break
      d.setDate(d.getDate()-1)
    }
    return cur
  }, [sessions, active])

  // whenever active changes to null, ensure persisted sessions refreshed? done in endSession

  return (
    <Ctx.Provider value={{ sessions, active, settings, todayMinutes, todayRemaining, streak, startSession, pauseSession, resumeSession, addMinutes, endSession, updateSettings, deleteAll, refresh }}>
      {children}
    </Ctx.Provider>
  )
}

export function useStore() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useStore outside provider')
  return v
}
