import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Landing from './pages/Landing'
import AppLayout from './pages/AppLayout'
import Home from './pages/Home'
import Sessions from './pages/Sessions'
import Insights from './pages/Insights'
import Settings from './pages/Settings'
import { Privacy, Terms } from './pages/Static'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(()=> { window.scrollTo(0,0) }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="sessions" element={<Sessions />} />
          <Route path="insights" element={<Insights />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
