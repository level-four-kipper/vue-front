<!--  -->
<template>
    <div class="author-index">
        <div class="main">
            <aside>
                <div class="user">
                    <div class="user-info">
                        <div class="user-img">
                            <img src="@/assets/img/blog-content/u1088.png" alt="用户头像" />
                        </div>
                        <div class="user-name">{{authorCount.data.username}}</div>
                    </div>
                    <div class="user-count">
                        <div class="user-count-item">
                            <span class="count-item-num">{{authorCount.data.article_count}}</span>
                            <span class="count-item-text">发布</span>
                        </div>
                        <div class="user-count-item">
                            <span class="count-item-num">{{authorCount.data.comment_count}}</span>
                            <span class="count-item-text">评论</span>
                        </div>
                        <div class="user-count-item">
                            <span class="count-item-num">{{authorCount.data.star_count}}</span>
                            <span class="count-item-text">收藏</span>
                        </div>
                        <div class="user-count-item">
                            <span class="count-item-num">{{authorCount.data.like_count}}</span>
                            <span class="count-item-text">点赞</span>
                        </div>
                    </div>
                </div>
                <div class="selector">
                    <div :class="['select-published',selector==1?'active':'']" @click="changeSelect(1)">已发布</div>
                    <div :class="['select-collect',selector==2?'active':'']" @click="changeSelect(2)">收藏夹</div>
                </div>
            </aside>
            <div class="main-content">
                <div class="main-content-item" v-for="item in blogList.data.list" :key="item.id">
                    <div class="item-title" @click="jumpBlogContent(item.id)">{{item.title}}</div>
                    <div class="item-count">
                        <div class="count-watch">
                            <span class="item-img">
                                <img src="@/assets/img/blog-content/u1099.svg" alt="看过" />
                            </span>
                            <span class="item-text">{{item.browse_count}}</span>
                        </div>
                        <div class="count-praise">
                            <span class="item-img">
                                <img src="@/assets/img/blog-content/u1095.svg" alt="点赞" />
                            </span>
                            <span class="item-text">{{item.like_count}}</span>
                        </div>
                        <div class="count-comment">
                            <span class="item-img">
                                <img src="@/assets/img/blog-content/u1093.svg" alt="评论" />
                            </span>
                            <span class="item-text">{{item.comment_count}}</span>
                        </div>
                        <div class="count-like">
                            <span class="item-img">
                                <img src="@/assets/img/blog-content/u1100.svg" alt="喜欢" />
                            </span>
                            <span class="item-text">{{item.like_count}}</span>
                        </div>
                    </div>
                    <div class="item-time">{{item.gmt_created}}</div>
                </div>
                <div class="list-page">
                    <span>共{{blogList.data.total_count?blogList.data.total_count:0}}条</span>
                    <div class="change-page">
                        <span class="change-page-btn" @click="pageReduce">
                            <el-icon>
                                <Back />
                            </el-icon>
                        </span>
                        <span class="page-num">{{blogList.data.curr_page}}</span>
                        <span class="change-page-btn" @click="pageAdd">
                            <el-icon>
                                <Right />
                            </el-icon>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import http from '@/utils/https.js'
