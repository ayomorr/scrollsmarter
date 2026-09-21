import { useEffect, useState } from 'react'
import { usePWAInstall } from '../hooks/usePWA'

export function InstallBanner() {
  const { canInstall, isStandalone, platform, prompt } = usePWAInstall()
  const [dismissed, setDismissed] = useState(false)
  const [show, setShow] = useState(false)

  useEffect(()=> {
    if (isStandalone) return
    const d = localStorage.getItem('sg_banner_dismissed')
    if (d && Date.now() - Number(d) < 1000*60*60*24*3) return
    const t = setTimeout(()=> setShow(true), 3000)
    return ()=> clearTimeout(t)
  }, [isStandalone])

  if (isStandalone || dismissed || !show) return null

  const dismiss = () => {
    setDismissed(true)
    localStorage.setItem('sg_banner_dismissed', String(Date.now()))
  }

  return (
    <div className="fixed bottom-[88px] md:bottom-6 inset-x-3 md:left-1/2 md:-translate-x-1/2 md:max-w-[420px] z-50">
      <div className="bg-[#1A1E1D] text-white rounded-[20px] p-4 flex items-center gap-3 shadow-[0_12px_32px_rgba(0,0,0,0.22)] border border-white/10">
        <div className="w-10 h-10 rounded-xl bg-[#5B7A5F] grid place-items-center shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="5" y="4" width="14" height="16" rx="3" stroke="white" strokeWidth="1.6"/><path d="M9 9H15M9 13H13" stroke="white" strokeWidth="1.6" strokeLinecap="round"/></svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-semibold leading-none">Make Scroll Guard feel like an app</div>
          <div className="text-[12px] opacity-70 leading-tight mt-1">{platform==='ios' ? 'Add to Home Screen for the best experience' : 'Install for offline access & focus timers'}</div>
        </div>
        {canInstall ? (
          <button onClick={()=> prompt()} className="bg-white text-[#1A1E1D] px-4 py-2 rounded-full text-sm font-semibold shrink-0">Install</button>
        ) : (
          <a href="#install" onClick={dismiss} className="bg-white text-[#1A1E1D] px-4 py-2 rounded-full text-sm font-semibold shrink-0">How</a>
        )}
        <button onClick={dismiss} aria-label="Dismiss" className="w-8 h-8 grid place-items-center rounded-full bg-white/10 shrink-0">✕</button>
      </div>
    </div>
  )
}
