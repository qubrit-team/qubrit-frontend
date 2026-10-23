// 비밀번호 찾기 화면
import { useEffect, useState } from 'react'
import BackButton from '../components/BackButton'
import TextField from '../components/TextField'
import Button from '../components/Button'
import StatusNotice from '../components/StatusNotice'
import '../styles/ForgotPasswordPage.css'

const RESEND_SECONDS = 60
const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

function ForgotPasswordPage({ onNavigate }) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [remaining, setRemaining] = useState(0)

  useEffect(() => {
    if (remaining <= 0) return
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000)
    return () => clearTimeout(t)
  }, [remaining])

  const send = () => {
    // TODO: 재설정 메일 발송 API 연동
    setSent(true)
    setRemaining(RESEND_SECONDS)
  }

  return (
    <div className="screen forgotPage">
      <BackButton src="/assets/signup/back.svg" onClick={() => onNavigate('login')} />
      <h1 className="screenTitle">비밀번호를<br />잊으셨나요?</h1>
      <p className="screenDesc">가입한 이메일로 재설정 링크를 보내드려요.</p>

      {sent ? (
        <div className="forgotSent">
          <StatusNotice
            icon="/assets/forgot/mail.svg"
            title="메일을 보냈어요"
            desc={['받은편지함을 확인해주세요.', '링크는 일정 시간 동안 쓸 수 있어요.']}
          >
            <button type="button" className="resendButton" disabled={remaining > 0} onClick={send}>
              다시 보내기{remaining > 0 && ` (${formatTime(remaining)})`}
            </button>
          </StatusNotice>
        </div>
      ) : (
        <TextField
          label="이메일"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      )}

      <div className="screenSpacer" />
      {sent ? (
        <Button onClick={() => onNavigate('login')}>로그인으로 돌아가기</Button>
      ) : (
        <Button disabled={!email.includes('@')} onClick={send}>재설정 링크 보내기</Button>
      )}
    </div>
  )
}

export default ForgotPasswordPage
