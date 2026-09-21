import { Link, Outlet, useLocation } from 'react-router-dom'
import { BottomNav } from '../components/BottomNav'
import { InstallBanner } from '../components/InstallBanner'
import { usePWAInstall } from '../hooks/usePWA'
import { useStore } from '../lib/store'
import { useEffect, useState } from 'react'

export default function AppLayout() {
  const { isStandalone } = usePWAInstall()
  const location = useLocation()
  const { active } = useStore()
  const [showUpdate, setShowUpdate] = useState(false)

  useEffect(()=> {
    // listen for PWA update (vite-plugin-pwa)
    const handler = () => setShowUpdate(true)
    window.addEventListener('pwa-update-available', handler as any)
    return ()=> window.removeEventListener('pwa-update-available', handler as any)
  }, [])

  return (
    <div className="min-h-screen bg-[#FFF7F3] dark:bg-[#17152B] text-[#17152B] dark:text-[#FFF7F3] flex flex-col max-w-[480px] mx-auto md:border-x border-black/5 dark:border-white/5 md:shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-[#FFF7F3]/80 dark:bg-[#17152B]/80 backdrop-blur-xl border-b border-black/5 dark:border-white/5 pt-[env(safe-area-inset-top)]">
        <div className="h-[56px] px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#FF4F87] grid place-items-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 3C12 3 7 7 7 12C7 15.5 9.5 18 12 18C14.5 18 17 15.5 17 12C17 7 12 3 12 3Z" stroke="white" strokeWidth="1.8"/><circle cx="12" cy="12" r="2.3" fill="white"/></svg>
            </div>
            <span className="font-display font-bold text-[16px] tracking-tight">Scroll Guard</span>
          </Link>
          <div className="flex items-center gap-2">
            {active && <span className="text-xs font-bold tracking-widest uppercase bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-full animate-pulse">Live</span>}
            {!isStandalone && (
              <Link to="/#install" className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#17152B] dark:bg-white text-white dark:text-black">Install</Link>
            )}
          </div>
        </div>
        {showUpdate && (
          <div className="mx-3 mb-3 bg-[#FF4F87] text-white rounded-2xl px-4 py-3 flex items-center justify-between gap-3" role="alert" aria-live="polite">
            <div className="text-sm font-medium">Update available — refresh for the latest.</div>
            <button onClick={()=> {
              const w = window as unknown as { updateSW?: (r:boolean)=>void }
              if (w.updateSW) w.updateSW(true)
              else window.location.reload()
            }} className="bg-white text-[#FF4F87] px-4 py-1.5 rounded-full text-sm font-bold shrink-0">Refresh</button>
          </div>
        )}
      </div>

      <main className="flex-1 pb-[88px] md:pb-[84px]">
        <Outlet />
      </main>

      <BottomNav />
      <InstallBanner />

      {/* subtle standalone indicator */}
      {location.pathname==='/app' && (
        <div className="fixed bottom-[90px] right-3 text-[10px] opacity-30">Standalone: {isStandalone ? 'yes' : 'browser'}</div>
      )}
    </div>
  )
}
