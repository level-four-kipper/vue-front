import http from '../utils/request.js'

// 消息分页列表
export function fetchMessageList(params) {
  return http.post(`/msg_log/page`, params)
}

// 删除记录
export function fetchDeleteMessage(id) {
  return http.delete(`/msg_log/delete1/${id}`)
}

// 一键清空
export function fetchDeleteAll(type) {
  return http.delete(`/msg_log/delete_all/${type}`)
}
