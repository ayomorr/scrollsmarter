import { useState } from 'react'
import { Link } from 'react-router-dom'
import { InteractiveDemo } from '../components/Demo'
import { usePWAInstall } from '../hooks/usePWA'

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 rounded-xl bg-[#5B7A5F] grid place-items-center shadow-sm">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 3C12 3 7 7 7 12C7 15.5 9.5 18 12 18C14.5 18 17 15.5 17 12C17 7 12 3 12 3Z" stroke="white" strokeWidth="1.8" strokeLinejoin="round"/>
          <path d="M12 18V21" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
          <circle cx="12" cy="12" r="2.5" fill="white" />
        </svg>
      </div>
      <span className="font-display font-bold tracking-tight text-[18px]">Scroll Guard</span>
      <span className="hidden sm:inline text-[10px] tracking-[0.12em] uppercase bg-[#5B7A5F] text-white px-1.5 py-0.5 rounded-full font-bold">PWA</span>
    </div>
  )
}

function InstallButton({ variant='primary', className='' }: { variant?: 'primary'|'ghost'|'dark', className?: string }) {
  const { canInstall, prompt } = usePWAInstall()
  const handle = async () => {
    if (canInstall) {
      await prompt()
    } else {
      document.getElementById('install')?.scrollIntoView({behavior:'smooth'})
    }
  }
  if (variant==='ghost') return (
    <button onClick={handle} className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-black/10 dark:border-white/15 bg-white dark:bg-white/5 font-semibold text-sm hover:bg-black/[0.02] transition min-h-[44px] ${className}`}>
      See how it works
    </button>
  )
  if (variant==='dark') return (
    <button onClick={handle} className={`inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#1A1E1D] dark:bg-white text-white dark:text-[#1A1E1D] font-semibold text-sm shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:opacity-90 transition min-h-[44px] ${className}`}>
      Install Scroll Guard
      <span className="w-6 h-6 rounded-full bg-white/15 dark:bg-black/10 grid place-items-center text-[12px]">↗</span>
    </button>
  )
  return (
    <button onClick={handle} className={`inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#5B7A5F] text-white font-semibold text-[15px] shadow-[0_8px_20px_rgba(91,122,95,0.35)] hover:bg-[#4A6650] transition min-h-[44px] ${className}`}>
      Install Scroll Guard
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 4V16M12 16L8 12M12 16L16 12"/><path d="M4 18V20H20V18"/></svg>
    </button>
  )
}

