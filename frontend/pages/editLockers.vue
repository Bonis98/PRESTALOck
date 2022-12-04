<template>
  <div>
    <Loader v-show="loading" />
    <TopBar :go-back="$nuxt.context.from?.name != 'signup'" />
    <div class="text-center w-11/12 m-auto mb-6 justify-around gap-24 pt-12">
      <div class="text-center mb-3 text-2xl">
        Seleziona i locker vicini a te (nella tua provincia):
      </div>

      <div>
        <div v-for="locker in availableLockers" :key="locker.id">
          <input :id="`locker-${locker.id}`" v-model="locker.selected" type="checkbox">
          <label :for="`locker-${locker.id}`"> {{ locker.name }} ({{ locker.address }}, {{ locker.province }}) </label>
        </div>
      </div>

      <div class="mt-4">
        <Button text="Annulla" hollow @click="cancel()" />
        <Button v-show="selectedLockers.length > 0" text="Salva" @click="save()" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      availableLockers: [],
      loading: true
    }
  },

  computed: {
    selectedLockers () {
      const selectedLockers = []
      for (const locker of this.availableLockers) {
        if (locker.selected) {
          selectedLockers.push(locker.id)
        }
      }
      return selectedLockers
    }
  },

  mounted () {
    this.getAllLockers()
  },

  methods: {
    async getAllLockers () {
      // Get ALL the lockers
      let result = await this.$callApi('/api/lockerList', 'GET')
      let allLockers = []
      if (result.data) {
        allLockers = result.data.lockerList
      }

      // Get the user's lockers
      result = await this.$callApi('/api/user/' + localStorage.getItem('userId'), 'GET')
      let userLockers = []
      if (result.data) {
        userLockers = result.data.user.lockerList
      }

      // For all lockers: set the `selected` status if the locker is also present in the user's list
      for (const userLocker of userLockers) {
        const locker = allLockers.find(element => element.id == userLocker.id)
        locker.selected = true
      }

      this.availableLockers = allLockers
      this.loading = false
    },

    async save () {
      this.loading = true

      const result = await this.$callApi('/api/saveUserLockers', 'POST', {
        lockers: this.selectedLockers
      })
      if (!result.error) {
        this.cancel()
      } else if (result.errorStatus == 400) {
        alert('Selezionare almeno un locker')
      }
      this.loading = false
    },

    cancel () {
      if (this.$nuxt.context.from?.name == 'signup') {
        this.$router.push('/')
      } else {
        this.$router.go(-1)
      }
    }
  }
}
</script>
