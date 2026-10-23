import '../styles/components/ProgressBar.css'

function ProgressBar({ value, max }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0
  return (
    <div className="progress" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
      <div className="progressFill" style={{ width: `${pct}%` }} />
    </div>
  )
}

export default ProgressBar
