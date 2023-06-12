<template>
  <div class="list-search">
    <div class="search">
      <div class="search-title">
        全部试题
        <span>{{count || 0}}</span>
      </div>
      <!--  搜索 -->
      <div class="search-content">
        <div class="search-input">
          <input type="text" placeholder="输入关键字搜索" v-model="keyword" @change="changeSearch()" />
          <img src="@/assets/img/index/g-search.png" @click="changeSearch()" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

defineProps({
  count: {
    type: Number,
    default: () => 0
  }
})
const keyword = ref('')
const emit = defineEmits(['search'])

const changeSearch = () => {
  emit('search', keyword.value)
}
defineExpose({
  keyword
})
</script>
<style lang="scss" scoped>
.list-search {
  display: flex;
  background: #eef3fd;
  justify-content: center;
  border-radius: 4px;
  padding: 35px 0px 15px 0px;
  .search{
    display: flex;
    justify-content: space-between;
    width: 1200px;
    .search-title{
      color: #333333;
      font-size: 18px;
      font-weight: 600;
      span{
        color: #9196A6;
        margin-left: 10px;
      }
    }
    .search-content {
      flex: 1;
      .search-input {
        float: right;
        right: 0;
        display: flex;
        width: 220px;
        padding: 0 16px;
        align-items: center;
        color: #9196a6;
        background: #ffffff;
        border-radius: 18px;
        height: 36px;
        input {
          min-width: 0;
          font-weight: 400;
          flex: 1 1 auto;
          background: #ffffff;
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
  }
}
</style>
