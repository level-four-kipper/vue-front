<template>
        <div class="container">
        <div class='header'>
            <span>系统通知</span>
        </div>
        <div class="detail-content" v-loading='loading'>
            <div class="detail-content_header">
                <span class="title">
                    {{detailNotification.title}}
                </span>
                <span class="time">
                    {{detailNotification.publish_time}}
                </span>
            </div>
            <div class="detail-content_content">
                {{detailNotification.content}}
            </div>        
            </div>
            <div class="button">
                <el-button type="primary" @click="close" class="close">关闭</el-button>
            </div>
    </div>
</template>
<script setup>
import { onMounted, ref, watch } from "vue"
import { useRouter } from "vue-router"
import { noticicationDetail ,updateStatus } from '@/api/notification.js'
import { ElMessage } from 'element-plus'
const detailNotification=ref(
    {tittle:'',publish_time:'',content:''}

)
const loading=ref(true)
const router=useRouter()
const notificationId=ref()
notificationId.value=router.currentRoute.value.params.id
onMounted(()=>{
    getNotificationDetail()
})
watch(()=>router.currentRoute.value.params.id,()=>{
    if(router.currentRoute.value.params.id){
            notificationId.value=router.currentRoute.value.params.id
            getNotificationDetail()
    }

})
//获取单条信息详情，获取后信息状态变为已读
function getNotificationDetail(){
    noticicationDetail(notificationId.value).then(result=>{
        if(result.code===0){
            detailNotification.value=result.data
            result.data.status===0?toUpdateStatus(1):''
            loading.value=false
        }else{
            console.log(router.currentRoute.value.params.id,'id')
            ElMessage({
              showClose: true,
              message: '请稍后再试.',
            })
        }
    })
}
//更新信息的状态
function toUpdateStatus(status){
    updateStatus({
        "id":notificationId.value,
        "status":status
    }).then(result=>{
        if(result.code===0){
            console.log(result)
        }
    })
}
//关闭
function close(){
    router.push('/workPanel/notification')
}
</script>
<style lang="scss" scoped>
.container{
    width: 100%;
    height: 100px;
    padding:0 200px;
    .header{
        width:100%;
        height: 60px;
        border-bottom:1px solid #8590a6 ;
        z-index:100;
        background-color: white;
        span{
            font-size:25px;
        }
    }
    .detail-content{
        width:100%;
        margin-top:40px;
        &_header{
            .title{
                font-size:17px;
                display: inline-block;
                margin-right: 20px;
                font-weight: 600;
            }
            .time{
                font-size: 14px;
                color: #7b7f8b;
            }
        }
        &_content{
            margin-top:30px;
        } 
    }
        .close{
        margin-top:30px;
    }   
}
</style>