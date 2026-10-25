// 문제 풀이 화면 (다 풀면 결과 화면으로 바뀜)
import { useEffect, useState } from 'react'
import QuizHeader from '../components/QuizHeader'
import ProgressBar from '../components/ProgressBar'
import ChoiceList from '../components/ChoiceList'
import QuestionNavigator from '../components/QuestionNavigator'
import QuizResult from '../components/QuizResult'
import { fetchSet } from '../api/sets'
import { startAttempt, submitAnswer, finishAttempt } from '../api/attempts'
import { ApiError, describeError } from '../api/http'
import '../styles/SolvePage.css'

// 풀이에 쓴 시간(초)은 화면을 나가도 이어지도록 풀이별로 저장해 둔다
const elapsedKey = (attemptId) => `qubrit.attempt.${attemptId}.elapsed`

function readElapsed(attemptId) {
  try {
    return Number(localStorage.getItem(elapsedKey(attemptId))) || 0
  } catch {
    return 0
  }
}

function writeElapsed(attemptId, seconds) {
  try {
    if (seconds == null) localStorage.removeItem(elapsedKey(attemptId))
    else localStorage.setItem(elapsedKey(attemptId), String(seconds))
  } catch { /* 저장소를 못 쓰면 이번 접속 동안만 센다 */ }
}

const SHORT_MAX = 20 // 단답형 최대 글자 수

