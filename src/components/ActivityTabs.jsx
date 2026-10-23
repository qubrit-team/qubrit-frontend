import '../styles/components/ActivityTabs.css'

// 밑줄형 탭. options: [{ value, label }]
function ActivityTabs({ options, value, onChange }) {
  return (
    <div className="activityTabs" role="tablist">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="tab"
          aria-selected={o.value === value}
          className={`activityTab ${o.value === value ? 'isOn' : ''}`}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export default ActivityTabs
