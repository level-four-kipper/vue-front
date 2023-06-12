<template>
  <div :class="['question', { active: isActive }]" @click.stop>
    <!-- 题目类型 -->
    <span class="question__type">{{ typeOptions[questionObj.type_id] }}</span>
    <!-- 题目内容 -->
    <div class="question__content">
      <!-- 题目名称 -->
      <div class="question__title">
        <el-input
          v-model.trim="questionObj.title"
          class="editor-input"
          type="textarea"
          rows="1"
          autosize
          resize="none"
          :placeholder="defaultTitle"
          :disabled="!canEdit || (questionObj.id && questionObj.status_id === 0)" />
      </div>
      <!-- 题目描述 -->
      <!-- 编辑页默认展示，审核页，需根据内容是否为空来控制展示和隐藏 -->
      <el-input
        v-if="(!canEdit && questionObj?.description) || canEdit"
        v-model="questionObj.description"
        :disabled="!canEdit || (questionObj.id && questionObj.status_id === 0)"
        class="topic-desc"
        :rows="4"
        autosize
        show-word-limit
        maxlength="1000"
        type="textarea"
        clearable
        placeholder="请输入描述" />
      <!-- 题目选项 -->
      <div class="question__items">
        <!-- 选择题 -->
        <template v-if="[0, 1].includes(questionObj.type_id)">
          <div v-for="(item, index) in questionObj.option_list" :key="index" class="question__items__cell">
            <div :class="{ options: true, active: item.checked }">
              <el-checkbox v-model="item.checked" :disabled="!canEdit || (questionObj.id && questionObj.status_id === 0)" @click="handleChecked($event, index)"></el-checkbox>
              <span class="eidtor-serial">{{ serialNumber[index] }}.</span>
              <template v-if="!canEdit || (questionObj.id && questionObj.status_id === 0)">
                <el-input
                  ref="optionsInput"
                  v-model.trim="item.option_content"
                  class="editor-input"
                  rows="1"
                  resize="none"
                  autosize
                  type="textarea"
                  :placeholder="'选项' + (index + 1)"
                  :disabled="!canEdit || (questionObj.id && questionObj.status_id === 0)" />
              </template>
              <template v-else>
                <el-input
                  v-show="focusIndex === index"
                  ref="optionsInput"
                  v-model.trim="item.option_content"
                  :class="{ 'editor-input': true, highlight: !canEdit }"
                  rows="1"
                  resize="none"
                  autosize
                  type="textarea"
                  :placeholder="'选项' + (index + 1)"
                  :disabled="!canEdit || (questionObj.id && questionObj.status_id === 0)"
                  @blur="focusIndex = -1" />
                <span v-show="focusIndex !== index" class="option-desc" @click="handleFocus(index)">{{ item.option_content || '选项' + (index + 1) }}</span>
                <span v-show="focusIndex !== index" class="is-answer">正确答案</span>
              </template>
            </div>
            <!-- 添加、删除选项 -->
            <div v-if="canEdit" class="btns">
              <span v-if="questionObj.option_list.length < 10" class="btn--add" @click="handleOptionsAdd(index)"></span>
              <span v-if="questionObj.option_list.length > 2" class="btn--del" @click="handleOptionsDel(index)"></span>
            </div>
          </div>
        </template>
        <!-- 问答题 -->
        <div v-else class="sort-answer">
          <el-input v-model="questionObj.answer" rows="6" resize="none" type="textarea" placeholder="输入正确答案" :disabled="!canEdit || (questionObj.id && questionObj.status_id === 0)" />
        </div>
      </div>
    </div>

    <div v-if="canEdit" class="question__btns">
      <!-- 删除未提交的题目 -->
      <img class="question__btn--del" src="@/assets/img/createQuestionBank/close.png" @click.stop="handleQuestionDel(index)" />
      <!-- 删除已提交的题目 -->
      <div v-if="questionObj.id" class="question__btn--more">
        <el-dropdown @command="handleCommand">
          <img src="@/assets/img/createQuestionBank/more.png" />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item :command="{ type: 'del', index: index }">删除</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- 删除弹窗 -->
    <CustomDialog v-model:dialogVisible="dialogVisible" title="删除题目" tips="请填写删除原因" @handleConfirm="handleConfirmAdd" />
  </div>
