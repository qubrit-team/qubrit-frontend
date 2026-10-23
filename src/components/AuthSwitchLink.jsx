import '../styles/components/AuthSwitchLink.css'

// "아직 계정이 없나요? 회원가입" 처럼 다른 인증 화면으로 보내는 안내 링크
function AuthSwitchLink({ text, linkText, onClick }) {
  return (
    <p className="authSwitch">
      <span>{text}</span>
      <button type="button" className="authSwitchLink" onClick={onClick}>{linkText}</button>
    </p>
  )
}

export default AuthSwitchLink
