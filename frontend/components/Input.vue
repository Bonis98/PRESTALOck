<template>
  <input
    class="w-72 border border-blue-400 rounded-full px-5 py-2"
    :value="value"
    :type="type ? type : 'text'"
    @input="$emit('input', $event.target.value)"
    @change="$emit('change', $event)"
  >
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: () => ''
    },
    type: {
      type: String,
      default: () => ''
    }
  }
}
</script>
