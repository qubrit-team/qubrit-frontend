// 문제 세트 상세 화면 (검색에서 세트를 고르면 풀이 전에 보여준다)
import { useEffect, useState } from 'react'
import SetDetailHeader from '../components/SetDetailHeader'
import StatGrid from '../components/StatGrid'
import CompositionCard from '../components/CompositionCard'
import OwnerRow from '../components/OwnerRow'
import StartBar from '../components/StartBar'
import { fetchSet } from '../api/sets'
import { describeError } from '../api/http'
import { mascotFor } from '../utils/mascot'
import '../styles/SetDetailPage.css'

const DIFFICULTY_LABEL = { EASY: '하', MEDIUM: '중', HARD: '상' }

function SetDetailPage({ onNavigate, params }) {
  const { setId, from = 'search' } = params
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  useEffect(() => {
    let ignore = false
    fetchSet(setId)
      .then((res) => !ignore && setData(res))
      .catch((err) => !ignore && setError(describeError(err)))
    return () => { ignore = true }
  }, [setId])

  const back = () => onNavigate(from)

  if (error || !data) {
    return (
      <div className="screen setDetailPage">
        <div className="setDetailMessage">
          <p>{error || '불러오는 중이에요…'}</p>
          {error && <button type="button" onClick={back}>돌아가기</button>}
        </div>
      </div>
    )
  }

  const { info, questions } = data
  const metrics = info.metrics ?? {} // 백엔드 버전에 따라 없을 수 있다
  const mcq = questions.filter((q) => q.type === 'MCQ').length
  const short = questions.length - mcq
  const created = new Date(info.createdAt)

  // 근거 데이터가 있는 수치만 보여준다 (정답률/신뢰도는 풀이·평가가 없으면 응답에서 빠진다)
  const statItems = [
    { label: '문항', value: info.questionCount },
    metrics.difficulty && { label: '난이도', value: DIFFICULTY_LABEL[metrics.difficulty] },
    metrics.estimatedMinutes != null && { label: '예상 시간', value: `${metrics.estimatedMinutes}분` },
    metrics.solveCount != null && { label: '풀이 수', value: metrics.solveCount.toLocaleString() },
    metrics.avgAccuracy != null && { label: '평균 정답률', value: `${metrics.avgAccuracy}%` },
    metrics.trustScore != null && { label: '신뢰도', value: metrics.trustScore },
  ].filter(Boolean)

  const share = async () => {
    const text = `${info.title} (공유 코드: ${info.shareCode})`
    try {
      await navigator.clipboard.writeText(text)
      setToast('공유 코드를 복사했어요')
    } catch {
      setToast(`공유 코드: ${info.shareCode}`)
    }
  }

  return (
    <div className="screen setDetailPage">
      <SetDetailHeader subject={info.subject} title={info.title} thumb={mascotFor(info.subject, info.id)} onBack={back} />

      <div className="setDetailStats"><StatGrid items={statItems} /></div>

      <CompositionCard
        summary={`객관식 ${mcq} · 주관식 ${short}`}
        rows={[{ label: '객관식', count: mcq }, { label: '주관식', count: short }]}
        previewTitle="1번 미리보기"
        preview={questions[0]?.content}
      />

      <OwnerRow
        name={info.ownerNickname}
        sub={`${created.getMonth() + 1}.${created.getDate()} 등록`}
      />

      {!info.mine && (
        <p className="setDetailLock">
          <img src="/assets/setDetail/lock.svg" alt="" width="16" height="16" />
          정답과 해설은 제출 후에 공개돼요
        </p>
      )}
      {toast && <p className="setDetailToast" role="status">{toast}</p>}

      <div className="screenSpacer" />
      <StartBar
        startLabel="풀이 시작하기"
        onStart={() => onNavigate('solve', { setId: info.id, from })}
        onShare={share}
      />
    </div>
  )
}

export default SetDetailPage
