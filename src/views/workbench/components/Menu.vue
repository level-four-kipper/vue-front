<template>
  <div class="menu">
    <el-menu :default-active="activeIndex" class="el-menu-my" @select="handleSelect">
      <el-menu-item index="6"><span>账户设置</span></el-menu-item>
    </el-menu>
  </div>
</template>

<script setup name="Menu">
import { ref, onMounted } from 'vue'
const props = defineProps({
  title: {
    type: String,
    default: () => ''
  },
})

const emit = defineEmits(['changeMenu'])

const activeIndex = ref(6)

const handleSelect = (key, keyPath) => {
  activeIndex.value = key
  emit('changeMenu', key)
  console.log(key, keyPath);
}

onMounted(async () => {
})
defineExpose({
})
</script>
<style lang="scss" scoped>
.menu {
  .el-menu-my{
    border: none;
    width: 260px;
    :deep(.el-menu-item){
      font-size: 16px;
      font-weight: 700;
      span{
        margin-left: 22px;
      }
    }
    :deep(.el-menu-item):hover{
      background-color: #ffffff;
    }
    // .is-active {
      :deep(.el-divider--vertical){
        border-left: 2px rgb(0 102 255 / 99%) var(--el-border-style);
        position: absolute;
        margin-left: 0;
        left: 0px;
      }
    // }
  }
}
</style>
