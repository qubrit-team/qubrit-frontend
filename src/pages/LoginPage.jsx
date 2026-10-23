// 로그인 화면
import { useState } from "react";
import TextField from "../components/TextField";
import Button from "../components/Button";
import Checkbox from "../components/Checkbox";
import QubritLogo from "../components/QubritLogo";
import SegmentedControl from "../components/SegmentedControl";
import PasswordToggle from "../components/PasswordToggle";
import AuthSwitchLink from "../components/AuthSwitchLink";
import { login } from "../api/auth";
import { ApiError, describeError } from "../api/http";
import "../styles/LoginPage.css";

const ROLES = [
  { value: "student", label: "학생" },
  { value: "teacher", label: "선생님" },
];
const MAX_ATTEMPTS = 5;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function LoginPage({ onNavigate }) {
  // TODO: 로그인 API 가 역할(role)을 받는지 확정 후 연동
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [autoLogin, setAutoLogin] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    // 입력값 검증
    const emailMsg = !email.trim()
      ? "이메일을 입력해 주세요"
      : !EMAIL_RE.test(email)
        ? "올바른 이메일 형식이 아니에요"
        : "";
    const pwMsg = password ? "" : "비밀번호를 입력해 주세요";
    setEmailError(emailMsg);
    setPasswordError(pwMsg);
    if (emailMsg || pwMsg) return;

    setLoading(true);
    try {
      await login({ email, password }, autoLogin);
      onNavigate("home");
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        const left = Math.max(0, attemptsLeft - 1);
        setAttemptsLeft(left);
        setPasswordError(
          left === 0
            ? "로그인 시도 횟수를 모두 사용했어요. 비밀번호 찾기를 이용해 주세요"
            : `이메일 또는 비밀번호가 맞지 않아요. (${left}회 남음)`,
        );
      } else {
        setFormError(describeError(err));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="screen loginPage" onSubmit={handleSubmit} noValidate>
      <QubritLogo />
      <h1 className="screenTitle loginTitle">다시 만나서 반가워요</h1>

      <div className="loginRole">
        <SegmentedControl label="로그인 유형" options={ROLES} value={role} onChange={setRole} />
      </div>

      <TextField
        label="이메일"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setEmailError("");
        }}
        status={emailError ? "error" : "default"}
        message={emailError || undefined}
        className="loginEmailField"
      />

      <TextField
        label="비밀번호"
        type={showPw ? "text" : "password"}
        autoComplete="current-password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setPasswordError("");
        }}
        status={passwordError ? "error" : "default"}
        message={passwordError || undefined}
        side={<PasswordToggle shown={showPw} onToggle={() => setShowPw((v) => !v)} />}
      />

      <div className="field autoLoginRow">
        <Checkbox checked={autoLogin} onChange={setAutoLogin}>
          자동 로그인
        </Checkbox>
        <button type="button" className="forgotLink" onClick={() => onNavigate("forgot")}>
          비밀번호 찾기
        </button>
      </div>

      <div className="screenSpacer loginSpacer" />
      <div className="loginFooter">
        {formError && (
          <p className="fieldMsg fieldMsgError loginFormError">{formError}</p>
        )}
        <Button type="submit" disabled={attemptsLeft === 0 || loading}>
          {loading ? "로그인 중..." : "로그인"}
        </Button>
        <AuthSwitchLink
          text="아직 계정이 없나요?"
          linkText="회원가입"
          onClick={() => onNavigate("signup")}
        />
      </div>
    </form>
  );
}

export default LoginPage;
