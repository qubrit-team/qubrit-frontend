import '../styles/components/SetDetailHeader.css'

// 세트 상세 상단: 뒤로가기 + 과목 + 제목 + 우측 썸네일
function SetDetailHeader({ subject, title, thumb, onBack }) {
  return (
    <header className="setDetailHeader">
      <button type="button" className="setDetailBack" aria-label="뒤로가기" onClick={onBack}>
        <img src="/assets/setDetail/back.svg" alt="" width="24" height="24" />
      </button>
      <div className="setDetailHeadRow">
        <div className="setDetailHeadText">
          <p className="setDetailSubject">{subject}</p>
          <h1 className="setDetailTitle">{title}</h1>
        </div>
        <div className="setDetailThumb"><img src={thumb} alt="" /></div>
      </div>
    </header>
  )
}

export default SetDetailHeader
