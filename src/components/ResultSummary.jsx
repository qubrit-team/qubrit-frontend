import '../styles/components/ResultSummary.css'

// 결과 상단: 닫기, 세트 제목, 맞힌 문제 수, 트로피
function ResultSummary({ setTitle, correct, total, onClose }) {
  return (
    <header className="resultSummary">
      <button type="button" className="resultSummaryClose" aria-label="닫기" onClick={onClose}>
        <img src="/assets/result/close.svg" alt="" width="22" height="22" />
      </button>
      <div className="resultSummaryRow">
        <div className="resultSummaryText">
          <p className="resultSummarySet">{setTitle}</p>
          <h1 className="resultSummaryTitle">{total}문제 중<br />{correct}문제 맞혔어요</h1>
        </div>
        <img src="/assets/result/trophy.png" alt="" width="96" height="96" />
      </div>
    </header>
  )
}

export default ResultSummary
