<template>
  <p v-html="comment.content"></p>
  <el-input v-show="replayId===comment.id" class="comment-top" type="textarea" :rows="2" :placeholder="'回复  @'+comment.user_name" v-model.trim="replay"> </el-input>
  <el-button v-show="replayId===comment.id" class="comment-top comment-right" type="primary" @click="postComment(comment, 4, comment)">提交回复</el-button>
</template>

<script setup name="Replay">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus'
import {addComment, updateLike, updateCollect, getAnswerComments} from '@/api/answer.js'
import User from './User.vue'
const props = defineProps({
  comment: {
    type: Object,
    default: () => {}
  }
})

let replayId = ref(-1)
let replay = ref('')

const toggleLike = (comment, type) =>{
  const params = {
    article_id: comment.id,
    article_type: type
  }
  updateLike(params).then(res=>{
    if(res.code!==0){
      ElMessage({ showClose:true, message:'点赞失败', type:'error' })
    }
  }).catch(err=>{
    console.log(err)
    ElMessage({ showClose:true, message:'点赞失败', type:'error' })
  })
}
const toggleCollect = (comment, type) =>{
  const params = {
    article_id: comment.id,
    article_type: type
  }
  updateCollect(params).then(res=>{
    if(res.code!==0){
      ElMessage({ showClose:true, message:'收藏失败', type:'error' })
    }
  }).catch(err=>{
    console.log(err)
    ElMessage({ showClose:true, message:'收藏失败', type:'error' })
  })
}

const showComment = (comment) =>{
  comment.commenting = !comment.commenting
  replayId.value = comment?.id
}

const queryAnswerComments= (id) => {
  getAnswerComments(id).then( res=>{
    if(res?.data?.length){
      comments.value = res?.data
    }
  }).catch(err=>console.log(err))
}

const postComment = (comment, type, parent) =>{
  const params = {
    article_type: type,
    blog_id: comment.id,
    content: comment.replay,
    parent_id: props.answer?.id || -1,
    parent_user_id: props.answer?.user_id || -1
  }
  addComment(params).then(res=>{
    if(res.code===0){
      comment.replay = "";
      replayId.value = -1;
      queryAnswerComments(parent?.id)
      ElMessage({ showClose:true, message:'评论成功', type:'success' })
    } else {
      ElMessage({ showClose:true, message:'评论失败', type:'error' })
    }
  }).catch(err=>console.log(err))
}

const changeReplay = (comment)=>{
  if(replayId.value !== comment.id){
    replayId.value = comment.id
    comment.replay = ''
  }
}

const router = useRouter();
const route = useRoute();

onMounted( async ()=>{
  await queryAnswerComments('1588004638120702466')
})
defineExpose({
})
</script>

<style lang="scss" scoped>
.comment-top{
  margin-top: 20px;
}
.comment-left{
  margin-left: 20px;
}
.comment-flex{
  display: flex;
}
.comment-right{
  display: flex;
  margin-left: auto;
}
.comment-active{
  color: #0175FF;
}
.comment-banner{
  background-color: #ffffff;
  margin: 20px 18.75%;
}
.comment-myComment{
  display: flex;
  vertical-align: middle;
  margin-top: 20px;
}
.comment-title{
  color: #333333;
  font-size: 18px;
  font-weight: 800;
  margin-right: 10px;
}
.comment-count{
  color: #9196A6;
  font-weight: 700;
}
.comment-popular{
  float: right;
  margin: 0px 10px;
  line-height: 30px;
}
.comment-new{
  float: right;
  line-height: 30px;
}
.comment-myAnswer{
  display: flex;
  vertical-align: middle;
  margin-top: 20px;
}
.comment-myPortrait{
  width: 54px;
  height: 54px;
  margin-right: 18px;
  border-radius: 50%;
  vertical-align: middle;
  display: inline-block;
}
.comment-all{
  background: #FFFFFF;
  border-radius: 4px;
  margin-top: 20px;
  padding: 20px;
}
.comment-info{
  font-size: 14px;
  line-height: 32px;
  justify-content: space-between;
  span,img{
    vertical-align: middle;
  }
  .comment-img{
    width: 18px;
    height: 18px;
    display: inline-block;
    vertical-align: middle;
  }
  .comment-portrait{
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-right: 10px;
    vertical-align: middle;
    display: inline-block;
  }
  .comment-levelImg{
    height: 18px;
    margin: 0 10px;
    display: inline-block;
    vertical-align: middle;
    width: 18px;
  }
  .comment-time{
    color: #9196A6;
    font-size: 12px;
  }
  .comment-subscribeButton{
    color: #0175FF;
    text-align: center;
    background: #EEF3FD;
    border-radius: 2px;
    line-height: 32px;
    margin-left: auto;
    font-size: 14px;
    border: 0px;
    width: 62px;
    padding: 0 12.5px;
  }
  .comment-detail{
    color: #333333;
    font-size: 14px;
  }
  .comment-detailHeight{
    max-height: 150px;
    overflow: hidden;
  }
  .comment-action{
    color: #9196A6;
    display: flex;
    font-size: 14px;
    line-height: 20px;
    img{
      width: 18px;
      height: 18px;
      margin-right: 4px;
      border-radius: 50%;
      vertical-align: sub;
    }
  }
}
.comment-content{
  margin: 6px 0 0 42px;
}
.comment-replayButton{
  color: #6D717D;
  background: #EEF3FD;
  border-radius: 2px;
  font-size: 12px;
  height: 28px;
  border: 0px;
  width: 56px;
}
</style>
