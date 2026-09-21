import { useEffect, useState } from 'react'

export function usePWAInstall() {
  const [deferred, setDeferred] = useState<any>(null)
  const [isStandalone, setIsStandalone] = useState(false)
  const [platform, setPlatform] = useState<'ios'|'android'|'other'>('other')

  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true
    setIsStandalone(standalone)
    const ua = navigator.userAgent
    if (/iPad|iPhone|iPod/.test(ua)) setPlatform('ios')
    else if (/Android/.test(ua)) setPlatform('android')
    else setPlatform('other')

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferred(e)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const prompt = async () => {
    if (!deferred) return false
    deferred.prompt()
    const res = await deferred.userChoice
    setDeferred(null)
    return res.outcome === 'accepted'
  }

  return { deferred, isStandalone, platform, canInstall: !!deferred, prompt }
}
