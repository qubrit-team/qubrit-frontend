import { mascotFor } from '../utils/mascot'
import '../styles/components/InviteCard.css'

// 받은 초대 카드: 초대한 사람과 학급 정보 + 거절/초대 확인 버튼
function InviteCard({ invite, busy, onDecline, onAccept }) {
  const { inviterNickname, classroomId, classroomName, memberCount, setCount } = invite
  return (
    <section className="inviteCard">
      <div className="inviteCardHead">
        <img className="inviteCardThumb" src={mascotFor(classroomName, classroomId)} alt="" />
        <div className="inviteCardText">
          <p className="inviteCardTitle">{inviterNickname}님이 ‘{classroomName}’ 방에 초대했어요.</p>
          <p className="inviteCardMeta">멤버 {memberCount}명 · 기출 {setCount}세트</p>
        </div>
      </div>
      <div className="inviteCardActions">
        <button type="button" className="inviteDecline" disabled={busy} onClick={onDecline}>거절</button>
        <button type="button" className="inviteAccept" disabled={busy} onClick={onAccept}>초대 확인</button>
      </div>
    </section>
  )
}

export default InviteCard
