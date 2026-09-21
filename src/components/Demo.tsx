import { useEffect, useRef, useState } from 'react'

export function InteractiveDemo() {
  const [phase, setPhase] = useState<'idle'|'running'|'nudge'|'done'>('idle')
  const [seconds, setSeconds] = useState(600) // 10 min demo uses 600 but we fast-forward for demo? We'll use 60 sec demo representing 10 min
  const [purpose, setPurpose] = useState('Catch up with friends')
  const total = 60
  const timerRef = useRef<number | null>(null)

  useEffect(()=> {
    if (phase !== 'running') return
    timerRef.current = window.setInterval(()=> {
      setSeconds(s=>{
        if (s<=1) {
          setPhase('done')
          return 0
        }
        if (s===30) setPhase('nudge') // at halfway show nudge but keep running? We'll show overlay
        return s-1
      })
    }, 1000)
    return ()=> { if (timerRef.current) clearInterval(timerRef.current) }
  }, [phase])

  // for demo, when nudge appears we pause timer until decision?
  useEffect(()=> {
    if (phase==='nudge' && timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [phase])

  const pct = ((total - seconds)/total)*100
  const mins = Math.floor(seconds/60)
  const secs = seconds % 60

  const start = (p: string) => {
    setPurpose(p)
    setSeconds(total)
    setPhase('running')
  }

  return (
    <div className="bg-white dark:bg-[#1E2320] rounded-[28px] p-5 md:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-black/5 dark:border-white/10 overflow-hidden relative">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold tracking-widest uppercase text-stone-500">Live demo — try it</span>
        </div>
        <span className="text-xs bg-[#F5EBDD] dark:bg-white/10 px-3 py-1 rounded-full font-medium">No install needed</span>
      </div>

      {phase==='idle' && (
        <div>
          <h3 className="font-display text-[22px] leading-tight">Start an intentional session</h3>
          <p className="text-sm text-stone-500 mt-1">Pick a purpose, set a timer, and let us nudge you before you spiral.</p>
          <div className="grid grid-cols-1 gap-2 mt-5">
            {[
              {label:'Catch up with friends', mins:10, icon:'💬'},
              {label:'Learn something', mins:15, icon:'📚'},
              {label:'Wind down', mins:5, icon:'🌙'},
            ].map(o=>(
              <button key={o.label} onClick={()=> start(o.label)} className="flex items-center gap-3 p-4 rounded-2xl border border-black/[0.06] dark:border-white/10 hover:border-[#5B7A5F]/30 hover:bg-[#FDF8F1] dark:hover:bg-white/[0.04] text-left transition">
                <span className="w-10 h-10 rounded-xl bg-[#F5EBDD] dark:bg-white/10 grid place-items-center text-lg">{o.icon}</span>
                <span className="flex-1">
                  <span className="block text-sm font-semibold">{o.label}</span>
                  <span className="block text-xs text-stone-500">{o.mins} minute session</span>
                </span>
                <span className="text-[#5B7A5F]">→</span>
              </button>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-stone-600">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="8"/><path d="M12 8V12L15 14"/></svg>
            Demo runs at 1× speed — real sessions keep running even if you switch apps.
          </div>
        </div>
      )}

      {(phase==='running' || phase==='nudge') && (
        <div>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5B7A5F] text-white text-xs font-semibold tracking-wide">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> {purpose}
            </div>
            <div className="mt-4 font-display text-[52px] leading-none tracking-tight tabular-nums">
              {String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}
            </div>
            <div className="text-sm text-stone-500">remaining • {Math.round(pct)}% in</div>
          </div>

          <div className="mt-6 h-2 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#7A9E7E] to-[#5B7A5F] transition-all duration-1000" style={{ width: `${pct}%` }} />
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2 text-center">
            <div className="bg-[#FDF8F1] dark:bg-white/[0.04] rounded-2xl p-3 border border-black/5">
              <div className="text-[11px] tracking-widest uppercase text-stone-500">Elapsed</div>
              <div className="font-semibold">{Math.floor((total-seconds)/60)}:{String((total-seconds)%60).padStart(2,'0')}</div>
            </div>
            <div className="bg-[#FDF8F1] dark:bg-white/[0.04] rounded-2xl p-3 border border-black/5">
              <div className="text-[11px] tracking-widest uppercase text-stone-500">Purpose</div>
              <div className="text-xs font-medium leading-tight line-clamp-2">{purpose}</div>
            </div>
            <div className="bg-[#FDF8F1] dark:bg-white/[0.04] rounded-2xl p-3 border border-black/5">
              <div className="text-[11px] tracking-widest uppercase text-stone-500">Mode</div>
              <div className="text-xs font-semibold text-[#5B7A5F]">Gentle</div>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <button onClick={()=> { setPhase('idle'); setSeconds(total)}} className="flex-1 py-3 rounded-full border border-black/10 dark:border-white/10 font-medium text-sm">End</button>
            <button onClick={()=> setSeconds(s=> Math.min(total, s+30))} className="flex-1 py-3 rounded-full bg-[#F5EBDD] dark:bg-white/10 font-medium text-sm">+30 sec</button>
          </div>

          {phase==='nudge' && (
            <div className="absolute inset-0 bg-white/80 dark:bg-[#1E2320]/80 backdrop-blur-md grid place-items-center p-6">
              <div className="bg-white dark:bg-[#252B27] rounded-[24px] p-6 w-full max-w-[320px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-black/5 text-center animate-[in_0.3s_ease]">
                <div className="w-12 h-12 rounded-full bg-[#F5EBDD] dark:bg-[#5B7A5F]/30 grid place-items-center mx-auto text-xl">🌿</div>
                <h4 className="font-display text-xl mt-3">Still want to keep scrolling?</h4>
                <p className="text-sm text-stone-500 mt-1">You've paused before — decide intentionally.</p>
                <div className="grid gap-2 mt-5">
                  <button onClick={()=> { setPhase('done'); setSeconds(0)}} className="w-full py-3 rounded-full bg-[#1A1E1D] dark:bg-white text-white dark:text-[#1A1E1D] font-semibold">I'm done ✓</button>
                  <button onClick={()=> { setPhase('running'); setSeconds(s=> s+30)}} className="w-full py-3 rounded-full bg-[#E8F0E8] dark:bg-white/10 font-semibold">+5 minutes</button>
                  <button onClick={()=> setPhase('running')} className="w-full py-3 rounded-full border border-black/10 dark:border-white/10 font-medium text-sm">Continue</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {phase==='done' && (
        <div className="text-center py-2">
          <div className="w-16 h-16 rounded-full bg-[#E8F0E8] dark:bg-[#5B7A5F]/20 grid place-items-center mx-auto">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5B7A5F" strokeWidth="2"><path d="M5 13L9 17L19 7"/></svg>
          </div>
          <h3 className="font-display text-2xl mt-4">Session complete.</h3>
          <p className="text-sm text-stone-500 mt-1">You stayed intentional for {purpose.toLowerCase()}. Nice pause.</p>
          <div className="mt-4 bg-[#FDF8F1] dark:bg-white/[0.04] rounded-2xl p-4 flex justify-around border border-black/5">
            <div><div className="text-xs uppercase tracking-widest text-stone-500">Time</div><div className="font-semibold">1:00</div></div>
            <div className="w-px bg-black/5" />
            <div><div className="text-xs uppercase tracking-widest text-stone-500">Purpose</div><div className="font-medium text-sm">{purpose}</div></div>
          </div>
          <button onClick={()=> setPhase('idle')} className="mt-6 w-full py-3 rounded-full bg-[#5B7A5F] text-white font-semibold">Start another</button>
          <button onClick={()=> setPhase('idle')} className="mt-2 text-sm text-stone-500 underline decoration-dotted">Back to options</button>
        </div>
      )}

      <style>{`@keyframes in { from { opacity:0; transform: translateY(8px) scale(0.98)} to {opacity:1; transform:none}}`}</style>
    </div>
  )
}
