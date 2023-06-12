import http from '@/utils/https.js'

// 上报浏览器信息
export function fetchWebInfo(params) {
  return http.post(`/web/add`, params)
}
