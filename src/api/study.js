import { request } from './http'

// 홈 요약 (연속 학습 일수, 미해결 오답 수 등)
export const fetchHome = () => request('/api/home')

// 과목별 정답률 등 학습 분석
export const fetchAnalysis = () => request('/api/tutor/analysis')

// 오답 노트 목록 (최근순). resolved=false 는 아직 복습이 필요한 문제
export function fetchWrongNotes({ subject = '', resolved = false, page = 0, size = 50 } = {}) {
  const params = new URLSearchParams({ resolved, page, size })
  if (subject) params.set('subject', subject)
  return request(`/api/wrong-notes?${params}`)
}
