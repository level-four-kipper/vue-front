<template>
  <div class="creation">
    <Header @open-drawer="openDrawer" />
    <div class="main">
      <router-view />
    </div>
  </div>
  <!-- 题库设置 -->
  <EditQuestionBank ref="editQuestionBankRef" />
</template>

<script setup>
import Header from './components/Header.vue'
import { fetchMyQuestionbank } from '@/api/questionBank.js'
import { ElMessage } from 'element-plus'
import EditQuestionBank from '@/views/questionBank/components/editQuestionBank.vue'

const route = useRoute()

const id = ref(route.query.id || '')
const questionBankList = ref([])
const questionBankIndex = ref(0)

const typeMap = {
  board: 2,
  editor: 0,
  audit: 1,
}

provide('questionBank', {
  questionBankList,
  questionBankIndex,
})

// 打开题库设置抽屉
const editQuestionBankRef = ref()
const openDrawer = () => {
  const { id = '' } = route.query
  if (!id) {
    return ElMessage.error('无法获取到题库ID')
  }
  editQuestionBankRef.value.handleOpen(id)
}

// 获取题库列表
const _fetchMyQuestionbank = () => {
  let str = route.path.split('/')[2]
  fetchMyQuestionbank(typeMap[str]).then(res => {
    questionBankList.value = res.data.map((item, index) => {
      return {
        role_id: item.role_id,
        id: item.id,
        visibility: item.visibility,
        name: item.name || `未命名题库${index + 1}`,
      }
    })

    // 展示当前题库
    if (id.value) {
      for (let i = 0, len = questionBankList.value.length; i < len; i++) {
        if (id.value === questionBankList.value[i].id) {
          questionBankIndex.value = i
          break
        }
      }
    } else {
      // 显示未命名题库
      questionBankList.value.push({
        role_id: 0,
        area_id: '',
        audit_policy: '',
        description: '',
        name: '未命名题库',
      })
      questionBankIndex.value = questionBankList.value.length - 1
    }
  })
}

onMounted(async () => {
  _fetchMyQuestionbank()
})
</script>

<style lang="scss" scoped>
.creation {
  background-color: #f5f8fe;
  height: 100%;
  .main {
    display: flex;
    height: calc(100% - 54px);
    min-width: 1280px;
    // max-width: 1440px;
    margin: 0 auto;
  }
}
</style>
