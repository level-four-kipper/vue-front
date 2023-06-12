import http from '@/utils/https.js'

// 博客领域
export function fetchTypeList(params) {
  return http.get(`/blog-type/type-list`, params)
}

// 博客列表
export function fetchBlogList(params) {
  return http.post(`/blog-article/list`, params)
}

// 按领域查询推荐博客
export function fetchRecommendedBlogsByDomain(params) {
  return http.post(`/blog-article/recommended_blogs`, params)
}

// 按领域查询最新博客
export function fetchLatestBlogsByDomain(params) {
  return http.post(`/blog-article/latest_blogs`, params)
}

// 按领域查询最热博客
export function fetchHotBlogsByDomain(params) {
  return http.post(`/blog-article/hot_blogs`, params)
}

// 推荐博客
export function fetchRecommendBlog(params) {
  return http.post(`/blog-article/recommend`, params)
}

// 热门博客
export function fetchHotBlog(params) {
  return http.get(`/blog-article/hot`, params)
}

// 点赞
export function fetchBlogLikeAdd(params) {
  return http.post(`/like-info/add`, params)
}

// 收藏
export function fetchBlogCollectAdd(params) {
  return http.post(`/collect-info/add`, params)
}

// 博客详情
export function fetchBlogDetail(id) {
  return http.get(`/blog-article/detail/${id}`)
}

// 新增评论
export function fetchBlogCommentAdd(params) {
  return http.post(`/blog-comment-info/add`, params)
}

// 查询评论信息
export function fetchBlogCommentDetail(id) {
  return http.get(`/blog-comment-info/detail/${id}`)
}

// 关注博主
export function fetchBloggerFollow(params) {
  return http.post(`/follower/follow`, params)
}

// 登录人员是否为博客作者
export function fetchBlogFollowFlag(id) {
  return http.get(`/follower/follow-flag/${id}`)
}

// 获取粉丝数量
export function fetchBlogFollowersNumber(params) {
  return http.post(`/follower/number`, params)
}

// 访客视角博客列表
export function fetchBlogTouristView(params) {
  return http.post(`/blog-article/tourist_view_list`, params)
}
