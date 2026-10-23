// 비밀번호 찾기 화면 (이메일 인증 후 다음 단계로)
import { useState } from 'react'
import BackButton from '../components/BackButton'
import TextField from '../components/TextField'
import Button from '../components/Button'
import { sendCode, verifyCode } from '../api/auth'
import { describeError } from '../api/http'
import '../styles/ForgotPasswordPage.css'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function ForgotPasswordPage({ onNavigate }) {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [sending, setSending] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [verified, setVerified] = useState(false)
  const [emailMsg, setEmailMsg] = useState({ text: '', tone: '' })
  const [codeMsg, setCodeMsg] = useState({ text: '', tone: '' })

  const changeEmail = (e) => {
    setEmail(e.target.value)
    setCodeSent(false)
    setVerified(false)
    setCode('')
    setEmailMsg({ text: '', tone: '' })
    setCodeMsg({ text: '', tone: '' })
  }

  const handleSendCode = async () => {
    setSending(true)
    setEmailMsg({ text: '', tone: '' })
    try {
      await sendCode(email)
      setCodeSent(true)
      setCode('')
      setCodeMsg({ text: '', tone: '' })
      setEmailMsg({ text: '인증번호를 보냈어요. 5분 안에 입력해 주세요', tone: 'ok' })
    } catch (err) {
      setEmailMsg({ text: describeError(err), tone: 'error' })
    } finally {
      setSending(false)
    }
  }

  const handleVerify = async () => {
    setVerifying(true)
    try {
      await verifyCode(email, code)
      setVerified(true)
      setCodeMsg({ text: '이메일 인증이 완료됐어요', tone: 'ok' })
    } catch (err) {
      setCodeMsg({ text: describeError(err), tone: 'error' })
    } finally {
      setVerifying(false)
    }
  }

  const next = () => {
    // TODO: 백엔드에 비밀번호 재설정 API가 생기면 재설정 화면으로 이동
  }

  return (
    <div className="screen forgotPage">
      <BackButton src="/assets/signup/back.svg" onClick={() => onNavigate('login')} />
      <h1 className="screenTitle">비밀번호를<br />잊으셨나요?</h1>
      <p className="screenDesc">가입한 이메일로 재설정 링크를 보내드려요.</p>

      <TextField
        label="이메일"
        type="email"
        value={email}
        onChange={changeEmail}
        status={emailMsg.tone === 'error' ? 'error' : 'default'}
        message={emailMsg.text || undefined}
        messageTone={emailMsg.tone === 'ok' ? 'ok' : undefined}
        action={
          <Button variant="soft" className="forgotAction forgotSendCode" disabled={!EMAIL_RE.test(email) || sending} onClick={handleSendCode}>
            {sending ? '발송 중' : '인증번호'}
          </Button>
        }
      />

      <TextField
        label="인증번호"
        placeholder="6자리를 입력해주세요."
        inputMode="numeric"
        maxLength={6}
        value={code}
        disabled={!codeSent || verified}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
        status={codeMsg.tone === 'error' ? 'error' : 'default'}
        message={codeMsg.text || undefined}
        messageTone={codeMsg.tone === 'ok' ? 'ok' : undefined}
        action={
          <Button variant="soft" className="forgotAction forgotVerify" disabled={!codeSent || verified || code.length !== 6 || verifying} onClick={handleVerify}>
            {verifying ? '확인 중' : verified ? '완료' : '인증'}
          </Button>
        }
      />

      <div className="screenSpacer" />
      <Button disabled={!verified} onClick={next}>다음으로</Button>
    </div>
  )
}

export default ForgotPasswordPage
