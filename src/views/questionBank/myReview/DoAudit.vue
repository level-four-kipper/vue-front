<template>
  <h2>试题审核</h2>
  <div class="container">
    <div class="test-review">
      <!-- 试题-->
      <div class="test" v-for="(item,index) in questionList" :key="index">
        <div class="left">
          <div class="test-list" v-if="num === index">
            <p class="test-title">#{{ index + 1 }} {{ item.title }}</p>
            <p class="test-content" v-for="(optionList,index) in item.options" :key="index">{{ optionList.option }}. {{ optionList. optionContent}}</p>
            <p class="test-content">正确答案：{{ item.answer }}</p>
          </div>
          <!-- 水平分割线 以下-->
          <div class="divider-below" v-if="num === index">
            <el-divider />
            <div class="below">
              <div class="result">
                <el-form require-asterisk-position="right">
                  <el-form-item label="审核结论" required="true" />
                </el-form>
                <div class="review-btn">
                  <el-button @click="pass">通过</el-button>
                  <el-button @click="refuse">拒绝</el-button>
                </div>
              </div>
              <div class="refuse-form" v-show="isRefuse">
                <el-form require-asterisk-position="right">
                  <el-form-item label="拒绝原因" prop="refuseReason" required="true">
                    <el-input v-model="description" :rows="5" type="textarea" placeholder="请填写拒绝原因" />
                  </el-form-item>
                </el-form>
              </div>
              <div class="btn">
                <el-button @click="pre" :disabled="preDisabled">上一题</el-button>
                <el-button type="primary" @click="sure">确定</el-button>
                <el-button @click="next" :disabled="nextDisabled">下一题</el-button>
              </div>
            </div>
          </div>
        </div>
        <!-- 垂直分割线及相关信息 -->
        <el-divider direction="vertical" v-if="num === index" />
        <div class="info-list" v-if="num === index">
          <!-- <el-divider direction="vertical" /> -->
          <div class="info">
            <span class="line"></span>
            <span class="title">相关信息</span> <br />
            <div class="info-content">
              <div class="row">
                <span class="content">所属题库</span>
                <span class="detail-content">{{ item.questionBankType }}</span>
              </div>
              <div class="row">
                <span class="content">难度等级 </span>
                <span class="detail-content">{{ item.level }}</span>
              </div>
              <div class="row">
                <span class="content">提交人员</span>
                <span class="detail-content">{{ item.creator }}</span>
              </div>
              <div class="row">
                <span class="content">提交时间 </span>
                <span class="detail-content">{{ item.gmt_created }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup name="DaAudit">
import { watch, ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
const preDisabled = ref(true) //上禁用按钮
const nextDisabled = ref(false) //下禁用按钮
const num = ref(0) //第几题
const isRefuse = ref(false) //默认通过
const description = ref() //不通过的描述
const questionList = reactive([
  {
    question_id: '1',
    title: '前端语言有什么?',
    options: [
      { option: 'A', optionContent: 'html' },
      { option: 'B', optionContent: 'css' },
      { option: 'C', optionContent: 'javascript' },
      { option: 'D', optionContent: 'vue' }
    ],
    answer: 'B',
    questionBankType: 'Java题库',
    level: '基础',
    creator: '李四',
    gmt_created: '2022/08/16 12:12:12'
  },
  {
    question_id: '2',
    title: '后端语言有什么？',
    options: [
      { option: 'A', optionContent: 'Java' },
      { option: 'B', optionContent: 'C' },
      { option: 'C', optionContent: 'C++' },
      { option: 'D', optionContent: 'Go' }
    ],
    answer: 'ABCD',
    questionBankType: 'Java题库',
    level: '基础',
    creator: '李四',
    gmt_created: '2022/08/16 12:12:12'
  },
  {
    question_id: '3',
    title: '什么是大数据？',
    options: [
      { option: 'A', optionContent: 'Java' },
      { option: 'B', optionContent: 'C' },
      { option: 'C', optionContent: 'C++' },
      { option: 'D', optionContent: 'Go' }
    ],
    answer: 'ABCD',
    questionBankType: 'Java题库',
    level: '基础',
    creator: '李四',
    gmt_created: '2022/08/16 12:12:12'
  }
])
//通过
const pass = () => {}
//拒绝
const refuse = () => {
  isRefuse.value = true
}
//上一题
const pre = () => {
  num.value === 0 ? (num.value = 0) : (num.value -= 1)
}
//确定
const router = useRouter()
const sure = () => {
  ElMessage({
    showClose: true,
    message: '审核成功！',
    type: 'success'
  })
  router.push('/myReview')
}
//下一题
const next = () => {
  preDisabled.value = false
  if (num.value < questionList.length - 1) {
    num.value += 1
  }
}
//第一题和最后一题禁用按钮
watch(num, () => {
  num.value == questionList.length - 1 ? (nextDisabled.value = true) : (nextDisabled.value = false)
  if (num.value < 1) {
    preDisabled.value = true
  }
})
</script>
<style lang="scss" scoped>
.container {
  display: flex;
  align-content: flex-start;
  padding: 10px;
  flex-wrap: nowrap;
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
</style>