function SolvePage({ onNavigate, params }) {
  const { setId, from = 'home' } = params
  const [data, setData] = useState(null) // { questions, attempt, baseSeconds, startedNow }
  const [loadError, setLoadError] = useState('')
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState({}) // 문제 id → { choiceId } | { text }
  const [submitted, setSubmitted] = useState({}) // 제출을 마친 문제 id → true
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState('')
  const [navOpen, setNavOpen] = useState(false)
  const [finished, setFinished] = useState(null)
  const [now, setNow] = useState(() => Date.now())

  // 세트와 풀이를 함께 불러온다. 진행 중이던 풀이면 이어서 푼다
  useEffect(() => {
    let ignore = false
    Promise.all([fetchSet(setId), startAttempt(setId)])
      .then(([set, attempt]) => {
        if (ignore) return
        const done = {}
        const prev = {}
        attempt.answers.forEach((a) => {
          done[a.questionId] = true
          prev[a.questionId] = a.selectedChoiceId != null ? { choiceId: a.selectedChoiceId } : { text: a.answerText ?? '' }
        })
        const firstOpen = set.questions.findIndex((q) => !done[q.id])
        setSubmitted(done)
        setPicked(prev)
        setIndex(firstOpen === -1 ? 0 : firstOpen)
        const startedNow = Date.now()
        setNow(startedNow)
        // 이전에 풀며 쌓인 시간 + 이번에 들어온 뒤로 흐른 시간
        setData({ questions: set.questions, attempt, baseSeconds: readElapsed(attempt.id), startedNow })
      })
      .catch((err) => !ignore && setLoadError(describeError(err)))
    return () => { ignore = true }
  }, [setId])

  // 경과 시간: 화면에 머무는 동안만 세고, 나갈 때(언마운트) 지금까지의 시간을 저장해 멈춘다
  useEffect(() => {
    if (!data) return undefined
    if (finished) {
      writeElapsed(data.attempt.id, null) // 끝낸 풀이는 저장한 시간을 지운다
      return undefined
    }
    const { attempt, baseSeconds, startedNow } = data
    const save = () => writeElapsed(attempt.id, baseSeconds + (Date.now() - startedNow) / 1000)
    const t = setInterval(() => {
      setNow(Date.now())
      save()
    }, 1000)
    return () => {
      clearInterval(t)
      save()
    }
  }, [data, finished])

  const leave = () => onNavigate(from)

  if (loadError) {
    return (
      <div className="screen solveMessage">
        <p>{loadError}</p>
        <button type="button" className="solveBackLink" onClick={leave}>돌아가기</button>
      </div>
    )
  }
  if (!data) return <div className="screen solveMessage"><p>문제를 불러오는 중이에요…</p></div>

  const { questions, baseSeconds, startedNow } = data
  const elapsed = baseSeconds + Math.max(0, now - startedNow) / 1000
  if (finished) {
    return <QuizResult attempt={finished} questions={questions} elapsedSeconds={elapsed} onWrongNotes={() => onNavigate('my')} onHome={() => onNavigate('home')} onSearch={() => onNavigate('search')} />
  }

  const q = questions[index]
  const isLast = index === questions.length - 1
  const locked = Boolean(submitted[q.id])
  const selection = picked[q.id]
  const hasAnswer = q.type === 'MCQ' ? selection?.choiceId != null : Boolean(selection?.text?.trim())

  const isMcq = q.type === 'MCQ'
  const submitAll = async () => {
    setActionError('')
    setBusy(true)
    try {
      await finish(submitted)
    } catch (err) {
      setActionError(describeError(err))
    } finally {
      setBusy(false)
    }
  }

  const select = (patch) => setPicked((prev) => ({ ...prev, [q.id]: patch }))

  // 풀이를 끝낸다. 풀지 않은 문제가 있으면 한 번 더 확인
  const finish = async (done) => {
    const left = questions.filter((x) => !done[x.id]).length
    if (left > 0 && !window.confirm(`풀지 않은 문제가 ${left}개 있어요. 제출할까요?`)) return
    setFinished(await finishAttempt(data.attempt.id))
  }

  // 현재 문제를 제출하고 다음 문제로(마지막이면 풀이 종료)
  const next = async () => {
    setActionError('')
    setBusy(true)
    try {
      let doneNow = submitted
      if (!locked) {
        const body = q.type === 'MCQ' ? { selectedChoiceId: selection.choiceId } : { answerText: selection.text.trim() }
        try {
          await submitAnswer(data.attempt.id, q.id, body)
        } catch (err) {
          if (!(err instanceof ApiError && err.status === 409)) throw err // 이미 제출된 문제는 넘어간다
        }
        doneNow = { ...submitted, [q.id]: true }
        setSubmitted(doneNow)
      }
      if (!isLast) {
        setIndex(index + 1)
        return
      }
      await finish(doneNow)
    } catch (err) {
      setActionError(describeError(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="screen solvePage">
      <QuizHeader elapsedSeconds={elapsed} onClose={leave} saved={isMcq && locked} onSubmit={isMcq ? submitAll : undefined} />

      <div className="solveTitleRow">
        <h1 className="solveTitle">{index + 1}번 문제</h1>
        <span className="solveCount">{index + 1}/{questions.length}</span>
      </div>
      <ProgressBar value={index + 1} max={questions.length} />

      {q.passage && <div className="passageBox">{q.passage}</div>}
      <p className="questionText">{q.content}</p>

      {isMcq ? (
        <ChoiceList
          choices={q.choices}
          selectedId={selection?.choiceId}
          locked={locked}
          onSelect={(id) => select({ choiceId: id })}
        />
      ) : (
        <div className="shortAnswerBox">
          <p className="shortAnswerLabel">내 답 <span>· 단답형</span></p>
          <input
            className="shortAnswer"
            type="text"
            placeholder="답을 입력해 주세요"
            maxLength={SHORT_MAX}
            value={selection?.text ?? ''}
            disabled={locked}
            onChange={(e) => select({ text: e.target.value })}
          />
          <p className="shortAnswerMeta">
            <span>답은 자동 저장돼요</span>
            <span>{(selection?.text ?? '').length} / {SHORT_MAX}</span>
          </p>
        </div>
      )}

      <div className="screenSpacer" />
      {actionError && <p className="solveError">{actionError}</p>}
      <div className="quizBar">
        <button type="button" className="quizGridButton" onClick={() => setNavOpen(true)}>
          <img src="/assets/icons/grid.svg" alt="" width="22" height="22" />
        </button>
        {isMcq ? (
          <button type="button" className="quizPrev" disabled={isLast || busy} onClick={() => setIndex(index + 1)}>
            건너뛰기
          </button>
        ) : (
          <button type="button" className="quizPrev" disabled={index === 0 || busy} onClick={() => setIndex(index - 1)}>
            이전
          </button>
        )}
        <button type="button" className="quizNext" disabled={(!locked && !hasAnswer) || busy} onClick={next}>
          {busy ? '처리 중…' : isLast ? '제출' : '다음'}
        </button>
      </div>

      {navOpen && (
        <QuestionNavigator
          questions={questions}
          current={index}
          answeredIds={new Set(Object.keys(submitted).map(Number))}
          onSelect={(i) => { setIndex(i); setNavOpen(false) }}
          onClose={() => setNavOpen(false)}
        />
      )}
    </div>
  )
}

export default SolvePage
