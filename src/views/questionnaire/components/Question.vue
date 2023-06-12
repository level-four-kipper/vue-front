<template>
    <template v-if="!showSuccess">
        <div class="top">
            <div class="top__content">
            <div class="top__title">亲爱的各位同事</div>
            <p>&nbsp; 大家好！</p>
            <p>&nbsp; 我们小组正在做技术提升平台的需求调研活动。想了解一下大家对博客和问答版块的需求和建议。您的真实回复将有助于我们研发更贴近市场与客户的产品，感谢您抽空参与，本次调研大约会占用您3-5分钟时间，感谢各位的支持！</p>
            </div>
        </div>
        <!-- 问卷内容 -->
        <div class="main">
            <div class="main__title">用户需求调查表</div>
            <div class="main__content">
                <el-form class="form" :model="form" ref="formRef">
                    <template v-for="(item, index) in formData" :key="item.field">
                        <!-- 单选 -->
                        <el-form-item 
                            v-if="item.type === 'radio'"
                            class="form__item" 
                            :prop="item.field"
                            :rules="{
                                required: true,
                                validator: validateRadio
                            }"
                        >
                            <div class="form__title">{{index+1}}.{{item.title}}</div>
                            <el-radio-group v-model="form[item.field]">
                                <template v-for="option in item.options" :key="option.value">
                                    <el-radio v-if="option.type !== 'input'" :label="option.label" :value="option.value"></el-radio>
                                    <el-radio v-else :label="option.value">
                                        <span>{{option.label}}</span>
                                        <el-input class="form_input" v-model.trim="item.inputValue"></el-input>
                                    </el-radio>
                                </template>
                            </el-radio-group>
                        </el-form-item>
                        <!-- 多选 -->
                        <el-form-item 
                            v-if="item.type === 'checkbox'"
                            class="form__item" 
                            :prop="item.field"
                            :rules="{
                                required: true,
                                validator: validateCheckbox
                            }"
                        >
                            <div class="form__title">{{index+1}}.{{item.title}}</div>
                            <el-checkbox-group v-model="form[item.field]">
                                <template v-for="option in item.options" :key="option.value">
                                    <el-checkbox v-if="option.type !== 'input'" :label="option.label" />
                                    <el-checkbox v-else :label="option.value">
                                        <span>{{option.label}}</span>
                                        <el-input class="form_input" v-model.trim="item.inputValue"></el-input>
                                    </el-checkbox>
                                </template>
                                
                            </el-checkbox-group>
                        </el-form-item>
                        <!-- 文本域 -->
                        <el-form-item 
                            v-if="item.type === 'textarea'"
                            class="form__item" 
                            :prop="item.field"
                            :rules="{
                                required: true,
                                validator: validateInput
                            }"
                        >
                            <div class="form__title">{{index+1}}.{{item.title}}</div>
                            <el-input
                                v-model="form[item.field]"
                                :rows="7"
                                type="textarea"
                                :placeholder="item.placeholder"
                            />
                        </el-form-item>
                    </template>
                    <!-- 姓名、邮箱 -->
                    <div class="form__bottom">
                        <div class="form__item">
                            <el-form-item>
                                <div class="form__title">为了更好地跟您沟通，请您留下您的联系方式, 谢谢您的支持 ！</div>
                            </el-form-item>
                            <el-form-item label="姓名:" prop="name" :rules="{required: true, message: '请输入姓名', trigger: 'blur'}">
                                <el-input v-model="form.name" placeholder="请输入您的真实姓名"></el-input>
                            </el-form-item>
                            <el-form-item label="邮箱:" prop="email" :rules="{required: true, validator: validateEmail, trigger: 'blur'}">
                                <el-input v-model="form.email" placeholder="请输入您的比亚迪邮箱"></el-input>
                            </el-form-item>
                        </div>
                    </div>
                    <div class="form__btn">
                        <el-button type="primary" color="#0066fffc" :loading="submitLoading" @click="sumbitForm(formRef)">提交</el-button>
                    </div>
                </el-form>
            </div>
        </div>
    </template>
    <div class="success-msg" v-else>您已完成调查，谢谢您的参与！</div>
</template>
<script setup name="Question">
import { reactive, ref } from 'vue'
import { formList } from './data.js'
import { ElMessage } from 'element-plus'
import { submitSurvey } from '@/api/questionnaire.js'

const formRef = ref()
const submitLoading = ref(false)
// 是否已提交过
const showSuccess = ref(false)
showSuccess.value = localStorage.getItem('isSuccess') || false

const form = reactive({
    answer1: '',
    answer2: '',
    answer3: [],
    answer4: '',
    answer5: [],
    answer6: [],
    answer7: [],
    answer8: '',
    answer9: '',
    answer10: [],
    answer11: [],
    answer12: [],
    answer13: '',
    answer14: '',
    answer15: '',
    answer16: '',
    answer17: '',
    name: '',
    email: ''
})

// 题目数据
const formData = reactive(formList)

