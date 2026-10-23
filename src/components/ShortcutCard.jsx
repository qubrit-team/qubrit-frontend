import '../styles/components/ShortcutCard.css'

// 바로가기 카드: 아이콘 + 제목 + 부제목
function ShortcutCard({ icon, title, sub, onClick }) {
  return (
    <button type="button" className="shortcutCard" onClick={onClick} disabled={!onClick}>
      <img src={icon} alt="" width="38" height="38" />
      <span className="shortcutTitle">{title}</span>
      <span className="shortcutSub">{sub}</span>
    </button>
  )
}

export default ShortcutCard
