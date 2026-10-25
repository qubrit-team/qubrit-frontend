import '../styles/components/CreateOptionCard.css'

// 출제 방식 큰 카드. badge가 있으면 흰 테두리로 강조한다
function CreateOptionCard({ eyebrow, badge, title, desc, image, onClick }) {
  return (
    <button type="button" className={`createOption ${badge ? 'isHighlight' : ''}`} onClick={onClick}>
      <span className="createOptionBody">
        {badge ? <span className="createOptionBadge">{badge}</span> : <span className="createOptionEyebrow">{eyebrow}</span>}
        <span className="createOptionTitle">{title}</span>
        <span className="createOptionDesc">{desc}</span>
      </span>
      <img className="createOptionImage" src={image} alt="" width="80" height="80" />
    </button>
  )
}

export default CreateOptionCard
