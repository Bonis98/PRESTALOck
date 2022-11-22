// eslint-disable-next-line vue/multi-word-component-names
<template>
  <NuxtLink :to="{ path: '/productDetails', query: { productId: passedProduct.id } }">
    <div class="border border-solid border-gray-200 rounded-md shadow w-96 h-64 flex-shrink-0 flex flex-col items-center cursor-pointer">
      <!-- image div -->
      <div class="h-2/4 overflow-hidden">
        <img class="w-full" src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg/1200px-Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg">
      </div>
      <!-- first row -->
      <div class="text-left w-11/12 flex justify-between">
        <div class="font-bold flex-grow truncate whitespace-nowrap w-2/4">
          {{ passedProduct.title }}
        </div>
        <div class="flex-grow text-right truncate whitespace-nowrap w-2/4">
          {{ passedProduct.owner }}
        </div>
      </div>
      <!-- description -->
      <div class="text-left w-11/12 flex-grow break-words">
        {{ passedProduct.description }}
      </div>
      <!-- last row -->
      <div class="text-right w-11/12 font-light text-sm">
        {{ passedProduct.insertionDate }}
      </div>
    </div>
  </NuxtLink>
</template>

<script>
export default {
  props: {
    passedProduct: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>
