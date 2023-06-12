<template>
  <h2>试题审核</h2>
  <div class="container">
    <div class="test-review">
      <!-- 试题-->
      <div class="test">
        <div class="left">
          <div class="test-list">
            <p class="test-title">{{ questionList.title }}</p>
            <p class="test-content" v-show="questionList.type==='单选题'||questionList.type==='多选题'" v-for="(optionList,index) in questionList.options" :key="index">
              {{ optionList.option }}. {{ optionList. optionContent}}
            </p>
            <p class="test-content" v-if="questionList.type==='判断题'||questionList.type==='单选题'||questionList.type==='多选题'">正确答案：{{ questionList.answer }}</p>
            <p class="test-content" v-if="questionList.type==='问答题'||questionList.type==='编程题'">正确答案：略</p>
          </div>
          <!-- 水平分割线 以下-->
          <div class="divider-below">
            <el-divider />
            <div class="below">
              <div class="result">
                <el-form :model="resultForm" require-asterisk-position="right">
                  <el-form-item label="审核结论" prop="result" required="true">
                    <div class="review-btn">
                      <el-button @click.stop="pass" class="pass">通过</el-button>
                      <el-button @click.stop="refuse" class="refuse">拒绝</el-button>
                    </div>
                  </el-form-item>
                  <el-form-item label="拒绝原因" v-show="isRefuse" prop="refuseReason" required="true">
                    <el-input v-model="description" :rows="5" type="textarea" placeholder="请填写拒绝原因" />
                  </el-form-item>
                </el-form>
              </div>
              <div class="btn">
                <el-button type="primary" @click.stop="sure">确定</el-button>
              </div>
            </div>
          </div>
        </div>
        <!-- 垂直分割线及相关信息 -->
        <el-divider direction="vertical" />
        <div class="info-list">
          <!-- <el-divider direction="vertical" /> -->
          <div class="info">
            <span class="line"></span>
            <span class="title">相关信息</span> <br />
            <div class="info-content">
              <div class="row">
                <span class="content">所属题库</span>
                <span class="detail-content">{{ questionList.questionBankType }}</span>
              </div>
              <div class="row">
                <span class="content">难度等级 </span>
                <span class="detail-content">{{ questionList.level }}</span>
              </div>
              <div class="row">
                <span class="content">提交人员</span>
                <span class="detail-content">{{ questionList.creator }}</span>
              </div>
              <div class="row">
                <span class="content">提交时间 </span>
                <span class="detail-content">{{ questionList.gmt_created }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup name="SingleAudit">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { fetchQuestionId } from '@/api/questionBank.js'
const isRefuse = ref(false) //默认通过
const description = ref() //不通过的描述
let resultForm = reactive({ result: '', refuseReason: '' })
let questionList = reactive([
  {
    id: '',
    title: '',
    options: [
      { option: '', optionContent: '' },
      { option: '', optionContent: '' },
      { option: '', optionContent: '' },
      { option: '', optionContent: '' }
    ],
    answer: '',
    questionBankType: '',
    level: '',
    creator: '',
    gmt_created: '',
    type: '',
    status: ''
  }
])
//通过
const pass = () => {
  isRefuse.value = false
  questionList.status = '已通过'
  console.log('questionList.status', questionList.status)
}
//拒绝
const refuse = () => {
  isRefuse.value = true
  questionList.status = '已拒绝'
  console.log('questionList.status', questionList.status)
  console.log('resultForm.result', resultForm.result)
}

//接收路由参数
const route = useRoute()
const id = route.query.id //我的审核页面点击审核按钮时传过来的试题id
//根据传过来的试题id调接口获取试题信息
const getQuestionInfo = async () => {
  await fetchQuestionId(id).then(res => {
    questionList.id = res.data.id
    questionList.title = res.data.title
    questionList.creator = res.data.creator
    questionList.gmt_created = res.data.gmt_created
    questionList.answer = res.data.answer
    questionList.questionBankType = res.data.question_bank_name
    questionList.level = res.data.difficulty
    questionList.type = res.data.type
    questionList.options = res.data.option_vo_list
    console.log('res.data', res.data)
  })
}
const router = useRouter()
const sure = () => {
  if (resultForm.result) {
    ElMessage({
      showClose: true,
      message: '审核成功！',
      type: 'success'
    })
    router.push('/myReview')
  } else {
    ElMessage({
      showClose: true,
      message: '审核结论为空',
      type: 'error'
    })
  }
}
onMounted(() => {
  getQuestionInfo()
})
</script>
<style lang="scss" scoped>
.container {
  display: flex;
  align-content: flex-start;
  padding: 10px;
  flex-wrap: nowrap;
  margin-left: 50px;
  // height: 100%;
  .test-review {
    display: flex;
    flex: 1;
    flex-direction: row;
    flex-wrap: wrap;

    .test {
      display: flex;
      .left {
        .test-list {
          margin-left: 30px;
          width: 1000px;
          margin-bottom: 45px;
          .test-title {
            margin-bottom: 15px;
            margin-top: 10px;
          }
          .test-content {
            margin-top: 5px;
            margin-left: 15px;
          }
        }
        .divider-below {
          width: 65%;
          :deep(.el-divider--horizontal) {
            width: 144%;
          }
          .below {
            display: flex;
            flex-direction: column;
            align-content: space-around;
            flex: 1;
            margin-top: 50px;
            .result {
              width: 130px;
              margin-bottom: 30px;
              margin-left: 20px;
              .review-btn {
                display: flex;
                justify-content: space-between;
                margin-top: 20px;
                .pass:focus {
                  //使用css伪类实现点击元素变色的效果，两个伪类是:active, :focus
                  background-color: #09e96e; //:active，元素被点击时变色，但颜色在点击后消失,   :focus， 元素被点击后变色，且颜色在点击后不消失
                  color: rgb(236, 240, 235);
                }
                .refuse:focus {
                  background-color: rgb(233, 13, 13);
                  color: rgb(236, 240, 235);
                }
              }
            }
            .refuse-form {
              .el-form {
                width: 109%;
              }
            }
            .btn {
              display: flex;
              justify-content: space-around;
              margin-top: 60px;
              width: 123%;
            }
          }
        }
      }
      .el-divider--vertical {
        height: 120%;
      }
      .info-list {
        // margin-left: 500px;
        .info {
          width: 500px;
          margin-left: 20px;
          .line {
            background: #094ee9;
            border: 2px solid #094ee9;
            margin-right: 13px;
          }
          .title {
            font-weight: bold;
            font-size: 17px;
          }
          .info-content {
            margin-left: 18px;
            .row {
              margin-top: 7px;
              .detail-content {
                font-size: 15px;
                font-weight: bold;
              }
              .content {
                color: gray;
                font-size: 15px;
                margin-right: 20px;
              }
            }
          }
        }
      }
    }
  }
}
.el-form-item {
  display: flex;
  --font-size: 14px;
  margin-bottom: 18px;
  margin-top: 30px;
}
.el-form-item {
  display: flex;
  --font-size: 14px;
  margin-bottom: 18px;
  margin-top: 30px;
  width: 402%;
}
h2 {
  margin-left: 50px;
}
</style>
