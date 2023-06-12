<template>
  <div class="search-box">
    <el-input v-model.trim="searchVal" :placeholder="placeholder" clearable @input="emit('update:keyword', searchVal)"></el-input>
    <span class="search-icon"></span>
  </div>
</template>

<script setup>
const props = defineProps({
  placeholder: {
    type: String,
    default: '',
  },
  keyword: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['update:keyword'])

const searchVal = ref(props.keyword)

const clearSearchVal = () => {
  searchVal.value = ''
}

// 向外暴露属性
defineExpose({ clearSearchVal })
</script>

<style lang="scss" scoped>
.search-box {
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: -14px;
  padding: 1px 18px;
  background: #eef3fd;
  border-radius: 36px;
  :deep(.el-input) {
    flex: 1;
    margin-right: 6px;
    .el-input__wrapper {
      padding: 0;
      background: #eef3fd;
      border-radius: 18px;
      box-shadow: none;
    }
    .el-input__suffix {
      color: #0175ff;
      font-size: 16px;
    }
    .el-input__inner {
      height: 36px;
      line-height: 36px;
    }
  }
}
.search-icon {
  position: relative;
  width: 15px;
  height: 15px;
  border-radius: 15px;
  margin-top: -2px;
  margin-right: -6px;
  border: 2px solid #0175ff;
  cursor: pointer;
  &::after {
    position: absolute;
    top: 11px;
    right: -3px;
    content: '';
    width: 5px;
    height: 2px;
    background: #0175ff;
    transform: rotate(45deg);
  }
  &:hover {
    opacity: 0.85;
  }
}
</style>
