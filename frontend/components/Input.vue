<template>
  <input class="w-72 border border-blue-400 rounded-full px-5 py-2"
    :value="value"
    @input="$emit('input', $event.target.value)"
    :type="type ? type : 'text'" />
</template>

<script>
export default {
  props: {
    value: String,
    type: String
  }
}
</script>
