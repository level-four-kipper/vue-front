<template>
  <div class="menu">
    <el-menu :default-active="activeIndex" class="el-menu-my" @select="handleSelect">
      <el-menu-item index="1"><el-divider v-show="activeIndex==='1'" direction="vertical" /><span>我的创作</span></el-menu-item>
      <el-menu-item index="2"><el-divider v-show="activeIndex==='2'" direction="vertical" /><span>我的收藏</span></el-menu-item>
      <el-menu-item index="3"><el-divider v-show="activeIndex==='3'" direction="vertical" /><span>我的粉丝</span></el-menu-item>
      <el-menu-item index="4"><el-divider v-show="activeIndex==='4'" direction="vertical" /><span>我的关注</span></el-menu-item>
      <el-menu-item index="5"><el-divider v-show="activeIndex==='5'" direction="vertical" /><span>消息通知</span></el-menu-item>
      <el-menu-item index="6"><el-divider v-show="activeIndex==='6'" direction="vertical" /><span>账户设置</span></el-menu-item>
    </el-menu>
  </div>
</template>

<script setup name="Setting">
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
