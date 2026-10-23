import { request } from "./http";

// 풀이 시작. 진행 중인 풀이가 있으면 이어서 풀게끔
export const startAttempt = (setId) =>
  request(`/api/sets/${setId}/attempts`, { method: "POST" });

// 답 제출
export const submitAnswer = (attemptId, questionId, body) =>
  request(`/api/attempts/${attemptId}/answers/${questionId}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });

export const finishAttempt = (attemptId) =>
  request(`/api/attempts/${attemptId}/finish`, { method: "POST" });

// 내 풀이 기록 (최근순). status: 'IN_PROGRESS' | 'DONE'
export function fetchMyAttempts({ status, size = 20 } = {}) {
  const params = new URLSearchParams({ size })
  if (status) params.set('status', status)
  return request(`/api/me/attempts?${params}`)
}
