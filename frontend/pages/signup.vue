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
        <Input v-model="email" type="email" />
      </div>
      <div class="mt-3">
        Password
      </div>
      <div>
        <Input v-model="password" type="password" />
      </div>
      <div class="mt-3">
        Conferma password
      </div>
      <div>
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
        <Button text="Torna al login" @click="login()" />
      </div>
      <div class="mt-12">
        <Button text="Registrati con Facebook" @click="facebook()" />
      </div>
      <div class="mt-12">
        <Button text="Registrati con Google" @click="google()" />
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
      for (const element of document.querySelectorAll('Input, Button, Select')) {
        element.disabled = newValue
      }
    }
  },

  created () {
    localStorage.removeItem('token')
    localStorage.removeItem('name')
  },

  mounted () {
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
      if (this.password != this.confirmPassword) {
        alert('Le password devono coincidere')
        return
      }
      if (this.email == '') {
        alert('Inserisci l\'indirizzo email')
        return
      }
      if (this.password == '') {
        alert('Inserisci la password')
        return
      }
      if (this.name == '') {
        alert('Inserisci il nome')
        return
      }
      if (this.surname == '') {
        alert('Inserisci il cognome')
        return
      }
      if (this.dateOfBirth == '') {
        alert('Inserisci la data di nascita')
        return
      }
      if (this.province == '') {
        alert('Inserisci la provincia')
        return
      }
      if (this.gender == '') {
        alert('Inserisci il sesso')
        return
      }

      // FROM yyyy-mm-dd to dd-mm-yyyy
      let formattedDate = this.dateOfBirth.split('-')
      formattedDate = `${formattedDate[2]}-${formattedDate[1]}-${formattedDate[0]}`

      const result = await this.$callApi('/api/signup', 'POST', {
        email: this.email,
        password: this.password,
        name: this.name,
        surname: this.surname,
        dateOfBirth: formattedDate,
        province: this.province,
        gender: this.gender
      })

      if (result.data) {
        localStorage.setItem('token', result.data.token)
        localStorage.setItem('name', result.data.name + ' ' + result.data.surname)
        this.$router.push({ path: '/editLocker' })
      }

      this.loading = false
    },

    login () {
      this.$router.push({ path: '/login' })
    },
    facebook () {
      this.$router.push({ path: '/api/signinFacebook' })
    },
    google () {
      this.$router.push({ path: '/api/signinGoogle' })
    }
  }
}
</script>
