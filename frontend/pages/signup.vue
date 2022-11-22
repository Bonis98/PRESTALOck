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
        <Input v-model="dateOfBirth" />
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
      // richiesta simulata
      await new Promise(resolve => setTimeout(resolve, 1000))
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
    }, /*
    async getProvinces () {
      try {
        const response = await fetch('/api/provinces', {
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
        //data got

      } catch (ex) {
        console.error(ex)
        alert(ex)
        this.loading = false
        return
      }
    } */

    async signup () {
      if (this.password != this.confirmPassword) {
        alert('Le password devono coincidere')
        return
      }
      if (this.email == '') {
        alert('Inserisci email')
        return
      }
      if (this.password == '') {
        alert('Inserisci password')
        return
      }
      if (this.name == '') {
        alert('Inserisci name')
        return
      }
      if (this.surname == '') {
        alert('Inserisci surname')
        return
      }
      if (this.dateOfBirth == '') {
        alert('Inserisci dateOfBirth')
        return
      }
      if (this.province == '') {
        alert('Inserisci province')
        return
      }
      if (this.gender == '') {
        alert('Inserisci gender')
        return
      }
      try {
        const response = await fetch('/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password,
            name: this.name,
            surname: this.surname,
            dateOfBirth: this.dateOfBirth,
            province: this.province,
            gender: this.gender
          })
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
        // data got
        localStorage.setItem('token', data.token)
        localStorage.setItem('name', data.name + ' ' + data.surname)
        this.$router.push({ path: '/login' })
      } catch (ex) {
        console.error(ex)
        alert(ex)
        this.loading = false
      }
    },

    login () {
      this.$router.push({ path: '/login' })
    }
  }
}
</script>
