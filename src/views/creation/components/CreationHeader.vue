<template>
  <div class="head">
    <div>共<span class="number">{{totalCount || 0}}</span>个{{tabLabel}}</div>
    <Pagination v-if="route.path.search(/myFans|myConcern/) !== -1" :page="page" @handleChange="handlePageChange" />
    <button v-if="operation?.title" class="btn-question" @click="jumpPublish">+ {{operation?.title}}</button>
  </div>
</template>

<script setup>
import Pagination from '@/views/personalCenter/components/Pagination.vue'
const props = defineProps({
  tabLabel: String,
  totalCount: Number,
  menuIndex: Number,
  page: {
    type: Object,
    default: () => { }
  },
  operation: {
    type: Object,
    default: () => { }
  }
})
const emit = defineEmits(['handlePageChange'])
const route = useRoute()
const router = useRouter()
const handlePageChange = pageIndex => {
  emit('handlePageChange', pageIndex)
}

function jumpPublish () {
  if(props.operation.params){
    const routeUrl = router.resolve( props.operation.params)
    window.open(routeUrl.href, '_blank')
  }
}
</script>

<style lang="scss" scoped>
.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  line-height: 20px;
  margin-bottom: 12px;
  font-size: 14px;
  color: #333;
  .number {
    margin: 0 5px;
    color: #0175ff;
  }
  .btn-question {
    height: 32px;
    width: 74px;
    color: #fff;
    background: #0175ff;
    border-radius: 4px;
    font-weight: 400;
    border: none;
    outline: none;
    cursor: pointer;
  }
}
</style>
