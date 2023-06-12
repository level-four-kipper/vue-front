import { ElMessage } from 'element-plus'
import {
  fetchUpdateQuestionbank,
  fetchPublishQuestionbank,
  fetchQuestion,
  fetchGetQuestionbank,
  fetchTypeList,
  fetchMyQuestionbank,
  fetchQuestionList,
  fetchAuditQuestions,
} from '@/api/questionBank.js'

export default function useQuestionbank() {
  const route = useRoute()
  const router = useRouter()

  const emailReg = /^[a-zA-Z]+\.+[a-zA-Z\d]+\@(byd)\.(com)$/

  const bankId = ref(route?.query?.id || '')

  // 角色id，0：管理员；1：编辑人员；2：审核人员
  // const roleId = ref(1)

  // 业务类型id，0：新增；1：修订；2：删除
  const buzOptions = reactive({
    0: '新增',
    1: '修订',
    2: '删除',
  })

  // 审核策略
  const auditPolicyOptions = reactive({
    0: '仅管理员通过',
    1: '至少一个通过',
    2: '全部审核通过',
  })

  // 试题难度，0：基础；1：进阶；2：高级；3：专家
  const difficultyList = reactive([
    { label: '基础', value: 0 },
    { label: '进阶', value: 1 },
    { label: '高级', value: 2 },
    { label: '专家', value: 3 },
  ])

  // 题库审核策略，0：仅管理员；1：至少一个通过；2：全部通过
  const auditPolicyList = reactive([
    { label: '至少一个通过', value: 1 },
    { label: '全部审核通过', value: 2 },
    { label: '仅管理员通过', value: 0 },
  ])

  // 选项序号A-Z
  const serialNumber = computed(() => {
    const list = []
    for (let i = 0; i < 26; i++) {
      list.push(String.fromCharCode(65 + i))
    }
    return list
  })

  // 默认题目
  const getDefaultTitle = type_id => {
    let title = ''
    switch (type_id) {
      case 0:
        title = '单选题示例'
        break
      case 1:
        title = '多选题示例'
        break
      case 2:
        title = '问答题示例'
        break
      case 3:
        title = '编程题示例'
        break
      default:
        break
    }
    return title
  }

  // 获取题目列表(题库和审核)
  const topicList = ref([])
  const topicCount = ref(0)
  const _fetchGetTopicList = (type, params) => {
    // audit_status: props.status,
    // bank_id: bankId.value,
    // question_title: searchVal.value,
    // 编辑
    if (type === 0) {
      fetchQuestionList(params)
        .then(res => {
          if (res.code !== 0) {
            ElMessage.error(res.msg || '获取题目类型失败')
          } else {
            const { count = 0, question_volist = [] } = res.data
            topicCount.value = count || 0
            topicList.value = question_volist || []
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    } else {
      // 审核
      fetchAuditQuestions(params)
        .then(res => {
          if (res.code !== 0) {
            ElMessage.error(res.msg || '获取题目类型失败')
          } else {
            const { count = 0, question_volist = [] } = res.data
            topicCount.value = count || 0
            topicList.value = question_volist || []
            // if (props.status === 0) {
            //   toBeReviewedList.splice(0)
            //   toBeReviewedList.push(...topicList.value)
            // } else {
            //   auditedList.splice(0)
            //   auditedList.push(...topicList.value)
            // }
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    }
  }

  // 查询单个题目信息
  const _fetchQuestion = id => {
    return new Promise((resolve, reject) => {
      fetchQuestion(id)
        .then(res => {
          if (res.code !== 0) {
            ElMessage({
              message: res.msg,
              type: 'warning',
            })
            reject(res.msg)
            return
          }
          const {
            gmt_created,
            type_id,
            title,
            answer,
            difficulty_id,
            option_volist,
            analysis,
            buz_id,
            status_id,
            id,
            question_bank_id,
            description,
          } = res.data
          // 回显选择题答案勾选状态
          let answerArr = []
          const answerIndex = []

          if (type_id < 2) {
            answerArr = answer.replace(/,/g, '、').split('、')

            // 查询答案选项下标
            answerArr.forEach(item => {
              const index = serialNumber.value.findIndex(child => {
                return child === item
              })

              index > -1 && answerIndex.push(index)
            })

            // 设置勾选状态
            option_volist.forEach((item, index) => {
              if (answerIndex.includes(index)) {
                item.checked = true
              }
            })
          }

          resolve({
            gmt_created, // 创建时间
            type_id, // 题型id
            title, // 题干
            answer, // 答案
            difficulty_id, // 试题难度，0：基础；1：进阶；2：高级；3：专家
            analysis: analysis || '', // 答案解析
            buz_id, // 业务类型id，0：新增；1：修订；2：删除
            status_id, // 状态id，0：审核中；1：已通过；2：未通过
            option_list: option_volist, // 题目选项
            id,
            question_bank_id,
            description,
          })
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  // 获取题库信息
  const _fetchGetQuestionbank = id => {
    return new Promise((resolve, reject) => {
      fetchGetQuestionbank(id || bankId.value)
        .then(res => {
          if (res.code !== 0) {
            ElMessage({
              message: res.msg,
              type: 'warning',
            })
            reject()
            return
          }

          resolve(res.data)
        })
        .catch(() => {
          reject()
        })
    })
  }

  // 获取题库类型/所属领域
  const questionBankType = ref([])
  const _fetchGetQuestionBankType = () => {
    fetchTypeList()
      .then(res => {
        if (res.code === 0) {
          questionBankType.value = res?.data || []
        } else {
          questionBankType.value = []
        }
      })
      .catch(() => {
        questionBankType.value = []
      })
  }

  // 获取我的题库列表
  const myQuestionBankList = ref([])
  const _fetchGetMyQuestionBankList = () => {
    const curruntPage = route.path.split('/')[2]
    const curruntPageTypeMap = {
      board: 2,
      editor: 0,
      audit: 1,
    }
    fetchMyQuestionbank(curruntPageTypeMap[curruntPage])
      .then(res => {
        if (res.code == 0) {
          const { data = [] } = res
          myQuestionBankList.value = data.map((item, index) => {
            return {
              id: item.id,
              role_id: item.role_id,
              visibility: item.visibility,
              name: item.name || `未命名题库${index + 1}`,
            }
          })
        } else {
          ElMessage({
            message: res?.msg || '获取题库信息失败',
            type: 'warning',
          })
        }
      })
      .catch(err => {
        console.log('err', err)
      })
  }

  // 提交题库
  const _fetchUpdateQuestionbank = params => {
    return new Promise((resolve, reject) => {
      fetchUpdateQuestionbank(params).then(res => {
        if (res.code !== 0) {
          ElMessage({
            message: res.msg,
            type: 'warning',
          })
          reject()
          return
        }
        ElMessage({
          message: bankId.value ? '修改成功' : '添加成功',
          type: 'success',
        })
        resolve(res.data)
      })
    })
  }

  // 发布题库
  const _fetchPublishQuestionbank = () => {
    fetchPublishQuestionbank(bankId.value).then(res => {
      if (res.code !== 0) {
        ElMessage({
          message: res.msg,
          type: 'warning',
        })
        return
      }
      ElMessage({
        message: '发布成功',
        type: 'success',
      })
      router.replace(`/creationList/quizBank`)
    })
  }

  /**
   * 通过指定属性比较两个数组是否相同
   * @param {Array} arr1 数组1
   * @param {Array} arr2 数组2
   * @param {String} property 属性
   */
  const isSameArray = (arr1, arr2, property) => {
    try {
      if (Array.isArray(arr1) && Array.isArray(arr2) && property) {
        const list1 = arr1.map(item => {
          return item[property]
        })
        const list2 = arr2.map(item => {
          return item[property]
        })

        list1.sort()
        list2.sort()

        return list1.toString() === list2.toString() ? true : false
      } else {
        throw new Error('传参出错')
      }
    } catch (error) {
      console.error(error)
    }
  }

  return {
    emailReg,
    bankId,
    buzOptions,
    auditPolicyOptions,
    difficultyList,
    auditPolicyList,
    serialNumber,
    getDefaultTitle,
    _fetchQuestion,
    _fetchGetQuestionbank,
    _fetchUpdateQuestionbank,
    _fetchPublishQuestionbank,
    isSameArray,
    questionBankType,
    _fetchGetQuestionBankType,
    myQuestionBankList,
    _fetchGetMyQuestionBankList,
    topicCount,
    topicList,
    _fetchGetTopicList,
  }
}
