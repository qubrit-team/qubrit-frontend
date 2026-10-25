import '../styles/components/WrongAnswerCard.css'

// 선택한 문항의 내 답, 정답, 해설
function WrongAnswerCard({ number, myAnswer, correctAnswer, explanation }) {
  return (
    <section className="wrongAnswerCard">
      <p className="wrongAnswerHead">
        <strong className="wrongAnswerNo">{number}번 오답</strong>
        {myAnswer && <span className="wrongAnswerMine">내 답 {myAnswer}</span>}
      </p>
      <p className="wrongAnswerCorrect">정답 {correctAnswer}</p>
      {explanation && <p className="wrongAnswerExplain">{explanation}</p>}
    </section>
  )
}

export default WrongAnswerCard
