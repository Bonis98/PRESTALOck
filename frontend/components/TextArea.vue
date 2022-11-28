<template>
  <textarea
    class="w-72 border border-blue-400 rounded-lg px-5 py-2"
    :value="value"
    style="resize: none"
    rows="5"
    @input="$emit('input', $event.target.value)"
  />
</template>
<script>
export default {
  props: {
    value: {
      type: String,
      default: () => ''
    }
  }
}
</script>
