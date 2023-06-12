<template>
  <!-- 回答人信息 -->
  <div class="answer-flex answer-info">
    <div>
      <User :userid="answer.user_id" :username="answer.username" :time="answer.time_different" :avatar="answer.img_url" @userClick="jumpPage(`/authorIndex/${answer.user_id}`)">
        <template #user-other>
          <!-- <img class="comment-levelImg" src="@/assets/img/index/newBloger.png" alt="用户等级" /> -->
        </template>
      </User>
    </div>
    <button v-show="!answer.author_flag && !answer.follow_flag" class="answer-subscribe hover" style="height: 32px" @click="subscribe(answer.user_id)">+关注</button>
    <button v-show="!answer.author_flag && answer.follow_flag" class="answer-subscribe hover" style="height: 32px" @click="subscribe(answer.user_id)">已关注</button>
  </div>
  <!-- 回答内容 -->
  <p ref="answerContent" class="answer-detail answer-top" :class="{'answer-detailHeight':(showMore && !showMoreContent)}">
    <!-- {{answer.content}} -->
    <VMdPreview :text="answer.content" />
  </p>
  <div class="answer-el-button">
    <el-button v-show="showMore && !showMoreContent" type="text" @click="showMoreContent=true">
      展开阅读全文
      <img src="@/assets/img/answerPhoto/形状结合.png" />
    </el-button>
  </div>
</template>

<script setup name="AnswerContent">
import { ref, computed } from 'vue'
import VMdPreview from '@/components/VMdPreview.vue'
import { changeFollow } from '@/api/answer.js'
import User from './User.vue'
const props = defineProps({
  answer: {
    type: Boolean
  }
})

const answerContent = ref()
const showMoreContent = ref(false)

const showMore = ref(false)
const router = useRouter()
const jumpPage = path => {
  const routeUrl = router.resolve({
    path
  })
  window.open(routeUrl.href, '_blank')
}

const emit = defineEmits(['subscribe'])

const subscribe = user_id => {
  emit('subscribe', user_id)
}

onMounted(() => {
  setTimeout(() => {
    if (answerContent.value?.offsetHeight > 160) {
      showMore.value = true
    } else {
      showMore.value = false
    }
  }, 500)
})
</script>

<style lang="scss" scoped>
.hover {
  &:hover {
    cursor: pointer;
    opacity: 0.85;
  }
}
.answer-flex {
  display: flex;
}
.answer-top {
  margin-top: 4px;
}
.answer-info {
  font-size: 14px;
  max-height: 32px;
  //   justify-content: space-between;
  span,
  img {
    vertical-align: middle;
  }
  .comment-levelImg {
    height: 18px;
    display: inline-block;
    vertical-align: middle;
    width: 18px;
  }
  .answer-subscribe {
    color: #0175ff;
    text-align: center;
    background: #eef3fd;
    border-radius: 2px;
    line-height: 32px;
    margin-left: auto;
    font-size: 14px;
    border: 0px;
    min-width: 62px;
    padding: 0 12.5px;
  }
}
.answer-detail {
  color: #333333;
  font-size: 14px;
  margin-left: -32px;
  width: 670px;
}
.answer-detailHeight {
  max-height: 110px;
  overflow: hidden;
}
.answer-el-button {
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  text-align: center;
  span {
    color: #0175ff;
  }
  img {
    margin-left: 4px;
  }
}
:deep(.vuepress-markdown-body) {
  padding: 0;
}
:deep(.github-markdown-body) {
  padding-bottom: 0px;
  p {
    margin-bottom: 0px;
  }
}
</style>
