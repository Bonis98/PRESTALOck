<template>
  <div class="h-10 w-screen items-center bg-blue-500 flex flex-row gap-3 fixed px-4 text-white z-40">
    <NuxtLink
      v-if="backRedirect"
      class="h-2/4 cursor-pointer"
      :to="{ path: backRedirect, query: backRedirectQuery }"
      :replace="backRedirectReplace"
    >
      <img class="h-full" src="/icons/back.png">
    </NuxtLink>

    <div
      v-if="!backRedirect && goBack"
      class="h-2/4 cursor-pointer"
      @click="$router.go(-1)"
    >
      <img class="h-full" src="/icons/back.png">
    </div>

    <div class="flex-grow" />

    <NuxtLink
      v-if="name && name.length > 0"
      class="h-2/4 cursor-pointer"
      :to="{ path: '/user', query: {userId } }"
    >
      <div> {{ name }} </div>
    </NuxtLink>

    <NuxtLink
      v-if="name && name.length > 0"
      class="h-2/4 cursor-pointer"
      :to="{ path: '/user', query: {userId } }"
    >
      <img class="h-full" src="/icons/user.png">
    </NuxtLink>
  </div>
</template>

<script>
export default {
  props: {
    backRedirect: {
      type: String,
      default: () => ''
    },
    goBack: {
      type: Boolean,
      default: () => false
    },
    backRedirectReplace: {
      type: Boolean,
      default: () => false
    },
    backRedirectQuery: {
      type: Object,
      default: () => {}
    }
  },

  data () {
    return {
      name: localStorage.getItem('name'),
      userId: localStorage.getItem('userId')
    }
  }
}
</script>
