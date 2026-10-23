import '../styles/components/Checkbox.css'

function Checkbox({ checked, onChange, children, strong }) {
  return (
    <label className={`check ${strong ? 'checkStrong' : ''}`}>
      <span className="checkLeft">
        <input className="checkInput" type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className="checkBox">
          {checked && <span className="checkMark" />}
        </span>
        {children}
      </span>
    </label>
  )
}

export default Checkbox
