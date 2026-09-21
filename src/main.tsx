import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { StoreProvider } from './lib/store'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <StoreProvider>
        <App />
      </StoreProvider>
    </BrowserRouter>
  </React.StrictMode>,
)

// PWA: register sw with prompt handling
// @ts-ignore
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh() {
    window.dispatchEvent(new CustomEvent('pwa-update-available'))
  },
  onOfflineReady() {
    console.log('App ready offline')
  },
})
// expose for update button
;(window as any).updateSW = updateSW

// safe area + viewport hack for iOS
if ('visualViewport' in window) {
  const vv = window.visualViewport
  const handler = () => {
    document.documentElement.style.setProperty('--vh', `${vv ? vv.height * 0.01 : 1}px`)
  }
  vv?.addEventListener('resize', handler)
  handler()
}
