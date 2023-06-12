<template>
  <!--  个人视角可编辑 -->
  <div class="edit-set">
    <span @click.stop="handleJump(item )" class="edit-content">
      <img src="@/assets/img/personalCenter/edit.png">
      <img src="@/assets/img/personalCenter/edit-active.png">
      <span>编辑</span>
    </span>
    <span class="more-content">
      <img src="@/assets/img/personalCenter/more.png" class="more" @click.stop="clickMore">
      <img src="@/assets/img/personalCenter/more-active.png" class="more" @click.stop="clickMore">
      <el-button v-show="item.isMore" class="btn-delete" @click.stop="handleDelete( item.id,index)">删除</el-button>
    </span>
  </div>
</template>
<script setup> 
const props = defineProps({
  handleDelete: Function,
  handleJump: Function,
  index: Number,
  list: Array
})
const item = reactive(props.list[props.index])
const recordIndex = ref(0) //点击列表下标
// 点击更多
const clickMore = () => {
  item.isMore = !item.isMore;
  if (recordIndex.value !== props.index) {
    // 点击不同的博客隐藏之前博客点击更多
    props.list[recordIndex.value].isMore = false
    recordIndex.value = props.index
  }
}

onMounted(() => {
  // 监听点击事件，当点击其他区域的more隐藏
  // document.addEventListener('click', (e) => {
  //   console.log(item, 'item');
  //   if (e.target.className !== 'more') {
  //     props.item.isMore = false
  //   }
  // })
})

</script>


<style scoped lang="scss">
.edit-set {
  margin-top: 1px;
  background: #fff;
  padding: 0 10px;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 400;
  .edit-content {
    margin-right: 16px;
    img:nth-child(2) {
      display: none;
    }
    &:hover {
      img:nth-child(1) {
        display: none;
      }
      img:nth-child(2) {
        display: inline-block;
      }
      span {
        color: #0175ff;
        opacity: 0.85;
      }
    }
  }
  .more-content {
    img:nth-child(2) {
      display: none;
    }
    &:hover {
      img:nth-child(1) {
        display: none;
      }
      img:nth-child(2) {
        display: inline-block;
      }
    }
  }
  img {
    cursor: pointer;
  }
  & > span {
    cursor: pointer;
    display: flex;
    align-items: center;
  }
  .btn-delete {
    z-index: 99;
    position: absolute;
    top: 30px;
    right: -8px;
    background: #ffffff;
    border: none;
    color: #333;
    box-shadow: 0 2px 16px 0 rgba(156, 172, 209, 0.44);
  }
}
</style>