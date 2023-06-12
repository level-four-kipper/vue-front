<template>
  <div class="pagination">
    <el-icon color="#333" :size="20" :class="{'pagination-btn': true, 'disabled': currentPage <= 1}" @click="currentPage > 1 && handlePrev()">
      <ArrowLeft />
    </el-icon>
    <el-input-number v-model="currentPage" :controls="false" :min="1" :max="page?.totalPage" :value-on-clear="1" @change="handlePageChange"></el-input-number>
    /
    <span class="pagination-total">{{page?.totalPage}}</span>
    <el-icon color="#333" :size="20" :class="{'pagination-btn': true, 'disabled': currentPage >= page?.totalPage}" @click="currentPage < page?.totalPage && handleNext()">
      <ArrowRight />
    </el-icon>
  </div>
</template>

<script setup>
const props = defineProps({
  page: {
    type: Object,
    default: () => {}
  }
})

const currentPage = ref(props.page?.pageIndex)

const emit = defineEmits(['handleChange'])

const handlePrev = () => {
  currentPage.value = currentPage.value - 1
  emit('handleChange', currentPage.value)
}

const handleNext = () => {
  console.log('===========')
  currentPage.value = currentPage.value + 1
  emit('handleChange', currentPage.value)
}

const handlePageChange = page => {
  currentPage.value = page
  emit('handleChange', currentPage.value)
}
</script>

<style lang="scss" scoped>
.pagination {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #333;
  user-select: none;
  &-btn {
    &:hover {
      cursor: pointer;
      opacity: 0.85;
    }
    &.disabled {
      &:hover {
        cursor: no-drop;
      }
    }
  }
  .el-input-number {
    width: 54px;
    margin: 0 10px;
    font-size: 14px;
    color: #0175ff;
  }
  &-total {
    margin: 0 10px;
    line-height: 20px;
    font-size: 14px;
    color: #333;
  }
}
</style>
