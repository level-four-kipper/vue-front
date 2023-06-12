const routes = [
  {
    path: 'questionBank/index',
    name: 'questionBankIndex',
    component: () => import('@/views/questionBank/questionBankIndex.vue'),
    meta: { title: '题库', navIndex: 3 },
  },
  {
    path: 'questionBank/detail',
    name: 'questionBankDetail',
    component: () => import('@/views/questionBank/questionBankDetail.vue'),
    meta: { title: '题库详情', navIndex: 3 },
  },
  {
    path: 'questionBank/topicDetail',
    name: 'topicDetail',
    component: () => import('@/views/questionBank/topicDetail.vue'),
    meta: { title: '题目详情', navIndex: 3 },
  },
  {
    path: 'questionBank/create',
    name: 'questionBankCreate',
    component: () => import('@/views/questionBank/createQuestionBank.vue'),
    meta: { title: '创建题库' },
  },
  // 题库管理
  {
    path: 'questionBank',
    name: 'questionBank',
    component: () => import('@/views/questionBank/management/index.vue'),
    meta: {
      hideFooter: true,
      navIndex: 2,
      left: '创作空间 · 题库',
      hideRight: true,
      logo: '/index/blog-logo.png',
      title: '创作题库', // header 导航下标
    },
    children: [
      {
        path: 'board',
        name: 'Board',
        component: () => import('@/views/questionBank/management/board.vue'),
        meta: { title: '题库.看板' },
      },
      {
        path: 'editor',
        name: 'Editor',
        component: () => import('@/views/questionBank/management/editor.vue'),
        meta: { title: '题库.编辑' },
      },
      {
        path: 'audit',
        name: 'Audit',
        component: () => import('@/views/questionBank/management/audit.vue'),
        meta: { title: '题库.审核' },
      },
    ],
  },
  // 题库 - 刷题模式
  {
    path: 'exerciseModel',
    name: 'exerciseModel',
    redirect: '/exerciseModel/start',
    meta: {
      title: '题库 - 刷题',
      routerViewKey: 'exerciseModel', //给一级子路由添加key值，防止重复渲染
    },
    children: [
      {
        path: 'start',
        name: 'start',
        component: () => import('@/views/questionBank/exerciseModel/ExerciseStart.vue'),
        meta: {
          title: '题库 - 开始刷题',
        },
      },
      {
        path: 'exercising',
        name: 'exercising',
        component: () => import('@/views/questionBank/exerciseModel/Exercising.vue'),
        meta: {
          title: '题库 - 刷题中',
        },
      },
      {
        path: 'finish',
        name: 'finish',
        component: () => import('@/views/questionBank/exerciseModel/ExerciseFinish.vue'),
        meta: {
          title: '题库 - 完成刷题',
        },
      },
    ],
  },
]

export default routes
