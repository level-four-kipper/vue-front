import { createRouter, createWebHistory } from 'vue-router'
import ForgetPassword from '../views/login/ForgetPassword.vue'
import { useLoginStore } from '../stores/login'
import { ElMessage } from 'element-plus'
import questionBankRoutes from './questionBank.js'

const routes = [
  {
    path: '/',
    name: 'index',
    redirect: '/home',
    component: () => import('../views/HomeView.vue'),
    children: [
      ...questionBankRoutes,
      //首页
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/home/Index.vue'),
        meta: {
          title: '首页',
          navIndex: 0,
        },
      },
      {
        path: 'introduce',
        name: 'introduce',
        component: () => import('@/views/introduce.vue'),
        meta: {
          title: '公司介绍',
          navIndex: 0,
        },
      },
      {
        path: 'example',
        name: 'example',
        component: () => import('@/views/example.vue'),
        meta: {
          title: '成功案例',
          navIndex: 0, // header 导航下标
        },
      },
      {
        path: 'search',
        name: 'search',
        component: () => import('@/views/search/Index.vue'),
        meta: {
          title: '搜索结果',
        },
      },
      //作者首页
      {
        path: 'authorIndex/:id', //作者首页--访客视角
        name: 'authorIndex',
        component: () => import('@/views/personalCenter/AuthorIndex.vue'),
        meta: {
          title: '作者首页',
        },
      },
      // 创作中心 - 列表
      {
        path: 'creationList', //个人中心--个人视角
        name: 'creationList',
        component: () => import('@/views/creation/CreationList.vue'),
        redirect: '/creationList/board',
        meta: {
          title: '创作空间',
          routerViewKey: 'creationList', //给一级子路由添加key值，防止重复渲染
        },
        children: [
          {
            path: 'board',
            name: 'board',
            component: () => import('@/views/creation/components/Board.vue'),
            meta: {
              title: '创作空间 · 看板',
              // navIndex: 4 // header 导航下标
            },
          },
          {
            path: 'blog',
            name: 'blog',
            component: () => import('@/views/creation/components/Blog.vue'),
            meta: {
              title: '创作空间 · 博客',
              // navIndex: 4 // header 导航下标
            },
          },
          {
            path: 'question',
            name: 'question',
            component: () => import('@/views/creation/components/Question.vue'),
            meta: {
              title: '创作空间 · 提问',
              // navIndex: 4 // header 导航下标
            },
          },
          {
            path: 'answer',
            name: 'answer',
            component: () => import('@/views/creation/components/Answer.vue'),
            meta: {
              title: '创作空间 · 回答',
              // navIndex: 4 // header 导航下标
            },
          },
          {
            path: 'quizBank',
            name: 'quizBank',
            component: () => import('@/views/creation/components/QuestionBank.vue'),
            meta: {
              title: '创作空间 · 题库',
              // navIndex: 4 // header 导航下标
            },
          },
        ],
      },
      //个人中心
      {
        path: 'personalIndex', //个人中心--个人视角
        name: 'personalIndex',
        component: () => import('@/views/personalCenter/PersonalIndex.vue'),
        redirect: '/personalIndex/myWriting',
        meta: {
          title: '个人空间',
          routerViewKey: 'personalIndex', //给一级子路由添加key值，防止重复渲染
        },
        children: [
          {
            path: 'myWriting',
            name: 'myWriting',
            component: () => import('@/views/personalCenter/components/AuthorContent.vue'),
            meta: {
              // navIndex: 4 // header 导航下标
            },
          },
          {
            path: 'myCollect',
            name: 'myCollect',
            component: () => import('@/views/personalCenter/components/AuthorContent.vue'),
            meta: {
              // navIndex: 4 // header 导航下标
            },
          },
          {
            path: 'myFans',
            name: 'myFans',
            component: () => import('@/views/personalCenter/pageView/MyFans.vue'),
            meta: {
              // navIndex: 4 // header 导航下标
              title: '我的粉丝',
            },
          },
          {
            path: 'myConcern',
            name: 'myConcern',
            component: () => import('@/views/personalCenter/pageView/MyConcern.vue'),
            meta: {
              title: '我的关注',
            },
          },
          {
            path: 'setting',
            name: 'setting',
            component: () => import('@/views/personalCenter/pageView/Setting.vue'),
            meta: {
              title: '账户设置',
            },
          },
        ],
      },
      //消息通知
      {
        path: 'messageIndex',
        name: 'messageIndex',
        component: () => import('@/views/messageCenter/index.vue'),
        meta: {
          title: '消息通知',
        },
      },
      // 考试
      {
        path: 'exam',
        name: 'exam',
        component: () => import('@/views/exam/Exam.vue'),
        meta: {
          navIndex: 4, // header 导航下标
        },
      },
      {
        path: 'answerExam/:id',
        name: 'answerExam',
        component: () => import('@/views/exam/AnswerExam.vue'),
        meta: {
          navIndex: 4, // header 导航下标
        },
      },
      // 发布问题
      {
        path: 'publishQuestion',
        name: 'publishQuestion',
        component: () => import('@/views/creation/publishQuestion.vue'),
        meta: {
          hideFooter: true,
          navIndex: 2,
          left: '创作空间 · 提问题',
          hideRight: true,
          logo: '/index/blog-logo.png',
          title: '提问', // header 导航下标
        },
      },
      // 发布回答
      {
        path: 'publishAnswer/:id',
        name: 'publishAnswer',
        component: () => import('@/views/creation/publishAnswer.vue'),
        meta: {
          hideFooter: true,
          navIndex: 2,
          left: '创作空间 · 回答',
          hideRight: true,
          logo: '/index/blog-logo.png',
          title: '回答', // header 导航下标
        },
      },
      // 发布博客
      {
        path: 'publishBlog',
        name: 'publishBlog',
        component: () => import('@/views/creation/publishBlog.vue'),
        meta: {
          hideFooter: true,
          navIndex: 1, // header 导航下标
          left: '创作空间 · 写博客',
          hideRight: true,
          logo: 'IindexBlog-logo.png',
          title: '创作博客',
        },
      },
      // {
      //   path: 'createQuestionBank/board',
      //   name: 'createQuestionBankBoard',
      //   component: () => import('@/views/creation/questionBank/board.vue'),
      //   meta: {
      //     hideFooter: true,
      //     navIndex: 2,
      //     left: '创作空间 · 题库',
      //     hideRight: true,
      //     logo: '/index/blog-logo.png',
      //     title: '创作题库' // header 导航下标
      //   }
      // },
      // // 创建题库 - 编辑
      // {
      //   path: 'createQuestionBank/editor',
      //   name: 'createQuestionBankEditor',
      //   component: () => import('@/views/creation/questionBank/editor.vue'),
      //   meta: {
      //     hideFooter: true,
      //     navIndex: 2,
      //     left: '创作空间 · 题库',
      //     hideRight: true,
      //     logo: '/index/blog-logo.png',
      //     title: '创作题库' // header 导航下标
      //   }
      // },
      // // 创建题库 - 审核
      // {
      //   path: 'createQuestionBank/audit',
      //   name: 'createQuestionBankAudit',
      //   component: () => import('@/views/creation/questionBank/audit.vue'),
      //   meta: {
      //     hideFooter: true,
      //     navIndex: 2,
      //     left: '创作空间 · 题库',
      //     hideRight: true,
      //     logo: '/index/blog-logo.png',
      //     title: '创作题库' // header 导航下标
      //   }
      // },
      // 问答详情
      {
        path: 'questionAnswerDetail/:id',
        name: 'questionAnswerDetail',
        component: () => import('@/views/answer/questionAnswerDetail.vue'),
        meta: {
          navIndex: 2, // header 导航下标
          title: '问答详情',
        },
      },
      // 编辑问题
      {
        path: 'editQuestion/:id',
        name: 'editQuestion',
        component: () => import('@/views/answer/EditQuestion.vue'),
        meta: {
          title: '编辑问答',
          navIndex: 2,
        },
      },
      // 问答
      {
        path: 'quizIndex',
        name: 'quizIndex',
        component: () => import('@/views/answer/QuizIndex.vue'),
        meta: {
          title: '问答首页',
          navIndex: 2,
        },
      },
      // 博客
      {
        path: 'blogIndex',
        name: 'blogIndex',
        component: () => import('@/views/blog/BlogIndex.vue'),
        meta: {
          title: '博客首页',
          navIndex: 1,
        },
      },
      // 博客详情
      {
        path: 'blogDetail/:id',
        name: 'blogDetail',
        component: () => import('@/views/blog/BlogDetail.vue'),
        meta: {
          title: '博客详情',
          navIndex: 1,
        },
      },
      // 写博客
      {
        path: '/writeBlog',
        name: 'writeBlog',
        component: () => import('@/views/blog/WriteBlog.vue'),
        meta: {
          title: '写博客',
          navIndex: 1,
        },
      },
      {
        path: 'certainQuestionList/:questionBank_id',
        name: 'certainQuestionList',
        component: () => import('@/views/questionBank/CertainQuestionList.vue'),
        meta: {
          navIndex: 3, // header 导航下标
        },
      },
      // 控制台
      {
        path: 'controlPanel',
        name: 'controlPanel',
        component: () => import('@/views/controlPanel/ControlPanel.vue'),
        meta: {
          title: '控制台',
          navIndex: 5,
          hideFooter: true,
          routerViewKey: 'controlPanel', //给一级子路由添加key值，防止重复渲染
        },
        children: [
          {
            path: '',
            name: 'overView',
            component: () => import('@/views/controlPanel/OverView.vue'),
          },
          {
            path: 'userManage',
            name: 'userManage',
            component: () => import('@/views/controlPanel/UserManage.vue'),
          },
          {
            path: 'registrationAudit',
            name: 'registrationAudit',
            component: () => import('@/views/controlPanel/RegistrationAudit.vue'),
          },
          {
            path: 'setInform',
            name: 'setInform',
            component: () => import('@/views/controlPanel/SetInform.vue'),
          },
          {
            path: 'auditInformation/:id',
            name: 'auditInformation',
            component: () => import('@/views/controlPanel/AuditInformation.vue'),
          },
        ],
      },
      // 工作台
      {
        path: 'workbench',
        name: 'workbench',
        component: () => import('../views/workbench/index.vue'),
        meta: {
          title: '账户中心',
          navIndex: 5,
          routerViewKey: 'workbench', //给一级子路由添加key值，防止重复渲染
        },
      },
      // 工作台
      {
        path: 'workPanel',
        name: 'workPanel',
        // redirect: '/myBlogWrite/1',
        component: () => import('../views/workPanel/WorkPanel.vue'),
        meta: {
          title: '个人空间',
          hideFooter: true,
          navIndex: 5,
          routerViewKey: 'workPanel', //给一级子路由添加key值，防止重复渲染
        },
        children: [
          //博客管理
          {
            path: '/myBlogWrite/:type', //我的创作
            name: 'myBlogWrite',
            component: () => import('@/views/blog/MyBlogWrite.vue'),
          },
          {
            path: '/myBlogActivity', //我的活动
            name: 'myBlogActivity',
            component: () => import('@/views/blog/MyBlogActivity.vue'),
          },

          //题库管理
          {
            path: 'myQuestionBank', //我的题库
            name: 'myQuestionBank',
            component: () => import('@/views/workPanel/questionBankManage/MyQuestionBank.vue'),
          },
          {
            path: 'addQuestionBank', //新增题库
            name: 'addQuestionBank',
            component: () => import('@/views/workPanel/questionBankManage/AddQuestionBank.vue'),
          },
          {
            path: 'editQuestionBank/:id', //编辑题库
            name: 'editQuestionBank',
            component: () => import('@/views/workPanel/questionBankManage/AddQuestionBank.vue'),
          },
          {
            path: 'setQuestionBank/:id', //题库设置Set
            name: 'setQuestionBank',
            component: () => import('@/views/workPanel/questionBankManage/SetQuestionBank.vue'),
          },
          {
            path: 'myTest', //我的题目
            name: 'myTest',
            component: () => import('@/views/workPanel/questionBankManage/MyTest.vue'),
          },
          {
            path: 'testDetail', //试题详情
            name: 'testDetail',
            component: () => import('@/views/questionBank/myTest/TestDetail.vue'),
          },

          {
            path: 'addTest', //添加试题
            name: 'addTest',
            component: () => import('@/views/workPanel/questionBankManage/AddTest.vue'),
          },
          {
            path: 'editTest/:id', //编辑试题
            name: 'editTest',
            component: () => import('@/views/workPanel/questionBankManage/AddTest.vue'),
          },

          {
            path: 'myReview', //我的审核
            name: 'myReview',
            component: () => import('@/views/workPanel/questionBankManage/MyReview.vue'),
          },
          // {
          //   path: '/doAudit', //开始审核
          //   name: 'doAudit',
          //   component: () => import('@/views/questionBank/myReview/DoAudit.vue')
          // },
          // {
          //   path: '/reviewDetail', //审核详情
          //   name: 'reviewDetail',
          //   component: () => import('@/views/questionBank/myReview/ReviewDetail.vue')
          // },
          // {
          //   path: '/audit', //开始审核
          //   name: 'audit',
          //   component: () => import('@/views/questionBank/myReview/SingleAudit.vue')
          // },
          //考试管理
          {
            path: 'myExam', //我的考试
            name: 'myExam',
            component: () => import('@/views/workPanel/examManage/MyExam.vue'),
          },

          {
            path: 'createExam', //创建考试
            name: 'createExam',
            component: () => import('@/views/workPanel/examManage/CreateExam.vue'),
          },
          {
            path: 'editExam/:id', //编辑考试
            name: 'editExam',
            component: () => import('@/views/workPanel/examManage/CreateExam.vue'),
          },

          {
            path: 'myPaper', //我的试卷
            name: 'myPaper',
            component: () => import('@/views/workPanel/examManage/MyPaper.vue'),
          },
          {
            path: 'createPaper', //添加试题
            name: 'createPaper',
            component: () => import('@/views/workPanel/examManage/CreatePaper.vue'),
          },
          {
            path: 'testSelect', //选择题库试题
            name: 'testSelect',
            component: () => import('@/views/workPanel/TestSelect.vue'),
          },
          {
            path: 'paperDetail', //查看试卷详情
            name: 'paperDetail',
            component: () => import('@/views/workPanel/examManage/PaperDetail.vue'),
          },
          {
            path: 'testScore', //编辑试题分数
            name: 'testScore',
            component: () => import('@/views/workPanel/TestScore.vue'),
          },

          //考生管理

          {
            path: 'group', //分组管理
            name: 'group',
            component: () => import('@/views/examinee/Group.vue'),
          },
          {
            path: 'examinee', //考生管理
            name: 'examinee',
            component: () => import('@/views/examinee/Examinee.vue'),
          },
          {
            path: 'examineeSelect', //考生选择
            name: 'examineeSelect',
            component: () => import('@/views/examinee/ExamineeSelect.vue'),
          },
          {
            path: 'notification', //站内通知
            name: 'notification',
            component: () => import('@/views/workPanel/notification/Notification.vue'),
          },
          {
            path: 'notificationDetail/:id',
            name: 'notificationDetail',
            component: () => import('@/views/workPanel/notification/NotificationDetail.vue'),
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/Login.vue'),
    meta: {
      title: '登录',
      noToken: true, // 不需要token时使用
    },
  },
  {
    path: '/web',
    name: 'web',
    component: () => import('@/views/login/web.vue'),
    meta: {
      title: '登录',
      noToken: true, // 不需要token时使用
    },
  },
  {
    path: '/feedback',
    name: 'feedback',
    component: () => import('@/views/Feedback.vue'),
    meta: {
      title: '用户反馈',
    },
  },
  {
    path: '/validateEmail',
    name: 'validateEmail',
    component: () => import('@/views/login/validateEmail.vue'),
    meta: {
      title: '忘记密码',
      noToken: true,
    },
  },
  {
    path: '/forgetPassword',
    name: 'forgetPassword',
    component: ForgetPassword,
    meta: {
      title: '忘记密码',
      noToken: true,
    },
  },
  // 用户调查表
  {
    path: '/questionnaire',
    name: 'questionnaire',
    component: () => import('@/views/questionnaire/QuestionnaireIndex.vue'),
  },
  {
    path: '/404',
    name: '404',
    meta: { title: '404', hideFooter: true, noToken: true },
    hidden: true,
    component: () => import('@/views/404.vue'), // 懒加载
  },
  {
    path: '/:pathMatch(.*)*', // 匹配所有路径  vue2使用*   vue3使用/:pathMatch(.*)*或/:pathMatch(.*)或/:catchAll(.*)
    redirect: '/404',
    hidden: true,
  },
]
const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_BASE_URL),
  routes,
})
router.beforeEach(async (to, from, next) => {
  document.title = to.meta.title || '技术提升平台'

  // 路由拦截
  const { setCurRoute, setCancelToken } = useLoginStore()

  setCancelToken()
  if (!to.meta.noToken) {
    if (
      !localStorage['tip-web-token'] ||
      !localStorage['tip-web-user-id'] ||
      !localStorage['tip-web-avatar'] ||
      !localStorage['tip-web-email'] ||
      !localStorage['tip-web-number']
    ) {
      if (
        localStorage['tip-web-token'] ||
        localStorage['tip-web-user-id'] ||
        localStorage['tip-web-avatar'] ||
        localStorage['tip-web-email'] ||
        localStorage['tip-web-number']
      ) {
        ElMessage({
          showClose: true,
          message: '请重新登录',
          type: 'warning',
        })
      }

      setCurRoute()
      next({ path: '/login' })
      document.title = '登录'
    } else {
      next()
    }
  } else {
    // 若有缓存，不进入无token页面
    if (
      localStorage['tip-web-token'] &&
      localStorage['tip-web-user-id'] &&
      localStorage['tip-web-avatar'] &&
      localStorage['tip-web-email'] &&
      localStorage['tip-web-number']
    ) {
      next({ path: '/home' })
    } else {
      next()
    }
  }
})
// 解决上一个页面跳转然后不另外一个页面不滚动的问题
router.afterEach(() => {
  window.scrollTo(0, 0)
  document.querySelector('body').setAttribute('style', 'overflow: auto !important;')
})

export default router
