import '../styles/components/Chip.css'

function Chip({ selected, onClick, children }) {
  return (
    <button type="button" className={`chip ${selected ? 'chipOn' : ''}`} aria-pressed={selected} onClick={onClick}>
      {children}
    </button>
  )
}

export default Chip
