<template>
  <div class="test">
    test
  </div>
</template>

<script>
import { fetchTest } from '@/api/article'

export default {
  components: {

  },
  data() {
    return {

    }
  },
  created() {
    fetchTest().then(resp => {
      console.log('resp', resp)
    })
  },
  methods: {

  }
}
</script>

<style lang='sass' scoped>
</style>
