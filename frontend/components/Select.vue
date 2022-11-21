<template>
  <select class="w-52 border border-blue-400 rounded-full px-5 py-2"
    :value="value"
    @input="$emit('input', $event.target.value)">
    <option selected value="" disabled> Seleziona </option>
    <option v-for="opt in options" :key="opt.val" :value="opt.val"> {{ opt.name }} </option>
  </select>
</template>

<script>
export default {
  props: {
    value: String,
    options: Array
  }
}
</script>
