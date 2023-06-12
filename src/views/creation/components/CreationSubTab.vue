<template>
  <div class="tab">
    <div class="tab-father">
      <div class="tab-cell" v-for="(item, index) in list" :key="index">
        <span :class="{active: Number(tabIndex) === index}" @click="handleTabClick(index)">{{item.label}}</span>
      </div>
      <!--  个人视角可搜索 -->
      <div v-if="!route.params.id" class="tab-search">
        <div class="search">
          <input type="text" placeholder="输入关键字搜索" v-model="textValue" @change="changeSearch(textValue)" />
          <img src="@/assets/img/index/g-search.png" @click="changeSearch(textValue)"/>
        </div>
      </div>

    </div>
    <div class="tab-children" v-if="showChildren">
      <div class="tab-cell" v-for="(item, index) in list[1].children" :key="index">
        <span :class="{active: subTabIndex === index}" @click="handleSubTabClick(index)">{{item.label}}</span>
      </div>
    </div>

  </div>
</template>

<script setup>
import SearchInput from '@/components/SearchInput.vue'

const props = defineProps({
  index: {
    type: String,
    default: () => ''
  },
  list: {
    type: Array,
    default: () => []
  },
  showChildren: {
    type: Boolean,
    default: () => false
  },
})
const textValue = ref('')
const emit = defineEmits(['handleClick', 'handleSearch', 'search'])
const route = useRoute()
// tab
const tabIndex = ref(Number(route.query.type || 0))
const subTabIndex = ref(0)
// tab 点击
const handleTabClick = index => {
  tabIndex.value = index
  const obj = {
    index: tabIndex.value,
    subIndex: subTabIndex.value,
    label: props.list[index].children ? props.list[index].children[subTabIndex.value].label : props.list[index].label
  }
  emit('handleClick', obj)
}

// subtab 点击
const handleSubTabClick = index => {
  subTabIndex.value = index
  const obj = {
    index: tabIndex.value,
    subIndex: subTabIndex.value,
    label: props.list[tabIndex.value].children[index].label
  }
  emit('handleClick', obj)
}

const changeSearch = keyword => {
  emit('search', keyword)
}

defineExpose({
  handleTabClick,
  textValue
})

</script>

<style lang="scss" scoped>
.tab {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 910px;
  border-radius: 4px;
  background: #fff;

  &-father,
  &-children {
    display: flex;
    height: 54px;
    padding: 0 10px 0 30px;
    align-items: center;
  }

  .tab-cell {
    display: flex;
    justify-content: center;
    margin-right: 40px;
    &:last-child {
      margin: 0;
    }
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
      &.active {
        &::after {
          position: absolute;
          left: 50%;
          bottom: 0;
          content: '';
          width: 16px;
          height: 3px;
          background: #0175ff;
          transform: translateX(-50%);
        }
      }
    }
  }
  .tab-search {
    flex: 1;
    .search {
      float: right;
      right: 0;
      display: flex;
      width: 220px;
      padding: 0 16px;
      align-items: center;
      color: #9196a6;
      background: #eef3fd;
      border-radius: 18px;
      height: 36px;
      input {
        min-width: 0;
        font-weight: 400;
        flex: 1 1 auto;
        background: #eef3fd;
        border: none;
        outline: none;
        &::placeholder {
          color: #9196a6;
        }
      }
      img {
        width: 16px;
        height: 16px;
        margin-left: 10px;
      }
    }
  }

  &-children {
    position: relative;
    &::before {
      position: absolute;
      top: 0;
      left: 0;
      content: '';
      width: 100%;
      height: 1px;
      opacity: 0.5;
      background: #c8c8db;
      transform: translateY(-50%);
    }
    .tab-cell span {
      line-height: 20px;
      font-size: 14px;
      color: #6d717d;
    }
  }
}
</style>
