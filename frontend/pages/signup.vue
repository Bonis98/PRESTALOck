<template>
  <div>
    <Loader v-show="loading" />
    <TopBar />
    <div class="text-center w-11/12 m-auto mb-6 justify-around gap-24 pt-12">
      <div class="mb-3 text-2xl">
        Registrazione
      </div>
      <div class="mt-3">
        Indirizzo email
      </div>
      <div>
        <Input v-if="!fromOAuth" v-model="email" type="email" />
        <span v-if="fromOAuth"> {{ email }} </span>
      </div>
      <div v-if="!fromOAuth" class="mt-3">
        Password
      </div>
      <div v-if="!fromOAuth">
        <Input v-model="password" type="password" />
      </div>
      <div v-if="!fromOAuth" class="mt-3">
        Conferma password
      </div>
      <div v-if="!fromOAuth">
        <Input v-model="confirmPassword" type="password" />
      </div>
      <div class="mt-12">
        Nome
      </div>
      <div>
        <Input v-model="name" />
      </div>
      <div class="mt-3">
        Cognome
      </div>
      <div>
        <Input v-model="surname" />
      </div>
      <div class="mt-3">
        Data di nascita
      </div>
      <div>
        <Input v-model="dateOfBirth" type="date" />
      </div>
      <div class="mt-3">
        Provincia
      </div>
      <div>
        <Select v-model="province" :options="allProvinces" />
      </div>
      <div class="mt-3">
        Genere
      </div>
      <div>
        <Select
          v-model="gender"
          :options="[{ val: '*', name: 'Altro' }, { val: 'M', name: 'Uomo' }, { val: 'F', name: 'Donna' }]"
        />
      </div>
      <div class="mt-12">
        <Button text="Registrati" @click="signup()" />
      </div>
      <div class="mt-12">
        <Button text="Torna al login" @click="signin()" />
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
      allProvinces: [],
      fromOAuth: false
    }
  },

  watch: {
    loading (newValue) {
      for (const element of document.querySelectorAll('Input, Button, Select')) {
        element.disabled = newValue
      }
    }
  },

  created () {
    localStorage.removeItem('token')
    localStorage.removeItem('name')
    localStorage.removeItem('userId')
  },

  mounted () {
    const data = new URLSearchParams(window.location.search).get('data')
    if (data) {
      const parsedData = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'))
      this.fromOAuth = true
      this.email = parsedData.userData.email
      this.name = parsedData.userData.name
      this.surname = parsedData.userData.surname
      this.dateOfBirth = parsedData.userData.dateOfBirth
      this.gender = parsedData.userData.gender
    }

    this.getProvinces()
  },

  methods: {
    async getProvinces () {
      const result = await this.$callApi('/api/provinces', 'GET')
      if (result.data) {
        for (const prov of result.data.provinces) {
          this.allProvinces.push({
            val: prov,
            name: prov
          })
        }
      }
      this.loading = false
    },

    async signup () {
      if (!this.fromOAuth && (this.password != this.confirmPassword)) {
        alert('Le password devono coincidere')
        return
      }
      if (!this.email || this.email == '') {
        alert('Inserisci l\'indirizzo email')
        return
      }
      if (!this.fromOAuth && (!this.password || this.password == '')) {
        alert('Inserisci la password')
        return
      }
      if (!this.name || this.name == '') {
        alert('Inserisci il nome')
        return
      }
      if (!this.surname || this.surname == '') {
        alert('Inserisci il cognome')
        return
      }
      if (!this.dateOfBirth || this.dateOfBirth == '') {
        alert('Inserisci la data di nascita')
        return
      }
      if (!this.province || this.province == '') {
        alert('Inserisci la provincia')
        return
      }
      if (!this.gender || this.gender == '') {
        alert('Inserisci il sesso')
        return
      }

      const result = await this.$callApi('/api/signup', 'POST', {
        email: this.email,
        password: this.password,
        name: this.name,
        surname: this.surname,
        dateOfBirth: this.dateOfBirth,
        province: this.province,
        gender: this.gender
      })

      if (result.data) {
        localStorage.setItem('token', result.data.token)
        localStorage.setItem('name', result.data.name + ' ' + result.data.surname)
        localStorage.setItem('userId', result.data.userId)
        this.$router.push({ path: '/editLockers' })
      }

      this.loading = false
    },

    signin () {
      this.$router.push({ path: '/signin' })
    }
  }
}
</script>
