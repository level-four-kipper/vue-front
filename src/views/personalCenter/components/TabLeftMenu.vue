<template>
  <div class="tab">
    <div class="tab-container">
      <div class="tab-cell" v-for="(item, index) in list" :key="index">
        <!-- <a :class="{'active':tabIndex===index}" :to="item.path" @click="handleTabClick(item,index)">
          <span>{{item.label}}</span>
        </a> -->
        <span :class="{'active':tabIndex===index}" @click=" handleTabClick (item,index)">{{item.label}}</span>

      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  list: { type: Array, default: () => [] },
  modelValue: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue'])
const tabIndex = ref(0)
const router = useRouter()
const route = useRoute()

// tab 点击
const handleTabClick = (item, index) => {
  tabIndex.value = index
  emit('update:modelValue', index)
  router.push(item.path)
}

// tab 设置
const setTabIndex = () => {
  props.list.forEach((item, index) => {
    // console.log(route.path, item, 'otiit', item.path.includes(route.path), 'dd', route.path.includes('messageIndex'))
    if (route.path.includes('messageIndex')) {
      // messagerIndex  路径相同query不同
      tabIndex.value = Number(route.query.tabIndex) 
    } else if (item.path.includes(route.path)) {
      tabIndex.value = index
    }
  })
}

onMounted(() => {
  setTabIndex()
})
</script>

<style lang="scss" scoped>
.tab-container {
  width: 260px;
  // height: 392px;
  padding: 30px 0;
  background-color: #fff;
  display: flex;
  justify-content: center;
  flex-direction: column;
  .tab-cell {
    display: flex;
    width: 100%;
    padding-left: 40px;
    span {
      position: relative;
      display: flex;
      align-items: center;
      height: 54px;
      line-height: 22px;
      font-size: 16px;
      color: #333;
      &:hover,
      &.active {
        font-weight: 600;
        color: #0175ff;
        cursor: pointer;
      }
      &.active::after {
        position: absolute;
        left: -36px;
        content: '';
        width: 3px;
        height: 20px;
        background: #0175ff;
        transform: translateX(-50%);
      }
    }
    // .router-link-active {
    //   span {
    //     font-weight: 600;
    //     color: #0175ff;
    //     cursor: pointer;
    //     &::after {
    //       position: absolute;
    //       left: -36px;
    //       content: '';
    //       width: 3px;
    //       height: 20px;
    //       background: #0175ff;
    //       transform: translateX(-50%);
    //     }
    //   }
    // }
  }
}
</style>