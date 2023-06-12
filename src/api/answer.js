import http from '@/utils/https.js'

// 获取工作台-我的提问列表
export function fetchMyAnswerList(params) {
  return http.post(`/quiz/workStation/detail`, params)
}

// 获取点赞/被评论/被收藏总数
export function fetchTotal(params) {
  return http.get(`/quiz/workStation/total`, params)
}

// 获取工作台-我的提问-删除
export function fetchDeleteMyAsk(id) {
  return http.delete(`/quiz/delete/${id}`)
}

// 获取工作台-编辑隐藏功能
export function fetchUpdateMyAsk(params) {
  return http.put(`/quiz/update`, params)
}

// 获取工作台-问答管理-我的提问
export function fetchInputQuestion(params) {
  return http.post(`/quiz/create`, params)
}

// 获取问答主页的展示
export function fetchAnswerIndex(params) {
  return http.post(`/quiz/detail`, params)
}

// 获取编辑回显
export function fetchEdit(id) {
  return http.get(`/quiz/get/feedback/${id}`)
}

// 获取问答首页展示
export function fetchAnswerList(params) {
  return http.post(`/quiz/page-list`, params)
}

// 热门问题列表首页
export function fetchQuestionHotList() {
  return http.get(`/quiz/hot/question`)
}
// 热门回答列表首页
export function fetchAnswerHotList() {
  return http.get(`/quiz/hot/answer`)
}
// 问答评论-新增回答
export function addAnswer(params) {
  return http.post(`/question-answer-info/add`, params)
}

// 问答评论-新增回答评论
export function addComment(params) {
  return http.post(`/blog-comment-info/add`, params)
}

// 问答评论-回答展示
export const getQuestionAnswers = param => {
  return http.get(`/question-answer-info/detail/${param.id}/${param.sort_status}`) //return http.post('/question-answer-info/detail/{id}`);
}

// 问答评论-回答评论展示
export const getAnswerComments = id => {
  return http.get(`/blog-comment-info/detail/${id}`) //http.post('/blog-comment-info/detail/${id}`)
}

// 问答-查询用户是否点赞
export const getLikeDetail = article_id => {
  return http.post(`/user-like-info/detail/${article_id}`)
}

// 问答-收藏
export const updateCollect = param => {
  return http.post('/collect-info/add', param)
}

// 问答-点赞
export const updateLike = param => {
  return http.post('/like-info/add', param)
}

// 问答-查询用户是否收藏
export const getCollectDetail = article_id => {
  return http.post(`/user-collect-info/detail/${article_id}`)
}

// 关联问题
export const getRelatedQuestion = param => {
  return http.post('/quiz/correlation/question', param)
}

// 问答-关注人
export const changeFollow = param => {
  return http.post('/follower/follow', param)
}

// 问答-查询是否关注人
export const getFollower = param => {
  return http.post('/follower/number', param)
}

// 保存问题（保存草稿、发布、编辑）
export function fetchQuizSave(params) {
  return http.post(`/quiz/save`, params)
}

//回答信息保存草稿
export function fetchAnswerSave(params) {
  return http.post(`/question-answer-info/draft`, params)
}

// 发布问题
export function fetchQuizPublish(params) {
  return http.post(`/quiz/publish`, params)
}

// 创作空间获取问答详情
export function fetchQuizDetails(id) {
  return http.get(`/quiz/quiz-details/${id}`)
}

// 我的回答
export function fetchQuizAnswer(params) {
  return http.post(`/quiz/list_answer`, params)
}

// 回答内容
export function fetchQuizAnswerDetail(id) {
  return http.get(`/space/detail_both/${id}`)
}
