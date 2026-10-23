import '../styles/components/Logo.css'

function Logo({ height = 28 }) {
  return <img src="/assets/logo.svg" alt="큐브릿" height={height} className="logo" />
}

export default Logo
