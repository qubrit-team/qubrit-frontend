import '../styles/components/ToggleSwitch.css'

// 제목/설명과 on-off 스위치가 한 줄에 있는 설정 행
function ToggleSwitch({ checked, onChange, title, desc }) {
  return (
    <label className="toggleSwitch">
      <span className="toggleSwitchText">
        <strong>{title}</strong>
        <small>{desc}</small>
      </span>
      <input
        className="toggleSwitchInput"
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="toggleSwitchTrack" />
    </label>
  )
}

export default ToggleSwitch
