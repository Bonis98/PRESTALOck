<template>
  <div>
    <Loader v-show="loading" />
    <TopBar />
    <div class="flex flex-wrap w-11/12 m-auto mb-6 justify-around gap-24 pt-12 pb-24">
      <ProductCard v-for="product in products" :key="product.id" :passed-product="product" />
      <div v-if="!loading && products.length == 0" class="text-2xl mt-2 text-center">
        Non hai nessun prodotto 😑️
      </div>
    </div>

    <!-- "Create new product" button -->
    <Button class="fixed right-4 bottom-6" text="Crea inserzione" icon="plus" @click="goToCreateProduct()" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      products: [],
      loading: true
    }
  },

  mounted () {
    this.getAllProducts()
  },

  methods: {
    // get the array of products from the backend API
    async getAllProducts () {
      const result = await this.$callApi('/api/user/' + localStorage.getItem('userId') + '/products', 'GET')
      if (result.data) {
        this.products = result.data.products
      }

      this.loading = false
    },

    goToCreateProduct () {
      this.$router.push({ path: '/createProduct' })
    }
  }
}
</script>

  <style>
  img {
    aspect-ratio: 1;
  }
  </style>
