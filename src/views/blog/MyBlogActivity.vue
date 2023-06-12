<!--  -->
<template>
  <div class="manage-activity">
    <!-- 我的收获 -->
    <div class="body">
      <header>
        <div class="harvest">
          <p>我的活动</p>
          <div class="harvest-count">
            <div @click="changeTab(0)">
              <img src="~@/assets/img/authorPhoto/icon/新点赞.png" />
              <span :class="[tabNum==0?'active-tab':'']">{{praiseCount}}</span>
            </div>
            <div @click="changeTab(1)">
              <img src="~@/assets/img/authorPhoto/icon/新评论.png" />
              <span :class="[tabNum==1?'active-tab':'']">{{commentCount}}</span>
            </div>
            <div @click="changeTab(2)">
              <img src="~@/assets/img/authorPhoto/icon/新收藏.png" />
              <span :class="[tabNum==2?'active-tab':'']">{{collectCount}}</span>
            </div>
          </div>
        </div>
      </header>
      <div class="main">
        <!-- 点赞列表 -->
        <div class="main-list" v-show="tabNum==0">
          <div class="main-list-select">
            <el-input
              v-model="searchPraiseContent"
              class="w-50 m-2"
              placeholder="请输入查询内容"
              :prefix-icon="Search"
              @keyup.enter="searchList(searchPraiseContent)"
            />
            <div class="list-select-button">
              <span class="sort-rule">活动时间</span>
              <span class="sort-btn" @click="upAndDown('praiseSort')" :class="praiseSort"></span>
            </div>
          </div>
          <div class="main-list-content">
            <div class="list-content-item" v-for="item in praiseList.content" :key="item.id">
              <p class="item-title" @click="jumpBlogContent(item.id)">{{item.title}}</p>
              <p class="item-time">点赞-{{item.gmt_created}}</p>
            </div>
          </div>
          <div class="list-content-page">
            <span>共{{praiseList.totalNum}}条</span>
            <select name="pages" id="pages" v-model="praiseNumValue" @change="getPageDate()">
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
              <span class="page-num">{{praiseList.currentPage}}</span>
              <span class="change-page-btn" @click="pageAdd(0)">
                <el-icon>
                  <Right />
                </el-icon>
              </span>
            </div>
          </div>
        </div>
        <!-- 评论列表 -->
        <div class="main-list" v-show="tabNum==1">
          <div class="main-list-select">
            <el-input
              v-model="searchCommentContent"
              class="w-50 m-2"
              placeholder="请输入查询内容"
              :prefix-icon="Search"
              @keyup.enter="searchList(searchCommentContent)"
            />
            <div class="list-select-button">
              <span class="sort-rule">活动时间</span>
              <span class="sort-btn" @click="upAndDown('commentSort')" :class="commentSort"></span>
            </div>
          </div>
          <div class="main-list-content">
            <div class="list-content-item" v-for="(item,index) in commentList.content" :key="index">
              <p class="item-title" @click="jumpBlogContent(item.id)">{{item.title}}</p>
              <p class="item-time">评论-{{item.gmt_created}}</p>
            </div>
          </div>
          <div class="list-content-page">
            <span>共{{commentList.totalNum}}条</span>
            <select name="pages" id="pages" v-model="commentNumValue">
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
              <span class="page-num">{{commentList.currentPage}}</span>
              <span class="change-page-btn" @click="pageAdd(1)">
                <el-icon>
                  <Right />
                </el-icon>
              </span>
            </div>
          </div>
        </div>
        <!-- 收藏列表 -->
        <div class="main-list" v-show="tabNum==2">
          <div class="main-list-select">
            <el-input
              v-model="searchCollectContent"
              class="w-50 m-2"
              placeholder="请输入查询内容"
              :prefix-icon="Search"
              @keyup.enter="searchList(searchCollectContent)"
            />
            <div class="list-select-button">
              <span class="sort-rule">活动时间</span>
              <span class="sort-btn" @click="upAndDown('collectSort')" :class="collectSort"></span>
            </div>
          </div>
          <div class="main-list-content table-content">
            <el-table
              ref="multipleTableRef"
              :show-header="false"
              @cell-click="jumpCollectContent"
              @selection-change="handleSelectionChange"
              :data="collectList.content"
              style="width: 100%"
            >
              <el-table-column type="selection" width="38" />
              <el-table-column property="title" label="title" width="400"></el-table-column>
              <el-table-column property="time" label="time" align="right" fixed="right">
                <template #default="scope">
                  收藏-{{scope.row.gmt_created}}
                  <span
                    class="table-delete-collect"
                    @click="deleteCollect(scope.row.id)"
                  >移除收藏</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="main-list-bottom">
            <div class="select-array">
              <p
                class="select-array-button"
                @click="removeCollect"
                v-if="selectArray.array.length"
              >移除选中的{{selectArray.array.length}}项</p>
            </div>
            <div class="list-content-page">
              <span>共{{collectList.totalNum}}条</span>
              <select name="pages" id="pages" v-model="collectNumValue">
                <option value="10" selected>10项/页</option>
                <option value="20">20项/页</option>
                <option value="50">50项/页</option>
                <option value="100">100项/页</option>
              </select>
              <div class="change-page">
                <span class="change-page-btn" @click="pageReduce(2)">
                  <el-icon>
                    <Back />
                  </el-icon>
                </span>
                <span class="page-num">{{collectList.currentPage}}</span>
                <span class="change-page-btn" @click="pageAdd(2)">
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
import http from '@/utils/https.js'
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
// import {ELTable} from 'element-plus'
const router = useRouter()
const route = useRoute()
// 0点赞 1评论 2收藏
const tabNum = ref(0)
const praiseSort = ref('')
const commentSort = ref('')
const collectSort = ref('')
const searchPraiseContent = ref('')
const searchCommentContent = ref('')
const searchCollectContent = ref('')
const praiseNumValue = ref(10)
const commentNumValue = ref('10')
const collectNumValue = ref('10')
const praiseCount = ref(0)
const commentCount = ref(0)
const collectCount = ref(0)
const praiseList = reactive({ content: [], totalNum: 0, currentPage: 1, totalPage: 1 })
const commentList = reactive({ content: [], totalNum: 100, currentPage: 1, totalPage: 1 })
const collectList = reactive({ content: [], totalNum: 100, currentPage: 1, totalPage: 1 })
const selectArray = reactive({
  array: []
})
const changeTab = function (num) {
  tabNum.value = num
  if (num == 1 && !commentList.content.length) {
    getPageDate(1)
  } else if (num == 2) {
    getPageDate(2)
  }
}
// -------------接口函数----------------
const getPageDate = (type = 0, page = 1, order = 'desc', keyword = '') => {
  http
    .post('/blog-article/active-list', {
      entity: {
        list_type: type,
        keyword
      },
      order,
      curr_page: page,
      page_size: praiseNumValue.value
    })
    .then(res => {
      if (type == 0) {
        praiseList.content = res.data.list
        praiseList.totalNum = res.data.total_count
        praiseList.currentPage = res.data.curr_page
        praiseList.totalPage = res.data.total_page
      } else if (type == 1) {
        commentList.content = res.data.list
        commentList.totalNum = res.data.total_count
        commentList.currentPage = res.data.curr_page
        commentList.totalPage = res.data.total_page
      } else if (type == 2) {
        collectList.content = res.data.list
        collectList.totalNum = res.data.total_count
        collectList.currentPage = res.data.curr_page
        collectList.totalPage = res.data.total_page
      }
    })
    .catch(err => console.log(err))
}

