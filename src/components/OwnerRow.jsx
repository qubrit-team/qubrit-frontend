import '../styles/components/OwnerRow.css'

// 출제자 한 줄: 이니셜 아바타 + 이름 + 부가 정보 (onClick이 있으면 화살표 표시)
function OwnerRow({ name, sub, onClick }) {
  const body = (
    <>
      <span className="ownerAvatar" aria-hidden="true">{name.slice(0, 1)}</span>
      <span className="ownerText">
        <span className="ownerName">{name}</span>
        <span className="ownerSub">{sub}</span>
      </span>
      {onClick && <img src="/assets/setDetail/chevron.svg" alt="" width="18" height="18" />}
    </>
  )
  return onClick
    ? <button type="button" className="ownerRow" onClick={onClick}>{body}</button>
    : <div className="ownerRow">{body}</div>
}

export default OwnerRow
