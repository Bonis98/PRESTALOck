<template>
  <div>
    <Loader v-show="loading" />
    <TopBar back-redirect="/productDetails" back-redirect-replace :back-redirect-query="{ idProduct: $route.query.idProduct }" />
    <div class="text-center w-11/12 m-auto mb-6 justify-around gap-24 pt-12">
      <div class="text-center mb-3 text-2xl">
        Upload la foto del prodotto: {{ product.title }}
      </div>
      <div class="mt-3">
        Carica la foto
      </div>
      <div class="m-3">
        <div>
          <form id="form" enctype="multipart/form-data">
            <div class="input-group">
              <Input id="file" type="file" accept="image/png, image/jpeg" @change="selectedImage" />
            </div>
          </form>
        </div>
        <!-- Image -->
        <div class="mt-3 mb-3">
          <img v-show="image" class="max-w-full m-auto" :src="imagePath">
        </div>
        <Button v-show="image" text="Salva" @click="upload()" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      loading: true,
      image: null,
      product: ''
    }
  },

  computed: {
    imagePath () {
      return this.image ? URL.createObjectURL(this.image) : ''
    }
  },

  mounted () {
    this.getProduct()
  },

  methods: {
    async getProduct () {
      const idProduct = this.$route.query.idProduct
      const result = await this.$callApi('/api/product/' + idProduct, 'GET')
      if (result.data) {
        this.product = result.data.product
      }

      this.loading = false
    },

    selectedImage (event) {
      if (event?.target?.files[0]) {
        this.image = event.target.files[0]
      }
    },

    async upload () {
      this.loading = true
      const image = document.getElementById('file').files[0]
      const formData = new FormData()
      formData.append('image', image)

      const idProduct = this.$route.query.idProduct
      const result = await this.$uploadFile('/api/product/' + idProduct + '/updateImage', formData)
      if (!result.error) {
        this.$router.replace({ path: '/productDetails', query: { idProduct } })
      }
      this.loading = false
    }
  }
}
</script>
