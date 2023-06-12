import http from '@/utils/https.js'

export function fetchPageListManage(params) {
  return http.post(`/user-manage/page-list-manage`, params)
}
export function fetchPageListAuait(params) {
  return http.post(`/user-manage/page-list-audit`, params)
}
export function fetchDeleteManage(params) {
  return http.delete(`/user-manage/${params}`)
}
export function fetchAuditInformation(params){
  return http.get(`/user-manage/detail/${params}`)
}
//审核是否通过
export function fetchAudit(params){
  return http.put(`/user-manage/audit`,params)
}