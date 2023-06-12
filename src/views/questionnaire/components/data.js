export const formList = [
    {
        type: 'radio', // 题目类型 radio, input, textarea, checkbox
        field: 'answer1', // 字段名称
        value: '', // 选项结果
        title: '您的工作岗位是以下哪种类型？', // 题目名称
        inputValue: '', // 输入框数据
        options: [  // 题目选项
            {
                label: '研发',
                value: '研发'
            },
            {
                label: '设计',
                value: '设计'
            },
            {
                label: '测试',
                value: '测试'
            },
            {
                label: '项目',
                value: '项目'
            },
            {
                label: '产品',
                value: '产品'
            },
            {
                label: '管理',
                value: '管理'
            },
            {
                type: 'input',
                label: '其他，请补充',
                value: '其他'
            }
        ]
    }, {
        type: 'radio', // 题目类型 radio, input, textarea, checkbox
        field: 'answer2', // 字段名称
        value: '', // 选项结果
        title: '除了同事之外，您有跟其他人做过知识(技术、经验、思考)交流吗？', // 题目名称
        options: [
            {
                label: '有',
                value: '有'
            },
            {
                label: '没有',
                value: '没有'
            }
        ]
    }, {
        type: 'checkbox', // 题目类型 radio, input, textarea, checkbox
        field: 'answer3', // 字段名称
        value: [], // 选项结果
        title: '您与其他人交流的方式有哪些？(可多选)', // 题目名称
        inputValue: '', // 输入框数据
        options: [
            {
                label: '在线论坛',
                value: '在线论坛'
            },
            {
                label: '博客社区',
                value: '博客社区'
            },
            {
                label: '线下会议',
                value: '线下会议'
            },
            {
                type: 'input',
                label: '其他，请补充',
                value: '其他'
            }
        ]
    }, {
        type: 'radio', // 题目类型 radio, input, textarea, checkbox
        field: 'answer4', // 字段名称
        value: [], // 选项结果
        title: '您喜欢跟其他人分享您的学习成果、技术总结、经验妙招吗？', // 题目名称
        inputValue: '', // 输入框数据
        options: [
            {
                label: '喜欢',
                value: '喜欢'
            },
            {
                type: 'input',
                label: '不喜欢，请补充原因',
                value: '其他'
            }
        ]
    }, {
        type: 'checkbox', // 题目类型 radio, input, textarea, checkbox
        field: 'answer5', // 字段名称
        value: [], // 选项结果
        title: '您使用过哪些博客产品？(可多选)', // 题目名称
        inputValue: '', // 输入框数据
        options: [
            {
                label: 'CSDN',
                value: 'CSDN'
            },
            {
                label: '博客园',
                value: '博客园'
            },
            {
                label: 'Segmentfault 思否',
                value: 'Segmentfault 思否'
            },
            {
                label: '稀土掘金',
                value: '稀土掘金'
            },
            {
                label: 'InfoQ',
                value: 'InfoQ'
            },
            {
                type: 'input',
                label: '其他，请补充',
                value: '其他'
            }
        ]
    }, {
        type: 'checkbox', // 题目类型 radio, input, textarea, checkbox
        field: 'answer6', // 字段名称
        value: [], // 选项结果
        title: '您经常使用该博客产品的哪些功能？(可多选)', // 题目名称
        inputValue: '', // 输入框数据
        options: [
            {
                label: '创作博客',
                value: '创作博客'
            },
            {
                label: '搜索博客',
                value: '搜索博客'
            },
            {
                label: '博客推荐',
                value: '博客推荐'
            },
            {
                label: '博客互动(评论、点赞、收藏、分享)',
                value: '博客互动(评论、点赞、收藏、分享)'
            },
            {
                type: 'input',
                label: '其他，请补充',
                value: '其他'
            }
        ]
    }, {
        type: 'checkbox', // 题目类型 radio, input, textarea, checkbox
        field: 'answer7', // 字段名称
        value: [], // 选项结果
        title: '您觉得该博客产品哪些功能做得比较好？(可多选)', // 题目名称
        inputValue: '', // 输入框数据
        options: [
            {
                label: '创作博客',
                value: '创作博客'
            },
            {
                label: '搜索博客',
                value: '搜索博客'
            },
            {
                label: '博客推荐',
                value: '博客推荐'
            },
            {
                label: '博客互动(评论、点赞、收藏、分享)',
                value: '博客互动(评论、点赞、收藏、分享)'
            },
            {
                type: 'input',
                label: '其他，请补充',
                value: '其他'
            }
        ]
    }, {
        type: 'textarea', // 题目类型 radio, input, textarea, checkbox
        field: 'answer8', // 字段名称
        value: '', // 选项结果
        title: '您觉得该博客产品哪些功能做得有待改进？', // 题目名称
        placeholder: '请填写您的建议'
    }, {
        type: 'textarea', // 题目类型 radio, input, textarea, checkbox
        field: 'answer9', // 字段名称
        value: '', // 选项结果
        title: '您觉得我们的博客产品应该加入哪些功能？', // 题目名称
        placeholder: '请填写您的建议'
    }, {
        type: 'checkbox', // 题目类型 radio, input, textarea, checkbox
        field: 'answer10', // 字段名称
        value: [], // 选项结果
        title: '遇到自己一时无法解决的问题时，您的做法是 (可多选)', // 题目名称
        inputValue: '', // 输入框数据
        options: [
            {
                label: '请教同事',
                value: '请教同事'
            },
            {
                label: '请教领导',
                value: '请教领导'
            },
            {
                label: '百度一下',
                value: '百度一下'
            },
            {
                label: '网上提问',
                value: '网上提问'
            },
            {
                type: 'input',
                label: '其他，请补充',
                value: '其他'
            }
        ]
    }, {
        type: 'checkbox', // 题目类型 radio, input, textarea, checkbox
        field: 'answer11', // 字段名称
        value: [], // 选项结果
        title: '您使用过哪些问答产品 (可多选)', // 题目名称
        inputValue: '', // 输入框数据
        options: [
            {
                label: '知乎',
                value: '知乎'
            },
            {
                label: 'Stack Overflow',
                value: 'Stack Overflow'
            },
            {
                label: 'CSDN',
                value: 'CSDN'
            },
            {
                label: '网上提问',
                value: '网上提问'
            },
            {
                type: 'input',
                label: '其他，请补充',
                value: '其他'
            }
        ]
    }, {
        type: 'checkbox', // 题目类型 radio, input, textarea, checkbox
        field: 'answer12', // 字段名称
        value: [], // 选项结果
        title: '您使用问答产品的驱动力是？(可多选)', // 题目名称
        inputValue: '', // 输入框数据
        options: [
            {
                label: '希望别人的帮助',
                value: '希望别人的帮助'
            },
            {
                label: '找到相似问题的答案',
                value: '找到相似问题的答案'
            },
            {
                label: '用自己的能力去帮助别人',
                value: '用自己的能力去帮助别人'
            },
            {
                label: '从别人的错误或问题中提升自己',
                value: '从别人的错误或问题中提升自己'
            },
            {
                type: 'input',
                label: '其他，请补充',
                value: '其他'
            }
        ]
    }, {
        type: 'radio', // 题目类型 radio, input, textarea, checkbox
        field: 'answer13', // 字段名称
        value: [], // 选项结果
        title: '该类问答产品能否解决您的问题？', // 题目名称
        inputValue: '', // 输入框数据
        options: [
            {
                label: '能',
                value: '能'
            },
            {
                type: 'input',
                label: '不能，原因是',
                value: '其他'
            }
        ]
    }, {
        type: 'textarea', // 题目类型 radio, input, textarea, checkbox
        field: 'answer14', // 字段名称
        value: '', // 选项结果
        title: '您觉得该问答产品比较好的功能有哪些？', // 题目名称
        placeholder: '请填写您的建议'
    }, {
        type: 'textarea', // 题目类型 radio, input, textarea, checkbox
        field: 'answer15', // 字段名称
        value: '', // 选项结果
        title: '您觉得该问答产品需要改进的功能有哪些？', // 题目名称
        placeholder: '请填写您的建议'
    }, {
        type: 'textarea', // 题目类型 radio, input, textarea, checkbox
        field: 'answer16', // 字段名称
        value: '', // 选项结果
        title: '您觉得我们的问答产品应该加入哪些功能？', // 题目名称
        placeholder: '请填写您的建议'
    }, {
        type: 'textarea', // 题目类型 radio, input, textarea, checkbox
        field: 'answer17', // 字段名称
        value: '', // 选项结果
        title: '您可以提出其它建议或意见？', // 题目名称
        placeholder: '请填写您的建议或意见'
    }
]