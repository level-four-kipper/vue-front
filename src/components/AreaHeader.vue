<!-- 顶部领域 -->
<template>
  <div class="area-wrap">
    <div
      :class="{ 'area-box': true, 'active': showAll}"
      @mouseenter="showAll = true"
      @mouseleave="showAll = false"
    >
      <div class="area-content">
        <div class="area-list">
          <div class="active">
            <span data-id>{{ currentArea }}</span>
            <img
              v-if="currentArea !== '全部'"
              @click="handleAreaClick('')"
              src="@/assets/img/blog-index/close.png"
            />
          </div>
          <div class="line"></div>
          <span
            v-for="(item, index) in areaList"
            :key="item.id"
            @click="handleAreaClick(index)"
          >{{ item.name }}</span>
        </div>
      </div>
      <div class="area-btn">
        <DArrowRight :class="{ 'btn': true, 'active': showAll }" @click="showAll = !showAll" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { fetchTypeList } from '@/api/blog.js'

const emit = defineEmits(['handleAreaChange'])

const areaList = ref([])
const currentIndex = ref('')
const currentArea = computed(() => {
  return currentIndex.value === '' ? '全部' : areaList.value[currentIndex.value].name
})
const showAll = ref(false)

// 获取领域
const getAreaList = () => {
  fetchTypeList().then(res => {
    if (res.code !== 0) {
      return
    }
    areaList.value = res?.data || []
  })
}

// 切换领域
const handleAreaClick = index => {
  if (currentIndex.value !== index) {
    currentIndex.value = index
    emit('handleAreaChange', index !== '' ? areaList.value[currentIndex.value].id : '')
  }
}

getAreaList()
</script>

<style lang="scss" scoped>
.area-wrap {
  height: 93px;
  margin: 0 0 40px;
  .area-box {
    width: 100%;
    max-height: 93px;
    padding-top: 30px;
    overflow: hidden;
    background: #fff;
    border-bottom: 1px solid rgba(200, 200, 219, 0.5);
    &.active {
      position: absolute;
      top: 0;
      left: 0;
      max-height: 175px;
      z-index: 10;
      transition: all 0.3s;
      // box-shadow: 0px 2px 10px 0px rgba(156, 172, 209, 0.3);
    }
    .area-content {
      position: relative;
      width: 1200px;
      margin: 0 auto;
      background: #fff;
      .area-list {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin-bottom: 24px;
        span {
          line-height: 30px;
          font-size: 16px;
          margin: 3px 30px 3px 0;
          color: #333;
          cursor: pointer;
          &:hover {
            color: #0175ff;
          }
        }
        .line {
          width: 1px;
          height: 20px;
          margin: 0 20px;
          background: rgba(200, 200, 219, 0.5);
        }
        .active {
          display: flex;
          align-items: center;
          height: 36px;
          padding: 0 12px;
          background: #eef3fd;
          border-radius: 2px;
          span {
            margin-right: 0;
            font-weight: 600;
            word-break: keep-all;
            color: #0175ff;
          }
          img {
            margin-left: 12px;
            cursor: pointer;
            &:hover {
              opacity: 0.85;
            }
          }
        }
      }
    }
    .area-btn {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 24px;
      line-height: 0;
      padding: 5px 0 6px;
      text-align: center;
      background: #fff;
      .btn {
        width: 13px;
        height: 13px;
        transform: rotate(90deg);
        color: #0175ff;
        cursor: pointer;
        transition: all 0.3s;
        &.active {
          transform: rotate(-90deg);
        }
      }
    }
  }
}
</style>
