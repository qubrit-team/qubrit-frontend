import { useId } from 'react'
import '../styles/components/TextField.css'

// status: 'default' | 'error'. message 는 필드 아래 표시되는 안내 문구.
function TextField({
  label, hint, status = 'default', message, messageTone, action, side, children, className = '', ...inputProps
}) {
  const id = useId()
  const tone = messageTone ?? (status === 'error' ? 'error' : '')
  return (
    <div className={`field ${status === 'error' ? 'fieldError' : ''} ${className}`}>
      {label && (
        <label className="fieldLabel" htmlFor={id}>
          {label} {hint && <small>· {hint}</small>}
        </label>
      )}
      <div className="fieldRow">
        <div className="fieldBox">
          <input id={id} className="fieldInput" {...inputProps} />
          {side && <span className="fieldSide">{side}</span>}
        </div>
        {action}
      </div>
      {children}
      {message && <p className={`fieldMsg ${tone ? `fieldMsg${tone[0].toUpperCase()}${tone.slice(1)}` : ''}`}>{message}</p>}
    </div>
  )
}

export default TextField
