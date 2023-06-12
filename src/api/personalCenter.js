// 个人空间
import http from '../utils/request.js'

// 创作列表展示-博客
export function fetchBlogList(data) {
  // return http.post(`/blog-article/creation-list`, data)
  return http.post(`/blog-article/tourist_view_list`, data)
}
// 创作列表展示-提问
export function fetchQuizList(params) {
  return http.post(`/quiz/page-list`, params)
}

// 创作列表展示-回答
export function fetchQuizAnswer(params) {
  return http.post(`/space/space_answer_list_person`, params)
}

// 收藏列表展示-博客
export function fetchCollectBlogList(data) {
  return http.post(`/collect-info/blog_list`, data)
}

// 收藏列表展示-提问
export function fetchCollectQuiz(data) {
  return http.post(`/collect-info/quiz_list`, data)
}

// 收藏列表展示-回答
export function fetchCollectQuizAnswer(params) {
  return http.post(`/collect-info/answer_list`, params)
}

// 删除博客
export function fetchDeleteBlog(id) {
  return http.delete(`/blog-article/delete/${id}`)
}

// 删除回答
export function deleteAnswer(id) {
  return http.delete(`/space/space_delete_answer/${id}`)
}
// 删除题库
export function fetchDeleteQsBank(id) {
  return http.delete(`/questionbanks/${id}`)
}

// 回答详情
export function fetchAnswerDetail(id) {
  return http.get(`/question-answer-info/detail_both/${id}`)
}

// 关注-关注列表
export function fetchConcernList(params) {
  return http.post(`/follower/detail/followings`, params)
}
// 关注-取消关注
export function fetchUpdateFollower(params) {
  return http.post(`/follower/follow`, params)
}

// 粉丝-粉丝列表
export function fetchFansList(params) {
  return http.post(`/follower/detail/followers`, params)
}

// 粉丝-获取粉丝图表数据
export function fetchFansChart() {
  return http.get(`/follower/statistics`)
}

// 用户粉丝和关注数量
export function fetchFollowerNumber(id) {
  return http.get(`/follower/number/${id}`)
}
