import '../styles/components/JoinCodeButton.css'

// 화면 하단에 떠 있는 "코드로 참여" 알약 버튼
function JoinCodeButton({ onClick, disabled }) {
  return (
    <button type="button" className="joinCodeButton" disabled={disabled} onClick={onClick}>
      코드로 참여
    </button>
  )
}

export default JoinCodeButton
