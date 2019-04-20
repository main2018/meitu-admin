<template>
  <article-detail :is-edit="false" />
</template>

<script type='text/ecmascript-6'>
import ArticleDetail from './components/ArticleDetail'

export default {
  name: 'ArticleCreate',
  components: {
    ArticleDetail
  }
}
</script>

<style lang='sass' scoped>
</style>
