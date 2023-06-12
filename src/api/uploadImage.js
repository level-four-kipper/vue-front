import http from '@/utils/https.js'
export function fetchUpload(data) {
  return http.post(`/file/upload`, data)
}
export function fetchPicture(data) {
  return http.post(`/file/testBytes`, data)
}
