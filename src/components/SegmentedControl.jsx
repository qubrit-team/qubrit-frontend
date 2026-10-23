import '../styles/components/SegmentedControl.css'

// 두 개 이상의 옵션 중 하나를 고르는 토글 (예: 학생 / 선생님)
function SegmentedControl({ options, value, onChange, label }) {
  return (
    <div className="segmented" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={o.value === value}
          className={`segmentedItem ${o.value === value ? 'isOn' : ''}`}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export default SegmentedControl
