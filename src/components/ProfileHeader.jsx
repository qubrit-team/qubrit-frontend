import '../styles/components/ProfileHeader.css'

// 프로필: 이니셜 아바타 + 이름 + 부가 정보
function ProfileHeader({ name, lines = [] }) {
  return (
    <div className="profileHeader">
      <div className="profileAvatar" aria-hidden="true">{name.slice(0, 1)}</div>
      <div className="profileText">
        <p className="profileName">{name}</p>
        {lines.map((line) => <p key={line} className="profileLine">{line}</p>)}
      </div>
    </div>
  )
}

export default ProfileHeader
