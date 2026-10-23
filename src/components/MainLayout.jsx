import TopBar from "./TopBar";
import BottomNav from "./BottomNav";
import '../styles/components/MainLayout.css'

// 메인 화면 공통 레이아웃
function MainLayout({ active, onNavigate, topBar = true, className = "", children }) {
  return (
    <div className={`screen screenMain ${className}`}>
      {topBar && <TopBar />}
      <main className="mainContent">{children}</main>
      <BottomNav active={active} onSelect={onNavigate} />
    </div>
  );
}

export default MainLayout;
