<template>
  <div>
    <Loader v-show="loading" />
    <TopBar go-back />
    <div class="text-center w-11/12 m-auto mb-6 justify-around gap-24 pt-12 pb-24">
      <div v-if="!loading && loans.length == 0" class="text-2xl mt-2 text-center">
        Non hai nessun prestito attivo 👀️
      </div>

      <div v-else-if="!loading">
        <div v-if="myProductsLoans.length > 0">
          <span class="text-3xl"> Prestiti effettuati </span>
          <div v-if="(myProductsWaitingLoans.length > 0)">
            <span class="text-xl mt-4 mb-4"> Prestiti non ancora avviati: </span>
            <div class="flex flex-wrap w-11/12 m-auto mb-6 justify-around gap-24">
              <LoanCard
                v-for="loan in myProductsWaitingLoans"
                :key="loan.id"
                :passed-loan="loan"
                :button="startLoan"
                @startLoading="loading = true"
                @endLoading="loading = false"
              />
            </div>
          </div>
          <div v-if="(myProductsActiveLoans.length > 0)">
            <span class="text-xl mt-4 mb-4"> Prestiti che devono essere restituiti: </span>
            <div class="flex flex-wrap w-11/12 m-auto mb-6 justify-around gap-24">
              <LoanCard
                v-for="loan in myProductsActiveLoans"
                :key="loan.id"
                :passed-loan="loan"
                @startLoading="loading = true"
                @endLoading="loading = false"
              />
            </div>
          </div>
        </div>

        <div v-if="othersProductsLoans.length > 0">
          <span class="text-3xl"> Prestiti richiesti </span>
          <div v-if="(othersProductsWaitingLoans.length > 0)">
            <span class="text-xl mt-4 mb-4"> Prestiti non ancora depositati: </span>
            <div class="flex flex-wrap w-11/12 m-auto mb-6 justify-around gap-24">
              <LoanCard
                v-for="loan in othersProductsWaitingLoans"
                :key="loan.id"
                :passed-loan="loan"
                @startLoading="loading = true"
                @endLoading="loading = false"
              />
            </div>
          </div>
          <div v-if="(othersProductsActiveLoans.length > 0)">
            <span class="text-xl mt-4 mb-4"> Prestiti che devono essere restituiti: </span>
            <div class="flex flex-wrap w-11/12 m-auto mb-6 justify-around gap-24">
              <LoanCard
                v-for="loan in othersProductsActiveLoans"
                :key="loan.id"
                :passed-loan="loan"
                :button="loan.returnSlotBooked ? 'endLoan' : 'requestReturnLocker'"
                @startLoading="loading = true"
                @endLoading="loading = false"
              />
            </div>
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
      loans: [],
      loading: false
    }
  },

  computed: {
    myProductsLoans () {
      const result = []
      for (const loan of this.loans) {
        if (loan.myProduct) {
          result.push(loan)
        }
      }
      return result
    },

    othersProductsLoans () {
      const result = []
      for (const loan of this.loans) {
        if (!loan.myProduct) {
          result.push(loan)
        }
      }
      return result
    },

    myProductsWaitingLoans () {
      const result = []
      for (const loan of this.loans) {
        if (loan.myProduct && !loan.alreadyStarted) {
          result.push(loan)
        }
      }
      return result
    },

    myProductsActiveLoans () {
      const result = []
      for (const loan of this.loans) {
        if (loan.myProduct && loan.alreadyStarted) {
          result.push(loan)
        }
      }
      return result
    },

    othersProductsWaitingLoans () {
      const result = []
      for (const loan of this.loans) {
        if (!loan.myProduct && !loan.alreadyStarted) {
          result.push(loan)
        }
      }
      return result
    },

    othersProductsActiveLoans () {
      const result = []
      for (const loan of this.loans) {
        if (!loan.myProduct && loan.alreadyStarted) {
          result.push(loan)
        }
      }
      return result
    }
  },

  created () {
    this.getAllLoans()
  },

  methods: {
    // get the array of loans from the backend API
    async getAllLoans () {
      const result = await this.$callApi('/api/loans', 'GET')
      if (result.data) {
        this.loans = result.data.loans
      }

      this.loading = false
    },

    goToCreateProduct () {
      this.$router.push({ path: '/createProduct' })
    }
  }
}
</script>

<style>
img {
    aspect-ratio: 1;
}
</style>