</template>

<script setup>
import CustomDialog from './CustomDialog.vue'
import { ElMessage } from 'element-plus'

import Bus from '@/utils/bus.js'
import { fetchDeleteQuestion } from '@/api/questionBank.js'
import useQuestionbank from '@/hooks/useQuestionbank.js'

const props = defineProps({
  index: Number,
  canEdit: {
    // 审核页面，题目不可编辑
    type: Boolean,
    default: true
  }
})

const { activeIndex, question_dtolist } = inject('questionBank')
const { serialNumber, getDefaultTitle } = useQuestionbank()

const typeOptions = { 0: '单选题', 1: '多选题', 2: '简答题', 3: '编程题' }
const dialogVisible = ref(false)

const optionsInput = ref(null)
const focusIndex = ref(-1)

const handleFocus = index => {
  focusIndex.value = index
  nextTick(() => {
    optionsInput.value[index].focus()
  })
}

const isActive = computed(() => {
  return props.index === activeIndex.value
})

const questionObj = computed(() => {
  return question_dtolist[props.index] || {}
})

const defaultTitle = computed(() => {
  return getDefaultTitle(question_dtolist[props.index].type_id)
})

// 添加选项
const handleOptionsAdd = index => {
  question_dtolist[props.index].option_list.splice(index + 1, 0, {
    checked: false,
    option_content: ''
  })
}

// 删除选项
const handleOptionsDel = index => {
  question_dtolist[props.index].option_list.splice(index, 1)
}

// 勾选答案
const handleChecked = ($event, index) => {
  // 是否可编辑
  if (!props.canEdit) return
  // 防止多次触发
  if ($event.target.className !== 'el-checkbox__inner') return

  const item = question_dtolist[props.index]
  // console.log(index, item)
  if (item.type_id < 2) {
    const answer = []

    item.option_list.forEach((subItem, idx) => {
      // 单选题只有一个答案
      if (item.type_id === 0) {
        if (!item.option_list[index].checked && idx !== index) {
          subItem.checked = false
        } else {
          answer.push(serialNumber.value[index])
        }
      } else {
        // 当前选中项
        if (idx === index) {
          !item.option_list[index].checked && answer.push(serialNumber.value[index])
        } else {
          // 以前选中项
          subItem.checked && answer.push(serialNumber.value[idx])
        }
      }
    })
    item.answer = answer.join('、')
  }
}

// 移除题目
const handleQuestionDel = index => {
  question_dtolist.splice(index, 1)
}

// 删除
const handleCommand = command => {
  console.log(command)
  dialogVisible.value = true
}

// 确认删除
const handleConfirmAdd = remark => {
  fetchDeleteQuestion(questionObj.value.id, { remark }).then(res => {
    if (res.code !== 0) {
      ElMessage({
        message: res.msg,
        type: 'warning'
      })
      return
    }
    dialogVisible.value = false
    Bus.emit('deleteQuestion', { status: questionObj.value.status_id, id: questionObj.value.id })
    question_dtolist.splice(props.index, 1)

    ElMessage({
      message: '操作成功',
      type: 'success'
    })
  })
}
</script>

