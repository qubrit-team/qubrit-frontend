// 회원가입 화면
import { useState } from "react";
import BackButton from "../components/BackButton";
import TextField from "../components/TextField";
import Button from "../components/Button";
import Checkbox from "../components/Checkbox";
// import TermsView from '../components/TermsView'
import PasswordRules from "../components/PasswordRules";
import { checkPassword } from "../utils/password";
import { checkEmail, sendCode, verifyCode, signup } from "../api/auth";
import { ApiError, describeError } from "../api/http";
import "../styles/SignupPage.css";

const ROLES = [
  {
    key: "student",
    title: "학생",
    desc: ["문제를 풀고 만들고", "학급에 참여해요"],
    icon: "/assets/signup/pencil.svg",
  },
  {
    key: "teacher",
    title: "선생님",
    desc: ["학급·자료·일정 관리", "학교 인증 필요"],
    icon: "/assets/signup/school.svg",
  },
];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function SignupPage({ onNavigate }) {
  const [email, setEmail] = useState("");
  const [emailChecked, setEmailChecked] = useState(false);
  const [emailMsg, setEmailMsg] = useState({ text: "", tone: "" });
  const [emailTouched, setEmailTouched] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  // 인증코드: codeSent 후 코드 입력, 확인되면 emailVerified
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [codeMsg, setCodeMsg] = useState({ text: "", tone: "" });
  const [emailVerified, setEmailVerified] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [nickname, setNickname] = useState("");
  // TODO: 서버 가입 API 에 역할(role) 전달 여부 확정 후 연동
  const [role, setRole] = useState("student");
  const [agreed, setAgreed] = useState(false);
  // const [termsOpen, setTermsOpen] = useState(false);
  const [nicknameTouched, setNicknameTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const rules = checkPassword(password);
  const passwordValid = rules.letterDigit && rules.length && rules.special;
  const mismatch = confirm.length > 0 && confirm !== password;
  const nicknameValid = nickname.length >= 2 && nickname.length <= 10;
  const emailFormatError =
    emailTouched && email.length > 0 && !EMAIL_RE.test(email);
  const nicknameError =
    nicknameTouched && nickname.length > 0 && !nicknameValid;
  const canSubmit =
    emailChecked &&
    emailVerified &&
    passwordValid &&
    confirm === password &&
    nicknameValid &&
    agreed &&
    !submitting;

  const handleCheckEmail = async () => {
    setCheckingEmail(true);
    try {
      const { available } = await checkEmail(email);
      setEmailChecked(available);
      setEmailMsg(
        available
          ? { text: "사용할 수 있는 이메일이에요", tone: "ok" }
          : { text: "이미 사용 중인 이메일이에요", tone: "error" },
      );
    } catch (err) {
      setEmailMsg({ text: describeError(err), tone: "error" });
    } finally {
      setCheckingEmail(false);
    }
  };

  const resetVerification = () => {
    setCodeSent(false);
    setCode("");
    setCodeMsg({ text: "", tone: "" });
    setEmailVerified(false);
  };

  const handleSendCode = async () => {
    setSendingCode(true);
    setCodeMsg({ text: "", tone: "" });
    try {
      await sendCode(email);
      setCodeSent(true);
      setCode("");
      setCodeMsg({ text: "인증코드를 보냈어요. 5분 안에 입력해 주세요", tone: "ok" });
    } catch (err) {
      setCodeMsg({ text: describeError(err), tone: "error" });
    } finally {
      setSendingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    setVerifyingCode(true);
    try {
      await verifyCode(email, code);
      setEmailVerified(true);
      setCodeMsg({ text: "이메일 인증이 완료됐어요", tone: "ok" });
    } catch (err) {
      setCodeMsg({ text: describeError(err), tone: "error" });
    } finally {
      setVerifyingCode(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setFormError("");
    try {
      await signup({ email, password, nickname });
      onNavigate("login");
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        // 중복확인 이후 다른 사람이 먼저 가입한 경우
        setEmailChecked(false);
        setEmailMsg({ text: "이미 가입된 이메일이에요", tone: "error" });
      } else {
        setFormError(describeError(err));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="screen signupPage" onSubmit={handleSubmit} noValidate>
      <div className="signupTop">
        <BackButton
          src="/assets/signup/back.svg"
          onClick={() => onNavigate("login")}
        />
      </div>
      <h1 className="screenTitle">
        큐브릿에서
        <br />
        함께 만들고 함께 풀어요
      </h1>

      <div className="field" role="radiogroup" aria-label="어떤 분이세요?">
        <span className="fieldLabel">어떤 분이세요?</span>
        <div className="roleCards">
          {ROLES.map((r) => (
            <button
              key={r.key}
              type="button"
              role="radio"
              aria-checked={role === r.key}
              className={`roleCard ${role === r.key ? "roleCardOn" : ""}`}
              onClick={() => setRole(r.key)}
            >
              <img
                className="roleIcon"
                src={r.icon}
                alt=""
                width="49"
                height="49"
              />
              <span className="roleTitle">{r.title}</span>
              <span className="roleDesc">
                {r.desc.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </span>
              {role === r.key && (
                <span className="roleBadge">
                  <img
                    src="/assets/signup/badge.svg"
                    alt=""
                    width="12"
                    height="12"
                  />
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <TextField
        label="이메일"
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setEmailChecked(false);
          setEmailMsg({ text: "", tone: "" });
          resetVerification();
        }}
        onBlur={() => setEmailTouched(true)}
        status={
          emailFormatError || emailMsg.tone === "error" ? "error" : "default"
        }
        message={
          emailFormatError
            ? "올바른 이메일 형식이 아니에요"
            : emailMsg.text || undefined
        }
        messageTone={
          !emailFormatError && emailMsg.tone === "ok" ? "ok" : undefined
        }
        action={
          <Button
            variant="soft"
            disabled={!EMAIL_RE.test(email) || checkingEmail}
            onClick={handleCheckEmail}
          >
            {checkingEmail ? "확인 중" : "중복확인"}
          </Button>
        }
      />

      {emailChecked && (
        <TextField
          label="인증코드"
          placeholder="6자리 숫자"
          inputMode="numeric"
          maxLength={6}
          value={code}
          disabled={emailVerified}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          status={codeMsg.tone === "error" ? "error" : "default"}
          message={codeMsg.text || undefined}
          messageTone={codeMsg.tone === "ok" ? "ok" : undefined}
          action={
            codeSent && !emailVerified ? (
              <>
                <Button
                  variant="soft"
                  disabled={code.length !== 6 || verifyingCode}
                  onClick={handleVerifyCode}
                >
                  {verifyingCode ? "확인 중" : "확인"}
                </Button>
                <Button
                  variant="soft"
                  disabled={sendingCode}
                  onClick={handleSendCode}
                >
                  재발송
                </Button>
              </>
            ) : (
              <Button
                variant="soft"
                disabled={emailVerified || sendingCode}
                onClick={handleSendCode}
              >
                {sendingCode ? "발송 중" : emailVerified ? "완료" : "코드 받기"}
              </Button>
            )
          }
        />
      )}

      <TextField
        label="비밀번호"
        type="password"
        maxLength={64}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      >
        <PasswordRules password={password} />
      </TextField>

      <TextField
        label="비밀번호 확인"
        type="password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        status={mismatch ? "error" : "default"}
        message={mismatch ? "비밀번호가 일치하지 않아요" : undefined}
      />

      <TextField
        label="닉네임"
        placeholder="2~10자로 입력해주세요"
        maxLength={10}
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        onBlur={() => setNicknameTouched(true)}
        status={nicknameError ? "error" : "default"}
        message={nicknameError ? "닉네임은 2~10자로 입력해 주세요" : undefined}
      />

      <div className="field termsRow">
        <Checkbox strong checked={agreed} onChange={setAgreed}>
          약관 및 개인정보 처리방침 전체 동의
        </Checkbox>
        <button
          type="button"
          className="termsOpen"
          // onClick={() => setTermsOpen(true)}
        >
          <img src="/assets/signup/chevron.svg" alt="" width="18" height="18" />
        </button>
      </div>

      <div className="screenSpacer signupSpacer" />
      <div className="signupFooter">
        {formError && (
          <p className="fieldMsg fieldMsgError signupFormError">{formError}</p>
        )}
        <Button type="submit" disabled={!canSubmit}>
          {submitting ? "가입 중..." : "다음으로"}
        </Button>
      </div>

      {/* 이용약관 */}
      {/* {termsOpen && (
        <TermsView
          onClose={() => setTermsOpen(false)}
          onAgree={() => { setAgreed(true); setTermsOpen(false) }}
        />
      )} */}
    </form>
  );
}

export default SignupPage;
