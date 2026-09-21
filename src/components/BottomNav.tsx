import { NavLink } from 'react-router-dom'

const items = [
  { to: '/app/home', label: 'Home', icon: '⌂' },
  { to: '/app/sessions', label: 'Sessions', icon: '◐' },
  { to: '/app/insights', label: 'Insights', icon: '◑' },
  { to: '/app/settings', label: 'Settings', icon: '⚙' },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/90 dark:bg-[#1E2320]/90 backdrop-blur-xl border-t border-black/5 dark:border-white/10 pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-[480px] mx-auto flex">
        {items.map(it => (
          <NavLink key={it.to} to={it.to} className={({isActive}) => `flex-1 flex flex-col items-center gap-1 py-3 text-[11px] tracking-wide font-medium transition-colors ${isActive ? 'text-[#5B7A5F] dark:text-[#A8C4A8]' : 'text-[#8A8682] dark:text-white/50'}`}>
            <span className={`w-7 h-7 grid place-items-center rounded-full text-[15px] ${'/*'}`}>{
              it.label==='Home' ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9L12 3L21 9V20H15V14H9V20H3V9Z"/></svg>
              ) : it.label==='Sessions' ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="8"/><path d="M12 8V12L15 14"/></svg>
              ) : it.label==='Insights' ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 16L9 10L12 13L20 6"/><path d="M20 6V12H14"/><path d="M4 20H20"/></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M12 2V4M12 20V22M4.93 4.93L6.34 6.34M17.66 17.66L19.07 19.07M2 12H4M20 12H22M4.93 19.07L6.34 17.66M17.66 6.34L19.07 4.93"/></svg>
              )
            }</span>
            {it.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
