import { formatElapsed } from '../utils/time'

// 풀이 화면 맨 위: 닫기(X) + (임시 저장 표시) + 경과 시간 + (제출)
function QuizHeader({ elapsedSeconds, onClose, saved, onSubmit }) {
  return (
    <header className="quizHeader">
      <div className="quizHeaderLeft">
        <button type="button" className="quizClose" aria-label="풀이 종료" onClick={onClose}>
          <img src="/assets/solve/close.svg" alt="" width="22" height="22" />
        </button>
        {saved && (
          <span className="quizSaved">
            <img src="/assets/solve/check.svg" alt="" width="14" height="14" />
            임시 저장됨
          </span>
        )}
      </div>
      <div className="quizHeaderRight">
        <span className="quizTimer">
          <img src="/assets/solve/clock.svg" alt="" width="16" height="16" />
          {formatElapsed(elapsedSeconds)}
        </span>
        {onSubmit && <button type="button" className="quizSubmit" onClick={onSubmit}>제출</button>}
      </div>
    </header>
  )
}

export default QuizHeader
