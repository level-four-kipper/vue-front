module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['plugin:vue/vue3-recommended', 'eslint:recommended', 'plugin:prettier/recommended'],
  parser: 'vue-eslint-parser', // 用于.vue文件的Eslint自定义解析器
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    // "off" or 0 - 关闭规则
    // "warn" or 1 - 将规则视为一个警告（不会影响退出码）
    // "error" or 2 - 将规则视为一个错误 (退出码为1)

    'prettier/prettier': 0,

    /** JS */
    'max-params': [2, 4], // 强制函数定义中最多允许的参数数量
    'no-undef': 0,
    'no-var': 2,
    'no-unused-vars': 1, // 定义未使用
    'no-debugger': 1,
    'no-useless-escape': 0,

    /** VUE */
    'vue/html-indent': 0, // 关闭缩进校验
    'vue/attributes-order': 2, // html 标签属性必须按规则排序
    'vue/comment-directive': 0,
    'vue/html-quotes': 2, // html 属性值必须用双引号括起来
    // 自定义标签的命名必须使用大驼峰
    'vue/component-name-in-template-casing': [
      2,
      'PascalCase',
      {
        registeredComponentsOnly: true,
        ignores: [],
      },
    ],
    // 组件名规定要使用驼峰方式，index除外
    'vue/multi-word-component-names': [
      2,
      {
        ignores: ['index', 'login', '404', '401', 'add', 'detail', 'common'],
      },
    ],
  },
}
