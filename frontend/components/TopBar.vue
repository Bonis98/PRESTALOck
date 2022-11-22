<template>
  <div class="h-10 w-screen items-center bg-blue-500 flex flex-row fixed px-4 text-white">
    <NuxtLink v-if="backRedirect" :to="{ path: backRedirect }">
      <div class="text-xl font-bold cursor-pointer">
        &lt;
      </div>
    </NuxtLink>
    <div class="flex-grow" />
    <div> {{ name }} </div>
  </div>
</template>

<script>
export default {
  props: {
    backRedirect: {
      type: String,
      default: () => ''
    }
  },

  data () {
    return {
      name: localStorage.getItem('name')
    }
  }
}
</script>
