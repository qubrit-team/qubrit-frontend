import '../styles/components/CreateMenuItem.css'

// 출제 하단 목록 한 줄: 아이콘 + 제목 + 설명 + 화살표
function CreateMenuItem({ icon, title, desc, onClick }) {
  return (
    <button type="button" className="createMenuItem" onClick={onClick}>
      <span className="createMenuIcon"><img src={icon} alt="" width="42" height="42" /></span>
      <span className="createMenuText">
        <span className="createMenuTitle">{title}</span>
        <span className="createMenuDesc">{desc}</span>
      </span>
      <img src="/assets/create/chevron.svg" alt="" width="18" height="18" />
    </button>
  )
}

export default CreateMenuItem
