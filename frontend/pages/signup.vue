<template>
  <div>
    <Loader v-show="loading" />
    <TopBar />
    <div class="text-center w-11/12 m-auto mb-6 justify-around gap-24 pt-12">
      <div class="mb-3 text-2xl"> Registrazione </div>
      <div class="mt-3"> Indirizzo email </div>
      <div>
        <Input v-model="email" />
      </div>
      <div class="mt-3"> Password </div>
      <div>
        <Input v-model="password" type="password" />
      </div>
      <div class="mt-3"> Conferma password </div>
      <div>
        <Input v-model="confirmPassword" type="password" />
      </div>
      <div class="mt-12"> Nome </div>
      <div>
        <Input v-model="name" />
      </div>
      <div class="mt-3"> Cognome </div>
      <div>
        <Input v-model="surname" />
      </div>
      <div class="mt-3"> Data di nascita </div>
      <div>
        <Input v-model="dateOfBirth" />
      </div>
      <div class="mt-3"> Provincia </div>
      <div>
        <Select v-model="province" :options="allProvinces" />
      </div>
      <div class="mt-3"> Genere </div>
      <div>
        <Select v-model="gender"
          :options="[{ val: '*', name: 'Altro' }, { val: 'M', name: 'Uomo' }, { val: 'F', name: 'Donna' }]" />
      </div>
      <div class="mt-12">
        <Button text="Registrati" />
      </div>
      <div class="mt-12">
        <Button text="Torna al login" @click="login()" />
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      loading: true,
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      surname: '',
      dateOfBirth: '',
      province: '',
      gender: '*',
      allProvinces: []
    }
  },

  watch: {
    loading (newValue) {
      for (let element of document.querySelectorAll('Input, Button, Select')) {
        element.disabled = newValue
      }
    }
  },

  methods: {
    async getProvinces () {
      // richiesta simulata
      await new Promise((resolve => setTimeout(resolve, 1000)))
      this.allProvinces = [
        { val: 'Milano', name: 'Milano' },
        { val: 'Cremona', name: 'Cremona' },
        { val: 'Bergamo', name: 'Bergamo' },
        { val: 'Brescia', name: 'Brescia' },
        { val: 'Venezia', name: 'Venezia' },
        { val: 'Modena', name: 'Modena' },
        { val: 'Bologna', name: 'Bologna' },
        { val: 'Arezzo', name: 'Arezzo' }
      ]
      this.loading = false
    },

    login () {
      this.$router.push({ path: '/login' })
    }
  },

  created () {
    localStorage.removeItem('token')
    localStorage.removeItem('name')
  },

  mounted () {
    this.getProvinces()
  }
}
</script>
