<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <sticky :z-index="10" :class-name="'sub-navbar '+postForm.status">
        <!-- <CommentDropdown v-model="postForm.comment_disabled" />
        <PlatformDropdown v-model="postForm.platforms" />
        <SourceUrlDropdown v-model="postForm.source_uri" /> -->
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
          发布
        </el-button>
        <el-button v-loading="loading" type="warning" @click="draftForm">
          草稿
        </el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <div class="article-base">
              <el-radio-group v-model="postForm.status">
                <el-radio :label="0">显示</el-radio>
                <el-radio :label="1">隐藏</el-radio>
              </el-radio-group>
              <el-form-item style="margin-bottom: 0;" prop="category" label="">
                <el-cascader
                  placeholder="请选择文章类型"
                  expand-trigger="hover"
                  :options="typesData"
                  @change="typeChange"
                >
                </el-cascader>
              </el-form-item>
              <div class="article-modules">
                <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="articleModuleCheckAllChange">全选</el-checkbox>
                文章包含模块
                <div style="margin: 10px 0;"></div>
                <el-checkbox-group v-model="checkedArticleModules" @change="articleModuleChange">
                  <el-checkbox v-for="articleModule in articleModules" :key="articleModule.key" :label="articleModule.key">{{ articleModule.value }}</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
            <!-- <el-form-item prop="title">
              <MDinput v-model="postForm.title" :maxlength="100" name="name" required>
                文章标题
              </MDinput>
            </el-form-item> -->
            <div class="article-header">
              <el-form-item style="margin-bottom: 0;" prop="cover" label="">
                <div class="article-cover background" :style="{backgroundImage: `url(${postForm.cover})`}" @click="coverVisible = true"></div>
                <!-- <editorImage text="文章封面" @success="setCover"></editorImage> -->
              </el-form-item>
              <div class="article-header-content">
                <el-form-item style="margin-bottom: 20px;" prop="title" label="">
                  <MDinput v-model="postForm.title" :maxlength="100" name="name" required>
                    文章标题
                  </MDinput>
                </el-form-item>
                <el-form-item style="margin-bottom: 0;" prop="desc" label="">
                  <el-input v-model="postForm.desc" type="textarea" :rows="4" resize="none" placeholder="请填写文章简介"></el-input>
                </el-form-item>
              </div>
            </div>
            <div class="article-module" data-title="图片">
              <draggable v-model="postForm.images">
                <div v-for="(item, index) in postForm.images" :key="item.id" class="article-item">
                  <div class="article-item-img" @click="moduleBgClick('image', index)">
                    <div
                      class="background background-ratio"
                      :style="{backgroundImage: `url(${item.url})`}"
                    >
                    </div>
                  </div>
                  <el-input v-model="item.text" type="textarea" :rows="3" resize="none" placeholder="请填写描述信息..."></el-input>
                  <div class="article-item-control">
                    <i class="el-icon-close"></i>
                    <i class="el-icon-rank handle"></i>
                    <i class="el-icon-plus" @click="addModulePicture(index)"></i>
                  </div>
                </div>
              </draggable>
            </div>
            <div class="article-module" data-title="视频">
              <draggable v-model="postForm.videos">
                <div v-for="(item, index) in postForm.videos" :key="item.id" class="article-item">
                  <div class="article-item-img" @click="moduleBgClick('video', index)">
                    <div
                      class="background background-ratio"
                      :style="{backgroundImage: `url(${item.url + videoCover})`}"
                    >
                    </div>
                  </div>
                  <el-input v-model="item.text" type="textarea" :rows="3" resize="none" placeholder="请填写描述信息..."></el-input>
                  <div class="article-item-control">
                    <i class="el-icon-close"></i>
                    <i class="el-icon-rank handle"></i>
                    <i class="el-icon-plus" @click="addModuleVideo(index)"></i>
                  </div>
                </div>
              </draggable>
            </div>
            <div class="article-module" data-title="链接">
              <draggable v-model="postForm.links">
                <div v-for="(item, index) in postForm.links" :key="item.id" class="article-item">
                  <div class="article-item-img" @click="moduleBgClick('link', index)">
                    <div
                      class="background background-ratio"
                      :style="{backgroundImage: `url(${item.url})`}"
                    >
                    </div>
                  </div>
                  <el-input v-model="item.text" type="textarea" :rows="3" resize="none" placeholder="请填写描述信息..."></el-input>
                  <div class="article-item-control">
                    <i class="el-icon-close"></i>
                    <i class="el-icon-rank handle"></i>
                    <i class="el-icon-plus" @click="addModuleLink(index)"></i>
                  </div>
                </div>
              </draggable>
            </div>
          </el-col>
        </el-row>
        <el-form-item prop="article" style="margin-bottom: 30px;">
          <Tinymce ref="editor" v-model="postForm.article" :height="400" />
        </el-form-item>
      </div>
    </el-form>
    <el-dialog :visible.sync="coverVisible">
      <editorImage v-if="coverVisible" @success="setCover"></editorImage>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button type="primary" :disabled="!cover" @click="saveCover">确 定</el-button> -->
      </span>
    </el-dialog>
    <el-dialog :visible.sync="articleItemVisible">
      <editorImage v-if="articleItemVisible" :is-video="currentArticleModule === 'video'" @success="setArticleItemUrl"></editorImage>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button type="primary" :disabled="!cover" @click="saveCover">确 定</el-button> -->
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
// import Upload from '@/components/Upload/SingleImage3'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
// import { validURL } from '@/utils/validate'
import { fetchArticle } from '@/api/article'
import { searchUser } from '@/api/remote-search'
// import { CommentDropdown, PlatformDropdown, SourceUrlDropdown } from './Dropdown'
import editorImage from '@/components/EditorImage'
import draggable from '@/components/Draggable'
// import errGif from '@/assets/401_images/401.gif'
import { qiniuDomain, videoCover } from 'config/qiniu'
import { getTypes } from '@/api/types'

