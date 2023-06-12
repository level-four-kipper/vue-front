import Programming from '@/views/exam/components/Programming.vue'
import Judge from '@/views/exam/components/Judge.vue'
import ShortAnswer from '@/views/exam/components/ShortAnswer.vue'
import MultipleSelection from '@/views/exam/components/MultipleSelection.vue'
import SingleSelection from '@/views/exam/components/SingleSelection.vue'

export const examAll = {
  exams: [
    {
      paper_id: 1,
      paper_name: 'string',
      question_bank_id: 1,
      create_method: '手动',
      question_number: 50,
      paper_description: 'string',
      paper_icon: 'string',
      creator: 'string',
      gmt_created: '2022-07-13 09:02:17.51',
      exam_num: 1,
      is_complete: 'yes',
      score: 0
    }
  ]
}

export const examAllList = {
  code: 0,
  msg: 'success',
  data: {
    total_count: 4,
    page_size: 10,
    total_page: 1,
    curr_page: 1,
    list: [
      {
        id: 1,
        gmt_created: null,
        creator: '1',
        gmt_modified: null,
        modifier: null,
        delete_flag: 0,
        paper_id: '1593067054638108674',
        paper_name: 'c++试卷',
        user_group_id: 1,
        start_time: '2022-11-02 15:02:12',
        end_time: '2022-11-02 15:02:12',
        exam_time: '90分钟',
        reviewer: 1,
        invigilator: 1,
        explain_string: null,
        state: 0,
        is_overdue: null,
        exam_num: 0
      },
      {
        id: '1588022514203426820',
        gmt_created: null,
        creator: '1',
        gmt_modified: null,
        modifier: null,
        delete_flag: 0,
        paper_id: 110,
        paper_name: '1',
        user_group_id: null,
        start_time: null,
        end_time: '2022-11-02 15:02:12',
        exam_time: null,
        reviewer: 1,
        invigilator: 1,
        explain_string: null,
        state: 0,
        is_overdue: null,
        exam_num: 0
      },
      {
        id: '1588022514203426835',
        gmt_created: null,
        creator: '1',
        gmt_modified: null,
        modifier: null,
        delete_flag: 0,
        paper_id: 110,
        paper_name: '试卷',
        user_group_id: null,
        start_time: null,
        end_time: '2022-11-02 15:02:12',
        exam_time: null,
        reviewer: 1,
        invigilator: 1,
        explain_string: null,
        state: 0,
        is_overdue: null,
        exam_num: 0
      },
      {
        id: '1593076557468622850',
        gmt_created: '2022-11-17 11:00:23',
        creator: '1',
        gmt_modified: null,
        modifier: null,
        delete_flag: 0,
        paper_id: 110,
        paper_name: 'c++试卷',
        user_group_id: 1,
        start_time: '2022-11-02 15:02:12',
        end_time: '2022-11-02 15:02:12',
        exam_time: '90分钟',
        reviewer: 1,
        invigilator: 1,
        explain_string: null,
        state: 0,
        is_overdue: null,
        exam_num: 0
      }
    ]
  }
}

export const questionType = {
  ['singleSelect']: { id: 1, type: 'singleSelect', name: '单选题', answerComponent: SingleSelection },
  ['multipleSelect']: { id: 2, type: 'multipleSelect', name: '多选题', answerComponent: MultipleSelection },
  ['judge']: { id: 3, type: 'judge', name: '判断题', answerComponent: Judge },
  ['shortAnswer']: { id: 4, type: 'shortAnswer', name: '问答题', answerComponent: ShortAnswer },
  ['programming']: { id: 5, type: 'programming', name: '编程题', answerComponent: Programming }
}
