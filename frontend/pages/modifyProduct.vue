<template>
  <div>
    <Loader v-show="loading" />
    <TopBar />
    <div class="text-center w-11/12 m-auto mb-6 justify-around gap-24 pt-12">
      <div class="mb-3 text-2xl">
        Modifica Annuncio
      </div>
      <div class="mt-3">
        Titolo prodotto
      </div>
      <div>
        <Input v-model="product.title" />
      </div>
      <div class="mt-3">
        Descrizione
      </div>
      <div>
        <TextArea v-model="product.description" />
      </div>
      <div class="mt-3">
        Numero dei giorni massimo di prestito (in giorni)
      </div>
      <div>
        <Input v-model="product.maxLoanDays" type="number" :placeholder="[[ product.maxLoanDays ]]" min="1" />
      </div>
      <div class="mt-3">
        Rendi disponibile il prodotto
      </div>
      <input id="available" v-model="availability" type="checkbox">
      <label for="available">{{ availability ? "Disponibile" : "Non disponibile" }}</label>
      <div class="mt-12">
        <Button text="Modifica" @click="modify()" />
      </div>
    </div>
  </div>
</template>
<script>

export default {
  data () {
    return {
      loading: false,
      product: '',
      availability: false
    }
  },
  watch: {
    maxLoanDays (newValue) {
      if (isNaN(newValue) && parseInt(newValue) <= 0) {
        this.maxLoanDays = 1
      }
    }
  },
  mounted () {
    this.getProduct()
  },
  methods: {
    // get the single of product from the backend API
    async getProduct () {
      this.loading = true
      const idProduct = this.$route.query.idProduct
      const result = await this.$callApi('/api/product/' + idProduct, 'GET')
      if (result.data) {
        this.product = result.data.product
      }
      this.loading = false
    },
    async modify () {
      this.loading = true
      if (JSON.stringify(this.product) === '{}') {
        alert('errore')
        return
      }
      // make the request
      const idProduct = this.$route.query.idProduct
      const result = await this.$callApi('/api/product/' + idProduct, 'PUT', {
        title: this.product.title,
        description: this.product.description,
        maxLoanDays: this.product.maxLoanDays,
        availability: this.availability
      })
      if (!result.error) {
        console.log(result.data)
        this.$router.replace({ path: '/productDetails', query: { idProduct } })
        // this.$router.push({ path: '/productDetails/', query: { idProduct: idProduct } })
        this.loading = false
      } else {
        // optional: do something if there's an error
        console.log(result.errorStatus)
      }
    }
  }
}
</script>