const defaultForm = {
  status: 0,
  title: '', // 文章题目
  cover: '',
  content: '', // 文章内容
  images: [
    {
      id: 0,
      uri: '',
      url: '',
      text: ''
    }
  ],
  videos: [
    {
      id: 0,
      uri: '',
      url: '',
      text: ''
    }
  ],
  links: [
    {
      id: 0,
      uri: '',
      url: '',
      text: ''
    }
  ],
  category: '',
  subcategory: '',
  desc: '',
  article: ''
}

export default {
  name: 'ArticleDetail',
  components: { Tinymce, MDinput, Sticky, editorImage, draggable },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必填项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必填项'))
      } else {
        callback()
      }
    }
    // const validateSourceUri = (rule, value, callback) => {
    //   if (value) {
    //     if (validURL(value)) {
    //       callback()
    //     } else {
    //       this.$message({
    //         message: '外链url填写不正确',
    //         type: 'error'
    //       })
    //       callback(new Error('外链url填写不正确'))
    //     }
    //   } else {
    //     callback()
    //   }
    // }
    return {
      coverVisible: false,
      videoCover,
      articleItemVisible: false,
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      rules: {
        image_uri: [{ validator: validateRequire }],
        title: [{ validator: validateRequire }],
        type: [
          { required: true, message: '文章类型为必选项' }
        ],
        cover: [
          { required: true, message: '请上传封面' }
        ],
        desc: [{ required: true, message: '文章简介不能为空' }],
        category: [{ required: true, message: '请选择文章类型' }],
        subcategory: [{ required: true, message: '请选择文章子类型' }]
      },
      tempRoute: {},
      selectedType: [],
      currentIndex: 0,
      types: [],
      checkAll: false,
      isIndeterminate: false,
      checkedArticleModules: [],
      articleModules: [
        { key: 'image', value: '图片' },
        { key: 'video', value: '视频' },
        { key: 'link', value: '链接' },
        { key: 'article', value: '文章' }
      ],
      currentArticleModule: ''
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.content_short.length
    },
    lang() {
      return this.$store.getters.language
    },
    typesData() {
      return this.types.map(type => {
        const data = {
          value: type.category,
          label: type.name
        }
        if (type.subcategories && type.subcategories.length) {
          data.children = type.subcategories.map(item => ({
            value: item,
            label: item
          }))
        }

        return data
      })
    }
  },
  created() {
    this.getTypes()
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    moduleBgClick(articleModule, index) {
      this.currentArticleModule = articleModule
      this.currentIndex = index
      this.articleItemVisible = true
    },
    addModuleLink(index) {
      this.postForm.links.splice(index + 1, 0, { id: this.postForm.links.length, uri: '', url: '', text: '' })
    },
    addModuleVideo(index) {
      this.postForm.videos.splice(index + 1, 0, { id: this.postForm.videos.length, uri: '', url: '', text: '' })
    },
    addModulePicture(index) {
      this.postForm.images.splice(index + 1, 0, { id: this.postForm.images.length, uri: '', url: '', text: '' })
    },
    articleModuleCheckAllChange(val) {
      this.checkedArticleModules = val ? this.articleModules : []
      this.isIndeterminate = false
    },
    articleModuleChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.articleModules.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.articleModules.length
    },
    getTypes() {
      getTypes().then(res => {
        this.types = res && res.data || []
        console.log('types:', this.types)
      })
    },
    setArticleItemUrl(key) {
      const img = qiniuDomain + key
      this.$set(this.postForm[`${this.currentArticleModule}s`][this.currentIndex], 'uri', key)
      this.$set(this.postForm[`${this.currentArticleModule}s`][this.currentIndex], 'url', img)
      this.articleItemVisible = false
    },
    setCover(key) {
      const img = qiniuDomain + key
      this.$set(this.postForm, 'cover', img)
      this.coverVisible = false
    },
    typeChange(value) {
      const [category, subcategory] = value

      this.$set(this.postForm, 'category', category)
      this.$set(this.postForm, 'subcategory', subcategory)
    },
    fetchData(id) {
      fetchArticle(id).then(response => {
        this.postForm = response.data
        // Just for test
        this.postForm.title += `   Article Id:${this.postForm.id}`
        this.postForm.content_short += `   Article Id:${this.postForm.id}`

        // Set tagsview title
        this.setTagsViewTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = this.lang === 'zh' ? '编辑文章' : 'Edit Article'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    submitForm() {
      // this.postForm.display_time = parseInt(this.display_time / 1000)
      console.log(this.postForm)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$notify({
            title: '成功',
            message: '发布文章成功',
            type: 'success',
            duration: 2000
          })
          // this.postForm.status = 'published'
          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    draftForm() {
      if (this.postForm.content.length === 0 || this.postForm.title.length === 0) {
        this.$message({
          message: '请填写必要的标题和内容',
          type: 'warning'
        })
        return
      }
      this.$message({
        message: '保存成功',
        type: 'success',
        showClose: true,
        duration: 1000
      })
      this.postForm.status = 'draft'
    },
    getRemoteUserList(query) {
      searchUser(query).then(response => {
        if (!response.data.items) return
        this.userListOptions = response.data.items.map(v => v.name)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;
  min-width: 900px;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea /deep/ {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
.article-header{
  margin-bottom: 40px;
  display: flex;
  align-items: flex-end;
  .article-cover{
    position: relative;
    width: 150px;
    height: 150px;
    background-color: #eee;
    border: 1px dashed #ccc;
    &::before{
      content: '上传封面';
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
  &-content{
    margin-left: 20px;
    flex: 1;
  }
}
.article-module{
  position: relative;
  margin-bottom: 20px;
  padding: 30px 10px 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  &::before{
    content: attr(data-title);
    padding: 0 20px;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    color: inherit;
  }
}
.article-item{
  padding: 10px 0 10px 10px;
  display: flex;
  background-color: #eee;
  &-img{
    position: relative;
    margin-right: 20px;
    flex: 0 0 100px;
    background-color: #fff;
    &::before{
      content: '点击上传';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 14px;
      white-space: nowrap;
    }
  }
  &-control{
    padding: 0 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 20px;
    color: #bbb;
    &>i{
      cursor: pointer;
    }
    &>i:hover{
      color: blue;
    }
  }
}
.article-base{
  margin: 20px 0 0;
  display: flex;
  align-items: center;
  &>*{
    margin-right: 20px;
  }
}
</style>
