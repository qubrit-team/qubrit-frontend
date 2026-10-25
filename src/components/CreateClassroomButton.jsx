import '../styles/components/CreateClassroomButton.css'

// "+ 학급 만들기" 알약 버튼
function CreateClassroomButton({ onClick, disabled }) {
  return (
    <button type="button" className="createClassroomButton" disabled={disabled} onClick={onClick}>
      <img src="/assets/classroom/plus.svg" alt="" width="16" height="16" />
      학급 만들기
    </button>
  )
}

export default CreateClassroomButton
