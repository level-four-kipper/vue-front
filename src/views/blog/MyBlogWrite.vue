<!--  -->
<template>
  <div class="manage-article">
    <!-- 我的收获 -->
    <div class="body">
      <header>
        <div class="harvest">
          <p>我的收获</p>
          <div class="harvest-count">
            <div>
              <img src="~@/assets/img/authorPhoto/icon/新点赞.png" />
              <span>{{myPraise}}</span>
            </div>
            <div>
              <img src="~@/assets/img/authorPhoto/icon/新评论.png" />
              <span>{{myComment}}</span>
            </div>
            <div>
              <img src="~@/assets/img/authorPhoto/icon/新收藏.png" />
              <span>{{myCollect}}</span>
            </div>
          </div>
        </div>
        <div class="write-blog" @click="jumpWriteBlog">写博客</div>
      </header>
      <div class="main">
        <!-- 已发布/草稿箱 -->
        <div class="main-select">
          <div
            :class="['select-published',publishedSelected?'selected':'unselect']"
            @click="choosePublishList"
          >已发布</div>
          <div
            :class="['select-drafts',publishedSelected?'unselect':'selected']"
            @click="chooseDraftsList"
          >草稿箱</div>
        </div>
        <div class="main-list">
          <div v-show="publishedSelected" class="main-list-select">
            <div class="list-select-condition">
              <el-input
                v-model="searchContent"
                class="w-50 m-2"
                placeholder="请输入查询内容"
                :prefix-icon="Search"
                @keyup.enter="searchList"
              />
              <div class="list-select-button">
                <el-select v-model="sortValue" class="m-2" @change="chooseSortRule">
                  <el-option label="发布时间" value="gmt_created" />
                  <el-option label="点赞数量" value="like_count" />
                  <el-option label="评论数量" value="comment_count" />
                  <el-option label="收藏数量" value="star_count" />
                </el-select>
                <span :class="[sort?'changeSort':'']" @click="upAndDown"></span>
              </div>
            </div>
            <div class="main-list-content">
              <div v-for="item in blogList.content" :key="item.id" class="list-content-item">
                <p class="item-title" @click="jumpBlogContent(item.id)">{{item.title}}</p>
                <div class="item-count">
                  <p>
                    <img src="~@/assets/img/authorPhoto/icon/点赞备份.png" />
                    <span>{{item.like_count}}</span>
                  </p>
                  <p>
                    <img src="~@/assets/img/authorPhoto/icon/评论备份.png" />
                    <span>{{item.comment_count}}</span>
                  </p>
                  <p>
                    <img src="~@/assets/img/authorPhoto/icon/收藏备份.png" />
                    <span>{{item.star_count}}</span>
                  </p>
                </div>
                <div class="item-operation">
                  <p class="item-time">发布于 {{item.create_day}}</p>
                  <p>
                    <span @click="updateBlog(item.id)">编辑</span>
                    <span v-show="item.is_secret==1" @click="hideBlog(item.id,item.is_secret)">取消隐藏</span>
                    <span v-show="item.is_secret==0" @click="hideBlog(item.id,item.is_secret)">隐藏</span>
                    <span @click="deleteBlog(item.id)">删除</span>
                  </p>
                </div>
              </div>
            </div>
            <div class="list-content-page">
              <span>共{{blogList.totalNum}}条</span>
              <select id="pages" v-model="selectNumValue" name="pages" @change="getBlogDate()">
                <option :value="10" selected>10项/页</option>
                <option :value="20">20项/页</option>
                <option :value="50">50项/页</option>
                <option :value="100">100项/页</option>
              </select>
              <div class="change-page">
                <span class="change-page-btn" @click="pageReduce(0)">
                  <el-icon>
                    <Back />
                  </el-icon>
                </span>
                <span class="page-num">{{blogList.currentPage}}</span>
                <span class="change-page-btn" @click="pageAdd(0)">
                  <el-icon>
                    <Right />
                  </el-icon>
                </span>
              </div>
            </div>
          </div>
          <div v-show="!publishedSelected" class="main-list-drafts">
            <div class="main-list-content">
              <div v-for="item in draftsList.content" :key="item.id" class="list-content-item">
                <p class="item-title" @click="updateBlog(item.id)">{{item.title}}</p>
                <div class="item-operation">
                  <p class="item-time">编辑于 {{item.create_day}}</p>
                  <p>
                    <span @click="updateBlog(item.id)">编辑</span>
                    <span @click="deleteDraftBlog(item.id)">删除</span>
                  </p>
                </div>
              </div>
            </div>
            <div class="list-content-page">
              <span>共{{draftsList.totalNum}}条</span>
              <select id="pages" v-model="draftsNumValue" name="pages">
                <option value="10" selected>10项/页</option>
                <option value="20">20项/页</option>
                <option value="50">50项/页</option>
                <option value="100">100项/页</option>
              </select>
              <div class="change-page">
                <span class="change-page-btn" @click="pageReduce(1)">
                  <el-icon>
                    <Back />
                  </el-icon>
                </span>
                <span class="page-num">{{draftsList.currentPage}}</span>
                <span class="change-page-btn" @click="pageAdd(1)">
                  <el-icon>
                    <Right />
                  </el-icon>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Search } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import { ref } from 'vue'
