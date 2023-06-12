<template>
    <div class="container">
        <div class='header'>
            <span>系统通知</span>
        </div>
        <!-- 信息展示 -->
        <div class="content" v-if="!viewDetail" v-loading='loading'>
            <div class="notification-item" v-for="(item,index) in notification" :key="index" :class="[{'is-read':(item.status===0)}]">
                <div class="notification-item_header">
                    <span class="title">{{item.title}}</span>
                    <span class="receive-time">{{item.publish_time}}</span>
                </div>
               <div class="notification-item_footer">
                    <div class="notification-item_content">{{item.content}}</div>
                    <div class="button">
                        <el-button type="primary" @click="viewNotification(index,item)" >查看</el-button>
                        <el-button type="danger" @click="removeNotification(item)">删除</el-button>
                    </div>
               </div>
            </div>
        </div>
        <!-- 分页 -->
         <div class="pagination-block">
            <el-pagination 
             :page-size="pageSize" 
              :pager-count="10"
              layout="prev, pager, next"
              :total="totalCount"
              v-model:current-page="currPage"
              hide-on-single-page
              @prev-click="prevClick"
              @next-click='nextClick'
              @current-change='currentChange' 
              />
        </div>
    </div>
</template>
<script setup>
import {onMounted, ref} from 'vue'
import {fetchNotification,updateStatus,deleteNoticication} from '@/api/notification.js'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
const notification=ref([])
notification.value=[{title:'',time:'',content:''},]
const currPage=ref(1)
const totalCount=ref()
const pageSize=ref(5)
const loading=ref(true)
//获得数据
function getNotification(){
    const params={
  "curr_page": currPage.value,
  "page_size": pageSize.value,
}
    fetchNotification(params).then(result=>{
        if(result.code===0){
            notification.value=result.data.list
            totalCount.value=result.data.total_count
            console.log(result)
            loading.value=false
        }
    })
}
onMounted(()=>{
    getNotification()
})
const optionIndex=ref()
//上一页
function prevClick(){
  getNotification()
  console.log('prevClick',currPage.value)
}
//下一页
function nextClick(){
  getNotification()
}
//指定页
function currentChange(){
  getNotification()
}
// //查看信息详情
const router=useRouter()
function  viewNotification(index,item){
    router.push({name:'notificationDetail',
               params:{id:item.id}})
    console.log(item.id)
}
//删除通知信息
function removeNotification(item){
    loading.value=true
    deleteNoticication(item.id).then(result=>{
        if(result.code===0){
            getNotification()
            console.log(result)
        }else{
            loading.value=false
            ElMessage({
              showClose: true,
              message: '删除失败，稍后再试',
              type:'error'
            })
        }
    })
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
    .content{
        width:100%;
        height: 600px;
        margin-top:40px;
        .notification-item{
            border: 1px solid #8590a6;
            border-radius: 5px;
            padding: 20px 10px;
            margin:15px 0;
            &_header{
                .title{
                    font-size:17px;
                    display: inline-block;
                    margin-right: 20px;
                    font-weight: 600;
                }
                .receive-time{
                    font-size: 14px;
                    color: #7b7f8b;
                }
            }
            &_footer{
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                .notification-item_content{
                    padding:0 10px;
                    font-size: 16px;
                    color: #5f6066;
                    flex:1;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                }
            }
        }
        .is-read{
            border:solid 3px #0175FF;
            .title{
                color:#0175FF;
            }
        }
    }
    .pagination-block{
        width: 100%;
        margin-top:80px;
        .el-pagination{
            justify-content: center;
        }
    }
}
</style>