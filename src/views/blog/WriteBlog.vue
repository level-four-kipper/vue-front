<!--  -->
<template>
  <div class="write-blog">
    <header>
      <div class="title-input">
        <input v-model="blogTitle" type="text" placeholder="文章标题" maxlength="30" />
      </div>
      <div class="publish-buttons">
        <div class="publish-blog" @click="openPublishView">发布</div>
        <div class="save-blog" @click="saveBlog">保存</div>
      </div>
    </header>
    <Editor v-model="blogHtml" to-edit @save="getBlogContent" />
    <div v-show="isShow" class="select-page">
      <div class="select-window">
        <div class="select-head">发布配置</div>
        <div class="select-content">
          <div class="blog-info">
            <div class="blog-info-left">
              <div class="info-classes">
                <p class="info-title">选择分类</p>
                <el-select v-model="blogClass" class="classSelect m-2" style="width: 120px" size="small" placeholder="请选择博客类型">
                  <el-option v-for="item in blogAllClasses.data" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </div>
              <div class="info-tags">
                <p class="info-title">添加标签</p>
                <div class="tags-show">
                  <span
                    v-for="item in blogTags.data"
                    :key="item.id"
                    class="tags"
                    :class="chooseTag.arr.indexOf(item.id) == -1 ? '' : 'active-tag'"
                    @click="addTag(item.id, $event)"
                    >{{ item.name }}</span
                  >
                  <!-- 添加标签 -->
                  <!-- <span class="add-tag">+</span> -->
                </div>
              </div>
            </div>
            <div class="blog-info-right">
              <p class="info-title">设置封面</p>
              <UploadImage :img-url="imgUrl" @uploadSuccess="handleUploadSuccess" />
            </div>
          </div>
          <div class="blog-publish-buttons">
            <span class="save-drafts" @click="saveBlog">保存到草稿箱</span>
            <span class="publish-blog" @click="publishBlog">发布</span>
            <span class="cancle" @click="cancleSaveBlog">取消</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Editor from '@/components/Editor.vue'
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import http from '@/utils/https.js'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import UploadImage from '@/components/UploadImage.vue'
const router = useRouter()
const route = useRoute()
const blogTitle = ref('')
const blogText = ref('')
const blogHtml = ref('')
const isShow = ref(false)
const blogClass = ref('')
const imgUrl = ref('')

