import http from '@/utils/https.js'

// 分页查询考试
export function fetchExamAll(data) {
  return http.post(`/exam/get-exam-all`, data)
}

// 考试试卷删除
export function fetchDeleteExam(id) {
  return http.delete(`/exam/delete/${id}`)
}

// 考试试卷批量删除
export function fetchDeleteBatchExam(data) {
  return http.delete(`/exam/delete-ids`, data)
}
// 考试发布
export function fetchPublishExam(id) {
  return http.post(`/exam/update-exam-publish/${id}`)
}

// 查询考试详情---关于该考试创建信息
export function fetchExamDetail(id) {
  return http.get(`/exam/get-exam/${id}`)
}

// 新增考试
export function fetchAddExam(data) {
  return http.post(`/exam/create-exam`, data)
}

// 更新考试
export function fetchUpdateExam(data) {
  return http.put('/exam/update', data)
}
//首页考试详细信息--包含题目列表
export function fetchExamInfo(id) {
  return http.get(`/exam/get-examinfo/${id}`)
}
//首页考试列表查询
export function fetchExamList(data) {
  return http.post(`exam/get-exam-index`, data)
}

// 考试提交
export function fetchSubmitExam(data) {
  return http.post('/exam/examing', data)
}

// 查询我的考试
export function fetchMyExam(id, data) {
  return http.get(`/exam/get-answered-exam/${id}`, data)
}
