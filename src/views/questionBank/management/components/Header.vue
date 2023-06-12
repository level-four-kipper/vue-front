<template>
  <!-- 题库公共头部 -->
  <div class="question-bank__header">
    <!-- 题库列表 -->
    <div class="header__left">
      <el-dropdown max-height="300" popper-class="questionbank-popper">
        <span class="el-dropdown-link question-bank-name">
          {{ myQuestionBankList[myQuestionBankIndex]?.name }}
          <el-icon>
            <CaretBottom />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="(item, idx) in myQuestionBankList"
              :key="item.id"
              :command="item.id"
              :class="{ active: myQuestionBankIndex === idx }"
              @click="handleQuestionBankChange(item.id)"
              >{{ item.name }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <!-- 看板、编辑、审核 -->
    <div class="header__content">
      <div
        v-for="(item, index) in tabs"
        :key="index"
        :class="['tabs__cell', { 'is-active': currentTab === item.value }]"
        @click="handleTabsChange(item.value)">
        {{ item.label }}
      </div>
    </div>

    <!-- 题库设置、退出 -->
    <div class="header__right">
      <div class="setting__btn" @click="openDrawer">
        <img src="@/assets/img/creation/setting.png" alt="" />
        <span>题库设置</span>
      </div>
      <el-divider direction="vertical" />
      <span class="back__btn" @click="handleBack">退出</span>
    </div>
  </div>
</template>

<script setup name="questionBankHeader">
import { ElMessage } from 'element-plus'
import useQuestionbank from '@/hooks/useQuestionbank'

const emit = defineEmits(['openDrawer'])

const router = useRouter()
const route = useRoute()

const myQuestionBankIndex = ref(0)
const { myQuestionBankList, _fetchGetMyQuestionBankList } = useQuestionbank() // 我的题库列表

const tabs = [
  { label: '看板', value: 'board' },
  { label: '编辑', value: 'editor' },
  { label: '审核', value: 'audit' },
]

// 当前所在的tab
const currentTab = computed(() => {
  return route.path.split('/')[2]
})

// 切换当前选中的题库
const handleQuestionBankChange = id => {
  myQuestionBankList.value.forEach((item, idx) => {
    if (item.id == id) {
      myQuestionBankIndex.value = idx
      // 目的是为了页面刷新获取最新数据
      router.replace(`/questionBank/${currentTab.value}?id=${item.id}`)
    }
  })
}
watch(
  () => myQuestionBankList.value,
  () => {
    const { id = '' } = route.query
    handleQuestionBankChange(id)
  },
  { immediate: true },
)

// 切换看板、编辑、审核tab，跳转到对应路由
const handleTabsChange = target => {
  const { id = '' } = route.query
  if (!id) {
    return ElMessage.error('题库ID不存在')
  }
  router.replace(`/questionBank/${target}?id=${id}`)
}

// 打开题库设置抽屉
const openDrawer = () => {
  emit('openDrawer')
}

// 退出
const handleBack = () => {
  if (history.length > 1) {
    router.go(-1)
  } else {
    router.replace(`/creationList/quizBank`)
  }
}
onMounted(() => {
  _fetchGetMyQuestionBankList()
})
</script>

<style lang="scss" scoped>
.question-bank__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: content-box;
  padding: 0 20px;
  background: #fff;

  .header__left {
    width: 360px;
  }

  .header__content {
    display: flex;
    align-items: center;
    justify-content: center;

    .tabs__cell {
      line-height: 25px;
      margin: 18px 20px 11px;
      font-size: 18px;
      color: #333;
      cursor: pointer;
      position: relative;
    }

    .is-active {
      font-weight: 600;
      color: #0175ff;

      &::after {
        position: absolute;
        left: 50%;
        bottom: -11px;
        content: '';
        width: 16px;
        height: 3px;
        background: #0175ff;
        transform: translateX(-50%);
      }
    }
  }

  .header__right {
    width: 360px;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .setting__btn {
      display: flex;
      align-items: center;
      cursor: pointer;
      img {
        cursor: pointer;
      }
    }

    > span {
      font-size: 16px;
      color: #333;
      cursor: pointer;

      &:hover {
        opacity: 0.85;
      }
    }

    .el-divider {
      margin: 0 20px;
      border-left: 1px solid rgba(145, 150, 166, 1);
    }
  }

  :deep(.el-dropdown-link) {
    display: flex;
    align-items: center;
    line-height: 22px;
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }

  .question-bank-name {
    cursor: pointer;
  }
}
</style>

<style lang="scss">
.questionbank-popper {
  box-shadow: 0 2px 12px 0 rgba(156, 172, 209, 0.5) !important;
  border-radius: 8px;
  overflow: hidden;

  .el-dropdown-menu__item {
    line-height: 20px;
    padding: 14px 16px;
    color: #6a6f7b;

    &:not(.is-disabled).active {
      background-color: rgba(1, 117, 255, 0.05) !important;
      color: #0175ff !important;
    }
  }
}
</style>
