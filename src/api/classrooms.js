import { request } from './http'

// 내가 만들었거나 참여한 학급
export const fetchMyClassrooms = () => request('/api/classrooms')

// name 외에 school, grade, classNo, subjects[], joinMode(APPROVAL|CODE), memberUploadAllowed 를 받는다
export const createClassroom = (payload) =>
  request('/api/classrooms', { method: 'POST', body: JSON.stringify(payload) })

// 참여 코드로 학급에 참여
export const joinClassroom = (code) =>
  request('/api/classrooms/join', { method: 'POST', body: JSON.stringify({ code }) })

// 나에게 온 초대 (응답하지 않은 것만)
export const fetchInvites = () => request('/api/classrooms/invites')

export const acceptInvite = (id) => request(`/api/classrooms/invites/${id}/accept`, { method: 'POST' })

export const declineInvite = (id) => request(`/api/classrooms/invites/${id}/decline`, { method: 'POST' })

// 학급 만들기에서 고르는 과목 목록 (["파이썬", ...]) / 과목 직접 추가 (추가된 이름 반환)
export const fetchClassroomSubjects = () => request('/api/classroom-subjects')

export const addClassroomSubject = (name) =>
  request('/api/classroom-subjects', { method: 'POST', body: JSON.stringify({ name }) })
