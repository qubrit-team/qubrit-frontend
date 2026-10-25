import { useState } from 'react'
import ResultSummary from './ResultSummary'
import ResultStat from './ResultStat'
import ResultActionButton from './ResultActionButton'
import QuestionResultGrid from './QuestionResultGrid'
import WrongAnswerCard from './WrongAnswerCard'
import RecommendCard from './RecommendCard'
import { formatElapsed } from '../utils/time'
import '../styles/QuizResult.css'

const answerLabel = (q, a) => {
  if (!a) return ''
  if (a.selectedChoiceId != null) {
    const i = q.choices.findIndex((c) => c.id === a.selectedChoiceId)
    return i === -1 ? '' : `${'①②③④⑤⑥⑦⑧'[i] ?? i + 1} ${q.choices[i].content}`
  }
  return a.answerText ?? ''
}

// 풀이 종료 후 결과: 점수, 문항별 정오, 선택한 문항의 해설
function QuizResult({ attempt, questions, elapsedSeconds, onHome, onSearch, onWrongNotes }) {
  const byQuestion = new Map(attempt.answers.map((a) => [a.questionId, a]))
  const statuses = questions.map((q) => {
    const a = byQuestion.get(q.id)
    return !a ? 'none' : a.correct ? 'right' : 'wrong'
  })
  const wrongCount = statuses.filter((s) => s !== 'right').length
  const firstWrong = statuses.findIndex((s) => s !== 'right')
  const [selected, setSelected] = useState(firstWrong === -1 ? 0 : firstWrong)

  const q = questions[selected]
  const a = byQuestion.get(q.id)
  const percent = attempt.total ? Math.round((attempt.score / attempt.total) * 100) : 0

  return (
    <div className="screen quizResult">
      <ResultSummary setTitle={attempt.setTitle} correct={attempt.score} total={attempt.total} onClose={onHome} />

      <div className="resultStats">
        <ResultStat label="점수" value={`${percent}점`} />
        {elapsedSeconds != null && <ResultStat label="소요 시간" value={formatElapsed(elapsedSeconds)} />}
      </div>

      <div className="resultActionRow">
        <ResultActionButton icon="/assets/result/share.svg" label="결과 공유" disabled />
        <ResultActionButton icon="/assets/result/saved.svg" label="학습 기록 저장됨" disabled />
        <ResultActionButton icon="/assets/result/report.svg" label="오류 신고" disabled />
      </div>

      <div className="resultSectionHead">
        <h2 className="resultSectionTitle">문항별 결과</h2>
        <span className="resultSectionNote">오답 <strong>{wrongCount}</strong> · 오답 노트에 자동 저장</span>
      </div>
      <QuestionResultGrid items={statuses} selectedIndex={selected} onSelect={setSelected} />

      {statuses[selected] !== 'right' && a && (
        <WrongAnswerCard
          number={selected + 1}
          myAnswer={answerLabel(q, a)}
          correctAnswer={a.correctAnswer}
          explanation={a.explanation || a.aiFeedback}
        />
      )}

      {wrongCount > 0 && (
        <RecommendCard
          label="유사 문제 추천"
          title="비슷한 유형 문제 풀어보기"
          desc={`틀린 ${firstWrong + 1}번과 같은 유형`}
          onClick={onSearch}
        />
      )}

      <div className="screenSpacer" />
      <div className="resultBar">
        <button type="button" className="resultBarSecondary" onClick={onWrongNotes}>오답 노트 보기</button>
        <button type="button" className="resultBarPrimary" onClick={onHome}>홈으로</button>
      </div>
    </div>
  )
}

export default QuizResult
