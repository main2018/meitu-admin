<template>
  <section class="container">
    <sticky :z-index="10" :class-name="'sub-navbar '+postForm.status">
      <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
        发布
      </el-button>
    </sticky>
    <el-form ref="postForm" v-loading="formLoading" :model="postForm" :rules="rules" class="container-form" label-width="80px">
      <el-form-item label="介绍文本" prop="introduce">
        <el-input v-model="postForm.introduce" placeholder="请填写介绍文本"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="tel">
        <el-input v-model="postForm.tel" placeholder="请填写联系电话"></el-input>
      </el-form-item>
      <el-form-item label="联系邮箱" prop="email">
        <el-input v-model="postForm.email" placeholder="请填写联系邮箱"></el-input>
      </el-form-item>
      <el-form-item label="联系地址" prop="address">
        <el-input v-model="postForm.address" placeholder="请填写联系地址"></el-input>
      </el-form-item>
      <div v-if="!formLoading" class="upload-group">
        <el-form-item label="介绍插图" prop="illustrate">
          <editorImage :list="_normalizeList([postForm.illustrate])" @success="setIllustrate"></editorImage>
        </el-form-item>
        <el-form-item label="轮播图片" prop="images">
          <editorImage :list="_normalizeList(postForm.images)" :limit="0" @success="setImagesUrl" @remove="removeImage"></editorImage>
        </el-form-item>
        <el-form-item label="地图插图" prop="map">
          <editorImage :list="_normalizeList([postForm.map])" @success="setMap"></editorImage>
        </el-form-item>
      </div>
    </el-form>
  </section>
</template>
<script type='text/ecmascript-6'>
import Sticky from '@/components/Sticky' // 粘性header组件
import editorImage from '@/components/EditorImage'

import { getAboutUs, updateAboutUs } from '@/api/about-us'
import { qiniuDomain } from 'config/qiniu'

const defaultForm = {
  introduce: '',
  illustrate: '',
  images: [],
  map: '',
  tel: '',
  email: '',
  address: ''
}

export default {
  components: {
    Sticky,
    editorImage
  },
  data() {
    return {
      loading: false,
      formLoading: false,
      postForm: Object.assign({}, defaultForm),
      rules: {
        introduce: [{ required: true, message: '请输入介绍文本', trigger: 'blur' }],
        illustrate: [{ required: true, message: '请上传介绍插图', trigger: 'blur' }],
        images: [{ required: true, message: '请上传轮播图', trigger: 'blur' }],
        map: [{ required: true, message: '请上传地图图片', trigger: 'blur' }],
        tel: [{ required: true, message: '请填写联系电话', trigger: 'blur' }],
        email: [{ required: true, message: '请填写联系邮箱', trigger: 'blur' }],
        address: [{ required: true, message: '请填写联系地址', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getAbout()
  },
  methods: {
    setMap(key) {
      this.postForm.map = key
    },
    setIllustrate(key) {
      this.postForm.illustrate = key
    },
    setImagesUrl(key) {
      this.postForm.images.push(key)
    },
    removeImage(key) {
      const index = this.postForm.images.findIndex(image => image === key)
      this.postForm.images.splice(index, 1)
    },
    submitForm() {
      this.$refs.postForm.validate((valid, result) => {
        if (valid) {
          console.log('postForm', this.postForm)
          this.formLoading = true
          updateAboutUs(this.postForm).then(resp => {
            if (resp && !resp.success) throw new Error('err')
            this.formLoading = false
            this.$notify({
              title: '成功',
              message: `修改成功`,
              type: 'success',
              duration: 2000
            })
            this.getAbout()
          })
        } else {
          const message = ((Object.values(result)[0] || [])[0] || {}).message || '您有未填写的字段'
          this.$message.error(message)
          return false
        }
      })
    },
    getAbout() {
      this.formLoading = true
      getAboutUs().then(resp => {
        console.log('getAboutUs', resp)
        this.initPostForm(resp && resp.data)
      }).finally(() => { this.formLoading = false })
    },
    initPostForm(data) {
      if (!data) return

      Object.keys(this.postForm).forEach(key => {
        const hasKey = data.hasOwnProperty(key)
        if (!hasKey) return

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

<style lang='sass' scoped>
</style>
