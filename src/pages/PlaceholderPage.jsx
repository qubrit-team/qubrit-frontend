// 준비 중인 탭 화면에 쓰는 임시 안내 화면
import MainLayout from '../components/MainLayout'
import '../styles/PlaceholderPage.css'

function PlaceholderPage({ active, text, onNavigate }) {
  return (
    <MainLayout active={active} onNavigate={onNavigate}>
      <p className="mainPlaceholder">{text}</p>
    </MainLayout>
  )
}

export default PlaceholderPage
