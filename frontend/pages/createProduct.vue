<template>
  <div>
    <Loader v-show="loading" />
    <TopBar />
    <div class="text-center w-11/12 m-auto mb-6 justify-around gap-24 pt-12">
      <div class="mb-3 text-2xl">
        Creazione Annuncio
      </div>
      <div class="mt-3">
        Titolo prodotto
      </div>
      <div>
        <Input v-model="title" />
      </div>
      <div class="mt-3">
        Descrizione
      </div>
      <div>
        <TextArea v-model="description" />
      </div>
      <div class="mt-3">
        Numero dei giorni massimo di prestito (in giorni)
      </div>
      <div>
        <Input v-model="maxLoanDays" type="number" min="1" />
      </div>
      <div class="mt-3">
        Seleziona immagine
      </div>
      <div>
        <Input v-model="image" type="file" />
      </div>
      <div class="mt-12">
        <Button text="Crea" @click="create()" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      title: '',
      description: '',
      maxLoanDays: '1',
      image: ''
    }
  },

  watch: {
    maxLoanDays (newValue) {
      if (isNaN(newValue) && parseInt(newValue) <= 0) {
        this.maxLoanDays = 1
      }
    }
  },

  methods: {
    async create () {
      this.loading = true

      if (this.image.split('.').pop() == 'jpg') {
        if (this.title == '' || this.description == '' || this.maxLoanDays <= 0 || this.image == '') {
          alert('Inserire correttamente le informazioni')
          this.loading = false
          return
        }
      } else {
        alert('Formato immagine non supportato')
        this.loading = false
        return
      }

      // make the request
      await new Promise(resolve => setTimeout(resolve, 1000))
      const respond = true
      if (respond) {
        this.loading = false
        // send imagee
        alert('Prodotto Creato')
      }
    }
  }
}
</script>
