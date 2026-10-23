// 홈 화면 (시험 D-day, 이어 풀기, 바로가기, 시험 일정·공지, 친구들이 많이 푼 문제)
import { useEffect, useState } from 'react'
import MainLayout from '../components/MainLayout'
import ProgressBar from '../components/ProgressBar'
import { fetchMe, logout } from '../api/auth'
import '../styles/HomePage.css'

// TODO: 서버 데이터 연동 (시험 D-day, 이어 풀기, 일정·공지, 인기 문제)
const EXAM = { name: '기말고사', dDay: 17 }
const RESUME = { title: '파이썬 예제 10개', solved: 3, total: 10, lastQuestion: 4, when: '어제 21:40' }
const SCHEDULE = { month: '11월', day: 9, title: '자료구조 수행평가', from: '11.10 2교시', to: '11.9 (월) 3교시', dDay: 17 }
const NOTICE = { title: '소프트웨어과 2-3 · 보고서 제출 안내', meta: '선생님 공지 · 오늘 08:10' }
const POPULAR = [
  { id: 1, title: ['함수와 매개변수 15제'], meta: '소프트웨어과 2-3 · 풀이' },
  { id: 2, title: ['정보처리기능사', '필기 기출 20제'], meta: '한빛공고 · 풀이 1,032' },
]

function HomePage({ onNavigate }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetchMe()
      .then(setUser)
      .catch(() => { logout(); onNavigate('login') })
  }, [onNavigate])

  if (!user) return null
  return (
    <MainLayout active="home" onNavigate={onNavigate} topBar={false} className="homeScreen">
      <div className="homePage">
        <header className="homeHeader">
          <button type="button" className="homeBell" aria-label="알림 (새 알림 4개)">
            <img src="/assets/home/bell.svg" alt="" width="24" height="24" />
            <span className="homeBellDot" />
          </button>
          <h1 className="homeTitle">
            {user.nickname}님, {EXAM.name}까지<br />{EXAM.dDay}일 남았어요
          </h1>
        </header>

        <section className="resumeCard">
          <div className="resumeHead">
            <b>이어 풀기</b>
            <span>{RESUME.when}</span>
          </div>
          <div className="resumeRow">
            <img className="resumeThumb" src="/assets/home/python.png" alt="" />
            <div className="resumeText">
              <p className="resumeName">{RESUME.title}</p>
              <p className="resumeMeta">{RESUME.lastQuestion}번 문제까지 학습</p>
            </div>
            <button type="button" className="resumeBtn">계속</button>
          </div>
          <ProgressBar value={RESUME.solved} max={RESUME.total} />
        </section>

        <div className="actionGrid">
          <button type="button" className="actionCard" onClick={() => onNavigate('search')}>
            <span className="actionTitle">문제 풀기</span>
            <span className="actionDesc">전공·학교 기출 탐색</span>
            <span className="actionImg actionImgSolve" aria-hidden>
              <img src="/assets/home/mascot-solve.png" alt="" />
            </span>
          </button>
          <button type="button" className="actionCard" onClick={() => onNavigate('create')}>
            <span className="actionTitle">문제 만들기</span>
            <span className="actionDesc">직접 · AI로 · 자료로</span>
            <span className="actionImg actionImgCreate" aria-hidden>
              <img src="/assets/home/mascot-create.png" alt="" />
            </span>
          </button>
        </div>

        <div className="quickGrid">
          <button type="button" className="quickLink"><span className="quickIcon" />AI 면접 연습</button>
          <button type="button" className="quickLink"><span className="quickIcon" />과외쌤 AI</button>
        </div>

        <section className="homeSection">
          <h2 className="sectionTitle">시험 일정 · 공지</h2>
          <div className="feedList">
            <div className="feedRow">
              <div className="dateBadge"><span>{SCHEDULE.month}</span><b>{SCHEDULE.day}</b></div>
              <div className="feedBody">
                <p className="feedTitle">{SCHEDULE.title}</p>
                <p className="feedMeta">{SCHEDULE.from} → <b>{SCHEDULE.to}</b></p>
              </div>
              <span className="feedDday">D-{SCHEDULE.dDay}</span>
            </div>
            <button type="button" className="feedRow">
              <div className="noticeBadge"><img src="/assets/home/megaphone.svg" alt="" width="38" height="38" /></div>
              <div className="feedBody">
                <p className="feedTitle feedTitleNotice">{NOTICE.title}</p>
                <p className="feedMeta">{NOTICE.meta}</p>
              </div>
              <img src="/assets/home/chevron.svg" alt="" width="18" height="18" />
            </button>
          </div>
        </section>

        <section className="homeSection homeSectionLast">
          <div className="sectionHead">
            <h2 className="sectionTitle">친구들이 많이 푼 문제</h2>
            <button type="button" className="sectionMore" onClick={() => onNavigate('search')}>전체</button>
          </div>
          <div className="popularGrid">
            {POPULAR.map((p) => (
              <button key={p.id} type="button" className="popularCard">
                <span className="popularThumb" />
                <span className="popularTitle">
                  {p.title.map((line) => <span key={line}>{line}</span>)}
                </span>
                <span className="popularMeta">{p.meta}</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  )
}

export default HomePage
