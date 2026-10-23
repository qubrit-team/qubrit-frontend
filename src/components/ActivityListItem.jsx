import '../styles/components/ActivityListItem.css'

// 내 활동 한 줄: 썸네일 + 제목 + 메타 + 우측 상태 라벨
function ActivityListItem({ thumb, title, meta, status, onClick }) {
  return (
    <li>
      <button type="button" className="activityItem" onClick={onClick}>
        <span className="activityThumb"><img src={thumb} alt="" /></span>
        <span className="activityBody">
          <span className="activityTitle">{title}</span>
          <span className="activityMeta">{meta}</span>
        </span>
        <span className="activityStatus">{status}</span>
      </button>
    </li>
  )
}

export default ActivityListItem