import http from '@/utils/https.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import { reactive, onMounted } from 'vue'
const router = useRouter()
const route = useRoute()
// 渲染切换
const publishedSelected = ref(true)
const sort = ref(0)
// 数据
const myPraise = ref(0)
const myComment = ref(0)
const myCollect = ref(0)
const searchContent = ref('')
const sortValue = ref('gmt_created')
const selectNumValue = ref(10)
const draftsNumValue = ref('10')
const blogList = reactive({ content: [], totalNum: 0, currentPage: 1, totalPage: 1 })
const draftsList = reactive({ content: [], totalNum: 0, currentPage: 1, totalPage: 1 })
const jumpWriteBlog = function () {
  // router.push('/writeBlog')
  router.push('/publishBlog')
  console.log(route)
}
const jumpBlogContent = function (id) {
  router.push('/blogDetail/' + id)
}
// 请求接口函数
const getBlogDate = (keyword = '', curr_page = 1, order = 'desc', sidx) => {
  http
    .post('/blog-article/creation-list', {
      entity: {
        status: publishedSelected.value ? 1 : 0,
        keyword
      },
      order,
      curr_page,
      page_size: selectNumValue.value,
      sidx
    })
    .then(res => {
      if (publishedSelected.value) {
        blogList.content = res.data.list
        blogList.totalNum = res.data.total_count
        blogList.currentPage = res.data.curr_page
        blogList.totalPage = res.data.total_page
      } else {
        draftsList.content = res.data.list
        draftsList.totalNum = res.data.total_count
        draftsList.currentPage = res.data.curr_page
        draftsList.totalPage = res.data.total_page
      }
    })
    .catch(err => console.log(err))
}

