import Logo from './Logo'
import '../styles/components/TopBar.css'

function TopBar({ hasNotice = true }) {
  return (
    <header className="topBar">
      <Logo height={24} />
      <button type="button" className="bell">
        <img src="/assets/icons/bell.svg" alt="" width="24" height="24" />
        {hasNotice && <span className="bellDot" />}
      </button>
    </header>
  )
}

export default TopBar
