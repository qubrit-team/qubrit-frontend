import { mascotFor } from '../utils/mascot'
import '../styles/components/SetListItem.css'

// 문제 세트 카드: 마스코트 썸네일 + 과목 + 제목 + 메타
function SetListItem({ set, onClick }) {
  return (
    <li>
      <button type="button" className="setItem" onClick={onClick}>
        <span className="setItemThumb">
          <img src={mascotFor(set.subject, set.id)} alt="" />
        </span>
        <span className="setItemBody">
          <span className="setItemSubject">{set.subject}</span>
          <span className="setItemTitle">{set.title}</span>
          <span className="setItemMeta">
            {set.questionCount}문항 · {set.ownerNickname}
          </span>
        </span>
      </button>
    </li>
  )
}

export default SetListItem
