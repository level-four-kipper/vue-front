<template>
  <div class="fans">
    <el-card>
      <h2>消息通知</h2>
    </el-card>
  </div>
</template>

<script setup name="Notification">
import { ref, onMounted } from 'vue'
const props = defineProps({
  title: {
    type: String,
    default: () => ''
  },
})

const activeIndex = ref(0)

const handleSelect = (value) => {
  activeIndex.value = value
}

onMounted(async () => {
})
defineExpose({
})
</script>
<style lang="scss" scoped>
.menu {
  .el-menu-my{
    width: 260px;
    :deep(.el-menu-item){
      font-size: 16px;
      font-weight: 700;
      span{
        margin-left: 22px;
      }
    }
    .is-active {
      :deep(.el-divider--vertical){
        border-left: 2px rgb(0 102 255 / 99%) var(--el-border-style);
        position: absolute;
        margin-left: 0;
        left: 0px;
      }
    }
  }
}
</style>
