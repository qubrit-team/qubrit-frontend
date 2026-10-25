import { request } from './http'

// 학교 이름 검색: [{ id, name, region }]
export const searchSchools = (query) => request(`/api/schools?query=${encodeURIComponent(query)}`)
