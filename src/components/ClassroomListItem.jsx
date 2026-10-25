import { mascotFor } from '../utils/mascot'
import '../styles/components/ClassroomListItem.css'

// 오른쪽 표시: 최근 공유된 기출이 있으면 "새 기출 N" 배지, 없으면 과제 D-day, 둘 다 없으면 화살표
function Trailing({ newSetCount, assignmentDday }) {
  if (newSetCount > 0) return <span className="classroomBadge">새 기출 {newSetCount}</span>
  if (assignmentDday != null) return <span className="classroomDday">과제 D-{assignmentDday}</span>
  return <img src="/assets/home/chevron.svg" alt="" width="18" height="18" />
}

// 학급 한 줄: 마스코트 썸네일 + 학급명 + "과목 · 멤버 N(· 방장)" + 오른쪽 표시
function ClassroomListItem({ classroom, onClick }) {
  const { subject, name, memberCount, owner, id, newSetCount, assignmentDday } = classroom
  return (
    <li>
      <button type="button" className="classroomItem" onClick={onClick}>
        <span className="classroomItemThumb">
          <img src={mascotFor(subject, id)} alt="" />
        </span>
        <span className="classroomItemBody">
          <span className="classroomItemName">{name}</span>
          <span className="classroomItemMeta">
            {subject} · 멤버 {memberCount}{owner && ' · 방장'}
          </span>
        </span>
        <Trailing newSetCount={newSetCount} assignmentDday={assignmentDday} />
      </button>
    </li>
  )
}

export default ClassroomListItem
