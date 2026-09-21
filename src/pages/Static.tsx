export function Privacy() {
  return (
    <div className="max-w-[720px] mx-auto px-4 md:px-6 py-8 pb-12">
      <a href="/" className="text-sm underline decoration-dotted">← Back to home</a>
      <h1 className="font-display text-3xl mt-4">Privacy</h1>
      <div className="prose prose-stone dark:prose-invert max-w-none mt-6 leading-relaxed text-[15px]">
        <p>Scroll Guard is designed to be private by default. We do not require an account, and we do not send your usage data to a server.</p>
        <h3>What we store</h3>
        <ul>
          <li><b>Sessions</b> you create (purpose, category, duration, timestamps, status) — stored in <b>IndexedDB</b> (database “scroll-guard”, stores “sessions” and “meta”).</li>
          <li><b>Settings</b> (daily goal, quiet hours, appearance, limits) — stored in <b>localStorage</b> under <code>sg_settings</code> and <code>sg_active</code> for the running timer.</li>
          <li><b>Dismissals</b> like “install banner dismissed” — localStorage.</li>
        </ul>
        <p>Everything lives on your device. If you clear site data or use “Delete all data” in Settings, it’s gone. We don’t keep a backup.</p>
        <h3>What we don’t do</h3>
        <ul>
          <li>No personal data sent to a server. No account sync in the MVP.</li>
          <li>No analytics that collects your session content. If we ever add privacy-conscious analytics, we’ll disclose it here and it will be anonymous and opt-in.</li>
          <li>No reading of other apps. Browsers can’t access screen time or app usage — we don’t pretend otherwise.</li>
        </ul>
        <h3>Notifications</h3>
        <p>If you grant permission, we use the Web Notifications API locally to remind you at “one minute left” and at session end. No push server is involved.</p>
        <h3>Service worker & offline</h3>
        <p>We cache the app shell, CSS, JS, icons and fonts so the PWA works offline. Cached assets contain no personal data.</p>
        <h3>Contact</h3>
        <p>Questions? The app is local-first — there’s no data controller beyond your device. For feedback, use your browser’s share or open an issue where the code is hosted.</p>
        <p className="text-sm opacity-60">Last updated: September 2026</p>
      </div>
    </div>
  )
}
export function Terms() {
  return (
    <div className="max-w-[720px] mx-auto px-4 md:px-6 py-8 pb-12">
      <a href="/" className="text-sm underline decoration-dotted">← Back to home</a>
      <h1 className="font-display text-3xl mt-4">Terms</h1>
      <div className="prose prose-stone dark:prose-invert max-w-none mt-6 leading-relaxed text-[15px]">
        <p>Scroll Guard is a supportive tool, not a medical or therapeutic service.</p>
        <ul>
          <li>The timers, limits and insights are self-reported and local. They are not a substitute for professional advice.</li>
          <li>We strive for accuracy but don’t guarantee uninterrupted or error-free operation; offline caching and browser storage can be cleared by the browser or user.</li>
          <li>You are responsible for how you use the tool. Use it kindly — toward yourself and others.</li>
        </ul>
        <p>By using the PWA, you agree to use it lawfully and to keep your device and data secure. There is no warranty — use at your own discretion.</p>
        <p className="text-sm opacity-60">Last updated: September 2026</p>
      </div>
    </div>
  )
}
