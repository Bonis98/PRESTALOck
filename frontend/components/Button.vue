<template>
  <button class="bg-blue-400 rounded-full px-7 py-3 hover:bg-blue-500"
    @click="$emit('click')"> {{ text }} </button>
</template>

<script>
export default {
  props: {
    text: String
  }
}
</script>
