import { request } from './http'

// 맞춤 세트 추천 ([{ set, reason }])
export function fetchRecommendations({ subject = '', size = 10 } = {}) {
  const params = new URLSearchParams({ subject, size })
  return request(`/api/recommendations?${params}`)
}

// 같은 학급 친구들이 많이 푼 공개 세트 ([{ set, classmateCount }])
export const fetchClassmatePopular = ({ size = 2 } = {}) =>
  request(`/api/recommendations/classmates?size=${size}`)
