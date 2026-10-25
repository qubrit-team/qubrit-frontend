// 오답 노트 화면 (마이 > 오답 노트): 틀린 문제를 출제된 세트별로 묶어 보여준다
import { useEffect, useState } from 'react'
import MainLayout from '../components/MainLayout'
import BackButton from '../components/BackButton'
import FilterBar from '../components/FilterBar'
import ActivityTabs from '../components/ActivityTabs'
import ActivityListItem from '../components/ActivityListItem'
import { fetchWrongNotes } from '../api/study'
import { fetchSubjects } from '../api/subjects'
import { describeError } from '../api/http'
import { mascotFor } from '../utils/mascot'
import '../styles/WrongNotePage.css'

const TABS = [
  { value: 'todo', label: '복습 필요' },
  { value: 'done', label: '해결됨' },
]
const PAGE_SIZE = 50
const MAX_PAGES = 10 // 한 번에 불러오는 최대 페이지 (500개)

// 오답을 세트별로 묶는다. 서버가 최근 틀린 순으로 주므로 먼저 나온 세트가 위에 온다.
function groupBySet(notes) {
  const groups = new Map()
  notes.forEach((n) => {
    if (!groups.has(n.setId)) {
      groups.set(n.setId, { setId: n.setId, setTitle: n.setTitle, subject: n.subject, notes: [] })
    }
    groups.get(n.setId).notes.push(n)
  })
  return [...groups.values()]
}

async function fetchAllWrongNotes({ subject, resolved }) {
  const all = []
  for (let page = 0; page < MAX_PAGES; page += 1) {
    const res = await fetchWrongNotes({ subject, resolved, page, size: PAGE_SIZE })
    all.push(...res.items)
    if (all.length >= res.totalItems || res.items.length === 0) break
  }
  return all
}

function WrongNotePage({ onNavigate }) {
  const [tab, setTab] = useState('todo')
  const [subjects, setSubjects] = useState([])
  const [subject, setSubject] = useState('') // '' = 전체
  const [notes, setNotes] = useState(null) // null = 불러오는 중
  const [error, setError] = useState('')
  const [open, setOpen] = useState(() => new Set()) // 펼친 세트 id

  useEffect(() => {
    fetchSubjects().then(setSubjects).catch(() => {}) // 과목 칩이 없어도 목록은 볼 수 있다
  }, [])

  useEffect(() => {
    let ignore = false
    fetchAllWrongNotes({ subject, resolved: tab === 'done' })
      .then((res) => {
        if (ignore) return
        setNotes(res)
        setError('')
      })
      .catch((err) => {
        if (ignore) return
        setNotes([])
        setError(describeError(err))
      })
    return () => { ignore = true }
  }, [tab, subject])

  const changeTab = (value) => {
    setNotes(null)
    setTab(value)
  }
  const changeSubject = (s) => {
    setNotes(null)
    setSubject((prev) => (prev === s ? '' : s))
  }

  const toggle = (setId) => setOpen((prev) => {
    const next = new Set(prev)
    if (next.has(setId)) next.delete(setId)
    else next.add(setId)
    return next
  })

  const groups = notes ? groupBySet(notes) : []

  return (
    <MainLayout active="my" onNavigate={onNavigate} topBar={false} className="myScreen">
      <div className="wrongNotePage">
        <BackButton src="/assets/backBtnWhite.svg" onClick={() => onNavigate('my')} />
        <h1 className="wrongNoteTitle">오답 노트</h1>
        <FilterBar options={subjects} value={subject} onChange={changeSubject} />
        <ActivityTabs options={TABS} value={tab} onChange={changeTab} />

        {error && <p className="wrongNoteNotice wrongNoteError" role="alert">{error}</p>}
        {notes?.length === 0 && !error && (
          <p className="wrongNoteNotice">
            {tab === 'todo' ? '복습할 오답이 없어요' : '아직 해결한 오답이 없어요'}
          </p>
        )}

        <ul className="wrongNoteGroups">
          {groups.map((g) => (
            <li key={g.setId} className="wrongNoteGroup">
              <div className="wrongNoteHead">
                <ul>
                  <ActivityListItem
                    thumb={mascotFor(g.subject, g.setId)}
                    title={g.setTitle}
                    meta={g.subject}
                    status={`오답 ${g.notes.length}`}
                    onClick={() => onNavigate('setDetail', { setId: g.setId, from: 'wrongNotes' })}
                  />
                </ul>
                <button
                  type="button"
                  className={`wrongNoteToggle ${open.has(g.setId) ? 'isOpen' : ''}`}
                  aria-label={open.has(g.setId) ? '틀린 문제 접기' : '틀린 문제 펼치기'}
                  aria-expanded={open.has(g.setId)}
                  onClick={() => toggle(g.setId)}
                >
                  <img src="/assets/chevronDown.svg" alt="" width="20" height="20" />
                </button>
              </div>
              {open.has(g.setId) && (
                <ul className="wrongNoteQuestions">
                  {g.notes.map((n) => (
                    <li key={n.id} className="wrongNoteQuestion">
                      <span className="wrongNoteContent">{n.content}</span>
                      <span className="wrongNoteCount">{n.wrongCount}번 틀림</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </MainLayout>
  )
}

export default WrongNotePage
