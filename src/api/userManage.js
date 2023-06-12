import http from '@/utils/https.js'

export function fetchSearchUserList(data) {
  return http.post(`/user-manage/page-list-name-part/${data}`)
}
// 用户反馈
export function fetchUserFeedback(data) {
  return http.post(`/user/feedback`, data)
}
