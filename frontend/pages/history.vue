<template>
  <div>
    <Loader v-show="loading" />
    <TopBar go-back />
    <div class="text-center w-11/12 m-auto mb-6 justify-around gap-24 pt-12 pb-24">
      <div v-if="!loading && myLoans.length == 0 && othersLoans.length" class="text-2xl mt-2 text-center">
        Non hai prestiti nello storico 👀️
      </div>

      <div v-else-if="!loading">
        <div v-if="myLoans.length > 0">
          <span class="text-3xl"> Prestiti effettuati </span>
          <div class="flex flex-wrap w-11/12 m-auto mb-6 justify-around gap-24">
            <LoanCard
              v-for="loan in myLoans"
              :key="loan.id"
              :passed-loan="loan"
              button="startLoan"
              @startLoading="loading = true"
              @endLoading="loading = false"
            />
          </div>
        </div>

        <div v-if="othersLoans.length > 0">
          <span class="text-3xl"> Prestiti richiesti </span>
          <div class="flex flex-wrap w-11/12 m-auto mb-6 justify-around gap-24">
            <LoanCard
              v-for="loan in othersLoans"
              :key="loan.id"
              :passed-loan="loan"
              @startLoading="loading = true"
              @endLoading="loading = false"
            />
          </div>
        </div>
      </div>

      <!-- "Create new product" button -->
      <Button class="fixed right-4 bottom-6" text="Crea inserzione" icon="plus" @click="goToCreateProduct()" />
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      myLoans: [],
      othersLoans: [],
      loading: true
    }
  },

  created () {
    this.getAllLoans()
  },

  methods: {
    // get the array of loans from the backend API
    async getAllLoans () {
      const result = await this.$callApi('/api/loans/ended', 'GET')
      const result2 = await this.$callApi('/api/loans/requested', 'GET')
      if (result.data && result2.data) {
        this.myLoans = result.data.loans
        this.othersLoans = result2.data.loans
      }

      this.loading = false
    },

    goToCreateProduct () {
      this.$router.push({ path: '/createProduct' })
    }
  }
}
</script>
