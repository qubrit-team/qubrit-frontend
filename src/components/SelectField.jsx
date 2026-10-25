import { useId } from 'react'
import '../styles/components/SelectField.css'

// 학년/반 같은 단일 선택 드롭다운. options: [{ value, label }]
function SelectField({ label, value, onChange, options, className = '' }) {
  const id = useId()
  return (
    <div className={`selectField ${className}`}>
      <label className="selectFieldLabel" htmlFor={id}>{label}</label>
      <select id={id} className="selectFieldBox" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

export default SelectField
