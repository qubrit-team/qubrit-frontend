import '../styles/components/StatGrid.css'

// 핵심 수치 격자(3열). items: [{ label, value }]
function StatGrid({ items }) {
  return (
    <dl className="statGrid">
      {items.map((item) => (
        <div key={item.label} className="statGridItem">
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}

export default StatGrid
