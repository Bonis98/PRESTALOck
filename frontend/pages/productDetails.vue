<template>
  <div>
    <TopBar back-redirect="/" />
    <div class="max-w-screen-md m-auto p-4 pt-12">
      <!-- Title -->
      <div class="text-center mb-3 text-2xl">{{ product.title }} </div>
      <!-- Image -->
      <div class="mb-3">
        <img class="max-w-full m-auto" :src="product.imageUrl">
      </div>
      <div class="text-left flex justify-between mb-3">
        <!-- Owner -->
        <div class="truncate whitespace-nowrap w-2/4"> {{ product.owner }} </div>
        <!-- Date -->
        <div class="text-right truncate whitespace-nowrap w-2/4"> {{ product.insertionDate }} </div>
      </div>
      <!-- Description -->
      <div class="mb-12"> {{ product.description }} </div>
      <div class="flex flex-wrap items-center justify-end gap-4 mb-3">
        <!-- Lockers list -->
        <div>
          <select name="cars" id="cars" class="border-2 border-blue-400 border-solid rounded px-2 py-1">
            <option v-for="locker in product.lockersList" :key="locker.id" :value="locker.id"> {{ locker.name }} ({{ locker.address }}) </option>
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
      product: {}
    }
  },

  methods: {
    // get the single of product from the backend API
    async getProduct () {
      // finta chiamata alle api
      this.product = {
        id: 1,
        title: 'oggetto di prova',
        owner: 'Mario Rossi',
        description: 'descrizione oggetto di prova',
        maxLoanDays: 10,
        insertionDate: '10/11/2022',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg/1200px-Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg',
        lockersList: [
          {
            id: 1,
            name: 'locker 1',
            province: 'Milano',
            address: 'Piazza Duomo, Milano'
          },
          {
            id: 2,
            name: 'locker 2',
            province: 'Milano',
            address: 'Piazza Cadorna, Milano'
          },
          {
            id: 3,
            name: 'locker 3',
            province: 'Milano',
            address: 'Mensa del Poli, Milano'
          }
        ]
      }
    }/*
    async getProduct () {
      try {
        const response = await fetch('/api/products', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          if (response.status == 400) {
            const data = await response.json()
            throw data.errortext
          } else {
            throw `Si è verificato un errore. (${response.status})`
          }
        }

        const data = await response.json()
        localStorage.setItem('token', data.token)
        localStorage.setItem('name', data.name + ' ' + data.surname)
        this.$router.push({ path: '/' })
      } catch (ex) {
        console.error(ex)
        alert(ex)
        this.loading = false
        return
      }
    }*/
  },

  mounted () {
    this.getProduct()
  }
}
</script>
