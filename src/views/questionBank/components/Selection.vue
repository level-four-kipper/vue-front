<template>
  <div class="selection">
    <el-checkbox-group v-model="answerList" @change="changeAnswer">
      <el-checkbox v-for="item in options" :key="item.option" :label="item.option + '. ' + item.option_content"></el-checkbox>
    </el-checkbox-group>
  </div>
</template>
<script setup>
const props = defineProps({
  type: {
    type: Number,
    default: 1,
  },
  options: {
    type: Array,
    default: () => [],
  },
})

const answerList = ref([])

const changeAnswer = val => {
  if (props.type === 0) {
    answerList.length = 0
    answerList.push(val.pop())
  }
}
</script>
<style lang="scss" scoped>
.selection {
  margin-top: 10px;
  min-height: 20px;
  width: 100%;
  :deep(.el-checkbox) {
    margin-right: 40px;
    display: block;
  }
}
</style>
