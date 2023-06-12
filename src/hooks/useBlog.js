import { fetchBlogLikeAdd, fetchBlogCollectAdd, fetchBlogDetail, fetchBlogCommentAdd } from '@/api/blog.js'

export default function useBlog() {
  /**
   * @description: 点赞
   * @param {*} id 文章/评论id
   * @param {*} type 类型 0:博客;1:问题;2:博客评论；3:问题回复
   * @return {*}
   */
  const handleLike = (id, type = 0) => {
    return new Promise((resolve, reject) => {
      fetchBlogLikeAdd({
        article_id: id,
        article_type: type
      }).then(res => {
        if (res.code !== 0) {
          reject()
        }
        resolve()
      })
    })
  }

  /**
   * @description: 收藏
   * @param {*} id 文章/评论id
   * @param {*} type 类型 0:博客;1:问题;2:博客评论；3:问题回复
   * @return {*}
   */
  const handleCollect = (id, type = 0) => {
    return new Promise((resolve, reject) => {
      fetchBlogCollectAdd({
        article_id: id,
        article_type: type
      }).then(res => {
        if (res.code !== 0) {
          reject()
        }
        resolve()
      })
    })
  }

  // 博客详情
  const getBlogDetail = id => {
    return new Promise((resolve, reject) => {
      fetchBlogDetail(id).then(res => {
        if (res.code !== 0) {
          reject(res.msg)
        }
        resolve(res.data)
      })
    })
  }

  /**
   * @description: 新增评论信息
   * @param {*} blog_id 博客id
   * @param {*} content 内容
   * @param {*} parent_id 父ID
   * @param {*} parent_user_id 父用户ID
   * @param {*} article_type 类型,0:博客;1:问题;2:博客评论；3:问题回复
   * @return {*}
   */
  const handleReply = (blog_id, content, parent_id = -1, parent_user_id = -1, article_type = 2) => {
    return new Promise(resolve => {
      fetchBlogCommentAdd({
        article_type,
        blog_id,
        content,
        parent_id,
        parent_user_id
      }).then(res => {
        resolve(res)
      })
    })
  }

  return {
    handleLike,
    handleCollect,
    getBlogDetail,
    handleReply
  }
}
