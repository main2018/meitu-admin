<template>
  <section class="container">
    <sticky :z-index="10" :class-name="'sub-navbar '+postForm.status">
      <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
        发布
      </el-button>
    </sticky>
    <el-form ref="postForm" v-loading="formLoading" :model="postForm" :rules="rules" class="container-form" label-width="80px">
      <el-form-item label="网站名称" prop="name">
        <el-input v-model="postForm.name" placeholder="请填写网站名称"></el-input>
      </el-form-item>
      <el-form-item label="联系地址" prop="address">
        <el-input v-model="postForm.address" placeholder="请填写联系地址"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="tel">
        <el-input v-model="postForm.tel" placeholder="请填写联系电话"></el-input>
      </el-form-item>
      <el-form-item label="联系邮箱" prop="email">
        <el-input v-model="postForm.email" placeholder="请填写联系邮箱"></el-input>
      </el-form-item>
      <div v-if="!formLoading" class="upload-group">
        <el-form-item label="网站图标" prop="logo">
          <editorImage :list="_normalizeList([postForm.logo])" @success="setLogo"></editorImage>
        </el-form-item>
      </div>
      <el-form-item label="图片高度" prop="imgHeight">
        <el-input v-model="postForm.imgHeight" type="number" placeholder="请填写图片高度" min="50" max="500"></el-input>
      </el-form-item>
      <el-form-item label="网站说明" prop="type">
        <draggable v-model="postForm.type">
          <div v-for="(item, index) in postForm.type" :key="item.id" class="article-item">
            <div class="article-item-img" @click="currentIndex = index; dialogVisible = true">
              <div
                class="background background-ratio"
                :style="{backgroundImage: `url(${qiniuDomain + item.icon})`}"
              >
              </div>
            </div>
            <div class="article-item-content">
              <el-input v-model="item.title" placeholder="请输入标题"></el-input>
              <el-input v-model="item.text" type="textarea" :rows="3" resize="none" placeholder="请填写描述信息...以换行符隔开"></el-input>
            </div>
            <div class="article-item-control">
              <i v-show="postForm.type.length > 1" class="el-icon-close" @click="delType(index)"></i>
              <i class="el-icon-rank handle"></i>
              <i class="el-icon-plus" @click="addType(index)"></i>
            </div>
          </div>
        </draggable>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="dialogVisible">
      <editorImage v-if="dialogVisible" @success="setArticleItemUrl"></editorImage>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="!cover" @click="saveCover">确 定</el-button>
      </span>  -->
    </el-dialog>
  </section>
</template>
<script type='text/ecmascript-6'>
import Sticky from '@/components/Sticky' // 粘性header组件
import editorImage from '@/components/EditorImage'
import draggable from '@/components/Draggable'

import { getSite, updateSite } from '@/api/site'
import { qiniuDomain } from 'config/qiniu'

const defaultForm = {
  name: '',
  logo: '',
  address: '',
  tel: '',
  email: '',
  type: [
    {
      id: 0,
      icon: '',
      title: '',
      text: ''
    }
  ],
  imgHeight: ''
}

export default {
  components: {
    Sticky,
    editorImage,
    draggable
  },
  data() {
    var validateImgHeight = (rule, value, callback) => {
      if (value < 50 || value > 500) {
        callback(new Error('图片高度范围为：50~500'))
      } else {
        callback()
      }
    }
    return {
      qiniuDomain,
      loading: false,
      formLoading: false,
      postForm: Object.assign({}, defaultForm),
      rules: {
        name: [{ required: true, message: '请输入网站名称', trigger: 'blur' }],
        logo: [{ required: true, message: '请上传网站logo', trigger: 'blur' }],
        address: [{ required: true, message: '请填写联系地址', trigger: 'blur' }],
        tel: [{ required: true, message: '请填写联系电话', trigger: 'blur' }],
        email: [{ required: true, message: '请填写联系邮箱', trigger: 'blur' }],
        imgHeight: [{ validator: validateImgHeight, trigger: 'blur' }]
      },
      currentIndex: 0,
      dialogVisible: false
    }
  },
  created() {
    this.getSite()
  },
  methods: {
    addType(index) {
      const idArr = this.postForm.type.map(item => item.id)
      const id = Math.max(...idArr) + 1

      this.postForm.type.splice(index + 1, 0, { id, icon: '', title: '', text: '' })
    },
    delType(index) {
      this.postForm.type.splice(index, 1)
    },
    setArticleItemUrl(key) {
      // const img = qiniuDomain + key
      this.$set(this.postForm.type[this.currentIndex], 'icon', key)
      this.dialogVisible = false
    },
    setLogo(key) {
      this.postForm.logo = key
    },
    submitForm() {
      this.$refs.postForm.validate((valid, result) => {
        if (valid) {
          console.log('postForm', this.postForm)
          this.formLoading = true
          updateSite(this.postForm).then(resp => {
            if (resp && !resp.success) throw new Error('err')
            this.formLoading = false
            this.$notify({
              title: '成功',
              message: `修改成功`,
              type: 'success',
              duration: 2000
            })
            this.getSite()
          })
        } else {
          const message = ((Object.values(result)[0] || [])[0] || {}).message || '您有未填写的字段'
          this.$message.error(message)
          return false
        }
      })
    },
    getSite() {
      this.formLoading = true
      getSite().then(resp => {
        console.log('getSite', resp)
        this.initPostForm(resp && resp.data)
      }).finally(() => { this.formLoading = false })
    },
    initPostForm(data) {
      if (!data) return

      Object.keys(this.postForm).forEach(key => {
        const hasKey = data.hasOwnProperty(key)
        if (!hasKey) return
        if (key === 'type' && (!data[key] || !data[key].length)) return

        this.$set(this.postForm, key, data[key])
      })
    },
    _normalizeList(arr) {
      if (!arr) return []

      return arr.map(item => ({
        name: item,
        url: qiniuDomain + item
      }))
    }
  }
}
</script>

<style lang='scss' scoped>
.article-item{
  padding: 10px 0 10px 10px;
  display: flex;
  background-color: #eee;
  &-img{
    position: relative;
    margin-right: 20px;
    flex: 0 0 150px;
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
    .background{
      height: 100%;
      padding: 0;
    }
  }
  &-content{
    flex: 1;
    &>*:first-child{
      margin-bottom: 10px;
    }
  }
  &-control{
    padding: 0 10px;
    display: flex;
    flex-direction: column;
    // justify-content: space-between;Z
    justify-content: center;
    font-size: 20px;
    color: #bbb;
    &>i{
      cursor: pointer;
      &:not(:last-child){
        margin-bottom: 7px;
      }
    }
    &>i:hover{
      color: blue;
    }
  }
}
</style>
