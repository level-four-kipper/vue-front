<template>
  <!-- 题库公共顶部 -->
  <div class="question-bank__header" @click="changeToQuestionBank">
    <!-- 题库列表 -->
    <div class="header__left">
      <el-dropdown max-height="300" popper-class="questionbank-popper" @command="handleCommand">
        <span class="el-dropdown-link">
          {{ questionBankList[questionBankIndex]?.name }}
          <el-icon class="el-icon--right">
            <CaretBottom />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="(item, index) in questionBankList"
              :key="item.id"
              :command="index"
              :class="{ active: questionBankIndex === index }"
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
      <!-- 题库管理员及已创建题库，展示发布按钮 -->
      <!-- <div
        v-if="
          questionBankList[questionBankIndex]?.role_id === 0 &&
          questionBankList[questionBankIndex]?.id &&
          questionBankList[questionBankIndex]?.visibility === 0
        "
        class="btn--submit"
        @click.stop="handlePublish">
        <img src="@/assets/img/creation/publish.png" alt />
        <span>发布题库</span>
      </div> -->
      <!-- <div v-if="currentTab === 'editor'" class="btn--publish" @click.stop="handleSubmit">
        <img src="@/assets/img/creation/saveDraft.png" alt />
        <span>提交题库</span>
      </div> -->
      <div class="operate-btns">
        <img src="@/assets/img/creation/setting.png" alt="" />
        <span @click.stop="openDrawer">题库设置</span>
        <el-divider direction="vertical" />
        <span @click.stop="handleBack">退出</span>
      </div>
    </div>
  </div>
</template>

<script setup name="questionBankHeader">
import { ElMessage } from 'element-plus'
import Bus from '@/utils/bus.js'

const emit = defineEmits(['openDrawer'])

const router = useRouter()
const route = useRoute()

const { questionBankList, questionBankIndex } = inject('questionBank')

const id = ref(route.query.id || '')

const tabs = [
  {
    label: '看板',
    value: 'board',
  },
  {
    label: '编辑',
    value: 'editor',
  },
  {
    label: '审核',
    value: 'audit',
  },
]

const currentTab = computed(() => {
  return route.path.split('/')[2]
})

// 切换看板、编辑、审核tab，跳转到对应路由
const handleTabsChange = val => {
  if (id.value) {
    router.replace(`/questionBank/${val}?id=${id.value}`)
  } else {
    // 默认展示列表第一个题库，注意新增时编辑页面第一个题库是没id的
    const bank_id = questionBankList.value[0]?.id
    if (bank_id) {
      router.replace(`/questionBank/${val}?id=${bank_id}`)
    } else {
      ElMessage({
        message: `请先创建题库`,
        type: 'warning',
      })
    }
  }
}

// 切换题库
const handleCommand = command => {
  questionBankIndex.value = command
  const clickId = questionBankList.value[command].id
  if (clickId && clickId !== id.value) {
    router.replace(`${route.path}?id=${questionBankList.value[command].id}`)
  }
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

const handleSubmit = () => {
  Bus.emit('handleSubmit')
}

const handlePublish = () => {
  Bus.emit('handlePublish')
}

const changeToQuestionBank = () => {
  Bus.emit('changeToQuestionBank')
}
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
    .btn--submit,
    .btn--publish {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 112px;
      height: 42px;
      margin-right: 30px;
      background: #0175ff;
      border-radius: 4px;
      border-radius: 4px;
      font-size: 16px;
      color: #fff;
      cursor: pointer;
      &:hover {
        opacity: 0.85;
      }
    }
    .btn--submit {
      img {
        margin-right: 6px;
      }
    }
    .btn--publish {
      width: 100px;
      background: transparent;
      border: none;
      color: #333;
    }
    .btn--publish + .line {
      display: inline-block;
    }
    .line {
      display: none;
      width: 1px;
      height: 18px;
      background: #9196a6;
    }
    .operate-btns {
      display: flex;
      align-items: center;
      > img {
        cursor: pointer;
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
  }
  :deep(.el-dropdown-link) {
    display: flex;
    align-items: center;
    line-height: 22px;
    font-size: 16px;
    font-weight: 600;
    color: #333;
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
