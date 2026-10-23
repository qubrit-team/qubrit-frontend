import '../styles/components/PasswordToggle.css'

// 비밀번호 보기/숨기기 버튼 (TextField 의 side 에 넣어 사용)
function PasswordToggle({ shown, onToggle }) {
  return (
    <button
      type="button"
      className="passwordToggle"
      aria-label="비밀번호 보기"
      aria-pressed={shown}
      onClick={onToggle}
    >
      <img src="/assets/login/eye.svg" alt="" width="20" height="20" />
    </button>
  )
}

export default PasswordToggle
