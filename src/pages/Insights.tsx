import { useMemo } from 'react'
import { useStore } from '../lib/store'

export default function Insights() {
  const { sessions, todayMinutes, streak, settings } = useStore()

  const weekly = useMemo(()=> {
    const days: { key:string; label:string; mins:number }[] = []
    for (let i=6;i>=0;i--) {
      const d = new Date()
      d.setDate(d.getDate()-i)
      const key = d.toISOString().slice(0,10)
      const label = d.toLocaleDateString('en-US', { weekday:'short' }).slice(0,2)
      const mins = sessions.filter(s=> new Date(s.startedAt).toISOString().slice(0,10)===key && s.status!=='cancelled')
        .reduce((a,s)=> a+ (s.remainingSeconds!=null ? Math.ceil((s.durationMinutes*60 - s.remainingSeconds)/60) : s.durationMinutes),0)
      days.push({ key, label, mins })
    }
    return days
  }, [sessions])

  const total = sessions.filter(s=>s.status!=='cancelled').reduce((a,s)=> a+ (s.remainingSeconds!=null ? Math.ceil((s.durationMinutes*60 - s.remainingSeconds)/60) : s.durationMinutes),0)
  const completed = sessions.filter(s=> s.status==='completed').length
  const avg = completed ? Math.round(total/completed) : 0
  const max = Math.max(30, ...weekly.map(d=>d.mins), settings.dailyGoal)

  return (
    <div className="px-4 pt-4 space-y-4">
      <h1 className="font-display text-2xl">Insights</h1>
      <p className="text-sm text-stone-500 -mt-2">Your locally stored progress — no server, just you.</p>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-[#26213B] rounded-2xl p-4 border border-black/5 dark:border-white/5 text-center">
          <div className="text-[11px] tracking-widest uppercase font-bold text-stone-500">Today</div>
          <div className="font-display text-xl mt-1">{todayMinutes}m</div>
          <div className="text-xs text-stone-500">of {settings.dailyGoal}m</div>
        </div>
        <div className="bg-white dark:bg-[#26213B] rounded-2xl p-4 border border-black/5 dark:border-white/5 text-center">
          <div className="text-[11px] tracking-widest uppercase font-bold text-stone-500">Total</div>
          <div className="font-display text-xl mt-1">{total}m</div>
          <div className="text-xs text-stone-500">{completed} sessions</div>
        </div>
        <div className="bg-[#FF4F87] text-white rounded-2xl p-4 text-center">
          <div className="text-[11px] tracking-widest uppercase font-bold opacity-80">Streak</div>
          <div className="font-display text-xl mt-1">{streak} days</div>
          <div className="text-xs opacity-80">gentle • avg {avg}m</div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#26213B] rounded-[24px] p-5 border border-black/5 dark:border-white/5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Weekly activity</h3>
          <span className="text-xs bg-[#F0DFDA] dark:bg-white/10 px-2.5 py-1 rounded-full font-medium">Intentional minutes</span>
        </div>
        <div className="mt-6 flex items-end gap-2 h-[120px]">
          {weekly.map(d=> {
            const h = Math.max(6, (d.mins / max) * 100)
            const isToday = d.key === new Date().toISOString().slice(0,10)
            return (
              <div key={d.key} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex justify-center" style={{ height: '100px' }}>
                  <div className="w-full max-w-[44px] bg-black/5 dark:bg-white/10 rounded-full relative overflow-hidden flex items-end">
                    <div className={`w-full rounded-full transition-all ${isToday ? 'bg-[#FF4F87]' : 'bg-[#25D9D1]'} `} style={{ height: `${h}%` }} />
                  </div>
                </div>
                <span className={`text-xs font-medium ${isToday ? 'text-[#FF4F87] font-bold' : 'text-stone-500'}`}>{d.label}</span>
                <span className="text-[10px] text-stone-600">{d.mins}m</span>
              </div>
            )
          })}
        </div>
        <div className="mt-4 h-px bg-black/5 dark:bg-white/10" />
        <div className="mt-3 flex justify-between text-xs text-stone-500">
          <span>Goal: {settings.dailyGoal} min/day</span>
          <span>{weekly.reduce((a,b)=>a+b.mins,0)} min this week</span>
        </div>
      </div>

      <div className="bg-white dark:bg-[#26213B] rounded-[24px] p-5 border border-black/5 dark:border-white/5">
        <h3 className="font-semibold">Breakdown</h3>
        <div className="mt-4 space-y-3">
          {(() => {
            const cats = ['Social media','Video','News','Learning','Other'] as const
            const totalCat = sessions.length || 1
            return cats.map(c=>{
              const count = sessions.filter(s=> s.category===c).length
              const pct = Math.round(count/totalCat*100)
              return (
                <div key={c} className="flex items-center gap-3">
                  <span className="text-sm w-[110px] font-medium">{c}</span>
                  <div className="flex-1 h-2 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#FF4F87]" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-stone-500 w-10 text-right">{pct}%</span>
                </div>
              )
            })
          })()}
        </div>
      </div>

      <div className="bg-[#FFF7F3] dark:bg-white/5 rounded-2xl p-4 border border-dashed border-black/10 dark:border-white/10 text-xs leading-relaxed text-stone-600 dark:text-white/60">
        Everything you see comes from <b>your device only</b>. No analytics, no tracking, no server. If you delete the app’s data, it’s gone — we don’t keep a copy.
      </div>
    </div>
  )
}
