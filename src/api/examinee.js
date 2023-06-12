import http from '@/utils/https.js'

//查询分组
export function fetchGroup() {
  return http.get(`/entrant/page`)
}

//查询分组列表
export function fetchGroupList(data) {
  return http.post(`/entrant/page-list`, data)
}

//查询有用户分组菜单
export function fetchGroupMenu() {
  return http.get(`/entrant/group`)
}
//查询下拉分组数据
export function fetchGroupData() {
  return http.get(`/entrant/list`)
}
//编辑分组
export function fetchUpdateGroup(data) {
  return http.put(`/entrant/update`, data)
}

//删除分组
export function fetchDeleteGroup(id) {
  return http.delete(`/entrant/delete/group?id=${id}`)
}

//创建分组
export function fetchCreateGroup(data) {
  return http.post(`/entrant/create`, data)
}

//查询分组考生
export function fetchExaminee(data) {
  return http.post(`/entrant/user`, data)
}

//删除分组考生
export function fetchDeleteExaminee(data) {
  return http.delete(`/entrant/delete/user`, data)
}

//添加分组考生
export function fetchCreateExaminee(id, data) {
  return http.post(`/entrant/users/${id}`, data)
}
