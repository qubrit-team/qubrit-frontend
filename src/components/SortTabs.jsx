import '../styles/components/SortTabs.css'

// 정렬 기준 텍스트 토글. options: [{ value, label, disabled? }]
function SortTabs({ options, value, onChange }) {
  return (
    <div className="sortTabs" role="radiogroup" aria-label="정렬">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={o.value === value}
          disabled={o.disabled}
          className={`sortTab ${o.value === value ? 'isOn' : ''}`}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export default SortTabs
