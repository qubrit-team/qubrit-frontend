import '../styles/components/SchoolField.css'

// 학교 입력 + 검색 미리보기 목록. confirmed 면 보라 테두리와 확인 체크가 붙는다.
function SchoolField({ value, onChange, confirmed, suggestions = [], onSelect, placeholder }) {
  const showList = !confirmed && suggestions.length > 0
  return (
    <div className="schoolFieldWrap">
      <div className={`schoolField ${confirmed ? 'schoolFieldOn' : ''}`}>
        <input
          className="schoolFieldInput"
          value={value}
          placeholder={placeholder}
          maxLength={50}
          onChange={(e) => onChange(e.target.value)}
        />
        {confirmed && (
          <span className="schoolFieldCheck" aria-label="학교 확인됨">
            <img src="/assets/createClassroom/check.svg" width="14" height="14" alt="" />
          </span>
        )}
      </div>
      {showList && (
        <ul className="schoolFieldList">
          {suggestions.map((s) => (
            <li key={s.id}>
              <button type="button" className="schoolFieldItem" onClick={() => onSelect(s)}>
                <span className="schoolFieldName">{s.name}</span>
                {s.region && <span className="schoolFieldRegion">{s.region}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SchoolField
