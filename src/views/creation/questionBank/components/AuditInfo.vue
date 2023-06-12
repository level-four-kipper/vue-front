<template>
  <el-tabs v-model="activeSetting" stretch>
    <el-tab-pane label="题目信息" name="questionInfo">
      <div class="row">
        <div class="row__label">难度等级</div>
        <div class="row__content">{{ difficultyList[questionObj.difficulty_id]?.label }}</div>
      </div>
      <div class="row">
        <div class="row__label">提交时间</div>
        <div class="row__content">{{ questionObj.gmt_created }}</div>
      </div>
      <div class="row">
        <div class="row__label">提交类型</div>
        <div class="row__content">{{ buzOptions[questionObj.buz_id] }}</div>
      </div>
      <div class="row">
        <div class="row__label">提交备注</div>
        <div class="row__content"></div>
      </div>
    </el-tab-pane>
    <el-tab-pane label="审核信息" name="auditInfo">
      <div class="row" label="审核策略">
        <div class="row__label">审核策略</div>
        <div class="row__content">{{ auditPolicyOptions[audit_policy] }}</div>
      </div>
      <div class="row">
        <div class="row__label">
          审核人员
          <span>（{{ audit_schedule }}）</span>
        </div>
        <div class="row__content">
          <div class="member-list">
            <div v-for="(item, index) in question_auditor_volist" :key="index" class="member">
              <el-image :src="item.img_url" />
              <div class="member__name">{{ item.name }}</div>
              <!-- 通过 -->
              <template v-if="item.status_id === 1">
                <img class="member__btn member__btn--pass" src="@/assets/img/createQuestionBank/pass.png" />
                <img class="member__btn member__btn--view" src="@/assets/img/createQuestionBank/view.png" />
              </template>
              <!-- 不通过 -->
              <template v-else-if="item.status_id === 2">
                <img class="member__btn member__btn--nopass" src="@/assets/img/createQuestionBank/failed.png" />
                <img class="member__btn member__btn--view" src="@/assets/img/createQuestionBank/view.png" />
              </template>
              <!-- 未审核 -->
              <template v-else>
                <img class="member__btn member__btn--wait" src="@/assets/img/createQuestionBank/wait.png" />
                <img class="member__btn member__btn--warn" src="@/assets/img/createQuestionBank/warn.png" />
              </template>
            </div>
          </div>
        </div>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup>
import useQuestionbank from '@/hooks/useQuestionbank.js'

const { activeIndex, question_dtolist } = inject('questionBank')
const { audit_schedule, question_auditor_volist } = inject('questionInfo')
const { buzOptions, difficultyList, auditPolicyOptions, _fetchGetQuestionbank } = useQuestionbank()
const questionObj = computed(() => {
  return question_dtolist[activeIndex.value] || {}
})
const activeSetting = ref('questionInfo')
// 审核策略
const audit_policy = ref(0)

const handleFetchGetQuestionbank = () => {
  _fetchGetQuestionbank().then(res => {
    audit_policy.value = res.audit_policy
  })
}

onMounted(() => {
  handleFetchGetQuestionbank()
})
</script>

<style lang="scss" scoped>
.row {
  line-height: 20px;
  margin-top: 30px;
  font-size: 14px;
  &__label {
    margin-bottom: 10px;
    font-weight: 600;
    color: #333;
    span {
      margin-left: 6px;
      font-weight: normal;
      color: #4d4e54;
    }
  }
  &__content {
    color: #4d4e54;
  }
}
.member-list {
  flex: 1;
  .member {
    display: flex;
    align-items: center;
    margin-bottom: 17px;
    &:last-child {
      margin-bottom: 0;
    }
    .el-image {
      width: 32px;
      height: 32px;
      border-radius: 32px;
      margin-right: 12px;
    }
    &__name {
      flex: 1;
      max-width: 221px;
      line-height: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #333;
    }
    &__btn {
      width: 18px;
      height: 18px;
      margin-left: 12px;
      cursor: pointer;
      &:hover {
        opacity: 0.85;
      }
    }
  }
}
.status--wait {
  color: #0175ff;
}
.status--pass {
  color: #67c23a;
}
.status--nopass {
  color: #da3939;
}
.member__btn{
  cursor: unset !important;
}
</style>
