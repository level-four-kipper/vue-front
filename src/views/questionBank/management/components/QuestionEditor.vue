<template>
  <div class="editor">
    <div v-if="question_dtolist.length === 0" class="editor__tips">
      <div class="add-btn">
        <img src="@/assets/img/createQuestionBank/add.png" alt />
        <span>点击左侧题型按钮创建新题目</span>
      </div>
    </div>
    <el-scrollbar v-else style="height: 100%">
      <div class="editor__content">
        <!-- 题目列表 -->
        <template v-for="(item, index) in question_dtolist" :key="item.key">
          <Question :index="index" :is-active="activeIndex === index" @click="handleQuestionClick(index)" />
        </template>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup>
import Question from './Question.vue'

const { activeIndex, question_dtolist } = inject('questionBank')

const handleQuestionClick = index => {
  activeIndex.value = index
}
</script>

<style lang="scss" scoped>
.editor {
  height: calc(100% - 20px);
  &__tips {
    position: relative;
    height: 100%;
    width: calc(100% - 40px);
    margin: 0 auto;
    background: #fff;
    box-shadow: 0 0 15px 2px rgb(0 0 0 / 10%);
    border-radius: 4px;
    .add-btn {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      align-items: center;
      img {
        margin-right: 8px;
      }
      span {
        line-height: 20px;
        font-size: 14px;
        color: #333;
      }
    }
  }
  .editor__content {
    padding: 0 20px;
  }
}
</style>