const pageAdd = index => {
  if (index == 0 && praiseList.totalPage > praiseList.currentPage) {
    praiseList.currentPage++
    getPageDate(index, praiseList.currentPage)
  } else if (index == 1 && commentList.totalPage > commentList.currentPage) {
    commentList.currentPage++
    getPageDate(index, commentList.currentPage)
  } else if (collectList.totalPage > collectList.currentPage) {
    collectList.currentPage++
    getPageDate(index, collectList.currentPage)
  }
}
const pageReduce = index => {
  if (index == 0 && praiseList.currentPage > 1) {
    praiseList.currentPage--
    getPageDate(index, praiseList.currentPage)
  } else if (index == 1 && commentList.currentPage > 1) {
    commentList.currentPage--
    getPageDate(index, commentList.currentPage)
  } else if (collectList.currentPage > 1) {
    collectList.currentPage--
    getPageDate(index, collectList.currentPage)
  }
}
const upAndDown = function (str) {
  if (str == 'praiseSort') {
    if (praiseSort.value) {
      // 顺序
      praiseSort.value = ''
      getPageDate(0, praiseList.currentPage)
      console.log(0, 'desc')
    } else {
      // 倒序
      praiseSort.value = 'changeSort'
      getPageDate(0, praiseList.currentPage, 'asc')
      console.log(0, 'asc')
    }
  } else if (str == 'commentSort') {
    if (commentSort.value) {
      commentSort.value = ''
      getPageDate(1, commentList.currentPage)
    } else {
      commentSort.value = 'changeSort'
      getPageDate(1, commentList.currentPage, 'asc')
    }
  } else if (str == 'collectSort') {
    if (collectSort.value) {
      getPageDate(2, collectList.currentPage)
      collectSort.value = ''
    } else {
      getPageDate(2, collectList.currentPage, 'asc')
      collectSort.value = 'changeSort'
    }
  } else {
    console.log('?')
  }
}
const jumpBlogContent = function (id) {
  router.push('/blogDetail/' + id)
  console.log(route)
}
const jumpCollectContent = function (row, column) {
  // 点击标题时跳转页面
  if (column.property == 'title') {
    router.push('/blogDetail/' + row.id)
  }
}
const deleteCollect = function (id) {
  // 调接口删除收藏
  ElMessageBox.confirm('确定要移除该收藏博客吗？', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      http
        .delete('/blog-article/delete-collection/' + id)
        .then(res => {
          if (res.code == 0) {
            ElMessage({
              showClose: true,
              message: '删除成功',
              type: 'success'
            })
            getPageDate(2)
            http.post('/blog-article/station-gather', 2).then(res => {
              praiseCount.value = res.data.like_count
              commentCount.value = res.data.comment_count
              collectCount.value = res.data.star_count
            })
          } else {
            ElMessage({
              showClose: true,
              message: '删除失败',
              type: 'error'
            })
          }
        })
        .catch(err => {
          ElMessage({
            showClose: true,
            message: '删除失败' + err,
            type: 'error'
          })
        })
    })
    .catch(() => {
      ElMessage({
        showClose: true,
        message: '取消操作',
        type: 'info'
      })
    })
}
const removeCollect = () => {
  ElMessageBox.confirm('确定要移除吗？', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      let idArray = []
      selectArray.array.map(el => {
        idArray.push(el.id)
      })
      console.log(idArray)
      http
        .delete('/blog-article/delete-batchCollection', idArray)
        .then(res => {
          if (res.code == 0) {
            ElMessage({
              showClose: true,
              message: '删除成功',
              type: 'success'
            })
            getPageDate(2)
          } else {
            ElMessage({
              showClose: true,
              message: '删除失败',
              type: 'error'
            })
          }
        })
        .catch(err => {
          ElMessage({
            showClose: true,
            message: '删除失败' + err,
            type: 'error'
          })
        })
    })
    .catch(() => {
      ElMessage({
        showClose: true,
        message: '取消操作',
        type: 'info'
      })
    })
}
const handleSelectionChange = val => {
  selectArray.array = val
  console.log(selectArray.array)
}
const searchList = search => {
  console.log(1)
  getPageDate(tabNum.value, 1, 'desc', search)
}
onMounted(() => {
  getPageDate()
  http.post('/blog-article/station-gather', 2).then(res => {
    praiseCount.value = res.data.like_count
    commentCount.value = res.data.comment_count
    collectCount.value = res.data.star_count
  })
})
</script>

