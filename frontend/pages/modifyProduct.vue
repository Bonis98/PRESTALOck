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
        <Input v-model="product.title"/>
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
        <Input v-model="product.maxLoanDays" type="number" :placeholder= "[[ product.maxLoanDays ]]" min="1"  />
      </div>
      <div class="mt-3">
        Rendi disponibile il prodotto
      </div>
      <input type="checkbox" id="available" v-model="available">
      <label for="available">{{ available ? "Disponibile" : "Non disponibile" }}</label>
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
      available: ''
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
    getProduct () {
      // finta chiamata alle api
      this.product = {
        id: 1,
        title: 'oggetto di prova',
        owner: 'Mario Rossi',
        description: 'descrizione oggetto di prova',
        maxLoanDays: 10,
        insertionDate: '10/11/2022',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg/1200px-Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg',
        locker:
        {
          id: 1,
          name: 'locker 1',
          province: 'Milano',
          address: 'Piazza Duomo, Milano'
        }
      }
    },
    async modify () {
      this.loading = true
      if (JSON.stringify(this.product) === '{}') {
        alert('errore')
        return
      }

      // make the request
      await new Promise(resolve => setTimeout(resolve, 1000))
      const respond = true
      if (respond) {
        this.loading = false
        // send imagee
        alert('Prodotto Modificato')
      }
    }
  }
}
</script>