import { useRoute, useRouter } from 'vue-router'
import { onMounted, reactive, ref } from 'vue'
import { fetchMyAnswerList, fetchTotal } from '@/api/answer.js'
// import  { TabsPaneContext } from 'element-plus'
const router = useRouter()
const route = useRoute()
const avtiveName = ref('first')
const handleClick = (tab, event) => {
  console.log(tab, event)
}
let userId = route.params.id
// 1发布 2收藏
const selector = ref(1)
const blogList = reactive({
  data: {}
})
const authorCount = reactive({
  data: {}
})
// 请求列表数据接口函数
const getAuthorData = (type = 1, page) => {
  http
    .post('/blog-article/author-list', {
      entity: {
        creator: userId,
        list_type: type
      },
      curr_page: page
    })
    .then(res => {
      blogList.data = res.data
      console.log(res.data)
    })
    .catch(err => console.log(err))
}
const jumpBlogContent = function (id) {
  router.push('/blogContent/' + id)
}
const changeSelect = function (num) {
  selector.value = num
  getAuthorData(num)
}
const pageAdd = () => {
  if (blogList.data.total_page > blogList.data.curr_page) {
    getAuthorData(selector.value, ++blogList.data.curr_page)
  }
}
const pageReduce = () => {
  if (blogList.data.curr_page > 1) {
    getAuthorData(selector.value, --blogList.data.curr_page)
  }
}
onMounted(() => {
  http.get('/blog-article/author-gather/' + userId).then(res => {
    authorCount.data = res.data
  })
  // http.get('/'+userId).then(res=>{
  //     askCount.data = res.data
  // })
  console.log(router)
  getAuthorData()
})
</script>

<style lang="scss" scoped>
.author-index {
  background-color: rgb(242, 242, 242);
  height: 100%;
  .main {
    width: 1350px;
    margin: 0 auto;
    padding-top: 40px;
    display: flex;
    justify-content: space-between;
    aside {
      width: 380px;
      .user {
        background-color: white;
        margin-bottom: 15px;
        .user-info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 170px;
          border-bottom: 1px solid #ddd;
          .user-img {
            width: 65px;
            height: 65px;
            margin-bottom: 25px;
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
        .user-count {
          height: 90px;
          display: flex;
          justify-content: space-around;
          .user-count-item {
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            align-items: center;
            .count-item-num {
              font-size: 20px;
              font-weight: 700;
              color: #333;
            }
            .count-item-text {
              font-size: 13px;
              color: #333;
            }
          }
        }
      }
      .selector {
        background-color: white;
        height: 120px;
        padding: 10px 30px;
        .select-published,
        .select-collect {
          height: 50px;
          border-bottom: 1px solid #ddd;
          display: flex;
          align-items: center;
          padding-left: 10px;
          font-size: 12px;
          color: #333;
          cursor: pointer;
        }
        .active {
          color: rgb(0, 102, 255);
        }
      }
    }
    .main-content {
      margin-left: 20px;
      width: 920px;
      background-color: white;
      height: 700px;
      padding: 0 20px;
      display: flex;
      flex-direction: column;
      .main-content-item {
        height: 60px;
        border-bottom: 1px solid #ddd;
        display: flex;
        align-items: center;
        padding: 0 30px;
        justify-content: space-between;
        .item-title {
          color: #5e5e5e;
          font-size: 13px;
          font-weight: 700;
          width: 260px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          cursor: pointer;
        }
        .item-count {
          display: flex;
          justify-content: space-between;
          width: 240px;
          .item-img {
            display: inline-block;
            margin-right: 8px;
          }
        }
        .item-time {
          font-size: 14px;
          color: #333;
          user-select: none;
        }
      }
      .list-page {
        margin-top: 25px;
        display: flex;
        font-size: 13px;
        align-self: flex-end;
        > span {
          padding: 5px 8px;
          background-color: transparent;
          border: 1px solid rgb(198, 198, 198);
        }
        > select {
          border-color: rgb(198, 198, 198);
          padding: 5px;
          padding-left: 8px;
          outline: none;
          &:focus {
            border: 1px solid rgb(198, 198, 198);
          }
        }
        .change-page {
          margin-left: 20px;
          width: 92px;
          height: 32px;
          line-height: 32px;
          text-align: center;
          border: 1px solid rgb(198, 198, 198);
          background-color: white;
          display: flex;
          font-size: 15px;
          .change-page-btn {
            cursor: pointer;
          }
          > span {
            width: 30px;
          }
          .page-num {
            border: 1px solid rgb(198, 198, 198);
            border-top-width: 0;
            border-bottom-width: 0;
          }
        }
      }
    }
  }
}
</style>
