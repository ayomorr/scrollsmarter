import { useState } from 'react'
import { useStore } from '../lib/store'

export default function Sessions() {
  const { sessions, active, startSession, endSession } = useStore()
  const [filter, setFilter] = useState<'all'|'today'>('all')
  const today = new Date().toISOString().slice(0,10)
  const list = filter==='today' ? sessions.filter(s=> new Date(s.startedAt).toISOString().slice(0,10)===today) : sessions

  const [showNew, setShowNew] = useState(false)
  const [purpose, setPurpose] = useState('')
  const [cat, setCat] = useState('Social media')
  const [mins, setMins] = useState(15)

  return (
    <div className="px-4 pt-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">Sessions</h1>
        <button onClick={()=> setShowNew(true)} className="px-4 py-2 rounded-full bg-[#5B7A5F] text-white text-sm font-semibold">New</button>
      </div>

      <div className="flex gap-2">
        <button onClick={()=> setFilter('all')} className={`px-4 py-2 rounded-full text-sm font-medium border ${filter==='all' ? 'bg-[#1A1E1D] text-white dark:bg-white dark:text-black border-transparent' : 'bg-white dark:bg-white/5 border-black/10 dark:border-white/10'}`}>All</button>
        <button onClick={()=> setFilter('today')} className={`px-4 py-2 rounded-full text-sm font-medium border ${filter==='today' ? 'bg-[#1A1E1D] text-white dark:bg-white dark:text-black border-transparent' : 'bg-white dark:bg-white/5 border-black/10 dark:border-white/10'}`}>Today</button>
        <span className="ml-auto text-xs text-stone-500 self-center">{list.length} sessions</span>
      </div>

      {active && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white grid place-items-center">⏳</div>
          <div className="flex-1">
            <div className="text-sm font-semibold">Live: {active.label} • {Math.floor(active.remaining/60)}:{String(active.remaining%60).padStart(2,'0')} left</div>
            <div className="text-xs text-stone-600 dark:text-white/60">{active.category} • {active.durationMinutes} min</div>
          </div>
          <button onClick={()=> endSession('completed')} className="text-xs font-bold px-3 py-1.5 rounded-full bg-[#1A1E1D] text-white dark:bg-white dark:text-black">End</button>
        </div>
      )}

      <div className="space-y-3">
        {list.length===0 ? (
          <div className="bg-white dark:bg-[#1E2320] rounded-[20px] p-8 text-center border border-black/5 dark:border-white/5">
            <div className="w-12 h-12 rounded-full bg-[#F5EBDD] dark:bg-white/10 grid place-items-center mx-auto">📝</div>
            <div className="font-medium mt-3">No sessions yet</div>
            <div className="text-sm text-stone-500 mt-1">Start your first intentional timer. It takes 15 seconds.</div>
            <button onClick={()=> setShowNew(true)} className="mt-4 px-6 py-2.5 rounded-full bg-[#5B7A5F] text-white text-sm font-semibold">Start one</button>
          </div>
        ) : list.map(s=> {
          const d = new Date(s.startedAt)
          const minsSpent = s.remainingSeconds != null ? Math.ceil((s.durationMinutes*60 - s.remainingSeconds)/60) : s.durationMinutes
          return (
            <div key={s.id} className="bg-white dark:bg-[#1E2320] rounded-2xl p-4 border border-black/5 dark:border-white/5 flex gap-3">
              <div className={`w-10 h-10 rounded-xl grid place-items-center shrink-0 ${s.status==='completed' ? 'bg-[#E8F0E8] dark:bg-emerald-900/20' : s.status==='cancelled' ? 'bg-stone-100 dark:bg-white/5' : 'bg-amber-100'}`}>
                {s.status==='completed' ? '✓' : s.status==='cancelled' ? '✕' : '⏳'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm truncate">{s.label}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 font-medium shrink-0">{s.category}</span>
                </div>
                <div className="text-xs text-stone-500 mt-0.5">{d.toLocaleDateString()} • {d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})} • {s.status}</div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs font-semibold bg-[#F5EBDD] dark:bg-white/10 px-2 py-1 rounded-full">{s.durationMinutes} min planned</span>
                  {s.status==='completed' && <span className="text-xs text-stone-500">{minsSpent} min • intentional</span>}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {showNew && (
        <div className="fixed inset-0 z-50 grid place-items-end sm:place-items-center p-0 sm:p-4">
          <button onClick={()=> setShowNew(false)} className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div className="relative w-full max-w-[480px] bg-white dark:bg-[#1E2320] rounded-t-[24px] sm:rounded-[24px] p-6 border-t border-black/5 max-h-[90dvh] overflow-auto">
            <h3 className="font-display text-xl">New session</h3>
            <label className="block text-sm font-medium mt-4">Purpose</label>
            <input value={purpose} onChange={e=> setPurpose(e.target.value)} placeholder="What will you do?" className="mt-1 w-full px-4 py-3 rounded-2xl border border-black/10 dark:border-white/10 bg-[#FDF8F1] dark:bg-white/5" />
            <label className="block text-sm font-medium mt-4">Category</label>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {['Social media','Video','News','Learning','Other'].map(c=>(
                <button key={c} onClick={()=> setCat(c)} className={`px-3 py-2 rounded-full text-sm font-medium border ${cat===c?'bg-[#5B7A5F] text-white border-[#5B7A5F]':'bg-white dark:bg-white/5 border-black/10'}`}>{c}</button>
              ))}
            </div>
            <label className="block text-sm font-medium mt-4">Minutes</label>
            <div className="grid grid-cols-4 gap-2 mt-1">
              {[5,10,15,20,30,45].map(m=>(
                <button key={m} onClick={()=> setMins(m)} className={`py-2.5 rounded-2xl border font-semibold ${mins===m?'bg-[#1A1E1D] text-white dark:bg-white dark:text-black':'bg-white dark:bg-white/5 border-black/10'}`}>{m}</button>
              ))}
            </div>
            <button onClick={()=> { startSession(purpose||'Intentional scroll', cat, mins); setShowNew(false); setPurpose('') }} className="mt-6 w-full py-3.5 rounded-full bg-[#5B7A5F] text-white font-semibold">Start {mins} min</button>
            <button onClick={()=> setShowNew(false)} className="mt-2 w-full py-3 rounded-full border border-black/10 dark:border-white/10">Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}