const searchList = function () {
  getBlogDate(searchContent.value)
}
const choosePublishList = function () {
  publishedSelected.value = true
  getBlogDate()
}
const chooseDraftsList = function () {
  publishedSelected.value = false
  getBlogDate()
}
const deleteBlog = function (id) {
  ElMessageBox.confirm('确定要删除该博客吗？', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      http
        .delete('/blog-article/delete/' + id)
        .then(res => {
          if (res.code == 0) {
            ElMessage({
              showClose: true,
              message: '删除成功',
              type: 'success'
            })
            // blogList.content.splice(blogList.content.findIndex(function(el){return el.id===id}),1)
            // blogList.totalNum--
            getBlogDate()
          } else {
            ElMessage({
              showClose: true,
              message: '操作失败',
              type: 'error'
            })
          }
        })
        .catch(err => {
          ElMessage({
            showClose: true,
            message: '接口调用失败 ' + err,
            type: 'error'
          })
        })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除'
      })
    })
}
const deleteDraftBlog = function (id) {
  ElMessageBox.confirm('确定要删除该博客吗？', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      http
        .delete('/blog-article/delete/' + id)
        .then(res => {
          if (res.code == 0) {
            ElMessage({
              showClose: true,
              message: '删除成功',
              type: 'success'
            })
            getBlogDate()
          } else {
            ElMessage({
              showClose: true,
              message: '操作失败',
              type: 'error'
            })
          }
        })
        .catch(err => {
          ElMessage({
            showClose: true,
            message: '接口调用失败 ' + err,
            type: 'error'
          })
        })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除'
      })
    })
}
const upAndDown = function () {
  sort.value = sort.value ? 0 : 1
  getBlogDate('', blogList.currentPage, sort.value ? 'asc' : 'desc', sortValue.value)
}
const hideBlog = function (id, is_secret) {
  if (!is_secret) {
    http
      .put('/blog-article/update', {
        id: id,
        is_secret: 1
      })
      .then(res => {
        if (res.code == 0) {
          ElMessage({
            showClose: true,
            message: '隐藏成功',
            type: 'success'
          })
          // blogList.content.map(el=>{
          //     if(el.id==id){
          //         el.is_secret=1
          //         return
          //     }
          // })
          getBlogDate()
        } else {
          ElMessage({
            showClose: true,
            message: '操作失败',
            type: 'error'
          })
        }
      })
      .catch(err => console.log(err))
  } else {
    http
      .put('/blog-article/update', {
        id: id,
        is_secret: 0
      })
      .then(res => {
        if (res.code == 0) {
          ElMessage({
            showClose: true,
            message: '取消隐藏成功',
            type: 'success'
          })
          // blogList.content.map(el=>{
          //     if(el.id==id){
          //         el.is_secret=0
          //         return
          //     }
          // })
          getBlogDate()
        } else {
          ElMessage({
            showClose: true,
            message: '操作失败',
            type: 'error'
          })
        }
      })
      .catch(err => console.log(err))
  }
}
const chooseSortRule = () => {
  getBlogDate('', blogList.currentPage, sort.value ? 'asc' : 'desc', sortValue.value)
}
const updateBlog = id => {
  router.push({
    path: '/publishBlog',
    query: {
      id
    }
  })
}
const pageReduce = function (num) {
  if (num && draftsList.currentPage > 1) {
    draftsList.currentPage--
    getBlogDate('', draftsList.currentPage, sort.value ? 'asc' : 'desc', sortValue.value)
  } else if (blogList.currentPage > 1) {
    blogList.currentPage--
    getBlogDate('', blogList.currentPage, sort.value ? 'asc' : 'desc', sortValue.value)
  }
}
const pageAdd = function (num) {
  if (num && draftsList.totalPage > draftsList.currentPage) {
    draftsList.currentPage++
    getBlogDate('', draftsList.currentPage, sort.value ? 'asc' : 'desc', sortValue.value)
  } else if (blogList.totalPage > blogList.currentPage) {
    blogList.currentPage++
    getBlogDate('', blogList.currentPage, sort.value ? 'asc' : 'desc', sortValue.value)
  }
}

onMounted(() => {
  console.log('================================', route.params.type)
  if (route.params.type) {
    choosePublishList()
  } else {
    chooseDraftsList()
  }

  http.post('/blog-article/station-gather', 1).then(res => {
    myPraise.value = res.data.like_count
    myComment.value = res.data.comment_count
    myCollect.value = res.data.star_count
  })
})
</script>

