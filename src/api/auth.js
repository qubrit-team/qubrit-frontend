import { request, setToken, clearToken } from './http'

export const signup = (data) =>
  request('/api/auth/signup', { method: 'POST', body: JSON.stringify(data) })

export const checkEmail = (email) =>
  request(`/api/auth/check-email?email=${encodeURIComponent(email)}`)

export const sendCode = (email) =>
  request('/api/auth/send-code', { method: 'POST', body: JSON.stringify({ email }) })

export const verifyCode = (email, code) =>
  request('/api/auth/verify-code', { method: 'POST', body: JSON.stringify({ email, code }) })

export async function login({ email, password }, autoLogin) {
  const res = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  setToken(res.accessToken, autoLogin)
  return res
}

export const fetchMe = () => request('/api/auth/me')

export const logout = clearToken
