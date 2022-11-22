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
      // this.products = await (await fetch('api/products', {
      //   header: {'Auth-Token': '123'}
      // })).json()

      // finta chiamata alle api

      this.products = [
        {
          id: 1,
          title: 'oggetto di prova',
          owner: 'Mario Rossi',
          description: 'descrizione oggetto di prova',
          maxLoanDays: 10,
          imageUrl: '/logo.png',
          insertionDate: '10/11/2022'
        },
        {
          id: 2,
          title: 'oggetto di prova',
          owner: 'Mario Rossi',
          description: 'descrizione oggetto di prova',
          maxLoanDays: 10,
          imageUrl: '/logo.png',
          insertionDate: '10/11/2022'
        },
        {
          id: 3,
          title: 'oggetto di prova',
          owner: 'Mario Rossi',
          description: 'descrizione oggetto di prova',
          maxLoanDays: 10,
          imageUrl: '/logo.png',
          insertionDate: '10/11/2022'
        },
        {
          id: 4,
          title: 'oggetto di prova',
          owner: 'Mario Rossi',
          description: 'descrizione oggetto di prova',
          maxLoanDays: 10,
          imageUrl: '/logo.png',
          insertionDate: '10/11/2022'
        },
        {
          id: 5,
          title: 'oggetto di prova',
          owner: 'Mario Rossi',
          description: 'descrizione oggetto di prova',
          maxLoanDays: 10,
          imageUrl: '/logo.png',
          insertionDate: '10/11/2022'
        },
        {
          id: 6,
          title: 'oggetto di prova',
          owner: 'Mario Rossi',
          description: 'descrizione oggetto di prova',
          maxLoanDays: 10,
          imageUrl: '/logo.png',
          insertionDate: '10/11/2022'
        }
      ]
    }
  }
}
</script>

<style>
img {
  aspect-ratio: 1;
}
</style>
