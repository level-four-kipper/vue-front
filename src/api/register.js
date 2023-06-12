import http from '@/utils/https.js'

export function fetchCheckCode(params) {
  return http.post(`/user-manage/check/${params}`)
}
export function fetchRegister(params) {
  return http.post(`/user-manage/register`, params)
}