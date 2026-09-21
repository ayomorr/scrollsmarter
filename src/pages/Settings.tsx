import { useState } from 'react'
import { useStore } from '../lib/store'
import { usePWAInstall } from '../hooks/usePWA'

export default function Settings() {
  const { settings, updateSettings, deleteAll, sessions } = useStore()
  const { canInstall, platform, prompt, isStandalone } = usePWAInstall()
  const [showReset, setShowReset] = useState(false)
  const [newLabel, setNewLabel] = useState('')
  const [newMins, setNewMins] = useState(30)

  const exportData = () => {
    const data = {
      settings,
      sessions,
      exportedAt: new Date().toISOString(),
      version: 1
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `scroll-guard-${new Date().toISOString().slice(0,10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const requestNotif = async () => {
    if (!('Notification' in window)) {
      alert('Notifications not supported in this browser.')
      return
    }
    const perm = await Notification.requestPermission()
    updateSettings({ notifications: perm==='granted' })
    if (perm==='granted') try { new Notification('Notifications enabled', { body: 'We’ll nudge you gently at one minute left.' }) } catch {}
  }

  return (
    <div className="px-4 pt-4 space-y-4 pb-6">
      <h1 className="font-display text-2xl">Settings</h1>

      {/* Appearance */}
      <div className="bg-white dark:bg-[#1E2320] rounded-[20px] p-5 border border-black/5 dark:border-white/5">
        <h3 className="font-semibold">Appearance</h3>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {(['system','light','dark'] as const).map(m=>(
            <button key={m} onClick={()=> updateSettings({ appearance: m })} className={`py-2.5 rounded-full border text-sm font-medium capitalize ${settings.appearance===m ? 'bg-[#1A1E1D] text-white dark:bg-white dark:text-black border-transparent' : 'bg-white dark:bg-white/5 border-black/10 dark:border-white/10'}`}>{m}</button>
          ))}
        </div>
      </div>

      {/* Daily goal */}
      <div className="bg-white dark:bg-[#1E2320] rounded-[20px] p-5 border border-black/5 dark:border-white/5">
        <h3 className="font-semibold">Daily goal</h3>
        <p className="text-xs text-stone-500 mt-1">How many intentional minutes feel kind for today?</p>
        <div className="mt-4 flex items-center gap-3">
          <input type="range" min={15} max={180} step={5} value={settings.dailyGoal} onChange={e=> updateSettings({ dailyGoal: Number(e.target.value) })} className="flex-1 accent-[#5B7A5F]" />
          <span className="w-16 text-center font-semibold bg-[#F5EBDD] dark:bg-white/10 rounded-full py-1.5 text-sm">{settings.dailyGoal} min</span>
        </div>
      </div>

      {/* Quiet hours */}
      <div className="bg-white dark:bg-[#1E2320] rounded-[20px] p-5 border border-black/5 dark:border-white/5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Quiet hours</h3>
          <button onClick={()=> updateSettings({ quietHours: { ...settings.quietHours, enabled: !settings.quietHours.enabled }})} className={`w-11 h-6 rounded-full p-1 transition ${settings.quietHours.enabled ? 'bg-[#5B7A5F]' : 'bg-black/10 dark:bg-white/15'}`}>
            <span className={`block w-4 h-4 rounded-full bg-white transition ${settings.quietHours.enabled ? 'translate-x-5' : ''}`} />
          </button>
        </div>
        <p className="text-xs text-stone-500 mt-1">No nudges during rest — timers still work.</p>
        {settings.quietHours.enabled && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <label className="text-sm">
              <span className="block text-xs font-bold tracking-widest uppercase text-stone-500 mb-1">Start</span>
              <input type="time" value={settings.quietHours.start} onChange={e=> updateSettings({ quietHours: { ...settings.quietHours, start: e.target.value }})} className="w-full px-3 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-[#FDF8F1] dark:bg-white/5" />
            </label>
            <label className="text-sm">
              <span className="block text-xs font-bold tracking-widest uppercase text-stone-500 mb-1">End</span>
              <input type="time" value={settings.quietHours.end} onChange={e=> updateSettings({ quietHours: { ...settings.quietHours, end: e.target.value }})} className="w-full px-3 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-[#FDF8F1] dark:bg-white/5" />
            </label>
          </div>
        )}
      </div>

      {/* Limits */}
      <div className="bg-white dark:bg-[#1E2320] rounded-[20px] p-5 border border-black/5 dark:border-white/5">
        <h3 className="font-semibold">Limits</h3>
        <p className="text-xs text-stone-500 mt-1">Self-set caps — tracked against intentional sessions only. Browsers can’t read other apps.</p>
        <div className="mt-4 space-y-3">
          {settings.limits.map(l=>(
            <div key={l.id} className="flex items-center gap-3">
              <span className="flex-1 text-sm font-medium">{l.label}</span>
              <input type="number" min={5} max={180} value={l.minutes} onChange={e=> {
                const next = settings.limits.map(x=> x.id===l.id ? { ...x, minutes: Number(e.target.value)} : x)
                updateSettings({ limits: next })
              }} className="w-20 px-3 py-2 rounded-full border border-black/10 dark:border-white/10 bg-[#FDF8F1] dark:bg-white/5 text-center text-sm font-semibold" />
              <span className="text-xs text-stone-500">min</span>
              <button aria-label={`Remove ${l.label}`} onClick={()=> updateSettings({ limits: settings.limits.filter(x=> x.id!==l.id) })} className="w-8 h-8 grid place-items-center rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 shrink-0">×</button>
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-[1fr_auto_auto] gap-2 items-end">
          <label className="text-xs font-medium">
            <span className="block mb-1 text-stone-500">New limit</span>
            <input value={newLabel} onChange={e=> setNewLabel(e.target.value)} placeholder="e.g., Reading" className="w-full px-3 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-[#FDF8F1] dark:bg-white/5 text-sm" />
          </label>
          <label className="text-xs font-medium">
            <span className="block mb-1 text-stone-500">Min</span>
            <input type="number" min={5} max={180} value={newMins} onChange={e=> setNewMins(Number(e.target.value))} className="w-20 px-3 py-2.5 rounded-full border border-black/10 dark:border-white/10 bg-[#FDF8F1] dark:bg-white/5 text-center text-sm font-semibold" />
          </label>
          <button onClick={()=> {
            if (!newLabel.trim()) return
            const id = Math.random().toString(36).slice(2,6)
            updateSettings({ limits: [...settings.limits, { id, label: newLabel.trim(), minutes: Math.max(5, newMins) }] })
            setNewLabel('')
            setNewMins(30)
          }} className="px-4 py-2.5 rounded-full bg-[#5B7A5F] text-white text-sm font-semibold h-[44px]">Add</button>
        </div>
        <div className="text-[11px] text-stone-600 mt-2">Example: Social media — 30 min/day, Video — 45 min/day. These are honest, self-reported — the PWA can’t spy on other apps.</div>
      </div>

      {/* Notifications */}
      <div className="bg-white dark:bg-[#1E2320] rounded-[20px] p-5 border border-black/5 dark:border-white/5">
        <h3 className="font-semibold">Notifications</h3>
        <p className="text-xs text-stone-500 mt-1">Gentle reminders at one minute left and at the end. Optional.</p>
        <div className="mt-3 flex gap-2">
          <button onClick={requestNotif} className={`flex-1 py-2.5 rounded-full font-semibold text-sm ${settings.notifications ? 'bg-[#E8F0E8] text-[#5B7A5F] border border-[#5B7A5F]/20' : 'bg-[#5B7A5F] text-white'}`}>
            {settings.notifications ? 'Enabled ✓' : 'Enable notifications'}
          </button>
          <button onClick={()=> updateSettings({ notifications: false })} className="px-4 py-2.5 rounded-full border border-black/10 dark:border-white/10 text-sm">Off</button>
        </div>
        {!('Notification' in window) && <div className="text-xs text-amber-600 mt-2">Notifications not supported here — we’ll use in-app reminders.</div>}
        <div className="mt-3 flex gap-3 text-xs">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={settings.sound} onChange={e=> updateSettings({ sound: e.target.checked })} className="accent-[#5B7A5F]" /> Sound
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={settings.haptics} onChange={e=> updateSettings({ haptics: e.target.checked })} className="accent-[#5B7A5F]" /> Haptics
          </label>
        </div>
      </div>

      {/* Data */}
      <div className="bg-white dark:bg-[#1E2320] rounded-[20px] p-5 border border-black/5 dark:border-white/5">
        <h3 className="font-semibold">Data management</h3>
        <div className="mt-3 grid gap-2">
          <button onClick={exportData} className="w-full py-3 rounded-full border border-black/10 dark:border-white/10 font-medium text-sm flex items-center justify-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 4V16M12 16L8 12M12 16L16 12"/><path d="M4 18V20H20V18"/></svg>
            Export data (JSON)
          </button>
          <button onClick={()=> setShowReset(true)} className="w-full py-3 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 border border-red-200 dark:border-red-800 font-semibold text-sm">Reset my data</button>
        </div>
        <p className="text-xs text-stone-500 mt-3 leading-relaxed">Data is stored locally via IndexedDB & localStorage. No account, no server copy. Export before resetting if you want a backup.</p>
      </div>

      {/* Install */}
      <div className="bg-[#1A1E1D] dark:bg-white rounded-[20px] p-5 text-white dark:text-[#1A1E1D]">
        <h3 className="font-semibold">Install app</h3>
        <p className="text-sm opacity-70 mt-1 leading-relaxed">
          {isStandalone ? 'You’re in standalone mode — running like a native app.' : platform==='ios' ? 'On iPhone: Share → Add to Home Screen → Add' : platform==='android' ? 'Tap menu → Add to Home screen → Install' : 'Install from your browser menu to use offline.'}
        </p>
        <div className="mt-3 flex gap-2">
          {canInstall ? (
            <button onClick={()=> prompt()} className="flex-1 py-2.5 rounded-full bg-white text-[#1A1E1D] dark:bg-[#1A1E1D] dark:text-white font-semibold text-sm">Install now</button>
          ) : (
            <span className="flex-1 py-2.5 rounded-full bg-white/10 dark:bg-black/5 text-center text-sm font-medium border border-white/20">{isStandalone ? 'Installed ✓' : 'Use browser menu'}</span>
          )}
          <a href="/#install" className="px-4 py-2.5 rounded-full bg-white/10 dark:bg-black/5 border border-white/15 text-sm font-medium">Help</a>
        </div>
      </div>

      {/* About */}
      <div className="bg-white dark:bg-[#1E2320] rounded-[20px] p-5 border border-black/5 dark:border-white/5">
        <h3 className="font-semibold">About</h3>
        <p className="text-sm text-stone-600 dark:text-white/60 leading-relaxed mt-2">Scroll Guard is a local-first PWA for intentional scrolling. No trackers, no ads, no server. Built to help you pause and decide — not to shame you.</p>
        <div className="mt-3 text-xs text-stone-500">Version 1.0 • Local-first • Offline capable • <a href="/privacy" className="underline decoration-dotted">Privacy</a> • <a href="/terms" className="underline decoration-dotted">Terms</a></div>
      </div>

      {showReset && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <button onClick={()=> setShowReset(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative bg-white dark:bg-[#252B27] rounded-[24px] p-6 w-full max-w-[360px] border border-black/5 shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
            <h3 className="font-display text-xl">Reset all data?</h3>
            <p className="text-sm text-stone-600 dark:text-white/60 mt-2 leading-relaxed">This will delete all sessions and reset settings. This cannot be undone. Your app will feel fresh — like day one.</p>
            <div className="mt-6 flex gap-2">
              <button onClick={()=> setShowReset(false)} className="flex-1 py-3 rounded-full border border-black/10 dark:border-white/10 font-medium">Cancel</button>
              <button onClick={async()=> { await deleteAll(); setShowReset(false); }} className="flex-1 py-3 rounded-full bg-red-600 text-white font-semibold">Delete everything</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
