import '../styles/components/CompositionCard.css'

// 문제 구성 카드: 항목별 막대 + 첫 문제 미리보기. rows: [{ label, count }]
function CompositionCard({ summary, rows, previewTitle, preview }) {
  const total = rows.reduce((sum, r) => sum + r.count, 0)
  return (
    <section className="compositionCard">
      <div className="compositionHead">
        <h2>문제 구성</h2>
        <span>{summary}</span>
      </div>
      <ul className="compositionRows">
        {rows.map((r) => (
          <li key={r.label}>
            <span className="compositionLabel">{r.label}</span>
            <span className="compositionBar">
              <span style={{ width: `${total ? (r.count / total) * 100 : 0}%` }} />
            </span>
            <b>{r.count}</b>
          </li>
        ))}
      </ul>
      {preview && (
        <div className="compositionPreview">
          <p className="compositionPreviewTitle">{previewTitle}</p>
          <p className="compositionPreviewBody">{preview}</p>
        </div>
      )}
    </section>
  )
}

export default CompositionCard
