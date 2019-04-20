<template>
  <div class="upload-container">
    {{ text }}
    <input type="file" accept="video/*" @change="update">
  </div>
</template>

<script type='text/ecmascript-6'>
export default {
  props: {
    text: {
      type: String,
      default: '上传视频'
    }
  },
  data() {
    return {
    }
  },
  methods: {
    update() {
      const file = event.target.files[0]
      console.log('file', file)
    }
  }
}
</script>

<style lang='sass' scoped>
.upload-container
  position: relative
  height: 100%
  cursor: pointer
  input
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    opacity: 0
    width: 100%
</style>
