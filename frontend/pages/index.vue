<template>
  <div>
    <TopBar />
    <div class="flex flex-wrap w-11/12 m-auto mb-6 justify-around gap-24 pt-12">
      <ProductCard v-for="product in products" :key="product.id" :passed-product="product" />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      products: []
    }
  },

  mounted () {
    this.getAllProducts()
  },

  methods: {
    // get the array of products from the backend API
    async getAllProducts () {
      const result = await this.$callApi('/api/products', 'GET')
      if (result.data) {
        this.products = result.data
      }
    }
  }
}
</script>

<style>
img {
  aspect-ratio: 1;
}
</style>
