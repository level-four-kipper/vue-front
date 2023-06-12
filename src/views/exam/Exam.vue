<template>
  <Carousel :cardList="cardList"></Carousel>
  <!-- 试卷搜索 -->
  <div class="search-header">
    <div class="search-contanier">
      <div class="exam-search">
        <SearchInput placeholder="你想了解什么"> </SearchInput>
        <span class="title">历史搜索:</span>
        <span class="search-history">
          <span>java</span>
          <span>c#</span>
          <span>python</span>
        </span>
      </div>
      <div class="exam-classify">
        <span class="title">考试分类:</span>
        <span class="classify-name">
          <span>java</span>
          <span>c#</span>
          <span>python</span>
          <span>linux</span>
        </span>
      </div>
    </div>
  </div>
  <!-- 考试列表 -->
  <div class="content-exam">
    <div class="exam-contanier">
      <el-scrollbar class="exam-scroll" height="600px">
        <ul class="exam-list" v-infinite-scroll="loadExamList">
          <li v-for="(item,index) in examList" :key="index" class="exam-item-message">
            <div class="left">
              <img class="paper-icon" src="@/assets/img/logo.png" />
              <div class="exam-message">
                <div class="exam-title">
                  <span>{{item.exam_name}}</span>
                  <button class="exam-level">基础</button>
                </div>
                <p class="exam-description">{{item.explain_string}}</p>
              </div>
            </div>
            <div class="right">
              <div class="exam-detail">
                <p>试题数量:20</p>
                <p>答题时长:{{item.exam_time}}min</p>
                <p>参与人数:40</p>
              </div>
              <button class="exam-answer" @click="answerExam(item.id)">测试一下</button>
            </div>
          </li>
        </ul>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup>
import Carousel from "@/components/Carousel.vue";
import SearchInput from "@/components/SearchInput.vue";
import { useRouter, useRoute  } from 'vue-router'
import {fetchExamList } from '@/api/exam.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import { onMounted  } from 'vue '
import {ref,reactive} from 'vue'
const cardList = [{img:"@/assets/img/blog-index/img1.jpg", title:"1", url:"1"},
              {img:"@/assets/img/blog-index/img2.jpg", title:"2", url:"1"},
              {img:"@/assets/img/blog-index/img3.jpg", title:"3", url:"1"},
              {img:"@/assets/img/blog-index/img4.jpg", title:"4", url:"1"},
              {img:"@/assets/img/blog-index/img5.jpg", title:"5", url:"1"},]

const router = useRouter()
const examList = ref([])
const pagination = reactive({
      curPageSize:10,
      curPage:1,
      total:0,
  })


function answerExam(id){
  router.push(`./answerExam/${id}`)
}

function loadExamList()  {
  getExamList()
}


//请求
function getExamList(){
  const  params =  {
    "entity":{
      "curr_page": pagination.curPageSize,
      "paper_size": pagination.curPageSize
    }
  }
    fetchExamList(params).then(res =>{
        if(res.code === 0 && res.data ){
         examList.value = examList.value.concat([...res.data.list])
         pagination.total = res.data.total_page
        }else{
             ElMessage({
              message: res.msg ||  res.data.error,
              type: 'error',
            })
        }
    })
}

onMounted(() =>{
  getExamList()
})
</script>
<style scoped lang="scss">
 .content {
    padding: 10px 0;
    background-color: #ccc;
}
  .carousel-main{
    padding: 40px 20px;
  }
 .search-header{
      .search-contanier{
        height: 100px;
        background-color: #fff;
        padding: 10px 80px;
        .exam-search{
          height: 60px;
          display: flex;
          align-items: center;
          .title{
            margin-left: 20px;
          }
          .search-history{
            span{
              padding-left:10px;
            }

          }
      }
        .exam-classify{
          .title{
            padding: 0 10px;
          }
        .classify-name{
          span{
            padding: 0 10px;
          }
        }
      }

      }


  }

  .content-exam{
    .exam-contanier{
      padding: 10px 80px;
      .exam-scroll{
        padding: 0 20px;
         .exam-list{
          padding: 0  ;
          .exam-item-message{
            margin-bottom: 20px;
            height: 128px;
            padding: 10px 20px;
            padding-bottom: 10px;
            list-style: none;
            border: 1px solid #ccc;
            display: flex;
            align-items: center;
            background-color: #fff;
            .left{
              flex: 1;
              display: flex;
              align-items: center;
              .paper-icon{
                  width: 80px;
                  height: 80px;
                  object-fit: fill;
              }
              .exam-message{
                .exam-title{
                  height: 30px;
                  width: 100%;
                  .exam-level{
                    border: 1px solid #faad14;
                    margin-left: 20px;
                    border-radius: 10px;
                    width: 44px;
                    height: 24px;
                    background-color: #faad14;
                    color: #fff;
                }
              }
                .exam-description{
                  height: 40px;
                  // text-align: center;
                }

              }
            }
            .right{
              width:300px;
              display: flex;
              align-items: center;
              .exam-detail{
                flex: 1;
                color: #c6c6c6;
              }
              .exam-answer{
                width: 68px;
                height: 30px;
                margin: 0 10px;
                background-color: #0066fffc;
                border: none;
                color: #fff;
              }

            }
          }
        }
      }

    }
  }
</style>
