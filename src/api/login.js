import http from '@/utils/https.js'

export async function fetchPublicKey(params = {}) {
  return await http.get(`/user-manage/getPublicKeyStr`, params)
}

export function fetchLogin(params) {
  return http.post(`/user-manage/login`, params)
}

