import Programming from '@/views/exam/components/Programming.vue'
import Judge from '@/views/exam/components/Judge.vue'
import ShortAnswer from '@/views/exam/components/ShortAnswer.vue'
import MultipleSelection from '@/views/exam/components/MultipleSelection.vue'
import SingleSelection from '@/views/exam/components/SingleSelection.vue'

export const questionType = {
  ['单选题']: SingleSelection,
  ['问答题']: ShortAnswer,
  ['多选题']: MultipleSelection,
  ['判断题']: Judge,
  ['编程题']: Programming
}

/**
 * 数据mock，模拟后端数据
 */
// 考试试卷答题
export const answerPaper = {
  paper_id: 1,
  paper_name: 'string',
  user_id: 1,
  user_name: 'string',
  playing_time: 'string',
  reviewer_id: 1,
  explain: 'string',
  questions: [
    {
      question_id: 12,
      question_number: 1,
      type: '单选题',
      answer: null
    },
    {
      question_id: 13,
      question_number: 2,
      type: '多选题',
      answer: null
    },
    {
      question_id: 14,
      question_number: 3,
      type: '问答题',
      answer: null
    },
    {
      question_id: 16,
      question_number: 4,
      type: '判断题',
      answer: null
    },
    {
      question_id: 15,
      question_number: 5,
      type: '编程题',
      answer: null
    }
  ]
}

// 考试试卷
export const examPaper = {
  code: 0,
  msg: 'success',
  data: {
    exam_id: '1',
    paper_id: '1598476216641638402',
    paper_name: null,
    start_time: '2022-11-02 15:02:12',
    end_time: '2022-11-02 15:02:12',
    exam_time: 90,
    question_number: 3,
    paper_description: null,
    explain_string: 'cctv',
    papaer_icon: null,
    questions: [
      {
        id: '1594907555367342082',
        type: '多选题',
        answer: 'A,B,C',
        question_serial: 0,
        title: 'Java的特性是？',
        score: 60,
        option_list: null
      },
      {
        id: '1594907832795385858',
        type: '判断题',
        answer: '对',
        question_serial: 0,
        title: 'Java的创始人是詹姆斯-高斯林',
        score: 20,
        option_list: null
      },
      {
        id: '1594911723419074561',
        type: '问答题',
        answer: '詹姆斯-xxx',
        question_serial: 0,
        title: 'Java的创始人是谁？abcdefegjsdjajdsadlasldaksdk',
        score: 20,
        option_list: null
      }
    ]
  }
}
