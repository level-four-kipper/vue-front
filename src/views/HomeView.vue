<template>
  <div :class="['common-layout', route.meta.hideFooter ? 'max-height' : '']">
    <el-container class="m-container">
      <Header class="m-header">
        <template #left>
          <div v-if="route?.meta?.left" class="header-left">
            <el-divider class="leftDivider" direction="vertical" />
            <span>{{ route?.meta?.left }}</span>
          </div>
        </template>
        <template #right><span v-if="route?.meta?.hideRight"></span> </template>
      </Header>
      <el-main class="m-content">
        <router-view :key="route.meta.routerViewKey || routeKey" />
      </el-main>
      <Footer v-show="!route.meta.hideFooter" />
    </el-container>
  </div>
</template>

<script setup>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const routeKey = ref('')

watch(
  () => route?.fullPath,
  newVal => {
    routeKey.value = newVal
  },
  {
    immediate: true,
  },
)
</script>

<style scoped lang="scss">
.common-layout {
  min-width: 1200px;

  .m-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: end;

    .m-header {
      box-sizing: border-box;
      flex-shrink: 0;
      position: fixed;
      top: 0;
      z-index: 101;
      width: 100%;

      .header-left {
        align-items: center;
        display: flex;
        min-width: 300px;

        .leftDivider {
          height: 20px;
          margin: 0 15px;
          border-left: 2px var(--el-border-color) var(--el-border-style);
        }

        span {
          color: #333333;
          font-size: 18px;
          font-weight: 600;
        }
      }
    }

    .m-content {
      margin-top: 64px !important;
      min-height: calc(100vh - 317px);
      overflow: visible;
      width: 100%;
      padding: 0;
      > div {
        min-height: calc(100vh - 317px);
      }
    }
  }
}

.max-height {
  height: 100vh;
}
</style>