const getFieldIndex = (field) => {
    const index = formData.findIndex((item) => {
        return item.field === field
    })
    return index
}

// 单选校验
const validateRadio = (rule, value, callback) => {
    if (!value) {
        callback(new Error('请选择'))
    }

    if (value === '其他') {
        const fieldIndex = getFieldIndex(rule.field)
        if (formData[fieldIndex].inputValue === '') {
            callback(new Error('请输入'))
        }
    }

    callback()
}

// 多选校验
const validateCheckbox = (rule, value, callback) => {
    if (!value.length) {
        callback(new Error('请选择'))
    }
    if (value.includes('其他')) {
        const fieldIndex = getFieldIndex(rule.field)
        if (formData[fieldIndex].inputValue === '') {
            callback(new Error('请输入'))
        }
    }
    callback()
}

// 输入框校验
const validateInput = (rule, value, callback) => {
    if (!value) {
        callback(new Error('请输入'))
    }
    callback()
}

// 邮箱校验
const validateEmail = (rule, value, callback) => {
    if (!value) {
        callback(new Error('请输入比亚迪邮箱'))
    }
    const emailReg = /^[a-zA-Z\d\.]+\@(byd)\.(com)$/
    if (!emailReg.test(value)) {
        callback(new Error('请输入正确的比亚迪邮箱'))
    }
    callback()
}

// 提交
const sumbitForm = async (formEl) => {
    if (!formEl) return
    await formEl.validate((valid) => {
        submitLoading.value = true
        if (valid) {
            console.log(form)
            const formJson = {}
            for (let i in form) {
                if (typeof form[i] === 'string') {
                    // 字符串
                    formJson[i] = form[i]
                    if (form[i] === '其他') {
                        const fieldIndex = getFieldIndex(i)
                        formJson[i] = formData[fieldIndex].inputValue
                    }
                } else {
                    // 数组
                    formJson[i] = form[i]
                    if (form[i].includes('其他')) {
                        const fieldIndex = getFieldIndex(i)
                        const otherIndex = form[i].findIndex(item => {
                            return item === '其他'
                        })

                        formJson[i].splice(otherIndex, 1, formData[fieldIndex].inputValue)
                    }
                }
            }

            submitSurvey(formJson).then(res => {
                submitLoading.value = false
                if (res.msg !== 'success') {
                    ElMessage.error(res.msg)
                    return
                }
                // 提交成功
                ElMessage.success('提交成功')
                localStorage.setItem('isSuccess', 1)
                setTimeout(() => {
                    showSuccess.value = true
                }, 1000)
            })
        } else {
            submitLoading.value = false
            ElMessage.warning('亲，还有问题没完成哦')
        }
    })
}
</script>
<style lang="scss" scoped>
.top {
    padding: 80px 0 0;
    background: #fff;
    overflow: hidden;
    &__content {
        width: 1000px;
        margin: 0 auto;
    }
    &__title {
        line-height: 30px;
        margin-bottom: 20px;
        font-family: '黑体 Bold', '黑体 Regular', '黑体', sans-serif;
        font-weight: 700;
    }
    p {
        margin-bottom: 20px;
        line-height: 20px;
        font-family: '黑体', sans-serif;
    }
}
.main {
    width: 800px;
    margin: 20px auto 0;
    border: 1px solid #dedede;
    font-family: 'Arial Negreta', 'Arial Normal', 'Arial', sans-serif;
    background: #fff;
    &__title {
        line-height: 60px;
        text-align: center;
        font-weight: 700;
        font-size: 18px;
        border-bottom: 1px solid #dedede;
    }
    .form__bottom {
        padding: 35px 0;
        border-top: 1px solid #dedede;
        border-bottom: 1px solid #dedede;
    }
    .form__item {
        padding: 10px 30px 0;
    }
    .form__title {
        width: 100%;
        line-height: 40px;
    }
    .el-radio-group {
        .el-radio {
            width: 100%;
        }
        .el-radio__label {
            .el-input {
                margin-left: 5px;
            }
        }
    }
    .el-checkbox-group {
        .el-checkbox {
            width: 100%;
        }
    }
    :deep(.el-input) {
        width: 221px;
        .el-input__wrapper {
            box-shadow: none;
            border-bottom: 1px solid #dedede;
            border-radius: 0;
        } 
    }
    :deep(.el-form-item__label) {
        font-size: 13px;
        font-weight: 700;
        color: #333;
    }
    .form__btn {
        text-align: center;
        padding: 20px 0;
        .el-button {
            font-size: 12px;
            border-radius: 0;
        }
    }
    :deep(.el-form-item.is-required:not(.is-no-asterisk).asterisk-left>.el-form-item__label:before) {
        display: none;
    }
}
.success-msg {
    position: fixed;
    left: 50%;
    top: 26%;
    transform: translateX(-50%);
    font-family: 'Arial Normal', 'Arial', sans-serif;
    font-size: 14px;
}
</style>