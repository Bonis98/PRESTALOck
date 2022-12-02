<template>
  <div>
    <Loader v-show="loading" />
    <TopBar go-back />
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
      loading: true,
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

  async mounted () {
    // Check if the user has at least 1 locker selected in its province
    const result = await this.$callApi('/api/user/' + localStorage.getItem('userId'), 'GET')
    if (!result.data || result.data.user.lockerList.length == 0) {
      alert('Non hai ancora selezionato i locker vicini a te. Per farlo, vai nel tuo profilo premendo l\'icona in alto a destra')
      this.$router.replace('/')
    }

    this.loading = false
  },

  methods: {
    async create () {
      if (this.loading) { return }
      this.loading = true

      // make the request
      const result = await this.$callApi('/api/product', 'POST', {
        title: this.title,
        description: this.description,
        maxLoanDays: parseInt(this.maxLoanDays)
      })
      if (result.data) {
        this.$router.push({ path: '/uploadImage', query: { idProduct: result.data.id } })
      } else {
        this.loading = false
      }
    }
  }
}
</script>
