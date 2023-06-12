import Mock from 'mockjs'

const Random = Mock.Random

// 设置拦截ajax请求的相应时间
Mock.setup({
  timeout: '200-600'
})

const getReplayChildren = length => {
  let replayList = []
  for (let i = 0; i < length; i++){
    replayList.push( {
      id: Random.natural(),
      title: Random.csentence(8, 15),
      content: Random.cparagraph(5),
      list_tags: ['tag 0', 'tag 1', 'tag 2'],
      status: Random.integer(0, 5),
      user_name: Random.cfirst() + Random.clast(),
      like_count: Random.integer(100, 10000),
      comment_count: Random.integer(100, 10000),
      created_time: Mock.mock('@date("yyyy-yy-yy")'),
      like_status: Random.boolean()
    })
  }
  return replayList
}

const getReplay = length => {
  let replayList = []
  for (let i = 0; i < length; i++){
    replayList.push( {
      id: Random.natural(),
      title: Random.csentence(8, 15),
      content: Random.cparagraph(5),
      list_tags: ['tag 0', 'tag 1', 'tag 2'],
      status: Random.integer(0, 5),
      user_name: Random.cfirst() + Random.clast(),
      like_count: Random.integer(100, 10000),
      comment_count: Random.integer(100, 10000),
      created_time: Mock.mock('@date("yyyy-yy-yy")'),
      like_status: Random.boolean(),
      children: getReplayChildren(6)
    })
  }
  return replayList
}

const getComment = length => {
  let commentList = []
  for (let i = 0; i < length; i++){
    commentList.push({
      id: Random.natural(),
      title: Random.csentence(8, 15),
      content: Random.cparagraph(15),
      list_tags: ['tag 0', 'tag 1', 'tag 2'],
      status: Random.integer(0, 5),
      user_name: Random.cfirst() + Random.clast(),
      username: Random.cfirst() + Random.clast(),
      like_count: Random.integer(100, 10000),
      comment_count: Random.integer(100, 10000),
      created_time: Mock.mock('@date("yyyy-yy-yy")'),
      like_status: Random.boolean(),
      time_different: Mock.mock('@date("yyyy-yy-yy")'),
      list: getReplay(Random.integer(2, 5)),
      children: getReplay(Random.integer(2, 5))
    })
  }
  return commentList
}

const getAnswer = length => {
  let answerList = []
  for (let i = 0; i < length; i++){
    answerList.push({
      id: Random.natural(),
      title: Random.csentence(8, 15),
      content: Random.cparagraph(50),
      list_tags: ['tag 0', 'tag 1', 'tag 2'],
      status: Random.integer(0, 5),
      user_name: Random.cfirst() + Random.clast(),
      username: Random.cfirst() + Random.clast(),
      look_count: Random.integer(100, 10000),
      like_count: Random.integer(100, 10000),
      comment_count: Random.integer(100, 10000),
      star_count: Random.integer(100, 10000),
      created_time: Mock.mock('@date("yyyy-yy-yy")'),
      time_different: Mock.mock('@date("yyyy-yy-yy")'),
      img_url: Random.dataImage('200x100', Random.cfirst() + Random.clast()),
      //
      like_status: Random.boolean(),
      star_status: Random.boolean(),
      commentList: getComment(Random.integer(4, 10))
    })
  }
  return answerList
}

let data = {
  code: 0,
  msg: 'success',
  data: {
    id: Random.natural(),
    title: Random.csentence(8, 15),
    content: Random.cparagraph(50),
    list_tags: ['tag 0', 'tag 1', 'tag 2'],
    status: Random.integer(1, 2),
    user_name: Random.cfirst() + Random.clast(),
    username: Random.cfirst() + Random.clast(),
    look_count: Random.integer(100, 10000),
    like_count: Random.integer(100, 10000),
    comment_count: Random.integer(100, 10000),
    star_count: Random.integer(100, 10000),
    created_time: Mock.mock('@date("yyyy-yy-yy")'),
    time_different: Mock.mock('@date("yyyy-yy-yy")'),
    comments: getAnswer(Random.integer(15, 50))
  }
}

// Mock.mock('/api/quiz/detail', 'post', a => {
//   console.log('------Mock.mock------/quiz/detail', a, data)
//   return { ...data }
// })

// Mock.mock('/api/question-answer-info/detail', 'get', a => {
//   console.log('------Mock.mock------/question-answer-info/detail', a, data)
//   const answers = {
//     code: 0,
//     msg: 'success',
//     data: getAnswer(Random.integer(15, 50))
//   }
//   return answers
// })

// Mock.mock('/api/blog-comment-info/detail', 'get', a => {
//   const comments = {
//     code: 0,
//     msg: 'success',
//     data: getComment(Random.integer(4, 10))
//   }
//   console.log('------Mock.mock------/blog-comment-info/detail', a, comments)
//   return { ...comments }
// })
