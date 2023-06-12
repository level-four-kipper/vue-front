<template>
  <div>
    <div class="container">
      <div class="head">
        <span>TA的热度</span>
      </div>
      <div class="main hot">
        <div v-for="(item, index) in hotList" :key="index">
          <img :src="item.icon" />
          <div class="hot-num">{{item.number}}</div>
          <div class="hot-title">{{item.name}}</div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="head">
        <span>TA的互动</span>
      </div>
      <div class="main interact">
        <div class="interact-cell" v-for="(item, index) in interactList" :key="index">
          <div class="interact-cell-left">
            <img :src="item.icon" />
            <span>{{item.name}}</span>
          </div>
          <span class="interact-cell-right">{{item.number}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import hotLike from '@/assets/img/authorPhoto/hot-like.png'
import hotComment from '@/assets/img/authorPhoto/hot-comment.png'
import hotStar from '@/assets/img/authorPhoto/hot-star.png'
import interactLike from '@/assets/img/authorPhoto/icon/interact-like.png'
import interactComment from '@/assets/img/authorPhoto/icon/interact-comment.png'
import interactStar from '@/assets/img/authorPhoto/icon/interact-star.png'
import interactAnswer from '@/assets/img/authorPhoto/icon/interact-answer.png'
import interactExercise from '@/assets/img/authorPhoto/icon/interact-exercise.png'
import interactExam from '@/assets/img/authorPhoto/icon/interact-exam.png'

import { fetchGatherInfoInteract, fetchGatherInfoPopularity } from '@/api/authorSpace.js'

const route = useRoute()
const id = route.params.id
// 热度
const hotList = reactive([
  { icon: hotLike, name: '点赞', number: 0 },
  { icon: hotComment, name: '评论', number: 0 },
  { icon: hotStar, name: '收藏', number: 0 }
])

// 互动
const interactList = reactive([
  { icon: interactLike, name: '点赞', number: 0 },
  { icon: interactComment, name: '评论', number: 0 },
  { icon: interactStar, name: '收藏', number: 0 },
  { icon: interactAnswer, name: '回答', number: 0 },
  { icon: interactExercise, name: '刷题', number: 0 },
  { icon: interactExam, name: '考试', number: 0 }
])

// 获取TA的热度信息
const handleGetPopularity = () => {
  fetchGatherInfoPopularity(id).then(res => {
    if (res.code === 0) {
      ;({ like_count: hotList[0].number, comment_count: hotList[1].number, star_count: hotList[2].number } = res.data)
    }
  })
}

// 获取TA的互动信息
const handleGetInteract = () => {
  fetchGatherInfoInteract(id).then(res => {
    if (res.code === 0) {
      ;({ like_count: interactList[0].number, comment_count: interactList[1].number, star_count: interactList[2].number, answer_count: interactList[3].number } = res.data)
    }
  })
}

onMounted(() => {
  handleGetPopularity()
  handleGetInteract()
})

defineExpose({
  handleGetPopularity
})
</script>

<style lang="scss" scoped>
.container {
  width: 260px;
  margin-bottom: 20px;
  padding: 0 20px;
  border-radius: 4px;
  background: #fff;
  .head {
    position: relative;
    padding: 18px 0 12px;
    text-align: center;
    span {
      line-height: 22px;
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }
    &::after {
      position: absolute;
      left: 1px;
      bottom: 0;
      content: '';
      width: 220px;
      height: 1px;
      background: #e3e3ed;
    }
  }
  .main {
    display: flex;
    align-items: center;
    padding: 20px 0 30px;
    &.hot {
      & > div {
        flex: 1;
        line-height: 0;
        text-align: center;
        img {
          height: 32px;
        }
        .hot-num {
          line-height: 25px;
          font-size: 18px;
          font-weight: 600;
          color: #333;
          margin: 10px 0 6px;
        }
        .hot-title {
          line-height: 20px;
          font-size: 14px;
          color: #6d717d;
        }
      }
    }
    &.interact {
      flex-direction: column;
      .interact-cell {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        margin-bottom: 20px;
        span {
          line-height: 20px;
          font-size: 14px;
        }
        &-left {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #6d717d;
          img {
            width: 18px;
            margin-right: 10px;
          }
        }
        &-right {
          color: #333;
        }
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>