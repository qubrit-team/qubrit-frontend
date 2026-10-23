import Button from './Button'

// 풀이 종료 후 결과: 점수와 문제별 정답/해설
function QuizResult({ attempt, questions, onHome, onSearch }) {
  const byQuestion = new Map(attempt.answers.map((a) => [a.questionId, a]))
  return (
    <div className="screen quizResult">
      <h1 className="screenTitle">풀이 결과</h1>
      <p className="resultScore">
        <strong>{attempt.score}</strong> / {attempt.total}
      </p>
      <p className="resultSub">{attempt.setTitle}</p>

      <ul className="resultList">
        {questions.map((q, i) => {
          const a = byQuestion.get(q.id)
          const status = !a ? 'none' : a.correct ? 'right' : 'wrong'
          return (
            <li key={q.id} className={`resultItem resultItem_${status}`}>
              <div className="resultItemHead">
                <span className="resultNo">{i + 1}번</span>
                <span className="resultBadge">{status === 'right' ? '정답' : status === 'wrong' ? '오답' : '미응답'}</span>
              </div>
              <p className="resultQuestion">{q.content}</p>
              {status !== 'right' && a && (
                <p className="resultAnswer">정답: {a.correctAnswer}</p>
              )}
              {status !== 'right' && a?.explanation && <p className="resultExplain">{a.explanation}</p>}
              {a?.aiFeedback && <p className="resultExplain">{a.aiFeedback}</p>}
            </li>
          )
        })}
      </ul>

      <div className="resultActions">
        <Button variant="soft" className="resultSecondary" onClick={onSearch}>다른 문제 찾기</Button>
        <Button onClick={onHome}>홈으로</Button>
      </div>
    </div>
  )
}

export default QuizResult
