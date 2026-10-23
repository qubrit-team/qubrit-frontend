import Chip from './Chip'
import '../styles/components/FilterBar.css'

// 필터 아이콘 버튼 + 가로 스크롤 칩. options: 문자열 배열, value: 선택된 값('' = 없음)
function FilterBar({ options, value, onChange }) {
  return (
    <div className="filterBar">
      <button type="button" className="filterBarButton" aria-label="필터 열기">
        <img src="/assets/search/filter.svg" alt="" width="18" height="18" />
      </button>
      <div className="filterBarChips">
        {options.map((o) => (
          <Chip key={o} selected={value === o} onClick={() => onChange(o)}>{o}</Chip>
        ))}
      </div>
    </div>
  )
}

export default FilterBar
