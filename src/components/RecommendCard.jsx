import '../styles/components/RecommendCard.css'

// 유사 문제 추천 링크 카드
function RecommendCard({ label, title, desc, onClick }) {
  return (
    <button type="button" className="recommendCard" onClick={onClick}>
      <span className="recommendIcon"><img src="/assets/result/recommend.svg" alt="" width="35" height="35" /></span>
      <span className="recommendBody">
        <span className="recommendLabel">{label}</span>
        <span className="recommendTitle">{title}</span>
        <span className="recommendDesc">{desc}</span>
      </span>
      <img src="/assets/result/chevron.svg" alt="" width="18" height="18" />
    </button>
  )
}

export default RecommendCard
