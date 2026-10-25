import '../styles/components/ResultStat.css'

// 점수·소요 시간 같은 라벨/값 한 쌍
function ResultStat({ label, value }) {
  return (
    <div className="resultStat">
      <span className="resultStatLabel">{label}</span>
      <strong className="resultStatValue">{value}</strong>
    </div>
  )
}

export default ResultStat
