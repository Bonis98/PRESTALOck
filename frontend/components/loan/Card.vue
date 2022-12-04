<template>
  <div class="w-96 border border-solid border-gray-200 rounded-md shadow flex-shrink-0 flex flex-col items-center" style="height: 20rem; max-width: 95vw;">
    <!-- image div -->
    <div class="h-3/4 overflow-hidden flex items-center">
      <img class="w-full" :src="imageUrl">
    </div>

    <!-- Info -->
    <div v-if="passedLoan.alreadyStarted" class="text-left w-11/12 flex-grow break-words font-light text-sm">
      Prodotto in prestito dal {{ $formatDate(passedLoan.loanStartDate) }} (tempo rimanente: {{ formattedLoanDays }})
    </div>

    <!-- Title and owner name -->
    <div class="text-left w-11/12 flex justify-between">
      <div class="font-bold flex-grow truncate whitespace-nowrap w-2/4">
        {{ passedLoan.product.title }}
      </div>
    </div>
    <div class="text-left w-11/12 flex justify-between">
      <div class="flex-grow text-right truncate whitespace-nowrap w-2/4">
        <span v-if="myUserId != passedLoan.owner.id">
          Di
          <NuxtLink :to="{ path: '/user', query: { userId: passedLoan.owner.id }}" class="underline text-blue-500">
            {{ passedLoan.owner.name }} {{ passedLoan.owner.surname }}
          </NuxtLink>
        </span>
        <span v-if="myUserId != passedLoan.borrower.id">
          Prestato a
          <NuxtLink :to="{ path: '/user', query: { userId: passedLoan.borrower.id }}" class="underline text-blue-500">
            {{ passedLoan.borrower.name }} {{ passedLoan.borrower.surname }}
          </NuxtLink>
        </span>
      </div>
    </div>

    <!-- Locker -->
    <div v-if="passedLoan.locker" class="text-left w-11/12 flex-grow break-words">
      <div>
        Locker {{ passedLoan.locker?.name }} ({{ passedLoan.locker?.address }}, {{ passedLoan.locker?.province }})
      </div>
      <div>
        Slot del locker: {{ passedLoan.lockerSlot }}
      </div>
      <div v-if="passedLoan.returnSlotBooked">
        Slot del locker di restituzione: {{ passedLoan.returnLockerSlot }}
      </div>
    </div>

    <div v-if="!passedLoan.terminationDate && button != ''" class="text-right w-11/12 mt-2 mb-2">
      <Button
        :text="button == 'requestReturnLocker' ? 'Prenota locker' : 'Conferma deposito'"
        @click="markDeposit()"
      />
    </div>

    <div class="text-right w-11/12 font-light text-sm">
      Richiesta di prestito effettuata il {{ formattedDate }}
    </div>
    <div v-if="passedLoan.loanStartDate" class="text-right w-11/12 font-light text-sm">
      Prestito avviato il {{ $formatDate(passedLoan.loanStartDate) }}
    </div>
    <div v-if="passedLoan.terminationDate" class="text-right w-11/12 font-light text-sm">
      Prestito terminato il {{ $formatDate(passedLoan.requestDate) }}
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

  data () {
    return {
      myUserId: localStorage.getItem('userId')
    }
  },

  computed: {
    imageUrl () {
      return `/api/product/${this.passedLoan.product.id}/image`
    },

    formattedDate () {
      return this.passedLoan ? this.$formatDate(this.passedLoan.requestDate) : ''
    },

    formattedLoanDays () {
      if (!this.passedLoan) {
        return ''
      }

      return this.passedLoan.remainingDays + (this.passedLoan.remainingDays > 1 ? ' giorni' : ' giorno')
    }
  },

  methods: {
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
        alert('Operazione effettuata correttamente. Controlla la tua casella di posta elettronica per ulteriori informazioni')
        this.$router.go(0)
      } else if (result.errorStatus == 409) {
        alert('Impossibile prenotare uno slot per la restituzione del prodotto. Riprovare')
      }
      this.$emit('endLoading')
    }
  }
}
</script>
