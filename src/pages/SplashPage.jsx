// 앱을 처음 열 때 잠깐 보여주는 스플래시 화면 (끝나면 홈/로그인으로 이동)
import { useEffect } from 'react'
import { getToken } from '../api/http'
import '../styles/SplashPage.css'

const SPLASH_MS = 1800

function SplashPage({ onNavigate }) {
  useEffect(() => {
    const t = setTimeout(() => onNavigate(getToken() ? 'home' : 'login'), SPLASH_MS)
    return () => clearTimeout(t)
  }, [onNavigate])

  return (
    <div className="splashPage">
      <img className="splashLogo" src="/assets/splash/logo.svg" alt="Qubrit" width="183" height="48" />
      <p className="splashSlogan">함께 만들고, 함께 믿는 퀴즈 플랫폼</p>
    </div>
  )
}

export default SplashPage
