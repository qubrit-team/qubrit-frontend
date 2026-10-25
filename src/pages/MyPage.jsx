// 마이 화면 (프로필, 활동 요약, 바로가기, 내 출제/풀이 목록, 설정 > 로그아웃)
import { useEffect, useState } from 'react'
import MainLayout from '../components/MainLayout'
import ProfileHeader from '../components/ProfileHeader'
import StatsSummary from '../components/StatsSummary'
import ShortcutCard from '../components/ShortcutCard'
import ActivityTabs from '../components/ActivityTabs'
import ActivityListItem from '../components/ActivityListItem'
import { fetchMe, logout } from '../api/auth'
import { fetchMySets } from '../api/sets'
import { fetchMyAttempts } from '../api/attempts'
import { fetchHome, fetchAnalysis } from '../api/study'
import { describeError } from '../api/http'
import { mascotFor } from '../utils/mascot'
import '../styles/MyPage.css'

const TABS = [
  { value: 'created', label: '출제' },
  { value: 'solved', label: '풀이' },
]
const VISIBILITY_LABEL = { PUBLIC: '공개 중', LINK: '링크 공개', PRIVATE: '비공개' }
const ATTEMPT_LABEL = { IN_PROGRESS: '풀이 중', DONE: '완료' }

// 과목별 정답률을 문제 수로 가중 평균
function overallAccuracy(subjects = []) {
  const right = subjects.reduce((sum, s) => sum + s.right, 0)
  const total = subjects.reduce((sum, s) => sum + s.right + s.wrong, 0)
  return total ? Math.round((right / total) * 100) : null
}

function MyPage({ onNavigate }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('created')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    Promise.all([
      fetchMe(),
      fetchHome(),
      fetchAnalysis().catch(() => null), // 분석 실패는 화면 전체를 막지 않는다
      fetchMySets({ size: 50 }),
      fetchMyAttempts({ size: 50 }),
    ])
      .then(([me, home, analysis, sets, attempts]) => setData({ me, home, analysis, sets, attempts }))
      .catch((err) => {
        if (err.status === 401) {
          logout()
          onNavigate('login')
        } else {
          setError(describeError(err))
        }
      })
  }, [onNavigate])

  const handleLogout = () => {
    logout()
    onNavigate('login')
  }

  const header = (
    <header className="myHeader">
      <h1 className="myTitle">MY</h1>
      <button type="button" className="mySettings" aria-label="설정" aria-expanded={menuOpen} onClick={() => setMenuOpen((v) => !v)}>
        <img src="/assets/my/settings.svg" alt="" width="22" height="22" />
      </button>
      {menuOpen && (
        <div className="myMenu" role="menu">
          <button type="button" role="menuitem" onClick={handleLogout}>로그아웃</button>
        </div>
      )}
    </header>
  )

  if (!data) {
    return (
      <MainLayout active="my" onNavigate={onNavigate} topBar={false} className="myScreen">
        <div className="myPage">
          {header}
          {error && <p className="myNotice" role="alert">{error}</p>}
        </div>
      </MainLayout>
    )
  }

  const { me, home, analysis, sets, attempts } = data
  const accuracy = overallAccuracy(analysis?.subjects)
  const doneCount = attempts.filter((a) => a.status === 'DONE').length

  const stats = [
    { label: '출제', value: sets.totalItems },
    { label: '풀이', value: doneCount },
    { label: '연속 학습', value: `${home.streak}일` },
    { label: '신뢰도', value: '-' }, // TODO: 백엔드에 신뢰도 지표가 생기면 연동
  ]

  const created = sets.items.map((s) => (
    <ActivityListItem
      key={s.id}
      thumb={mascotFor(s.subject, s.id)}
      title={s.title}
      meta={`${s.subject} · ${s.questionCount}문항`}
      status={VISIBILITY_LABEL[s.visibility]}
    />
  ))
  const solved = attempts.map((a) => (
    <ActivityListItem
      key={a.id}
      thumb={mascotFor(a.subject, a.setId)}
      title={a.setTitle}
      meta={`${a.subject} · ${a.answeredCount}/${a.total}문항`}
      status={ATTEMPT_LABEL[a.status]}
      onClick={() => onNavigate('setDetail', { setId: a.setId, from: 'my' })}
    />
  ))
  const list = tab === 'created' ? created : solved

  return (
    <MainLayout active="my" onNavigate={onNavigate} topBar={false} className="myScreen">
      <div className="myPage">
        {header}
        <ProfileHeader name={me.nickname} lines={[me.email]} />
        <StatsSummary items={stats} />
        <div className="myShortcuts">
          <ShortcutCard icon="/assets/my/note.svg" title="오답 노트" sub={`복습할 문제 ${home.wrongNoteCount}`} onClick={() => onNavigate('wrongNotes')} />
          <ShortcutCard icon="/assets/my/analysis.svg" title="학습 분석" sub={accuracy === null ? '아직 기록이 없어요' : `정답률 ${accuracy}%`} />
          <ShortcutCard icon="/assets/my/interview.svg" title="면접 기록" sub="준비 중" />
        </div>
        <section className="myActivity">
          <ActivityTabs options={TABS} value={tab} onChange={setTab} />
          {list.length > 0
            ? <ul className="myList">{list}</ul>
            : <p className="myNotice">{tab === 'created' ? '아직 출제한 세트가 없어요.' : '아직 푼 문제가 없어요.'}</p>}
        </section>
      </div>
    </MainLayout>
  )
}

export default MyPage
