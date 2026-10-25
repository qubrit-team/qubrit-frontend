// 출제 시작 화면: 문제를 만드는 방법을 고른다. 학급/검색과 같은 다크 레이아웃을 쓴다.
import MainLayout from '../components/MainLayout'
import CreateOptionCard from '../components/CreateOptionCard'
import CreateMenuItem from '../components/CreateMenuItem'
import '../styles/CreatePage.css'

// TODO: 각 출제 방식 화면 연결 (아직 화면이 없다)
function CreatePage({ onNavigate }) {
  return (
    <MainLayout active="create" onNavigate={onNavigate} topBar={false} className="screenDark">
      <div className="createPage">
        <h1 className="createTitle">문제 만들기</h1>
        <p className="createSub">어떻게 시작할까요?</p>

        <div className="createOptions">
          <CreateOptionCard
            eyebrow="기본"
            title="직접 문제 만들기"
            desc="문제·정답·해설을 하나씩 입력해요."
            image="/assets/create/pencil.svg"
          />
          <CreateOptionCard
            badge="AI 보조"
            title="AI 도움받아 만들기"
            desc="자료를 넣으면 초안을 만들어 줘요. 확인하고 고친 뒤 공개해요."
            image="/assets/create/sparkle.svg"
          />
        </div>

        <div className="createMenu">
          <CreateMenuItem icon="/assets/create/folder.svg" title="학습 자료에서 만들기" desc="자료실의 PDF·이미지를 골라 시작해요" />
          <CreateMenuItem icon="/assets/create/scroll.svg" title="기존 세트 복제 · 수정" desc="내 문제나 허용된 세트를 복사해 고쳐요" />
        </div>
      </div>
    </MainLayout>
  )
}

export default CreatePage