<style lang="scss" scoped>
.manage-article {
  background-color: #eef3fd;
  height: 100%;
  min-width: 1200px;
  .body {
    min-height: 100%;
    min-width: 1170px;
    width: 1170px;
    margin: 0 auto;
    box-sizing: border-box;
    overflow: auto;
    // padding: 0 238px;
    display: flex;
    flex-direction: column;
  }
  header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 40px 0 20px;
    .harvest {
      > p {
        width: 120px;
        height: 40px;
        line-height: 40px;
        padding-left: 20px;
        background-color: #0175ff;
        color: #fff;
        font-size: 14px;
        font-weight: 700;
        position: relative;
        margin-bottom: 15px;
        &::after {
          content: '';
          position: absolute;
          right: 0;
          top: 0;
          border: 20px solid rgba(242, 242, 242, 1);
          border-left-color: transparent;
          border-bottom-color: transparent;
        }
      }
      .harvest-count {
        display: flex;
        flex-direction: row;
        > div {
          width: 230px;
          height: 80px;
          margin-right: 70px;
          background-color: white;
          display: flex;
          flex-direction: row;
          align-items: center;
          font-size: 24px;
          font-weight: 700;
          color: rgb(51, 51, 51);
          img {
            display: flex;
            margin: 0 35px;
          }
        }
      }
    }
    .write-blog {
      width: 170px;
      height: 135px;
      background-color: white;
      line-height: 135px;
      text-align: center;
      font-weight: 700;
      user-select: none;
      cursor: pointer;
      border-radius: 32px;
      border-color: #0175ff;
      border-width: 1px;
      border-style: solid;
      color: #0175ff;
    }
  }
  .main {
    min-width: 860px;
    padding-top: 10px;
    padding-bottom: 10px;
    .main-select {
      display: flex;
      flex-direction: row;
      margin-bottom: 20px;
      .select-published {
        width: 80px;
        height: 40px;
        line-height: 40px;
        padding-left: 20px;
        color: #fff;
        font-size: 14px;
        font-weight: 700;
        position: relative;
        margin-right: 43px;
        user-select: none;
        cursor: pointer;
        &::after {
          content: '';
          position: absolute;
          right: -40px;
          top: 0;
          border: 20px solid #363636;
          border-top-color: transparent !important;
          border-right-color: transparent !important;
        }
      }
      .select-drafts {
        width: 80px;
        height: 40px;
        line-height: 40px;
        padding-left: 20px;
        background-color: #ccc;
        color: #fff;
        font-size: 14px;
        font-weight: 700;
        position: relative;
        user-select: none;
        cursor: pointer;
        &::after {
          content: '';
          position: absolute;
          left: -40px;
          top: 0;
          border: 20px solid #ccc;
          border-bottom-color: transparent !important;
          border-left-color: transparent !important;
        }
      }
      .selected {
        font-weight: 700;
        background-color: #0175ff;
        &::after {
          border-color: #0175ff;
        }
      }
      .unselect {
        font-weight: normal;
        background-color: #ccc;
        &::after {
          border-color: #ccc;
        }
      }
    }
    .main-list {
      display: flex;
      flex-direction: column;
      .main-list-select {
        display: flex;
        flex-direction: column;
        .list-select-condition {
          height: 32px;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          margin-bottom: 12px;
          .el-input {
            width: 350px;
          }
          .list-select-button {
            display: flex;
            .el-select {
              width: 100px;
              margin-right: 14px;
            }
            span {
              height: 32px;
              width: 32px;
              background-color: white;
              border: 1px solid #e4e7ed;
              position: relative;
              cursor: pointer;
              &::before {
                content: '';
                position: absolute;
                top: 2px;
                left: 9px;
                border: 6px solid transparent;
                border-bottom-color: #999;
              }
              &::after {
                content: '';
                position: absolute;
                bottom: 2px;
                left: 9px;
                border: 6px solid transparent;
                border-top-color: #409eff;
              }
            }
            .changeSort {
              &::before {
                border-bottom-color: #409eff;
              }
              &::after {
                border-top-color: #999;
              }
            }
          }
        }
      }
      .main-list-drafts {
        display: flex;
        flex-direction: column;
      }
      .main-list-content {
        // height: 501px;
        min-width: 860px;
        border-top: 1px solid #ddd;
      }
      .list-content-item {
        height: 50px;
        padding-left: 20px;
        font-size: 13px;
        color: #333;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        background-color: white;
        border: 1px solid #ddd;
        border-top: 0 solid #ddd;
        .item-title {
          min-width: 180px;
          width: 250px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          cursor: pointer;
          font-size: 16px;
          font-weight: 500;
        }
        .item-count {
          width: 150px;
          min-width: 150px;
          margin-left: 120px;
          margin-right: 100px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          p {
            min-width: 40px;
            width: 40px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 15px;
            color: #666;
            img {
              width: 16px;
              height: 16px;
            }
            span {
              font-size: 14px;
              color: #333;
            }
          }
        }
        .item-operation {
          // min-width: 270px;
          width: 370px;
          display: flex;
          justify-content: space-between;
          span {
            justify-self: end;
            margin-right: 10px;
            color: dodgerblue;
            user-select: none;
            cursor: pointer;
          }
        }
      }
      .list-content-page {
        margin-top: 25px;
        display: flex;
        font-size: 13px;
        align-self: flex-end;
        > span {
          padding: 5px 8px;
          background-color: transparent;
          border: 1px solid rgb(198, 198, 198);
          background-color: white;
          border-right-color: transparent;
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
:deep(.w-50 .is-focus) {
  border: 1px solid #409eff;
  box-shadow: 3px 3px 3px #409eff;
}
:deep(.el-select .el-input.is-focus .el-input__wrapper) {
  box-shadow: 0 0 0 1px #c0c4cc !important;
}
:deep(.el-select .el-input .el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #c0c4cc !important;
}
:deep(.el-select .m-2) {
  width: 100px !important;
}
</style>
