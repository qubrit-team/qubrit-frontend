import '../styles/components/ResultActionButton.css'

// 아이콘 위, 문구 아래의 정사각에 가까운 액션 버튼
function ResultActionButton({ icon, label, onClick, disabled }) {
  return (
    <button type="button" className="resultAction" onClick={onClick} disabled={disabled}>
      <img src={icon} alt="" width="20" height="20" />
      <span>{label}</span>
    </button>
  )
}

export default ResultActionButton
