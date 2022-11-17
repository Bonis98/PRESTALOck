<template>
  <div class="h-10 w-screen items-center bg-blue-500 flex flex-row fixed px-4 text-white">
    <NuxtLink :to="{ path: backRedirect }" v-if="backRedirect">
      <div class="text-xl font-bold cursor-pointer"> &lt; </div>
    </NuxtLink>
    <div class="flex-grow"></div>
    <div>nome utente</div>
  </div>
</template>

<script>
export default {
  props: {
    'backRedirect': String
  }
}
</script>  