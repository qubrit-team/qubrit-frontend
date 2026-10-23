import '../styles/components/BottomNav.css'

const TABS = [
  { key: "home", label: "홈", iconClass: "navIconHome" },
  { key: "classroom", label: "학급", iconClass: "navIconClassroom" },
  { key: "search", label: "탐색", iconClass: "navIconSearch" },
  { key: "create", label: "출제", iconClass: "navIconCreate" },
  { key: "my", label: "내 활동", iconClass: "navIconMy" },
];

function BottomNav({ active = "home", onSelect }) {
  return (
    <nav className="bottomNav">
      {TABS.map((t) => (
        <button
          key={t.key}
          type="button"
          className={`bottomNavItem ${t.key === active ? "isActive" : ""}`}
          aria-current={t.key === active ? "page" : undefined}
          onClick={() => onSelect?.(t.key)}
        >
          <span className={`navIcon ${t.iconClass}`} aria-hidden="true" />
          <span>{t.label}</span>
        </button>
      ))}
    </nav>
  );
}

export default BottomNav
