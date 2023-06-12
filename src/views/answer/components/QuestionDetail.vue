<template>
  <div class="question">
    <div>
      <div class="question-title">{{ detail.title}}</div>
    </div>
    <div class="question-description">
      <div class="spread-wrap">
        <div :class="{'no-spread':!spread,'spread-box':spread}">
          <VMdPreview :text="detail.content_md || detail.content" ref="table" />
        </div>
        <div v-if="display">
          <div v-show="spread === false" @click="spreadText" style="display: inline-block" class="spread-btn">
            <span>展开全部</span>
            <el-icon>
              <ArrowDown />
            </el-icon>
          </div>
          <div v-show="spread === true" @click="spreadText" class="spread-btn">
            <span>收起全部</span>
            <el-icon>
              <ArrowUp />
            </el-icon>
          </div>
        </div>
      </div>
      <div class="question-info">
        <el-button style="background-color: #0175ff">
          <img src="@/assets/img/answerPhoto/我来回答白.png" />
          <div @click="jumpAnswer(detail.id)">我来回答</div>
        </el-button>
        <el-button v-if="!isPreview" @click="subscribe" plain class="question-left">
          <img v-show="!starFlag" class="avatar" src="@/assets/img/collect_in.png " alt="收藏" />
          <img v-show="starFlag" class="avatar" src="@/assets/img/collected.png " alt="已收藏" />
          <ebutton class="question-active">关注问题</ebutton>
        </el-button>
        <span>{{detail.look_count }}浏览</span>
        <span>{{detail.comment_count }}回答</span>
        <span>{{detail.star_count }}关注</span>
        <span>提问于{{detail.created_time }}</span>
      </div>
    </div>
    <div class="question-tag" v-for="tag in detail.list_tags" :key="tag">#{{ tag }}#</div>
  </div>
</template>

<script setup name="QuestionDetail">
import VMdPreview from '@/components/VMdPreview.vue'
import { onMounted, ref } from 'vue'
let spread = ref(false)
const table = ref()
const display = ref(true)
function spreadText() {
  spread.value = !spread.value
}
const props = defineProps({
  detail: {
    type: Object,
    default: () => {}
  }
})
// 跳转我来回答
const router = useRouter()
const jumpAnswer = function (id) {
  router.push('/publishAnswer/' + id)
}
const route = useRoute()
const isPreview = computed(() => {
  return route.query.preview
})
const starFlag = ref(false)
watch(
  () => props.detail,
  (newV, oldV) => {
    if (newV) {
      starFlag.value = newV.star_flag
      setTimeout(() => {
        const height = document.querySelector('.github-markdown-body').offsetHeight
        if (height < 145) {
          display.value = false
        } else {
          display.value = true
        }
      }, 150)
    }
  },
  {
    immediate: true,
    deep: true
  }
)
const emit = defineEmits(['subscribe'])
const subscribe = () => {
  emit('subscribe')
}
onMounted(() => {})
</script>

<style lang="scss" scoped>
.question {
  margin-top: 20px;
  .question-left {
    cursor: pointer;
  }
  .question-active {
    color: #0175ff;
  }
  .el-button {
    margin-right: 20px;
  }
  .question-title {
    color: #333333;
    display: inline-block;
    vertical-align: middle;
    font-weight: 800;
    font-size: 26px;
  }
  button {
    border: 1px solid #0175ff;
    // background-color: #ffffff;
    border-radius: 4px;
    line-height: 32px;
    padding: 0 12px;
    vertical-align: middle;
    img,
    i {
      vertical-align: middle;
      padding-right: 10px;
    }
  }
  .question-description {
    :deep(.v-md-editor-preview) {
      .vuepress-markdown-body:not(.custom) {
        padding: 20px 0;
      }
    }
  }
  .question-info {
    color: #9196a6;
    font-size: 14px;
    line-height: 32px;
    .el-button {
      color: #ffff;
      width: 118px;
      height: 42px;
      :deep(span) {
        font-size: 16px;
      }
    }
    span {
      padding-right: 20px;
    }
  }
  .question-tag {
    color: #0175ff;
    height: 32px;
    font-size: 14px;
    border-radius: 16px;
    background: #eef3fd;
    display: inline-block;
    margin: 20px 20px 10px 0px;
    padding: 4px 16px;
  }
}
.no-spread {
  tab-size: 2;
  height: 85px;
  margin-bottom: 20px;
  overflow: hidden;
}
.spread-box {
  tab-size: 2;
  overflow: hidden;
}
.spread-wrap {
  cursor: pointer;
  width: 850px;
  overflow: hidden;
  .float-left {
    float: left;
  }
  .float-right {
    padding-top: 20px;
    float: right;
  }
}
.spread-btn {
  margin-bottom: 20px;
  width: 147px;
  color: #0175ff;
  .el-icon {
    width: 36px;
    padding-top: 5px;
  }
}
:deep(.github-markdown-body) {
  padding-left: 0px;
}
</style>