const chooseTag = reactive({
  arr: [],
})
const blogTags = reactive({
  data: [],
})
const blogAllClasses = reactive({
  data: [],
})
// 图片上传
const handleUploadSuccess = res => {
  imgUrl.value = res.url
}
const openPublishView = function () {
  isShow.value = true
}
const cancleSaveBlog = function () {
  isShow.value = false
}
const saveBlog = function () {
  if (!blogTitle.value || !blogText.value) {
    ElMessage({
      showClose: true,
      message: '博客标题或内容不能为空！',
      type: 'error',
    })
  } else if (!route.query.id) {
    http
      .post('/blog-article/create', {
        // 文章信息
        title: blogTitle.value,
        content: blogText.value,
        content_md: blogHtml.value,
        status: 0,
        tags: chooseTag.arr || [],
        type: blogClass.value || '',
        image: imgUrl.value || '',
      })
      .then(res => {
        if (res.code == 0) {
          ElMessage({
            showClose: true,
            message: '保存成功',
            type: 'success',
          })
          router.push('/myBlogWrite')
        } else {
          ElMessage({
            showClose: true,
            message: '保存失败 请重试',
            type: 'error',
          })
        }
      })
      .catch(err => console.log(err))
  } else {
    http
      .put('/blog-article/update', {
        id: route.query.id,
        title: blogTitle.value,
        tags: chooseTag.arr || [],
        content: blogText.value,
        type: blogClass.value || '',
        status: 0,
        image: imgUrl.value || '',
        content_md: blogHtml.value,
      })
      .then(res => {
        if (res.code == 0) {
          ElMessage({
            showClose: true,
            message: '保存成功',
            type: 'success',
          })
          isShow.value = 'true'
          router.push('/myBlogWrite')
        } else {
          ElMessage({
            showClose: true,
            message: '保存失败，请重试',
            type: 'error',
          })
        }
      })
      .catch(err => console.log(err))
  }
}
const getBlogContent = function (text = '', html) {
  // blogText.value = text
  blogHtml.value = html
  // console.log(html)
  blogText.value = text.replace(/"/g, '\\"')
  console.log(blogText.value)
  ElMessage({
    showClose: true,
    message: '内容已保存',
    type: 'success',
  })
}
const publishBlog = function () {
  if (!blogTitle.value || !blogText.value) {
    ElMessage({
      showClose: true,
      message: '博客标题或内容不能为空！',
      type: 'error',
    })
  } else if (blogClass.value === '请选择博客类型') {
    ElMessage({
      showClose: true,
      message: '请选择博客类型',
      type: 'warning',
    })
  } else if (chooseTag.arr.length == 0) {
    ElMessage({
      showClose: true,
      message: '请选择博客标签',
      type: 'warning',
    })
  } else if (!route.query.id) {
    http
      .post('/blog-article/create', {
        // 文章信息
        title: blogTitle.value,
        tags: chooseTag.arr,
        content: blogText.value,
        type: blogClass.value,
        status: 1,
        image: imgUrl.value,
        content_md: blogHtml.value,
      })
      .then(res => {
        console.log(res)
        if (res.code == 0) {
          ElMessage({
            showClose: true,
            message: '创建成功',
            type: 'success',
          })
          isShow.value = 'true'
          router.push('/myBlogWrite')
        } else {
          ElMessage({
            showClose: true,
            message: '创建失败，请重试',
            type: 'error',
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
  } else {
    console.log('发布编辑后的文章')
    http
      .put('/blog-article/update', {
        id: route.query.id,
        title: blogTitle.value,
        tags: chooseTag.arr,
        content: blogText.value,
        type: blogClass.value,
        status: 1,
        image: imgUrl.value,
        content_md: blogHtml.value,
      })
      .then(res => {
        if (res.code == 0) {
          ElMessage({
            showClose: true,
            message: '发布成功',
            type: 'success',
          })
          isShow.value = 'true'
          router.push('/myBlogWrite')
        } else {
          ElMessage({
            showClose: true,
            message: '发布失败，请重试',
            type: 'error',
          })
        }
      })
      .catch(err => console.log(err))
  }
}
const addTag = function (id, el) {
  // chooseTag.arr.indexOf(id)==-1?chooseTag.arr.push(id):chooseTag.arr.splice(chooseTag.arr.indexof(id),1)
  if (chooseTag.arr.indexOf(id) == -1) {
    chooseTag.arr.push(id)
    el.srcElement.classList.add('active-tag')
  } else {
    chooseTag.arr.splice(chooseTag.arr.indexOf(id), 1)
    el.srcElement.classList.remove('active-tag')
  }
  console.log(chooseTag.arr)
}
onMounted(() => {
  // 查询标签
  http
    .get('/blog-tag/tag-list')
    .then(res => {
      blogTags.data = res.data
    })
    .catch(err => console.log(err))
  // 查询分类
  http
    .get('/blog-type/type-list')
    .then(res => {
      // console.log(res.data)
      blogAllClasses.data = res.data
    })
    .catch(err => console.log(err))
  if (route.query.id) {
    http.get('/blog-article/detail/' + route.query.id).then(res => {
      console.log(res)
      blogTitle.value = res.data.title
      blogText.value = res.data.content
      blogHtml.value = res.data.content_md
      if (res.data.type_obj.id) {
        blogClass.value = res.data.type_obj.id
      }
      imgUrl.value = res.data.image
      if (res.data.tag_list) {
        res.data.tag_list.map(el => {
          chooseTag.arr.push(el.id)
        })
      }
    })
  }
})
onBeforeUnmount(() => {})
</script>

<style lang="scss" scoped>
.write-blog {
  height: 100%;
  background-color: rgb(242, 242, 242);
  padding: 25px 40px;
  position: relative;
  header {
    padding: 10px 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .title-input {
      width: 350px;
      height: 35px;
      overflow: hidden;
      color: rgb(153, 153, 153);
      border: 1px solid rgb(222, 222, 222);
      border-radius: 5px;
      > input {
        width: 100%;
        line-height: 33px;
        padding: 0 10px;
        border: 0 solid #333;
        outline: none;
      }
    }
    .publish-buttons {
      width: 115px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .publish-blog,
      .save-blog {
        height: 35px;
        width: 50px;
        line-height: 35px;
        border-radius: 3px;
        text-align: center;
        user-select: none;
        cursor: pointer;
        border: 1px solid rgba(0, 102, 255, 0.988235294117647);
      }
      .publish-blog {
        background-color: rgba(0, 102, 255, 0.988235294117647);
        color: #fff;
      }
      .save-blog {
        // background-color: #fff;
        color: rgba(0, 102, 255, 0.988235294117647);
      }
    }
  }
  :deep(.v-md-editor) {
    height: 800px !important;
  }
  .select-page {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: rgba($color: #000, $alpha: 0.3);
    z-index: 99;
    .select-window {
      width: 500px;
      height: 370px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: white;
      .select-head {
        height: 55px;
        display: flex;
        align-items: center;
        padding-left: 30px;
        border-bottom: 1px solid #ddd;
        color: rgb(51, 51, 51);
        font-size: 15px;
        font-weight: 600;
      }
      .select-content {
        height: 315px;
        padding: 20px 45px 15px 30px;
        display: flex;
        flex-direction: column;
        .blog-info {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          flex: 1;
          .blog-info-left {
            .info-classes {
              margin-bottom: 20px;
            }
            .info-tags {
              .tags-show {
                display: flex;
                font-size: 12px;
                flex-direction: row;
                flex-wrap: wrap;
                .tags {
                  padding: 0 6px;
                  border-radius: 11px;
                  color: #faad14;
                  border: 1px solid #faad14;
                  margin-right: 12px;
                  margin-bottom: 8px;
                  user-select: none;
                  cursor: pointer;
                }
                .active-tag {
                  color: #fff;
                  background-color: #faad14;
                }
                .add-tag {
                  width: 50px;
                  height: 22px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  color: #c6c6c6;
                  border: 1px dashed #c6c6c6;
                  border-radius: 11px;
                  cursor: pointer;
                  user-select: none;
                }
              }
            }
          }
          .blog-info-right {
            display: flex;
            flex-direction: column;
            // .upload-picture{
            //     width: 130px;
            //     height: 65px;
            //     display: flex;
            //     align-items: center;
            //     justify-content: center;
            //     border: 1px dashed #c6c6c6;
            //     user-select: none;
            //     cursor: pointer;
            // }
            .avatar-uploader {
              border: 1px dashed #d9d9d9;
              border-radius: 6px;
              cursor: pointer;
              position: relative;
              overflow: hidden;
              &:hover {
                border-color: #409eff;
              }
            }
            :deep(.avatar-uploader-icon) {
              font-size: 28px;
              color: #8c939d;
              width: 130px;
              height: 130px;
              line-height: 130px;
              text-align: center;
            }
            .avatar {
              width: 130px;
              height: 130px;
              display: block;
            }
          }
          .info-title {
            margin-bottom: 20px;
          }
        }
        .blog-publish-buttons {
          font-size: 13px;
          justify-self: end;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          .save-drafts {
            color: #409eff;
            user-select: none;
            cursor: pointer;
          }
          .publish-blog {
            color: #fff;
            user-select: none;
            cursor: pointer;
            width: 60px;
            height: 30px;
            background-color: #409eff;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .cancle {
            margin-right: 5px;
            color: #7f7f7f;
            user-select: none;
            cursor: pointer;
          }
        }
      }
    }
  }
  :deep(.w-50 .is-focus) {
    border: 1px solid #409eff;
    box-shadow: 3px 3px 3px #409eff;
  }
  :deep(.el-select .el-input.is-focus .el-input__wrapper) {
    box-shadow: 0 0 0 1px #c0c4cc !important;
  }
  :deep(.el-select .el-input .el-input__wrapper.is-focus) {
    box-shadow: 0 0 0 1px #c0c4cc !important;
  }
}
</style>
