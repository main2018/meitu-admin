<template>
  <div>
    <el-upload
      class="upload-demo"
      action="http://up-z2.qiniu.com"
      :multiple="multiple"
      :file-list="fileList2"
      :list-type="isVideo ? 'text' : 'picture-card'"
      :data="uptoken"
      :limit="1"
      :before-upload="beforeUpload"
      :on-change="handleChange"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-exceed="onExceed"
      :accept="accept"
    >
      <el-button size="small" type="primary">{{ text || `上传${isVideo ? '视频' : '图片'}` }}</el-button>
      <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script type='text/ecmascript-6'>
// const qiniuDomain = 'http://img.tukeshare.com/'
import { getToken } from '@/api/qiniu'

export default {
  props: {
    isVideo: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: ''
    },
    list: {
      type: Array,
      default: () => []
    },
    multiple: {
      type: Boolean,
      default: false
    },
    accept: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      uptoken: {},
      fileList2: this.list
    }
  },
  methods: {
    beforeUpload(file) {
      const imageReg = /^image/
      const videoReg = /^video/
      const type = file.type
      if (this.isVideo && imageReg.test(type)) {
        this.$message.error('请上传视频')
        return false
      }
      if (!this.isVideo && videoReg.test(type)) {
        this.$message.error('请上传图片')
        return false
      }
      // const isJPG = file.type === 'image/jpeg';
      // const isLt2M = file.size / 1024 / 1024 < 2;

      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!');
      // }
      // if (!isLt2M) {
      //   this.$message.error('上传头像图片大小不能超过 2MB!');
      // }
      // return isJPG && isLt2M;
      this.$emit('before')
      return new Promise(async(resolve, reject) => {
        const resp = await getToken()
        if (resp.data) {
          this.uptoken.token = resp.data.token

          const spaceReg = /\s/g
          const key = Date.now() + this.makeRandom() + file.name.replace(spaceReg, '')

          console.log('key', key)
          this.uptoken.key = key
          resolve()
        } else {
          reject()
        }
      })
    },
    makeRandom(size = 3) {
      const num = ~~(Math.random() * 1000)
      const arr = []
      arr.length = size
      arr.fill(0)
      return Number((num + arr.join()).substring(0, size))
    },
    handleRemove(file, fileList) {
      // console.log(file, fileList);
      this.$emit('change', fileList)
    },
    handleSuccess(resp, file, fileList) {
      // console.log(resp, file, fileList)
      // const url = qiniuDomain + resp.data.key

      if (this.max === 1) {
        this.fileList2 = [file]
        this.$emit('change', [file])
        this.$emit('success', file)
        return
      }
      console.log('file', file)
      this.$emit('change', fileList)

      const key = (file.response && file.response.key) || file.name
      this.$emit('success', key)
    },
    handleError() {},
    handlePreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleChange(file, fileList) {
      // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
      // const start = -(this.max || 0)
      // this.fileList2 = fileList.slice(start)
    },
    onExceed() {
      this.$message.warning(`超出允许的最大张数，请移除后再传`)
    }
  }
}
</script>

<style lang='sass' scoped>
</style>
