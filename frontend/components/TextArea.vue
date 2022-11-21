<template>
    <textarea class="w-72 border border-blue-400 rounded-full px-5 py-2"
    :value="value"
    @input="$emit('input', $event.target.value)"
    style="resize: none">
        
    </textarea>

</template>
<script>
export default {
  props: {
    value: String
  }
}
</script>