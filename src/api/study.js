import { request } from './http'

// 홈 요약 (연속 학습 일수, 미해결 오답 수 등)
export const fetchHome = () => request('/api/home')

// 과목별 정답률 등 학습 분석
export const fetchAnalysis = () => request('/api/tutor/analysis')