function PhoneMock() {
  return (
    <div className="relative mx-auto w-[300px] md:w-[340px]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#7A9E7E]/20 to-[#E8B86A]/20 blur-[40px] rounded-[40px]" />
      <div className="relative bg-[#0F1410] rounded-[46px] p-3 shadow-[0_30px_80px_rgba(0,0,0,0.25),0_0_0_1px_rgba(255,255,255,0.08)] border border-white/10">
        <div className="bg-[#FDF8F1] rounded-[34px] overflow-hidden relative">
          <div className="h-7 flex items-center justify-center relative">
            <div className="w-20 h-5 bg-black rounded-full" />
            <span className="absolute right-6 text-[10px] font-bold tracking-wide">9:41</span>
          </div>
          <div className="px-5 pb-5">
            <div className="flex items-center justify-between">
              <div className="text-[11px] tracking-widest uppercase font-bold text-[#5B7A5F]">Today</div>
              <div className="w-7 h-7 rounded-full bg-white border border-black/5 grid place-items-center">🌿</div>
            </div>
            <div className="mt-1 font-display text-[22px] leading-none">23 min today</div>
            <div className="text-xs text-stone-500">37 min remaining • goal 60</div>

            <div className="mt-4 h-2 bg-black/5 rounded-full overflow-hidden">
              <div className="h-full w-[38%] bg-[#5B7A5F] rounded-full" />
            </div>

            <div className="mt-4 bg-white rounded-[20px] p-4 border border-black/[0.06] shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-widest uppercase text-stone-500">Current session</span>
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-display text-[28px]">07:42</span>
                <span className="text-xs bg-[#F5EBDD] px-2 py-1 rounded-full font-medium">Social • 15m</span>
              </div>
              <div className="text-xs text-stone-500">Purpose: catch up quickly</div>
              <div className="mt-3 flex gap-2">
                <span className="flex-1 py-2 rounded-full bg-[#1A1E1D] text-white text-xs font-semibold grid place-items-center">Pause</span>
                <span className="flex-1 py-2 rounded-full bg-[#F5EBDD] text-xs font-semibold grid place-items-center">+5 min</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-[#2E3B2F] text-white rounded-2xl p-4">
                <div className="text-[11px] uppercase tracking-widest text-white/90 font-bold">Streak</div>
                <div className="font-display text-2xl leading-none mt-1">5 days</div>
                <div className="text-xs text-white/90">Keep it gentle</div>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-black/5">
                <div className="text-[11px] uppercase tracking-widest text-stone-500">Quiet hours</div>
                <div className="font-semibold text-sm mt-1">10pm — 7am</div>
                <div className="text-xs text-stone-500">No nudges</div>
              </div>
            </div>

            <button className="mt-4 w-full py-3 rounded-full bg-[#5B7A5F] text-white font-semibold text-sm">Start session</button>
            <div className="text-center text-[11px] text-stone-600 mt-2">Works offline • No account needed</div>
          </div>
          <div className="h-5 flex justify-center pb-2"><div className="w-28 h-1 bg-black/15 rounded-full" /></div>
        </div>
      </div>
    </div>
  )
}

export default function Landing() {
  const { canInstall, prompt } = usePWAInstall()
  const [faq, setFaq] = useState<number|null>(0)

  return (
    <div className="min-h-screen bg-[#FDF8F1] dark:bg-[#121412] text-[#1A1E1D] dark:text-[#F5F1EB] selection:bg-[#5B7A5F]/20">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-[#1A1E1D] text-white px-4 py-2 rounded-full text-sm z-50">Skip to content</a>
      {/* NAV */}
      <header className="sticky top-0 z-30 bg-[#FDF8F1]/80 dark:bg-[#121412]/80 backdrop-blur-xl border-b border-black/[0.06] dark:border-white/5">
        <div className="max-w-[1120px] mx-auto px-4 md:px-6 h-[64px] flex items-center justify-between gap-4">
          <Logo />
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600 dark:text-white/70">
            <a href="#how" className="hover:text-[#1A1E1D] dark:hover:text-white">How it works</a>
            <a href="#demo" className="hover:text-[#1A1E1D] dark:hover:text-white">Demo</a>
            <a href="#features" className="hover:text-[#1A1E1D] dark:hover:text-white">Features</a>
            <a href="#faq" className="hover:text-[#1A1E1D] dark:hover:text-white">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/app" className="hidden md:inline-flex px-5 py-2.5 rounded-full border border-black/10 dark:border-white/15 text-sm font-semibold hover:bg-white dark:hover:bg-white/10 transition">Open app</Link>
            <div className="hidden md:block"><InstallButton variant="dark" className="!py-2.5 !px-5 text-sm" /></div>
            <Link to="/app" className="md:hidden px-4 py-2 rounded-full bg-[#1A1E1D] dark:bg-white text-white dark:text-black text-sm font-semibold">Open</Link>
          </div>
        </div>
      </header>

      <main id="main">
      {/* HERO */}
      <section className="max-w-[1120px] mx-auto px-4 md:px-6 pt-8 md:pt-14 pb-8">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 md:gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-full pl-1 pr-3 py-1">
              <span className="bg-[#D1E5D3] dark:bg-[#2E3B2F] text-[#1E3A24] dark:text-white text-[11px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full">New</span>
              <span className="text-xs font-medium">Installable PWA • Works offline</span>
              <span className="hidden sm:inline w-6 h-6 rounded-full bg-[#1A1E1D] text-white grid place-items-center text-xs">→</span>
            </div>
            <h1 className="font-display text-[38px] md:text-[56px] leading-[0.95] tracking-[-0.03em] mt-5">
              Take back <br />
              <span className="text-[#5B7A5F] italic font-light">your scroll.</span>
            </h1>
            <p className="text-[18px] md:text-[19px] leading-relaxed text-stone-600 dark:text-white/60 mt-4 max-w-[540px]">
              A gentle pause between opening an app and losing an hour. Set an intention, watch the timer, decide what happens next.
            </p>
            <div className="flex flex-wrap gap-3 mt-7">
              <InstallButton />
              <a href="#how" className="inline-flex items-center justify-center px-6 py-3.5 rounded-full border border-black/10 dark:border-white/15 bg-white dark:bg-white/5 font-semibold text-[15px] min-h-[44px] hover:bg-black/[0.02] transition">See how it works</a>
            </div>
            <div className="flex items-center gap-4 mt-6 text-xs text-stone-500 dark:text-white/50">
              <span className="flex items-center gap-1.5"><span className="w-5 h-5 rounded-full bg-emerald-100 grid place-items-center text-[11px]">✓</span> Free</span>
              <span className="flex items-center gap-1.5"><span className="w-5 h-5 rounded-full bg-emerald-100 grid place-items-center text-[11px]">✓</span> No account</span>
              <span className="flex items-center gap-1.5"><span className="w-5 h-5 rounded-full bg-emerald-100 grid place-items-center text-[11px]">✓</span> Offline</span>
            </div>
            <div className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-[#E9D5C8] border-2 border-white dark:border-[#121412] grid place-items-center text-xs">A</div>
                <div className="w-8 h-8 rounded-full bg-[#C8D9E9] border-2 border-white dark:border-[#121412] grid place-items-center text-xs">B</div>
                <div className="w-8 h-8 rounded-full bg-[#D5E9C8] border-2 border-white dark:border-[#121412] grid place-items-center text-xs">C</div>
              </div>
              <div className="text-xs leading-tight">
                <div className="font-semibold">Loved for the gentle nudges</div>
                <div className="text-stone-500">Not a blocker. A breath.</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <PhoneMock />
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white dark:bg-[#1E2320] rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.12)] border border-black/5 dark:border-white/10 px-4 py-3 flex items-center gap-3 w-[92%] max-w-[360px]">
              <div className="w-10 h-10 rounded-xl bg-[#F5EBDD] grid place-items-center">⏳</div>
              <div className="flex-1">
                <div className="text-xs font-bold tracking-widest uppercase text-[#5B7A5F]">Gentle reminder</div>
                <div className="text-sm font-medium leading-tight">Still want to keep scrolling?</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#1A1E1D] text-white grid place-items-center text-sm">›</div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="max-w-[1120px] mx-auto px-4 md:px-6 py-10 md:py-16">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="text-xs font-bold tracking-[0.16em] uppercase text-[#5B7A5F]">The problem</div>
            <h2 className="font-display text-[28px] md:text-[32px] leading-tight tracking-tight mt-2">Your phone is designed<br/>to keep you scrolling.</h2>
            <p className="text-stone-600 dark:text-white/60 mt-3 leading-relaxed">You open it for one thing. Thirty minutes vanish. It's not a lack of willpower — it's a lack of a pause.</p>
          </div>
          <div className="md:col-span-2 grid sm:grid-cols-3 gap-4">
            {[
              { title:'Autopilot', desc:'Thumb moves before your brain decides.', icon:'🌀' },
              { title:'Time warps', desc:'“5 minutes” becomes 45 without a trace.', icon:'⏰' },
              { title:'Guilt loop', desc:'You feel bad, then scroll to feel better.', icon:'😮‍💨' },
            ].map(c=>(
              <div key={c.title} className="bg-white dark:bg-white/[0.04] rounded-[20px] p-5 border border-black/5 dark:border-white/5">
                <div className="w-10 h-10 rounded-xl bg-[#FDF8F1] dark:bg-white/5 border border-black/5 grid place-items-center text-lg">{c.icon}</div>
                <div className="font-semibold mt-3">{c.title}</div>
                <div className="text-sm text-stone-500 dark:text-white/50 mt-1 leading-relaxed">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 bg-[#1A1E1D] dark:bg-[#1E2320] rounded-[24px] p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#5B7A5F]/30 to-transparent" />
          <div className="relative flex-1">
            <div className="font-display text-xl md:text-2xl">We don't block. We breathe.</div>
            <div className="text-sm opacity-70 mt-1 max-w-[560px]">Scroll Guard never pretends to lock other apps — browsers can't do that honestly. Instead it gives you timers, intention, and a calm reminder to decide.</div>
          </div>
          <div className="relative bg-white text-[#1A1E1D] rounded-full px-5 py-2.5 text-sm font-semibold">Supportive, not punitive →</div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="max-w-[1120px] mx-auto px-4 md:px-6 py-6">
        <div className="text-center max-w-[640px] mx-auto">
          <div className="text-xs font-bold tracking-[0.16em] uppercase text-[#5B7A5F]">How it works</div>
          <h2 className="font-display text-[30px] md:text-[38px] leading-tight tracking-tight mt-2">Pause. Decide. Return.</h2>
          <p className="text-stone-600 dark:text-white/60 mt-2">Three gentle steps. No shaming, no streaks that punish you — just a little more choice.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5 mt-8">
          {[
            { n:'01', t:'Set an intention', d:'“Catch up for 10 minutes” beats “just a sec”. Pick a purpose and a duration that feels kind.', col:'bg-[#F5EBDD]' },
            { n:'02', t:'Stay with a timer', d:'A quiet countdown lives with you. Pause anytime. Add 5 minutes if you choose to — consciously.', col:'bg-[#E8F0E8]' },
            { n:'03', t:'Get a gentle nudge', d:'At one minute left, we ask: “Still want to keep scrolling?” You decide. No lock-outs.', col:'bg-[#FFF2D6]' },
          ].map(s=>(
            <div key={s.n} className="bg-white dark:bg-white/[0.04] rounded-[24px] p-6 border border-black/5 dark:border-white/5 relative overflow-hidden">
              <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${s.col} dark:opacity-20`} />
              <div className="relative">
                <div className="text-xs font-bold tracking-widest text-[#5B7A5F]">{s.n}</div>
                <h3 className="font-semibold text-lg mt-1">{s.t}</h3>
                <p className="text-sm text-stone-600 dark:text-white/60 mt-2 leading-relaxed">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DEMO */}
      <section id="demo" className="max-w-[1120px] mx-auto px-4 md:px-6 py-10 md:py-14">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#5B7A5F] bg-white dark:bg-white/5 border border-black/5 px-3 py-1 rounded-full">Interactive demo</div>
            <h2 className="font-display text-[30px] md:text-[36px] leading-tight tracking-tight mt-3">Feel the pause — right here.</h2>
            <p className="text-stone-600 dark:text-white/60 mt-2 leading-relaxed">Start a 1-minute demo session. Watch the bar, feel the nudge, choose what happens next. The real app works the same — offline, on your home screen.</p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                'Timer keeps running even if you switch tabs',
                'Haptics + sound when time is almost up (if enabled)',
                'No data leaves your device — everything is local',
              ].map(x=>(
                <li key={x} className="flex gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#E8F0E8] dark:bg-[#5B7A5F]/20 grid place-items-center text-[#5B7A5F] text-xs">✓</span>
                  <span className="text-stone-700 dark:text-white/80">{x}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 hidden lg:flex gap-3">
              <Link to="/app" className="px-6 py-3 rounded-full bg-[#5B7A5F] text-white font-semibold text-sm">Open the real app</Link>
              <span className="text-xs text-stone-500 self-center">No signup — data stays on your phone</span>
            </div>
          </div>
          <InteractiveDemo />
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="max-w-[1120px] mx-auto px-4 md:px-6 pb-10">
        <div className="grid md:grid-cols-12 gap-4">
          <div className="md:col-span-8 bg-white dark:bg-white/[0.04] rounded-[24px] p-6 md:p-8 border border-black/5 dark:border-white/5">
            <h3 className="font-display text-2xl">Built for clarity, not control.</h3>
            <div className="grid sm:grid-cols-2 gap-6 mt-6">
              {[
                { t:'Intentional timers', d:'Any duration from 2 to 60 minutes. Add time consciously — not compulsively.', i:'⏱️' },
                { t:'Quiet hours', d:'No nudges after 10pm. Your evenings stay calm.', i:'🌙' },
                { t:'Daily progress', d:'See today’s intentional minutes vs. your gentle goal. No shaming.', i:'📊' },
                { t:'Focus sessions', d:'Name the purpose: “Inspo, not comparison.” Keep the “why” visible.', i:'🎯' },
              ].map(f=>(
                <div key={f.t} className="flex gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#F5EBDD] dark:bg-white/5 grid place-items-center text-sm shrink-0">{f.i}</div>
                  <div>
                    <div className="font-semibold text-sm">{f.t}</div>
                    <div className="text-sm text-stone-600 dark:text-white/60 leading-relaxed">{f.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="md:col-span-4 bg-[#2E3B2F] text-white rounded-[24px] p-6 md:p-7 flex flex-col">
            <div className="text-xs tracking-widest uppercase text-white font-bold">Honest limits</div>
            <h4 className="font-display text-xl leading-tight mt-2">We won't pretend to block Instagram.</h4>
            <p className="text-sm text-white/90 leading-relaxed mt-3">Browsers can't see inside other apps. We don't fake it. We track what we can — your intentional sessions, self-set limits, and daily progress — all on-device, offline-first.</p>
            <div className="mt-auto pt-6">
              <div className="bg-white/15 rounded-2xl p-4 border border-white/20">
                <div className="text-xs text-white/90">Your data</div>
                <div className="text-sm font-medium">Stays on your phone. Export or delete anytime. No account.</div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          {[
            { k:'Offline', v:'Install once, use anywhere. Airplane mode? Still works.' },
            { k:'Private', v:'No server, no tracking. IndexedDB + local storage only.' },
            { k:'Light', v:'Tiny bundle, fast on slow phones & slow networks.' },
          ].map(x=>(
            <div key={x.k} className="bg-[#FDF8F1] dark:bg-white/[0.02] rounded-2xl p-5 border border-black/5 dark:border-white/5">
              <div className="text-xs font-bold tracking-widest uppercase text-[#5B7A5F]">{x.k}</div>
              <div className="text-sm text-stone-700 dark:text-white/70 mt-1 leading-relaxed">{x.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* INSTALL CTA big */}
      <section id="install" className="max-w-[1120px] mx-auto px-4 md:px-6 py-8">
        <div className="bg-white dark:bg-[#1E2320] rounded-[28px] border border-black/5 dark:border-white/10 p-6 md:p-10 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#F5EBDD]/60 via-transparent to-[#E8F0E8]/40 dark:from-white/[0.04] pointer-events-none" />
          <div className="relative grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
            <div>
              <h2 className="font-display text-[28px] md:text-[36px] leading-[0.95] tracking-tight">Your phone doesn't have<br/>to decide how you<br/>spend your time.</h2>
              <p className="text-stone-600 dark:text-white/60 mt-3 leading-relaxed">Add Scroll Guard to your home screen. It opens like a real app — no App Store, no waiting.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <InstallButton />
                <Link to="/app" className="px-6 py-3.5 rounded-full border border-black/10 dark:border-white/15 bg-white dark:bg-white/5 font-semibold">Open app now</Link>
              </div>
              <div className="mt-3 text-xs text-stone-500">Free · No account required · Works offline</div>

              <div className="mt-8 grid sm:grid-cols-2 gap-3">
                <div className="rounded-2xl bg-[#FDF8F1] dark:bg-white/5 border border-black/5 dark:border-white/10 p-4">
                  <div className="text-xs font-bold tracking-widest uppercase">Android — Chrome</div>
                  <div className="text-sm leading-relaxed mt-1 text-stone-600 dark:text-white/70">Tap <b>⋮</b> → <b>Add to Home screen</b> → <b>Install</b></div>
                </div>
                <div className="rounded-2xl bg-[#FDF8F1] dark:bg-white/5 border border-black/5 dark:border-white/10 p-4">
                  <div className="text-xs font-bold tracking-widest uppercase">iPhone — Safari</div>
                  <div className="text-sm leading-relaxed mt-1 text-stone-600 dark:text-white/70">Tap <b>Share</b> → <b>Add to Home Screen</b> → <b>Add</b></div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-[#1A1E1D] rounded-[24px] p-6 text-white overflow-hidden relative">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#5B7A5F]/30 blur-2xl rounded-full" />
                <div className="relative">
                  <div className="text-xs tracking-widest uppercase opacity-60 font-bold">How to install</div>
                  <ol className="mt-4 space-y-4">
                    <li className="flex gap-3">
                      <span className="w-7 h-7 rounded-full bg-white text-[#1A1E1D] grid place-items-center text-sm font-bold shrink-0">1</span>
                      <span className="text-sm leading-relaxed"><b>Tap Install</b> (or use the browser menu) — we’ll trigger the prompt if your browser supports it.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="w-7 h-7 rounded-full bg-white text-[#1A1E1D] grid place-items-center text-sm font-bold shrink-0">2</span>
                      <span className="text-sm leading-relaxed">Confirm <b>Add to Home Screen</b>. Look for the leaf icon — that’s Scroll Guard.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="w-7 h-7 rounded-full bg-white text-[#1A1E1D] grid place-items-center text-sm font-bold shrink-0">3</span>
                      <span className="text-sm leading-relaxed">Open from your home screen. It launches <b>standalone</b> — no address bar, just your timers.</span>
                    </li>
                  </ol>
                  <button onClick={()=> canInstall? prompt() : document.getElementById('install')?.scrollIntoView()} className="mt-6 w-full py-3 rounded-full bg-white text-[#1A1E1D] font-semibold flex items-center justify-center gap-2">
                    {canInstall ? 'Install now' : 'Show instructions'} <span>→</span>
                  </button>
                  <div className="text-xs opacity-60 mt-3 text-center">PWA updates automatically when you’re back online.</div>
                </div>
              </div>
              <div className="mt-3 text-center text-xs text-stone-500">
                Already installed? <Link to="/app" className="underline decoration-dotted font-medium">Open Scroll Guard</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-[720px] mx-auto px-4 md:px-6 py-10">
        <h2 className="font-display text-2xl md:text-[28px] text-center tracking-tight">Questions, answered kindly.</h2>
        <div className="mt-6 divide-y divide-black/5 dark:divide-white/5 border border-black/5 dark:border-white/5 rounded-[20px] overflow-hidden bg-white dark:bg-white/[0.03]">
          {[
            { q:'Does it really block other apps?', a:'No — and we’re honest about it. No website can truly lock Instagram, TikTok or YouTube on iOS/Android. Scroll Guard gives you intentional sessions, timers, limits you set yourself, and gentle reminders — all local, all offline. Think of it as a mindfulness tool, not a blocker.' },
            { q:'Do I need an account?', a:'No. All your sessions and settings live in your browser (IndexedDB + localStorage). No server, no sign-up. You can export or delete everything in Settings.' },
            { q:'Will it work offline?', a:'Yes. After you install the PWA, the shell, timers, and your history are cached. Start sessions on a flight, in the subway — they’re saved locally.' },
            { q:'How do notifications work?', a:'If you allow notifications, we’ll ping you at “one minute left” and at the end. If not, we fall back to in-app haptics and visuals. You can turn them on/off in Settings → Notifications.' },
            { q:'Can I delete my data?', a:'Anytime. Settings → Data management → Delete all data. One tap, with confirmation. It clears IndexedDB and localStorage immediately.' },
          ].map((f, i)=>(
            <div key={f.q} className="">
              <button onClick={()=> setFaq(faq===i ? null : i)} className="w-full text-left px-5 md:px-6 py-4 flex items-start justify-between gap-4 hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition">
                <span className="font-medium text-[15px] leading-snug">{f.q}</span>
                <span className={`w-7 h-7 rounded-full border grid place-items-center shrink-0 text-sm transition ${faq===i ? 'bg-[#1A1E1D] text-white dark:bg-white dark:text-black border-transparent' : 'border-black/10 dark:border-white/10'}`}>{faq===i ? '−' : '+'}</span>
              </button>
              {faq===i && <div className="px-5 md:px-6 pb-5 text-sm leading-relaxed text-stone-600 dark:text-white/60 -mt-1">{f.a}</div>}
            </div>
          ))}
        </div>
      </section>

      </main>
      {/* FOOTER */}
      <footer className="border-t border-black/5 dark:border-white/5 mt-6">
        <div className="max-w-[1120px] mx-auto px-4 md:px-6 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Logo />
              <span className="text-xs text-stone-500">© 2026 Scroll Guard. Calm tech for intentional days.</span>
            </div>
            <div className="flex gap-5 text-sm">
              <Link to="/privacy" className="underline decoration-dotted">Privacy</Link>
              <Link to="/terms" className="underline decoration-dotted">Terms</Link>
              <Link to="/app" className="underline decoration-dotted">App</Link>
              <a href="#install" className="underline decoration-dotted">Install</a>
            </div>
          </div>
          <div className="text-xs text-stone-500 leading-relaxed mt-6 border-t border-black/5 dark:border-white/5 pt-6">
            Scroll Guard stores data locally on your device using IndexedDB and localStorage. No personal usage data is sent to a server. The PWA works offline after installation. Notifications are optional and use the Web Notifications API where supported.
          </div>
        </div>
      </footer>
    </div>
  )
}