<style lang="scss" scoped>
.manage-activity {
  // margin-left: 240px;
  min-width: 1200px;
  background-color: #eef3fd;
  height: 100%;
  .body {
    // height: 100vh;
    min-height: 100%;
    // min-width: 860px;
    width: 1170px;
    box-sizing: border-box;
    overflow: auto;
    // padding: 0 238px;
    margin: 0 auto;
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
          font-size: 18px;
          color: rgb(51, 51, 51);
          user-select: none;
          cursor: pointer;
          img {
            display: flex;
            width: 30px;
            height: 30px;
            margin: 0 35px;
          }
        }
        .active-tab {
          color: cornflowerblue;
          font-weight: bold !important;
        }
      }
    }
  }
  .main {
    .main-list {
      display: flex;
      flex-direction: column;
      .main-list-select {
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
          .sort-rule {
            width: 90px;
            margin-right: 14px;
            background-color: white;
            display: flex;
            align-items: center;
            border: 1px solid #e4e7ed;
            justify-content: center;
            user-select: none;
          }
          .sort-btn {
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
      .main-list-content {
        min-width: 860px;
        // height: 501px;
        border-top: 1px solid #ddd;
        margin-bottom: 25px;
      }
      .table-content > div {
        border: 1px solid #ddd;
        border-top: 0px solid #ddd;
      }
      .list-content-item {
        height: 50px;
        padding: 0 20px;
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
          width: 400px;
          cursor: pointer;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          font-size: 16px;
          font-weight: 500;
          .item-title-checkbox {
            width: 16px;
            height: 16px;
            margin-right: 8px;
          }
          .item-title-text {
            flex: 1;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
      .main-list-bottom {
        // margin-top: 25px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .select-array {
          .select-array-button {
            background-color: white;
            height: 100%;
            font-size: 14px;
            display: flex;
            align-items: center;
            border: 1px solid #409eff;
            color: #409eff;
            padding: 0 10px;
            cursor: pointer;
            user-select: none;
          }
        }
      }
      .list-content-page {
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
// table
:deep(.el-table__body) {
  width: 100% !important;
}
:deep(tbody) {
  width: 100%;
}
:deep(.el-table__row) {
  width: 100%;
  height: 50px;
  // display: flex;
  .table-delete-collect {
    margin-left: 30px;
    margin-right: 10px;
    color: #409eff;
    user-select: none;
    cursor: pointer;
  }
}
:deep(.el-table_1_column_2) {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
:deep(.el-table td.el-table__cell, .el-table th.el-table__cell.is-leaf) {
  border-color: #ddd;
}
:deep(.el-table_1_column_2) {
  cursor: pointer;
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
</style>
