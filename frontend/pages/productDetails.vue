<template>
  <div>
    <Loader v-show="loading" />
    <TopBar go-back />
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
          {{ product.user?.name }} {{ product.user?.surname }}
        </div>

        <!-- Date -->
        <div class="text-right truncate whitespace-nowrap w-2/4">
          {{ formattedDate }}
        </div>
      </div>

      <!-- Description -->
      <div class="mb-6">
        {{ product.description }}
      </div>
      <div class="mb-12">
        <span class="font-light"> Durata max del prestito: <span class="font-bold">{{ formattedLoanDays }} </span></span>
      </div>

      <!-- Buttons -->
      <div v-if="myProduct" class="flex flex-wrap items-center justify-end gap-4 mb-3">
        <Button text="Cambia immagine" hollow @click="goToUploadImage()" />
        <Button text="Modifica" @click="goToEdit()" />
      </div>
      <div v-else class="flex flex-wrap items-center justify-end gap-4 mb-3">
        <!-- Lockers list -->
        <div v-if="product.availability">
          <Select v-model="selectedLockerId" :options="formattedLockersList" />
          <Button text="Prenota" @click="book()" />
        </div>
        <div v-if="product && !product.availability">
          Non disponibile.
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
    },

    formattedLockersList () {
      const result = []
      if (!this.product.lockerList) {
        return result
      }
      for (let k = 0; k < this.product.lockerList.length; k++) {
        const locker = this.product.lockerList[k]
        result.push({
          val: locker.id,
          name: `${locker.name} (${locker.address}, ${locker.province})`
        })
      }

      return result
    },

    myProduct () {
      return localStorage.getItem('userId') == this.product.idOwner
    },

    formattedLoanDays () {
      if (!this.product) {
        return ''
      }

      return this.product.maxLoanDays + (this.product.maxLoanDays > 1 ? ' giorni' : ' giorno')
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

    async book () {
      if (this.loading) {
        return
      }
      if (!this.selectedLockerId) {
        alert('Selezionare il locker')
        return
      }
      this.loading = true
      const result = await this.$callApi('/api/book/', 'POST', {
        idProduct: this.product.id,
        lockerId: this.selectedLockerId
      })
      if (!result.error) {
        alert('Prenotazione effettuata. Controlla la tua casella di posta elettronica per ulteriori informazioni')
        this.$router.go() // reloads the page
      }
      this.loading = false
    },

    goToUploadImage () {
      this.$router.push({ path: '/uploadImage', query: { idProduct: this.product.id } })
    },

    goToEdit () {
      this.$router.push({ path: '/editProduct', query: { idProduct: this.product.id } })
    }
  }
}

</script>
