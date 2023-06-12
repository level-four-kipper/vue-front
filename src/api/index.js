import http from '@/utils/https.js'

export function fetchQueationBank(params) {
  return http.post(`/questionbanks/page`, params)
}
export function fetchQueationBankMeun(params) {
  return http.get(`/area/list`)
}
export function fetchExamBoutique() {
  return http.get(`/exam/select-exam-boutique`)
}

// 大首页-全局搜索
export function fetchSearchGlob(params) {
  return http.post(`/global/search`, params)
}
// 大首页-全局搜索热搜词
export function fetchSearchKey() {
  return http.get(`/content/select/hot_key`)
}
// 大首页-全局搜索热搜内容
export function fetchSearchContent() {
  return http.get(`/content/select/hot_content`)
}

// 大首页-全局搜索历史记录
export function fetchSearchHistory() {
  return http.get(`/content/select/history_data`)
}
// 大首页-全局搜索新增热搜内容
export function fetchSearchContentAdd(data) {
  return http.post(`/content/add/content`, data)
}
// 大首页-全局搜索新增热搜词汇
export function fetchSearchKeyAdd(data) {
  return http.post(`/content/add/keyword`, data)
}
// 大首页-全局搜索新增搜索记录
export function fetchSearchRecordAdd(data) {
  return http.post(`/content/add/history_data`, data)
}

// 大首页-题库模块-查询题库
export function getHotQuestionBank() {
  return http.get(`/blog-type/hot-questionbank`)
}
