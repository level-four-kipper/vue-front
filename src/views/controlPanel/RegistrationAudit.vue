<template>
  <div class='container'>
    <div class="nav-bread">
      <NavBread :lists='lists'></NavBread>
    </div>
    <div class="content">
      <div class="title"><span>注册审核</span></div>
      <div>
        <AuditTable :tableData="tableData"></AuditTable>
      </div>
    </div>
    <div class="pagination">
      <el-pagination :page-size="pageSize" :pager-count="6" layout="prev, pager, next" :total="totalCount" v-model:current-page="currentPage" hide-on-single-page @prev-click="prevClick" @next-click='nextClick' @current-change='currentChange' />
    </div>
  </div>
</template>

<script setup>
import NavBread from '@/components/NavBread.vue'
import AuditTable from '../controlPanel/AuditTable.vue'
import { ref } from 'vue'
import { fetchPageListAuait } from '@/api/controlPannel.js'
//面包屑的数据
let lists = ref < Array > ''
lists = [
  { name: '安全', path: '/controlPanel' },
  { name: '注册审核', path: '/controlPanel/RegistrationAudit' }
]
//审核表单的数据
let tableData = ref([])
//分页
const emit = defineEmits(['update:current-page'])
const loading = ref(true)
let currentPage = ref() //当前页码
const totalCount = ref()
const pageSize = ref(5)
//获取数据
function getTableData(currentPage) {
  const data = fetchPageListAuait({ curr_page: currentPage, entity: { delete_flag: 0 }, page_size: pageSize.value }).then(result => {
    tableData.value = result.data.list
    totalCount.value = result.data.total_count
    tableData.value.forEach(element => {
      console.log(element.audit_status)
      if (element.audit_status === 0) {
        element.audit_status = '未审核'
      } else if (element.audit_status === 1) {
        element.audit_status = '通过'
      } else {
        element.audit_status = '拒绝'
      }
    })
    loading.value = false
  })
}
getTableData(1)
//上一页
function prevClick() {
  getTableData(currentPage.value)
}
//下一页
function nextClick() {
  getTableData(currentPage.value)
}
//指定页
function currentChange() {
  getTableData(currentPage.value)
}
</script>

<style scoped lang="scss">
.el-menu {
  border-right: unset !important;
}
.container {
  width: 100%;
  height: 100%;
  .nav-bread {
    padding-bottom: 20px;
    border-bottom: 1px solid rgb(226, 223, 223);
  }
  .title {
    height: 30px;
    width: 70px;
    border: 1px solid rgb(226, 223, 223);
    color: rgb(189, 184, 184);
    font-size: 12px;
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .pagination {
    width: 100%;
    display: flex;
    justify-content: center;
  }
}
</style>