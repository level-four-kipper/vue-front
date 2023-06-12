import http from '@/utils/https.js'

// 添加题库
export function fetchAddQuestionbank(params) {
  return http.post(`/questionbanks`, params)
}

// 编辑题库
export function fetchEditQuestionbank(params) {
  return http.put(`/questionbanks`, params)
}

// 提交题库
export function fetchUpdateQuestionbank(params) {
  return http.post(`/questionbanks/commit`, params)
}

// 发布题库
export function fetchPublishQuestionbank(bankId) {
  return http.put(`/questionbanks/publish?bankId=${bankId}`)
}

// 根据id查询题库
export function fetchGetQuestionbank(id) {
  return http.get(`/questionbanks/${id}`)
}

// 查询用户可以出题的题库
export function fetchMyQuestionbank(type) {
  return http.get(`/questionbanks/bank_list/${type}`)
}

// 通过邮箱查询人员信息
export function fetchMemberInfo(emailString) {
  return http.get(`questionbanks/member/info?emailString=${emailString}`)
}

// 搜索题库管理人员
export function fetchManagerMember(params) {
  return http.post(`/questionbanks/member`, params)
}

// 添加题库管理人员
export function fetchAddManagerMember(params) {
  return http.post(`/questionbanks/member`, params)
}

// 移除题库管理人员
export function fetchDeleteManagerMember(params) {
  return http.delete(`/questionbanks/member`, params)
}

// 查询领域
export function fetchTypeList() {
  return http.get(`/blog-type/type-list`)
}

// 查询编辑页面题目列表
export function fetchQuestionList(params) {
  return http.post(`/questions/list_edit`, params)
}

// 查询审核页面题目列表
export function fetchAuditQuestions(params) {
  return http.post(`/questions/list_audit`, params)
}

// 提交审核信息
export function fetchAuditCommit(params) {
  return http.post(`/questions/audit/commit`, params)
}

// 查询题目审核进度
export function fetchAuditQuery(params) {
  return http.post(`/questions/audit/query`, params)
}

// 删除题目
export function fetchDeleteQuestion(id, params) {
  return http.delete(`/questions/${id}`, params)
}

// 查询单个试题
export function fetchQuestion(id) {
  return http.get(`/questions/${id}`)
}

/*
 * 题库详情
 */

// 题库详情 - 题库详情
export function fetchQuestionBanks(id) {
  return http.get(`/questionbanks/${id}`)
}

// 题库详情 - 题目列表
export function fetchQuestions(params) {
  return http.post(`/questions/page`, params)
}

// 查询贡献人榜单
export function fetchHotUsers(id) {
  return http.get(`/questionbanks/hot/users/${id}`)
}

// 查询题库下的最热试题
export function fetchHotQuestions(id) {
  return http.get(`/questionbanks/hot-questions`, { bankId: id })
}

// 刷题模式 - 是否有未完成的刷题进度
export function getNotFinishedExercise(id) {
  return http.get(`/exercise/not_finished/${id}`)
}

// 刷题模式 - 开始刷题
export function getExerciseStart(id) {
  return http.get(`/exercise/start/${id}`)
}

// 题库详情 - 继续未完成的刷题进度
export function getExerciseContinue(id) {
  return http.get(`/exercise/continue/${id}`)
}

// 题库详情 - 确认答案
export function postExerciseConfirm(params) {
  return http.post(`/exercise/confirm`, params)
}

// 题库详情 - 获取下一题信息
export function getExerciseNext(id) {
  return http.get(`/exercise/next/${id}`)
}

// 题库详情 - 退出刷题模式
export function postExerciseExit(params) {
  return http.post(`/exercise/exit`, params)
}

/*
/**
 * 题库看板
 */
// 总题数、上月、昨日新增题数
export function fetchBoardCount(bankId) {
  return http.get(`/questionbanks/board/count/${bankId}`)
}

// 题数趋势
export function fetchBoardCountTrend(bankId, timeUnit) {
  return http.get(`/questionbanks/board/count_trend/${bankId}/${timeUnit}`)
}

// 互动趋势
export function fetchBoardInteractTrend(bankId, timeUnit) {
  return http.get(`/questionbanks/board/interact_trend/${bankId}/${timeUnit}`)
}

/**
 * 题目
 */
export function fetchQsCollect(params) {
  return http.post(`/questions/favorites`, params)
}
export function fetchQsCollectUpdate(id) {
  return http.delete(`/questions/favorites/${id}`)
}
