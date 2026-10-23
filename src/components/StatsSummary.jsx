import '../styles/components/StatsSummary.css'

// 활동 수치 요약 박스. items: [{ label, value }]
function StatsSummary({ items }) {
  return (
    <dl className="statsSummary">
      {items.map((item) => (
        <div key={item.label} className="statsItem">
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}

export default StatsSummary
