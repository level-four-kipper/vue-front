<template>
  <div class="tab">
    <div class="tab-container">
      <div class="tab-cell" v-for="(item, index) in list" :key="index">
        <router-link :to="item.path" @click="handleTabClick(item,index)">
          <span >{{item.label}}</span>
        </router-link>
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
// tab 点击  
const handleTabClick = (item, index) => {
  tabIndex.value = index
  emit('update:modelValue', index)
}
onMounted(() => {
  // getFansList()

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
      &:hover  {
        font-weight: 600;
        color: #0175ff;
        cursor: pointer;
      }
      // &.active::after {
      //   position: absolute;
      //   left: -36px;
      //   content: '';
      //   width: 3px;
      //   height: 20px;
      //   background: #0175ff;
      //   transform: translateX(-50%);
      // }
    }
    .router-link-active {
      span {
        font-weight: 600;
        color: #0175ff;
        cursor: pointer;
        &::after {
          position: absolute;
          left: -36px;
          content: '';
          width: 3px;
          height: 20px;
          background: #0175ff;
          transform: translateX(-50%);
        }
      }
    }
  }
}
</style>