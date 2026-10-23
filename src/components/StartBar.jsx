import '../styles/components/StartBar.css'

// 하단 고정 바: 공유 버튼 + 시작 버튼
function StartBar({ startLabel, onStart, onShare }) {
  return (
    <div className="startBar">
      <button type="button" className="startShare" aria-label="공유" onClick={onShare}>
        <img src="/assets/setDetail/share.svg" alt="" width="21" height="21" />
      </button>
      <button type="button" className="startButton" onClick={onStart}>{startLabel}</button>
    </div>
  )
}

export default StartBar
