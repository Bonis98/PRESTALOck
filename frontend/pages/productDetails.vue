<template>
  <div>
    <TopBar back-redirect="/" />
    <div class="max-w-screen-md m-auto p-4 pt-12">
      <!-- Title -->
      <div class="text-center mb-3 text-2xl">
        {{ product.title }}
      </div>
      <!-- Image -->
      <div class="mb-3">
        <img class="max-w-full m-auto" :src="imageUrl">
      </div>
      <div class="text-left flex justify-between mb-3">
        <!-- Owner -->
        <div class="truncate whitespace-nowrap w-2/4">
          {{ product.owner }}
        </div>
        <!-- Date -->
        <div class="text-right truncate whitespace-nowrap w-2/4">
          {{ formattedDate }}
        </div>
      </div>
      <!-- Description -->
      <div class="mb-12">
        {{ product.description }}
      </div>
      <div class="flex flex-wrap items-center justify-end gap-4 mb-3">
        <!-- Lockers list -->
        <div>
          <select id="cars" v-model="selectedLockerId" name="cars" class="border-2 border-blue-400 border-solid rounded px-2 py-1">
            <option v-for="locker in product.lockerList" :key="locker.id" :value="locker.id">
              {{ locker.name }} ({{ locker.address }}, {{ locker.province }})
            </option>
          </select>
        </div>
        <!-- Button -->
        <div>
          <Button text="Prenota" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      product: {},
      loading: false,
      selectedLockerId: null
    }
  },

  computed: {
    imageUrl () {
      return this.product ? `/api/product/${this.product.id}/image` : '/empty.jpg'
    },

    formattedDate () {
      return this.product ? this.$formatDate(this.product.insertionDate) : ''
    }
  },

  mounted () {
    this.getProduct()
  },

  methods: {
    // get the single of product from the backend API
    async getProduct () {
      const productId = this.$route.query.productId
      const result = await this.$callApi('/api/product/' + productId, 'GET')
      if (result.data) {
        this.product = result.data
      }
    },


      }
  }
}
</script>
