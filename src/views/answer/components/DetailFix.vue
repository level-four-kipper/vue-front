<template>
  <template v-if="!isPreview">
    <img v-show="!star_flag" class="fixImg fixCollect" src="@/assets/img/index/collect.png" @click="collect" />
    <img v-show="star_flag" class="fixImg fixCollect" src="@/assets/img/index/collected.png" @click="collect" />
    <el-popover width="100" placement="left" trigger="hover">
      <div style="text-align:center">我来回答</div>
      <template #reference>
        <img class="fixImg fixComment" src="@/assets/img/index/comment.png" @click="focusMyAnswer" />
      </template>
    </el-popover>
  </template>
  <el-backtop style="right:15.104167%;cursor: pointer;width: 50px;height: 50px;" bottom="60"><img src="@/assets/img/index/g-backtop.png" /></el-backtop>
</template>

<script setup name="DetailFix">
import { watch } from 'vue'

const props = defineProps({
  star_flag: {
    type: Boolean,
    default: () => false
  }
})

const route = useRoute()
const isPreview = computed(() => {
  return route.query.preview
})
const star_flag = ref(props.star_flag)

watch(
  () => props.star_flag,
  flag => {
    star_flag.value = flag
  },
  {
    immediate: true
  }
)
const emit = defineEmits(['collect', 'focusMyAnswer'])

const collect = () => {
  emit('collect')
}

const focusMyAnswer = () => {
  emit('focusMyAnswer')
}
</script>

<style lang="scss" scoped>
.fixImg {
  position: fixed;
  width: 50px;
  bottom: 180px;
  right: 15.104167%;
  cursor: pointer;
  z-index: 180;
}
.fixCollect {
  bottom: 180px;
}
.fixComment {
  bottom: 120px;
}
</style>
