<template>
  <div class="form">
    <p class="form__title">审核意见</p>
    <div class="form__list">
      <template v-for="(item, index) in question_auditor_volist" :key="index">
        <div class="form__cell" v-if="item.status_id >= 1">
          <div class="auditor">
            <ComUser :userId="item.creator" />
            <label class="flag--pass" v-if="item.status_id === 1">通过</label>
            <label class="flag--nopass" v-else>拒绝</label>
          </div>
          <div class="idea">
            <span>审核意见：</span>
            <p>{{ item.opinion }}</p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import ComUser from '@/components/ComUser.vue'

const { question_auditor_volist } = inject('questionInfo')
</script>

<style lang="scss" scoped>
.form {
  padding: 20px;
  font-size: 14px;
  background: #fff;
  // box-shadow: 0 2px 16px 0 rgba(156, 172, 209, 0.44);
  &__title {
    line-height: 20px;
    margin-bottom: 20px;
    font-weight: 600;
    color: #333;
  }
  &__list {
  }
  &__cell {
    margin-bottom: 30px;
    &:last-child {
      margin-bottom: 10px;
    }
    div {
      display: flex;
      &.auditor {
        align-items: center;
        margin-bottom: 11px;
        label {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 52px;
          height: 28px;
          margin-left: 10px;
          border-radius: 4px;
          &.flag--pass {
            color: #0175ff;
            background: rgba(1, 117, 255, 0.12);
          }
          &.flag--nopass {
            color: #da3939;
            background: rgba(218, 57, 57, 0.12);
          }
        }
      }
      &.idea {
        color: #333;
        span {
          color: #9196a6;
        }
        p {
          flex: 1;
          word-break: break-all;
        }
      }
    }
  }
}
</style>
