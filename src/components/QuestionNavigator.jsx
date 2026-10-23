// 문항 목록 시트: 번호를 눌러 해당 문제로 이동
function QuestionNavigator({ questions, current, answeredIds, onSelect, onClose }) {
  return (
    <div className="navigatorOverlay" onClick={onClose}>
      <div className="navigatorSheet" role="dialog" onClick={(e) => e.stopPropagation()}>
        <div className="navigatorHead">
          <strong>문항 목록</strong>
          <button type="button" className="navigatorCloseText" onClick={onClose}>닫기</button>
        </div>
        <div className="navigatorGrid">
          {questions.map((q, i) => (
            <button
              key={q.id}
              type="button"
              className={`navigatorCell ${i === current ? 'isCurrent' : ''} ${answeredIds.has(q.id) ? 'isAnswered' : ''}`}
              onClick={() => onSelect(i)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default QuestionNavigator
