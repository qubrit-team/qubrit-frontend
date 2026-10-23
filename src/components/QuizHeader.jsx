import { formatElapsed } from '../utils/time'

// 풀이 화면 맨 위: 닫기(X) + 경과 시간
function QuizHeader({ elapsedSeconds, onClose }) {
  return (
    <header className="quizHeader">
      <button type="button" className="quizClose" onClick={onClose}>
        <img src="/assets/icons/close.svg" alt="" width="22" height="22" />
      </button>
      <span className="quizTimer">
        <img src="/assets/icons/clock.svg" alt="" width="16" height="16" />
        {formatElapsed(elapsedSeconds)}
      </span>
    </header>
  )
}

export default QuizHeader
