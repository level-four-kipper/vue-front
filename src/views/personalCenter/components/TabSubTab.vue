<template>
  <div class="tab">
    <div class="tab-father">
      <div
        class="tab-cell"
        v-for="(item, index) in list"
        :key="index"
      >
        <span
          :class="{active: tabIndex === index}"
          @click="handleTabClick(index)"
        >{{item.label}}</span>
      </div>
      <!--  个人视角可搜索 -->
      <div
        v-if="!route.params.id"
        class="tab-search"
      >
        <div class="search">
          <el-input
            type="text"
            placeholder="输入关键字搜索"
            v-model="textValue"
            clearable
            @keyup.enter="updateSearchValue(textValue)"
          />
          <img
            @click="updateSearchValue(textValue)"
            src="@/assets/img/index/g-search.png"
          />
        </div>
      </div>
    </div>
    <!-- <div class="tab-children" v-if="tabIndex === 1">
      <div class="tab-cell" v-for="(item, index) in list[1].children" :key="index">
        <span :class="{active: subTabIndex === index}" @click="handleSubTabClick(index)">{{item.label}}</span>
      </div>
    </div> -->
  </div>
</template>

<script setup>
const props = defineProps({
  list: {
    type: Array,
    default: () => []
  },
})
const { searchValue, updateSearchValue } = inject('searchValue')
const textValue = ref('')
const emit = defineEmits(['handleClick', 'handleSearch'])
const route = useRoute()
const router = useRouter()
// tab
const tabIndex = ref(Number(route.query.tabIndex) || 0)
const subTabIndex = ref(0)

// tab 点击
const handleTabClick = index => {
  updateSearchValue('')
  textValue.value = ''
  tabIndex.value = index
  const obj = {
    index: tabIndex.value,
    subIndex: subTabIndex.value,
    label: props.list[index].children ? props.list[index].children[subTabIndex.value].label : props.list[index].label
  }
  console.log('handleClick');
  emit('handleClick', obj)
  router.push({
    path:  route.path,
    query: {
      tabIndex: tabIndex.value
    }
  })


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
      :deep(.el-input) {
        min-width: 0;
        font-weight: 400;
        flex: 1;
        background: #eef3fd;
        border: none;
        outline: none;
        &::placeholder {
          color: #9196a6;
        }
        .el-input__wrapper {
          padding: 0;
          background: #eef3fd;
          box-shadow: none;
          border: none;
          .el-input__inner {
            background: #eef3fd;
          }
        }
      }
      img {
        width: 16px;
        height: 16px;
        margin-left: 6px;
        cursor: pointer;
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
