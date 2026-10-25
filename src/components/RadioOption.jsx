import '../styles/components/RadioOption.css'

// 제목과 설명이 붙은 라디오 항목
function RadioOption({ name, checked, onChange, title, desc }) {
  return (
    <label className="radioOption">
      <input className="radioOptionInput" type="radio" name={name} checked={checked} onChange={onChange} />
      <span className="radioOptionDot" />
      <span className="radioOptionText">
        <strong>{title}</strong>
        <small>{desc}</small>
      </span>
    </label>
  )
}

export default RadioOption
