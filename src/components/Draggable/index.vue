<template>
  <draggable :value="value" tag="div" v-bind="dragOptions" handle=".handle" @input="handleInput">
    <transition-group type="transition" name="flip-list">
      <slot></slot>
    </transition-group>
  </draggable>
</template>

<script type='text/ecmascript-6'>
import draggable from 'vuedraggable'

export default {
  components: {
    draggable
  },
  props: {
    group: {
      type: String,
      default: function() {
        return 'group-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
      }
    },
    value: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
      arr: []
    }
  },
  computed: {
    dragOptions() {
      return {
        animation: 0,
        group: this.group,
        disabled: false,
        ghostClass: 'ghost'
      }
    }
  },
  methods: {
    handleInput(val) {
      this.arr = val
      this.$emit('input', val)
      console.log('handleInput', val)
    }
  }
}
</script>

<style lang='sass'>
.flip-list-move
  transition: transform 0.5s
.no-move
  transition: transform 0s
.ghost
  opacity: 0.5
  background: red
</style>
