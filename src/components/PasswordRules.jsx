import { checkPassword } from '../utils/password'
import '../styles/components/PasswordRules.css'

function PasswordRules({ password }) {
  const r = checkPassword(password)
  const items = [
    ['영문·숫자', r.letterDigit],
    ['8자 이상', r.length],
    ['특수문자', r.special],
  ]
  return (
    <ul className="rules">
      {items.map(([label, ok]) => (
        <li key={label} className={`rulesItem ${ok ? 'rulesItemOk' : ''}`}>
          <span className="rulesCheck" /> {label}
        </li>
      ))}
    </ul>
  )
}

export default PasswordRules
