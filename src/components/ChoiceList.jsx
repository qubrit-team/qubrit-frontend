const CIRCLED = '①②③④⑤⑥⑦⑧⑨⑩'

// 객관식 보기. 이미 제출한 문제는 잠굼
function ChoiceList({ choices, selectedId, locked, onSelect }) {
  return (
    <div className="choiceList" role="radiogroup">
      {choices.map((c, i) => {
        const selected = c.id === selectedId
        return (
          <button
            key={c.id}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={locked}
            className={`choiceItem ${selected ? 'isSelected' : ''}`}
            onClick={() => onSelect(c.id)}
          >
            <span className="choiceRadio" aria-hidden="true" />
            <span className="choiceText">{CIRCLED[i] ?? `${i + 1}.`} {c.content}</span>
          </button>
        )
      })}
    </div>
  )
}

export default ChoiceList
