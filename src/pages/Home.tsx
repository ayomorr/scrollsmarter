import { useState } from 'react'
import { useStore } from '../lib/store'

export default function Home() {
  const { todayMinutes, todayRemaining, streak, active, settings, startSession, pauseSession, resumeSession, addMinutes, endSession, sessions } = useStore()
  const [showStart, setShowStart] = useState(false)
  const [purpose, setPurpose] = useState('Catch up quickly')
  const [category, setCategory] = useState('Social media')
  const [minutes, setMinutes] = useState(15)

  const formatRemaining = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    if (hours > 0) return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const goal = settings.dailyGoal
  const pct = Math.min(100, Math.round((todayMinutes/goal)*100))
  const remainingLabel = todayRemaining>0 ? `${todayRemaining} min remaining` : 'Goal reached — nice pause'

  const handleStart = () => {
    if (Notification && Notification.permission==='default' && settings.notifications) {
      Notification.requestPermission()
    }
    startSession(purpose, category, minutes)
    setShowStart(false)
  }

  // quiet hours check
  const inQuiet = (()=> {
    if (!settings.quietHours.enabled) return false
    const now = new Date()
    const [sh, sm] = settings.quietHours.start.split(':').map(Number)
    const [eh, em] = settings.quietHours.end.split(':').map(Number)
    const cur = now.getHours()*60+now.getMinutes()
    const start = sh*60+sm
    const end = eh*60+em
    if (start < end) return cur >= start && cur < end
    return cur >= start || cur < end
  })()

  return (
    <div className="px-4 pt-4 space-y-4">
      {/* Progress card */}
      <div className="bg-white dark:bg-[#26213B] rounded-[24px] p-5 border border-black/5 dark:border-white/5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#FF4F87]">Today's progress</div>
            <div className="font-display text-[30px] leading-none mt-1">{todayMinutes} <span className="text-stone-500 text-[18px] font-body font-normal">min today</span></div>
            <div className="text-xs text-stone-500 mt-1">{remainingLabel} • goal {goal} min</div>
          </div>
          <div className="text-right">
            <div className="w-14 h-14 rounded-full border-[3px] border-[#DFF8F5] dark:border-white/10 grid place-items-center relative">
              <div className="absolute inset-0 rounded-full" style={{ background: `conic-gradient(#FF4F87 ${pct}%, transparent ${pct}%)` }} />
              <div className="w-[46px] h-[46px] rounded-full bg-white dark:bg-[#26213B] grid place-items-center text-xs font-bold">{pct}%</div>
            </div>
            <div className="text-[11px] text-stone-500 mt-1">{streak} day streak</div>
          </div>
        </div>
        <div className="mt-4 h-2 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-[#FF4F87] transition-all" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-3 flex gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-[#F0DFDA] dark:bg-white/10 font-medium">{sessions.filter(s=> new Date(s.startedAt).toISOString().slice(0,10)===new Date().toISOString().slice(0,10)).length} sessions</span>
          {inQuiet && <span className="px-2.5 py-1 rounded-full bg-[#17152B] text-white dark:bg-white dark:text-black font-medium">Quiet hours</span>}
        </div>
      </div>

      {/* Active session */}
      {active ? (
        <div className="bg-[#17152B] dark:bg-white text-white dark:text-[#17152B] rounded-[24px] p-5 relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#FF4F87]/30 blur-2xl rounded-full" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold tracking-widest uppercase opacity-60">Current session</span>
              <span className={`w-2 h-2 rounded-full ${active.pausedAt ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'}`} />
            </div>
            <div className="mt-3 flex items-baseline gap-3">
              <span className="font-display text-[40px] leading-none tabular-nums">{formatRemaining(active.remaining)}</span>
              <span className="text-xs bg-white/15 dark:bg-black/10 px-2.5 py-1 rounded-full font-medium">{active.category} • {active.durationMinutes}m</span>
            </div>
            <div className="text-sm opacity-70 mt-1 line-clamp-1">“{active.label}”</div>
            <div className="mt-4 h-1.5 bg-white/15 dark:bg-black/10 rounded-full overflow-hidden">
              <div className="h-full bg-white dark:bg-[#FF4F87] transition-all" style={{ width: `${((active.totalSeconds-active.remaining)/active.totalSeconds)*100}%` }} />
            </div>
            {active.remaining <= 60 && active.remaining>0 && !active.pausedAt && (
              <div className="mt-4 bg-white/10 dark:bg-black/5 rounded-2xl p-3 flex items-center gap-3 border border-white/10">
                <span className="w-8 h-8 rounded-full bg-amber-400 grid place-items-center text-sm">🌿</span>
                <div className="flex-1">
                  <div className="text-sm font-semibold">One minute left</div>
                  <div className="text-xs opacity-70">Still want to keep scrolling?</div>
                </div>
              </div>
            )}
            <div className="mt-4 grid grid-cols-3 gap-2">
              {!active.pausedAt ? (
                <button onClick={pauseSession} className="py-3 rounded-full bg-white dark:bg-[#17152B] text-[#17152B] dark:text-white font-semibold text-sm">Pause</button>
              ) : (
                <button onClick={resumeSession} className="py-3 rounded-full bg-emerald-500 text-white font-semibold text-sm">Resume</button>
              )}
              <button onClick={()=> addMinutes(5)} className="py-3 rounded-full bg-white/10 dark:bg-black/10 border border-white/20 font-semibold text-sm">+5 min</button>
              <button onClick={()=> endSession('completed')} className="py-3 rounded-full bg-[#FF4F87] text-white font-semibold text-sm">I'm done</button>
            </div>
            <button onClick={()=> endSession('cancelled')} className="w-full mt-2 text-xs opacity-60 underline decoration-dotted">End without saving</button>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#26213B] rounded-[24px] p-6 border border-black/5 dark:border-white/5 text-center">
          <div className="w-12 h-12 rounded-full bg-[#F0DFDA] dark:bg-white/10 grid place-items-center mx-auto text-xl">⏳</div>
          <h3 className="font-display text-xl mt-3">No active session</h3>
          <p className="text-sm text-stone-500 mt-1">Pick an intention and start a timer. You’ll stay aware, not adrift.</p>
          <button onClick={()=> setShowStart(true)} className="mt-4 w-full py-3.5 rounded-full bg-[#FF4F87] text-white font-semibold">Start session</button>
          <div className="text-xs text-stone-600 mt-2">Works offline • Timers run in background</div>
        </div>
      )}

      {/* Quick start */}
      {!active && (
        <div>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Quick start</h3>
            <button onClick={()=> setShowStart(true)} className="text-sm font-medium text-[#FF4F87]">Customize →</button>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-3">
            {[
              { m:5, label:'Quick check', icon:'⚡', cat:'Social media' },
              { m:15, label:'Deep dive', icon:'📚', cat:'Video' },
              { m:25, label:'Wind down', icon:'🌙', cat:'News' },
            ].map(q=>(
              <button key={q.label} onClick={()=> { setMinutes(q.m); setPurpose(q.label); setCategory(q.cat); startSession(q.label, q.cat, q.m)}} className="bg-white dark:bg-[#26213B] rounded-2xl p-4 border border-black/5 dark:border-white/5 text-center hover:border-[#FF4F87]/20 transition">
                <div className="text-lg">{q.icon}</div>
                <div className="text-xs font-bold tracking-widest uppercase text-stone-500 mt-1">{q.m} min</div>
                <div className="text-sm font-semibold leading-tight mt-1">{q.label}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Limits */}
      <div className="bg-white dark:bg-[#26213B] rounded-[24px] p-5 border border-black/5 dark:border-white/5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Your limits</h3>
          <span className="text-xs bg-[#F0DFDA] dark:bg-white/10 px-2.5 py-1 rounded-full font-medium">Self-set</span>
        </div>
        <p className="text-xs text-stone-500 mt-1 leading-relaxed">We don’t spy on other apps — these are your own gentle caps. Track intentional time against them.</p>
        <div className="mt-4 space-y-3">
          {settings.limits.map(l=> {
            const catUsed = sessions.filter(s=> s.category===l.label && new Date(s.startedAt).toISOString().slice(0,10)===new Date().toISOString().slice(0,10)).reduce((a,s)=> a+ s.durationMinutes,0) + (active?.category===l.label ? Math.ceil((active.totalSeconds-active.remaining)/60) : 0)
            const pctCat = Math.min(100, Math.round(catUsed / l.minutes * 100))
            return (
              <div key={l.id} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{l.label}</span>
                    <span className="text-xs text-stone-500">{catUsed}/{l.minutes} min</span>
                  </div>
                  <div className="mt-1.5 h-1.5 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#FF4F87]" style={{ width: `${pctCat}%` }} />
                  </div>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${pctCat>=100 ? 'bg-red-100 text-red-600' : pctCat>=80 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>{pctCat}%</span>
              </div>
            )
          })}
        </div>
        <div className="text-xs text-stone-600 mt-3">Honest note: Browser apps can’t read screen time from other apps. These limits track your intentional sessions only.</div>
      </div>

      {/* Start sheet */}
      {showStart && (
        <div className="fixed inset-0 z-50 grid place-items-end sm:place-items-center p-0 sm:p-4">
          <button aria-label="Close" onClick={()=> setShowStart(false)} className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div className="relative w-full max-w-[480px] bg-[#FFF7F3] dark:bg-[#26213B] rounded-t-[28px] sm:rounded-[28px] p-6 pb-[calc(16px+env(safe-area-inset-bottom))] border-t border-black/5 max-h-[92dvh] overflow-y-auto shadow-[0_-12px_40px_rgba(0,0,0,0.12)]">
            <div className="w-10 h-1 bg-black/10 dark:bg-white/10 rounded-full mx-auto mb-5" />
            <h3 className="font-display text-2xl">Start a session</h3>
            <p className="text-sm text-stone-500 mt-1">Give your scroll a purpose. You can pause or extend anytime.</p>

            <label className="block mt-5 text-sm font-medium">Purpose</label>
            <input value={purpose} onChange={e=> setPurpose(e.target.value)} placeholder="e.g., Catch up with friends" className="mt-1.5 w-full px-4 py-3 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-[#FF4F87]/20" />

            <label className="block mt-4 text-sm font-medium">Category</label>
            <div className="mt-1.5 grid grid-cols-3 gap-2">
              {['Social media','Video','News','Learning','Other'].map(c=>(
                <button key={c} onClick={()=> setCategory(c)} className={`px-3 py-2.5 rounded-full border text-sm font-medium transition ${category===c ? 'bg-[#FF4F87] text-white border-[#FF4F87]' : 'bg-white dark:bg-white/5 border-black/10 dark:border-white/10'}`}>{c}</button>
              ))}
            </div>

            <label className="block mt-4 text-sm font-medium">Duration</label>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {[5,10,15,20,25,30,45,60,90,120,180,240].map(m=>(
                <button key={m} onClick={()=> setMinutes(m)} className={`py-3 rounded-2xl border font-semibold ${minutes===m ? 'bg-[#17152B] text-white dark:bg-white dark:text-black border-transparent' : 'bg-white dark:bg-white/5 border-black/10 dark:border-white/10'}`}>{m}m</button>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-3">
              <label className="flex-1 text-xs font-medium text-stone-500">
                Custom duration
                <input type="number" min={1} max={1440} step={1} value={minutes} onChange={e=> setMinutes(Math.min(1440, Math.max(1, Number(e.target.value) || 1)))} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 text-sm font-semibold text-[#17152B] dark:text-white" />
              </label>
              <span className="text-sm font-semibold w-14 text-right">min</span>
            </div>
            <p className="text-xs text-stone-500 mt-2">Choose any duration from 1 minute to 24 hours.</p>

            <button onClick={handleStart} className="mt-6 w-full py-3.5 rounded-full bg-[#FF4F87] text-white font-semibold text-[16px]">Start {minutes}-minute session</button>
            <button onClick={()=> setShowStart(false)} className="mt-2 w-full py-3 rounded-full border border-black/10 dark:border-white/10 font-medium">Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}
