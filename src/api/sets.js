import { request } from './http'

// 공개 문제 세트 검색. sort: 'latest' | 'popular' | 'trust'
export function searchSets({ subject = '', q = '', sort = 'latest', page = 0, size = 20 } = {}) {
  const params = new URLSearchParams({ scope: 'public', subject, q, sort, page, size })
  return request(`/api/sets?${params}`)
}

// 세트 상세(풀이자에게는 정답/해설이 빠진 문제 목록)
export const fetchSet = (id) => request(`/api/sets/${id}`)

// 내가 만든 세트
export function fetchMySets({ page = 0, size = 20 } = {}) {
  const params = new URLSearchParams({ scope: 'mine', page, size })
  return request(`/api/sets?${params}`)
}
