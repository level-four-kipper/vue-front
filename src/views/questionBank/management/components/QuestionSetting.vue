<template>
  <!-- 题目设置 -->
  <div class="topic-setting">
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-position="top">
      <el-tabs v-model="activeSetting" stretch>
        <el-tab-pane label="题目设置" name="setting">
          <el-form-item label="题目序号">
            <span class="serial"></span>
            {{ activeIndex + 1 }}
          </el-form-item>
          <el-form-item label="难度等级" prop="difficulty_id">
            <el-input v-model="ruleForm.difficulty_id" style="display: none" />
            <div class="list" @click="handleDifficultyClick">
              <div
                v-for="item in difficultyList"
                :key="item.value"
                :class="{ list__cell: true, active: ruleForm.difficulty_id === item.value }"
                :data-value="item.value">
                {{ item.label }}
              </div>
            </div>
          </el-form-item>
          <el-form-item label="答案解析">
            <el-input v-model="ruleForm.analysis" rows="5" resize="none" type="textarea" />
          </el-form-item>
          <el-form-item v-if="ruleForm.type_id === 3" label="编程语言" prop="language">
            <el-input v-model="ruleForm.language" style="display: none" />
            <div class="list" @click="handleLanguageClick">
              <div
                v-for="item in languageOptions"
                :key="item.value"
                :class="{ list__cell: true, active: ruleForm.language === item.value }"
                :data-value="item.value">
                {{ item.label }}
              </div>
            </div>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="编辑信息" name="edit">
          <el-form-item label="提交类型">
            <span>{{ buzOptions[ruleForm.buz_id] }}</span>
          </el-form-item>
          <el-form-item label="审核状态">
            <span v-if="ruleForm.status_id === 0" class="status--wait">审核中</span>
            <span v-else-if="ruleForm.status_id === 1" class="status--pass">已收录</span>
            <span v-else class="status--nopass">已拒绝</span>
          </el-form-item>
          <el-form-item label="上次编辑">2023-01-27</el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <el-button plain class="submit-btn" @click="handleSubmit">
      <img src="@/assets/img/创建-1.png" alt="" />
      <span>提交题目</span>
    </el-button>
  </div>
</template>

<script setup>
import useQuestionbank from '@/hooks/useQuestionbank.js'
import Bus from '@/utils/bus.js'

const { activeIndex, question_dtolist } = inject('questionBank')
const { buzOptions, difficultyList } = useQuestionbank()

const ruleFormRef = ref(null)
const activeSetting = ref('setting')
const ruleForm = computed(() => {
  return question_dtolist[activeIndex.value]
})
const rules = reactive({
  difficulty_id: [{ required: true, message: '请选择难度等级', trigger: 'blur' }],
  language: [{ required: true, message: '请选择编程语言', trigger: 'blur' }],
})

const languageOptions = [
  { label: 'Java', value: '1' },
  { label: 'C++', value: '2' },
  { label: 'Python', value: '3' },
  { label: 'Go', value: '4' },
  { label: 'Javascript', value: '5' },
]

const handleDifficultyClick = e => {
  question_dtolist[activeIndex.value].difficulty_id = +e.target.dataset.value
}

const handleLanguageClick = e => {
  question_dtolist[activeIndex.value].language = e.target.dataset.value
}

// 提交
const handleSubmit = () => {
  Bus.emit('handleSubmit')
}
</script>

<style lang="scss" scoped>
.topic-setting {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  :deep(.el-form) {
    .el-form-item {
      padding: 0 20px;
      margin-top: 30px;
      .el-form-item__label {
        line-height: 20px !important;
        margin-bottom: 10px !important;
        height: 20px;
        font-weight: 600;
        color: #333;
      }
      .el-form-item__content {
        line-height: normal;
      }
    }
    .el-form-item__content {
      color: #4d4e54;
    }
  }
  .submit-btn {
    width: 100%;
    height: 54px;
    text-align: center;
    border-radius: 2px;
    font-size: 16px;
    text-align: right;
    img {
      margin-right: 5px;
    }
  }
}

.serial {
  line-height: 20px;
  color: #4d4e54;
}
.list {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: -20px;
  &__cell {
    width: 150px;
    height: 36px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6a6f7b;
    border: 1px solid #d3d3de;
    border-radius: 2px;
    transition: all 0.3s;
    cursor: pointer;
    &:hover,
    &.active {
      font-weight: 600;
      border-color: #0175ff;
      color: #0175ff;
      background: #eef3fd;
    }
  }
}
.status--wait {
  color: #0175ff;
}
.status--pass {
  color: #67c23a;
}
.status--nopass {
  color: #da3939;
}
</style>
