import http from '@/utils/https.js'
//获取信息
export function fetchNotification(params) {
  return http.post(`/message/receive`, params)
}
//更新状态
export function updateStatus(params) {
  return http.put(`/message/update-status`, params)
}
//删除通知信息
export function deleteNoticication(params) {
  return http.delete(`/message/delete/${params}`)
}
//信息详情
export function noticicationDetail(params) {
  return http.get(`/message/detail/${params}`)
}