import '../styles/components/QubritLogo.css'

// 다크 화면용 Qubrit 워드마크 (+ 보라색 다이아몬드 점)
function QubritLogo() {
  return (
    <span className="qubritLogo">
      <img src="/assets/login/logo.svg" alt="Qubrit" width="103" height="27" />
      <span className="qubritLogoDot" aria-hidden="true" />
    </span>
  )
}

export default QubritLogo
