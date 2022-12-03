<template>
  <div class="w-96 border border-solid border-gray-200 rounded-md shadow flex-shrink-0 flex flex-col items-center cursor-pointer" style="height: 20rem; max-width: 95vw;" @click="goToProductDetails">
    <!-- image div -->
    <div class="h-3/4 overflow-hidden">
      <img class="w-full" :src="imageUrl">
    </div>

    <!-- Info -->
    <div v-if="passedLoan.alreadyStarted" class="text-left w-11/12 flex-grow break-words">
      Prodotto in prestito dal {{ $formatDate(passedLoan.loanStartDate) }} (tempo rimanente: {{ passedLoan.remainingDays }} giorni
    </div>

    <!-- Title and owner name -->
    <div class="text-left w-11/12 flex justify-between">
      <div class="font-bold flex-grow truncate whitespace-nowrap w-2/4">
        {{ passedLoan.product.title }}
      </div>
    </div>
    <div class="text-left w-11/12 flex justify-between">
      <div class="flex-grow text-right truncate whitespace-nowrap w-2/4">
        {{ passedLoan.owner.name }} {{ passedLoan.owner.surname }}
      </div>
    </div>

    <!-- Locker -->
    <div class="text-left w-11/12 flex-grow break-words">
      Slot del locker: {{ passedLoan.lockerSlot }}
    </div>

    <div v-if="button != ''" class="text-right w-11/12 mt-2 mb-2">
      <Button
        :text="button == 'requestReturnLocker' ? 'Prenota locker' : 'Conferma deposito'"
        @click="markDeposit()"
      />
    </div>

    <div class="text-right w-11/12 font-light text-sm">
      Richiesta di prestito effettuata il {{ formattedDate }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    passedLoan: {
      type: Object,
      default: () => ({})
    },

    button: {
      type: String,
      default: () => ''
    }
  },

  computed: {
    imageUrl () {
      return `/api/product/${this.passedLoan.product.id}/image`
    },

    formattedDate () {
      return this.passedLoan ? this.$formatDate(this.passedLoan.requestDate) : ''
    }
  },

  methods: {
    goToProductDetails () {
      this.$router.push({ path: '/productDetails', query: { idProduct: this.passedLoan.product.id } })
    },

    async markDeposit () {
      let url = null
      switch (this.button) {
        case 'startLoan':
          url = '/api/loan/start/' + this.passedLoan.product.id
          break
        case 'endLoan':
          url = '/api/loan/close/' + this.passedLoan.product.id
          break
        case 'requestReturnLocker':
          url = '/api/book/return/' + this.passedLoan.product.id
          break
        default:
          return
      }

      this.$emit('startLoading')
      const result = await this.$callApi(url, 'GET')
      if (!result.error) {
        this.$router.go(0)
      } else if (result.errorStatus == 409) {
        alert('Impossibile prenotare uno slot per la restituzione del prodotto. Riprovare')
      }
      this.$emit('endLoading')
    }
  }
}
</script>
