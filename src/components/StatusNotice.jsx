import '../styles/components/StatusNotice.css'

// 아이콘 + 제목 + 설명 + (선택) 액션으로 이루어진 결과 안내 블록 (예: 메일 발송 완료)
function StatusNotice({ icon, title, desc, children }) {
  return (
    <div className="statusNotice">
      <img src={icon} alt="" width="106" height="106" />
      <h2 className="statusNoticeTitle">{title}</h2>
      <p className="statusNoticeDesc">
        {desc.map((line) => <span key={line}>{line}</span>)}
      </p>
      {children}
    </div>
  )
}

export default StatusNotice
