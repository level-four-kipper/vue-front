import http from '@/utils/https.js'

export function getTags(params) {
  return http.get(`/blog-tag/tag-list`, params)
}

export function getTypes(params) {
  return http.get(`/blog-type/type-list`, params)
}

export function fetchAddQuestion(params) {
  return http.post(`/survey/add`, params)
}

// 博客详情
export function fetchBlogDetails(id) {
  return http.get(`/blog-article/article-details/${id}`)
}

// 保存博客（保存草稿、发布、编辑）
export function fetchBlogSave(params) {
  return http.post(`/blog-article/save`, params)
}

// 发布博客
export function fetchBlogPublish(params) {
  return http.post(`/blog-article/publish`, params)
}


/*
* 创作空间 - 列表
*/

// 创作空间-博客列表  /space/space_quiz_list/{issue}
export function fetchBlogList(params) {
  return http.post(`/blog-article/creation-list`, params)
}

// 创作空间-删除博客  /space/space_delete_quiz/{id}
export function deleteBlog(id) {
  return http.delete(`/space/space_delete_quiz/${id}`)
}


// 创作空间-提问列表  /space/space_quiz_list/{issue}
export function fetchQuizList(params) {
  return http.post(`/space/space_quiz_list_person`, params)
}

// 创作空间-删除问题  /space/space_delete_quiz/{id}
export function deleteQuiz(id) {
  return http.delete(`/space/space_delete_quiz/${id}`)
}

// 创作空间-回答列表  /space/space_answer_list/{issue}
export function fetchAnswerList(params) {
  return http.post(`/space/space_answer_list_person`, params)
}

// 创作空间-删除回答  /space/space_delete_answer/{id}
export function deleteAnswer(id) {
  return http.delete(`/space/space_delete_answer/${id}`)
}

// 创作空间-看板-各种数据的总数量  /space/space_board_count
export function fetchBoardCount() {
  return http.post(`/space/space_board_count`)
}

// 创作空间-看板-查询过去12个月每月数量  /space/space_board_que
export function fetchBoardQue() {
  return http.post(`/space/space_board_que`)
}


// 创作空间-题库 /space/space_board_que
export function fetchQuestionBanks(params) {
  return http.post(`/questionbanks/page`, params)
}

// 创作空间-删除题库  /space/space_delete_quiz/{id}
export function deleteQuestionBanks(id) {
  return http.delete(`/questionbanks/${id}`)
}

























