import '../styles/components/QuestionResultGrid.css'

// 문항별 정오 표시. 오답은 빨강, 미응답은 연한 회색
function QuestionResultGrid({ items, selectedIndex, onSelect }) {
  return (
    <div className="questionResultGrid">
      {items.map((status, i) => (
        <button
          key={i}
          type="button"
          className={`questionResultCell questionResultCell_${status} ${i === selectedIndex ? 'isSelected' : ''}`}
          aria-label={`${i + 1}번 ${status === 'right' ? '정답' : status === 'wrong' ? '오답' : '미응답'}`}
          onClick={() => onSelect(i)}
        >
          {i + 1}
        </button>
      ))}
    </div>
  )
}

export default QuestionResultGrid
