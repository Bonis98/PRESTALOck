<template>
  <div class="h-10 w-screen items-center bg-blue-500 flex flex-row gap-3 fixed px-4 text-white">
    <NuxtLink v-if="backRedirect" class="h-2/4 cursor-pointer" :to="{ path: backRedirect }">
      <img class="h-full" src="/icons/back.png">
    </NuxtLink>
    <div class="flex-grow" />
    <div> {{ name }} </div>
    <div v-if="name && name.length > 0" class="h-2/4 cursor-pointer">
      <img class="h-full" src="/icons/logout.png" @click="logout()">
    </div>
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
  },

  methods: {
    logout () {
      if (confirm('Sei sicuro di voler uscire?')) {
        this.$router.push({ path: '/login' })
      }
    }
  }
}
</script>
