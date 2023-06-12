import http from '../utils/request.js'

// 获取全部试卷
export function fetchPaperAll(data) {
  return http.post(`/test-paper/page-list`, data)
}

// 查询由我创建试卷
export function fetchMyPaper(data) {
  return http.post(`/test-paper/me`, data)
}

//查询由我审核试卷
// export function fetchMyCheckPaper(id, data) {
//   return http.get(`/test-paper/me/${id}`, data)
// }

// 试卷修改
export function fetchUpdatePaper(data) {
  return http.put(`/test-paper/update`, data)
}

// 试卷删除
export function fetchDeletePaper(id, data) {
  return http.delete(`/test-paper/delete/${id}`, data)
}

// 查询试卷详情
export function fetchPaperDetail(data) {
  return http.post(`/test-paper/question-list`, data)
}

// 创建试卷
export function fetchAddPaper(data) {
  return http.post('/test-paper/create', data)
}

//查询题库信息
export function fetchQsBank(data) {
  return http.post('/questionbanks/page', data)
}

//根据题库id查询试题信息
export function fetchTest(data) {
  return http.post('/questions/page', data)
}

//根据试题id查询试题信息
export function fetchTestList(data) {
  return http.post('/questions/list', data)
}

// 试卷提交
export function fetchSubmitPaper(data) {
  return http.post('/test-paper/create', data)
}
