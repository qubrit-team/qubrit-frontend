// 학급 화면 (받은 초대, 내 학급 목록, 코드로 참여, 학급 만들기)
import { useEffect, useState } from 'react'
import MainLayout from '../components/MainLayout'
import InviteCard from '../components/InviteCard'
import ClassroomListItem from '../components/ClassroomListItem'
import JoinCodeButton from '../components/JoinCodeButton'
import CreateClassroomButton from '../components/CreateClassroomButton'
import {
  fetchMyClassrooms, fetchInvites, joinClassroom, acceptInvite, declineInvite,
} from '../api/classrooms'
import { describeError } from '../api/http'
import '../styles/ClassroomPage.css'

function ClassroomPage({ onNavigate }) {
  const [rooms, setRooms] = useState(null) // null = 불러오는 중
  const [invites, setInvites] = useState([])
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let ignore = false
    Promise.all([fetchMyClassrooms(), fetchInvites()])
      .then(([myRooms, myInvites]) => {
        if (ignore) return
        setRooms(myRooms)
        setInvites(myInvites)
        setError('')
      })
      .catch((err) => {
        if (ignore) return
        setRooms([])
        setError(describeError(err))
      })
    return () => { ignore = true }
  }, [reloadKey])

  // 요청을 보내고 성공하면 목록을 다시 불러온다
  const run = async (action) => {
    setBusy(true)
    try {
      await action()
      setReloadKey((k) => k + 1)
    } catch (err) {
      setError(describeError(err))
    } finally {
      setBusy(false)
    }
  }

  const join = () => {
    // TODO: 참여 코드 입력 화면(Figma)이 나오면 prompt 대신 교체
    const code = window.prompt('참여 코드를 입력해 주세요')
    if (code?.trim()) run(() => joinClassroom(code))
  }

  const create = () => onNavigate('createClassroom')

  return (
    <MainLayout active="classroom" onNavigate={onNavigate} topBar={false} className="screenDark">
      <div className="classroomPage">
        <h1 className="classroomTitle">학급</h1>

        {invites.length > 0 && (
          <div className="inviteList">
            {invites.map((invite) => (
              <InviteCard
                key={invite.id}
                invite={invite}
                busy={busy}
                onDecline={() => run(() => declineInvite(invite.id))}
                onAccept={() => run(() => acceptInvite(invite.id))}
              />
            ))}
          </div>
        )}

        <h2 className="classroomSection">내 학급</h2>
        {error && <p className="classroomNotice classroomError" role="alert">{error}</p>}
        {rooms?.length === 0 && !error && <p className="classroomNotice">아직 참여한 학급이 없어요</p>}

        <ul className="classroomList">
          {rooms?.map((room) => (
            // TODO: 학급 상세 화면이 생기면 이동 연결
            <ClassroomListItem key={room.id} classroom={room} />
          ))}
        </ul>

        <div className="classroomActions">
          <JoinCodeButton disabled={busy} onClick={join} />
          <CreateClassroomButton disabled={busy} onClick={create} />
        </div>
      </div>
    </MainLayout>
  )
}

export default ClassroomPage
