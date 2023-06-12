import http from '../utils/https.js'

/**
 * 题库
 */
// 分页查询题库
export function fetchQuestionBank(data) {
  return http.post(`/questionbanks/page`, data)
}
// 根据题库id查询
export function fetchQuestionBankId(id, data) {
  return http.get(`/questionbanks/${id}`, data)
}
// 查询题库成员列表
export function fetchQsBankUserList(data) {
  return http.post(`/questionbanks/user/page`, data)
}
// 添加题库用户
export function fetchAddQuestionBankUser(data) {
  return http.post(`/questionbanks/user`, data)
}
// 更新题库用户
export function fetchUpdateQuestionBankUser(data) {
  return http.put(`/questionbanks/user`, data)
}
// 删除题库用户
export function fetchDeleteQuestionBankUser(id) {
  return http.delete(`/questionbanks/user/${id}`)
}
// 新增题库
export function fetchAddQuestionBank(data) {
  return http.post(`/questionbanks`, data)
}
// 题库删除
export function fetchDeleteQuestionBank(id) {
  return http.delete(`/questionbanks/${id}`)
}
// 更新题库
export function fetchUpdateQuestionBank(data) {
  return http.put(`/questionbanks`, data)
}
//获取题库领域
export function fetchAreaList() {
  return http.get(`/area/list`)
}

/**
 * 试题
 */
// 分页查询
export function fetchQuestion(data) {
  return http.post(`/questions/page`, data)
}
// 新增
export function fetchAddQuestion(data) {
  return http.post(`/questions`, data)
}
// 更新
export function fetchUpdateQuestion(data) {
  return http.put(`/questions`, data)
}
// 根据试题id查询单个试题
export function fetchQuestionId(id, data) {
  return http.get(`/questions/${id}`, data)
}
// 试题删除
export function fetchDeleteQuestion(id) {
  return http.delete(`/questions/${id}`)
}

// 查询我的试题
export function fetchQuestionMy(data) {
  return http.post(`/questions/page/my`, data)
}
// 查询用户可以出题的题库(目标题库)
export function fetchQuestionBankSet(data) {
  return http.get(`/questionbanks/set-question`, data)
}
// 获取图片
export function fetchPicture(data) {
  return http.post(`/file/testBytes`, data)
}

/**
 * 审核
 */
// 查询我的审核
export function fetchQuestionReview(data) {
  return http.post(`/questions/page/review`, data)
}
