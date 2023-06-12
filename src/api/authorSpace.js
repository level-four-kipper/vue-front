import http from '@/utils/https.js'

// 关注
export function fetchFollow(params) {
  return http.post(`/follower/follow`, params)
}

// 登录人员是否为博客作者
export function fetchFollowFlag(id) {
  return http.get(`/follower/follow-flag/${id}`)
}

// 获取粉丝数量
export function fetchFollowersNumber(params) {
  return http.post(`/follower/number`, params)
}

// 用户详情
export function fetchUserDetail(id) {
  return http.get(`/user-manage/detail/${id}`)
}

// 查询用户互动信息
export function fetchGatherInfoInteract(id) {
  return http.get(`/gather-info/interact/${id}`)
}

// 查询用户热度信息
export function fetchGatherInfoPopularity(id) {
  return http.get(`/gather-info/popularity/${id}`)
}

// 修改用户详情
export function updateUserInfo(params) {
  return http.put(`/user-manage/update_info`, params)
}

// 修改用户密码
export function updatePassword(params) {
  return http.put(`/user-manage/update_password`, params)
}

// 修改用户密码
export function updatePasswordForget(params) {
  return http.put(`/user-manage/update_password_forget`, params)
}

// 修改邮箱
export function updateEmail(params) {
  return http.put(`/user-manage/update_email`, params)
}

// 校验密码是否正确
export function verityPassword(data) {
  return http.post(`/user-manage/verity`, data)
}
