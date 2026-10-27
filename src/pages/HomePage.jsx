// 홈 화면 (시험 D-day, 이어 풀기, 바로가기, 시험 일정·공지, 친구들이 많이 푼 문제)
import { useEffect, useState } from 'react'
import MainLayout from '../components/MainLayout'
import ProgressBar from '../components/ProgressBar'
import QubritLogo from '../components/QubritLogo'
import { fetchMe, logout } from '../api/auth'
import { fetchMyAttempts } from '../api/attempts'
import { fetchClassmatePopular, fetchRecommendations } from '../api/recommendations'
import { searchSets } from '../api/sets'
import { mascotFor } from '../utils/mascot'
import '../styles/HomePage.css'

// TODO: 서버 데이터 연동 (시험 D-day, 일정·공지)
const EXAM = { name: '기말고사', dDay: 17 }
const SCHEDULE = { month: '11월', day: 9, title: '자료구조 수행평가', from: '11.10 2교시', to: '11.9 (월) 3교시', dDay: 17 }
const NOTICE = { title: '소프트웨어과 2-3 · 보고서 제출 안내', meta: '선생님 공지 · 오늘 08:10' }

// 풀이 시작 시각을 "방금 전 / N분 전 / N시간 전 / N일 전"으로
function timeAgo(iso) {
  const min = Math.max(0, Math.floor((Date.now() - Date.parse(iso)) / 60000))
  if (min < 1) return '방금 전'
  if (min < 60) return `${min}분 전`
  if (min < 60 * 24) return `${Math.floor(min / 60)}시간 전`
  return `${Math.floor(min / (60 * 24))}일 전`
}

function HomePage({ onNavigate }) {
  const [user, setUser] = useState(null)
  const [resume, setResume] = useState(null) // 풀던 풀이
  const [recommend, setRecommend] = useState(null) // 풀던 게 없을 때 추천 { set, reason }
  const [popular, setPopular] = useState([])

  useEffect(() => {
    fetchMe()
      .then(setUser)
      .catch(() => { logout(); onNavigate('login') })
  }, [onNavigate])

  // 풀던 풀이가 있으면 이어 풀기, 없으면 추천 세트를 보여준다
  useEffect(() => {
    let ignore = false
    fetchMyAttempts({ status: 'IN_PROGRESS', size: 1 })
      .then((list) => {
        if (ignore) return null
        if (list.length > 0) return setResume(list[0])
        return fetchRecommendations({ size: 1 }).then((r) => !ignore && setRecommend(r[0] ?? null))
      })
      .catch(() => {}) // 카드만 비워 둔다
    // 같은 학급 친구들이 푼 문제를 우선하고, 없으면 전체 인기 문제로 채운다
    fetchClassmatePopular({ size: 2 })
      .then((list) => {
        if (ignore) return null
        if (list.length > 0) return setPopular(list.map((r) => ({ ...r.set, friends: r.classmateCount })))
        return searchSets({ sort: 'popular', size: 2 }).then((res) => !ignore && setPopular(res.items ?? []))
      })
      .catch(() => {})
    return () => { ignore = true }
  }, [])

  // 세트를 풀기 전에는 항상 세트 상세를 먼저 보여준다
  const openSet = (setId) => onNavigate('setDetail', { setId, from: 'home' })

  if (!user) return null
  return (
    <MainLayout active="home" onNavigate={onNavigate} topBar={false} className="homeScreen">
      <div className="homePage">
        <header className="homeHeader">
          <div className="homeTopRow">
            <QubritLogo />
            <button type="button" className="homeBell" aria-label="알림 (새 알림 4개)">
              <img src="/assets/home/bell.svg" alt="" width="24" height="24" />
              <span className="homeBellDot" />
            </button>
          </div>
          <h1 className="homeTitle">
            {user.nickname}님, {EXAM.name}까지<br />{EXAM.dDay}일 남았어요
          </h1>
        </header>

        {(resume || recommend) && (
          <section className="resumeCard">
            <div className="resumeHead">
              <b>{resume ? '이어 풀기' : '추천 문제'}</b>
              <span>{resume ? timeAgo(resume.startedAt) : recommend.reason}</span>
            </div>
            <div className="resumeRow">
              <img className="resumeThumb" src={mascotFor(resume ? resume.subject : recommend.set.subject, resume ? resume.setId : recommend.set.id)} alt="" />
              <div className="resumeText">
                <p className="resumeName">{resume ? resume.setTitle : recommend.set.title}</p>
                <p className="resumeMeta">
                  {resume ? `${resume.answeredCount}문제까지 학습` : `${recommend.set.subject} · ${recommend.set.questionCount}문항`}
                </p>
              </div>
              <button type="button" className="resumeBtn" onClick={() => openSet(resume ? resume.setId : recommend.set.id)}>
                {resume ? '계속' : '시작'}
              </button>
            </div>
            {resume && <ProgressBar value={resume.answeredCount} max={resume.total} />}
          </section>
        )}

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
            {popular.map((p) => (
              <button key={p.id} type="button" className="popularCard" onClick={() => openSet(p.id)}>
                <span className="popularThumb" />
                <span className="popularTitle"><span>{p.title}</span></span>
                <span className="popularMeta">
                  {p.subject}
                  {p.friends != null
                    ? ` · 친구 ${p.friends}명 풀이`
                    : p.metrics?.solveCount != null && ` · 풀이 ${p.metrics.solveCount.toLocaleString()}`}
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  )
}

export default HomePage