<style lang="scss" scoped>
.question {
  position: relative;
  display: flex;
  padding: 20px;
  margin-bottom: 20px;
  background: #fff;
  font-size: 14px;
  color: #333;
  border-radius: 4px;
  &.active {
    box-shadow: 0 2px 16px 0 rgba(156, 172, 209, 0.44);
  }
  &__type {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 66px;
    height: 32px;
    border: 1px solid #0175ff;
    border-radius: 4px;
    color: #0a7aff;
  }
  &__content {
    flex: 1;
    margin-left: 10px;
    margin-right: 60px;
  }
  &__title {
    cursor: pointer;
    margin-bottom: 12px;
    --el-disabled-text-color: '#333';
    ::-webkit-input-placeholder {
      /* 使用webkit内核的浏览器 */
      color: #333;
    }
    :-moz-placeholder {
      /* Firefox版本4-18 */
      color: #333;
    }
    ::-moz-placeholder {
      /* Firefox版本19+ */
      color: #333;
    }
    :-ms-input-placeholder {
      /* IE浏览器 */
      color: #333;
    }
  }
  &__items {
    --el-disabled-text-color: '#535560';
    ::-webkit-input-placeholder {
      /* 使用webkit内核的浏览器 */
      color: #535560;
    }
    :-moz-placeholder {
      /* Firefox版本4-18 */
      color: #535560;
    }
    ::-moz-placeholder {
      /* Firefox版本19+ */
      color: #535560;
    }
    :-ms-input-placeholder {
      /* IE浏览器 */
      color: #535560;
    }
    .sort-answer {
      margin-bottom: 10px;
      :deep(.el-textarea__inner) {
        &:focus {
          box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
        }
      }
    }
    &__cell {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
      &:last-child {
        margin-bottom: 3px;
      }
      & > div {
        display: flex;
        align-items: center;
      }
      .eidtor-serial {
        margin: 0 10px;
      }
      .options {
        flex: 1;
        .option-desc {
          display: flex;
          align-items: center;
          padding: 5px 0;
          line-height: 1.5;
          min-height: 32px;
        }
        .is-answer {
          display: none;
          font-weight: 600;
          margin-left: 10px;
          line-height: 1.5;
          word-break: keep-all;
        }
        &.active {
          color: #0175ff;
          .is-answer {
            display: inline-block;
          }
          .option-desc {
            color: #535560;
          }
          .highlight {
            :deep(.el-textarea__inner) {
              color: #0175ff;
            }
          }
          --el-disabled-text-color: '#0175ff';
        }
      }
    }
  }
  &__btns {
    position: absolute;
    display: flex;
    top: 12px;
    right: 12px;
    height: 18px;
    .question__btn--more,
    .question__btn--del {
      margin-left: 10px;
      cursor: pointer;
      &:hover {
        opacity: 0.85;
      }
    }
  }
}
.el-textarea {
  --el-input-border-color: #d3d3de;
  --el-border-color: #d3d3de;
}
.editor-input {
  line-height: 1.5;
  min-height: 32px;
  :deep(.el-textarea__inner) {
    padding: 5px 0;
    min-height: 32px !important;
    box-shadow: none;
    &:focus {
      box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
    }
  }
  &.is-disabled {
    :deep(.el-textarea__inner) {
      background: none;
    }
  }
}
.topic-desc {
  margin-bottom: 20px;
}
.el-checkbox {
  height: auto; // 不加，点击区域可能在多选框外面也生效
  :deep(.el-checkbox__inner) {
    width: 16px;
    height: 16px;
    border-color: #d3d3de;
    background-color: #f5f8fe;
  }
  &.is-checked {
    :deep(.el-checkbox__inner) {
      border-color: #0175ff;
      background-color: #fff;
      &::after {
        width: 4px;
        height: 8px;
        border-color: #0175ff;
        border-width: 2px;
      }
    }
  }
}
.btns {
  .btn--add,
  .btn--del {
    position: relative;
    width: 16px;
    height: 16px;
    margin-left: 10px;
    border-radius: 16px;
    background: #d8d8d8;
    cursor: pointer;
    &::before {
      position: absolute;
      content: '';
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 8px;
      height: 2px;
      background: #fff;
    }
    &:hover {
      &::after,
      &::before {
        background: #0175ff;
      }
    }
  }
  .btn--del {
    &:hover {
      &::before {
        background: #da3939;
      }
    }
  }
  .btn--add::after {
    position: absolute;
    content: '';
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 2px;
    height: 8px;
    background: #fff;
  }
}
// checkbox 自定义
.checkbox {
  position: relative;
  min-width: 16px;
  min-height: 16px;
  background: #f5f8fe;
  border: 1px solid #d3d3de;
  border-radius: 2px;
  cursor: pointer;
  &.active {
    background: #fff;
    border-color: #0175ff;
    &::before {
      position: absolute;
      content: '';
      left: 1px;
      bottom: 4px;
      width: 5px;
      height: 2px;
      background: #0175ff;
      transform: rotate(60deg);
    }
    &::after {
      position: absolute;
      right: 0;
      bottom: 5px;
      content: '';
      width: 10px;
      height: 2px;
      background: #0175ff;
      transform: rotate(-45deg);
    }
  }
}
:deep(.el-textarea.is-disabled .el-textarea__inner) {
  cursor: auto;
}
</style>
