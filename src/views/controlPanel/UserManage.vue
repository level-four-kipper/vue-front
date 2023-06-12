<template>
  <div class="container">
    <div class="nav-bread">
      <NavBread :lists='lists'></NavBread>
    </div>
    <div>
      <div class="title">
        <span>用户列表</span>
        <!-- <button @click="toregister">注册</button> -->
      </div>
      <div v-loading="loading">
        <UserTable :tableData='tableData' @delete="deleteManage"></UserTable>
      </div>
    </div>
    <!-- 分页 -->
    <div class="pagination">
      <el-pagination :page-size="pageSize" :pager-count="10" layout="prev, pager, next" :total="totalCount" v-model:current-page="currentPage" hide-on-single-page @prev-click="prevClick" @next-click='nextClick' @current-change='currentChange' />
    </div>
  </div>
</template>

<script setup>
import { ElLoading } from 'element-plus'
import NavBread from '@/components/NavBread.vue'
import UserTable from '../controlPanel/UserTable.vue'
import { ref } from 'vue'
import { fetchPageListManage, fetchDeleteManage } from '@/api/controlPannel.js'
//面包屑的数据
let lists = ref < Array > ''
lists = [
  { name: '安全', path: '/controlPanel' },
  { name: '用户管理', path: '/controlPanel/userManage' }
]
//表格的数据
let tableData = ref([])
const isshow = ref(false)
//分页
const loading = ref(true)
const emit = defineEmits(['update:current-page'])
let currentPage = ref(1) //当前页码
const totalCount = ref()
const pageSize = ref(5)
//获取table的数据
function getTableData(currentPage) {
  loading.value = true
  const data = fetchPageListManage({ curr_page: currentPage, entity: { delete_flag: 0, audit_status: 1 }, page_size: pageSize.value, sidx: 'gmt_modified', order: 'desc' }).then(result => {
    tableData.value = result.data.list
    totalCount.value = result.data.total_count
    console.log(tableData.value, 'tabeldata')
    tableData.value.forEach(element => {
      if (element.charactor === 0) {
        element.charactor = '普通用户'
      } else {
        element.charactor = '管理员'
      }
      loading.value = false
    })
  })
}
getTableData(1)
//上一页
function prevClick() {
  getTableData(currentPage.value)
  console.log('prevClick', currentPage.value)
}
//下一页
function nextClick() {
  getTableData(currentPage.value)
}
//指定页
function currentChange() {
  getTableData(currentPage.value)
}
//删除
function deleteManage(id) {
  loading.value = true
  fetchDeleteManage(id).then(result => {
    if (result.code === 0) {
      getTableData(currentPage.value)
    } else {
      ElMessage({
        showClose: true,
        message: '删除失败，请稍后再试',
        type: 'error'
      })
    }
  })
}
</script>

<style scoped lang="scss">
.el-menu {
  border-right: unset !important;
}
.container {
  height: 100%;
  width: 100%;
  .nav-bread {
    padding-bottom: 20px;
    border-bottom: 1px solid rgb(226, 223, 223);
  }
  .title {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    span {
      display: inline-block;
      height: 30px;
      width: 70px;
      border: 1px solid rgb(226, 223, 223);
      color: rgb(189, 184, 184);
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    button {
      width: 44px;
      height: 30px;
      border-style: none;
      background: #0066fffc;
      color: white;
      font-size: 12px;
    }
  }
  .pagination {
    width: 100%;
    display: flex;
    justify-content: center;
  }
}
</style>
