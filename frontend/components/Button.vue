<template>
  <button
    :class="hollow ? hollowClasses : fullClasses"
    @click="$emit('click')"
  >
    <div class="flex justify-between items-center h-full gap-2">
      <img v-if="icon" class="h-full" :src="`/icons/${icon}.png`">
      <span class="hover:text-white" :class="{ 'text-white': !hollow }"> {{ text }} </span>
    </div>
  </button>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: () => ''
    },

    hollow: {
      type: Boolean,
      default: () => false
    },

    icon: {
      type: String,
      default: () => null
    }
  },

  data () {
    return {
      fullClasses: 'h-12 bg-blue-400 rounded-full px-7 py-3 hover:bg-blue-500',
      hollowClasses: 'h-12 bg-white border border-blue-400 rounded-full px-7 py-3 hover:bg-blue-500 hover:border-blue-500'
    }
  }
}
</script>
