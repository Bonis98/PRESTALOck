<template>
  <div>
    <Loader v-show="loading" />
    <TopBar />
    <div class="text-center w-11/12 m-auto mb-6 justify-around gap-24 pt-12">
      <div class="text-center mb-3 text-2xl">
        Password dimenticata
      </div>
      <div class="text-center">
        <div class="mt-3">
          <div>Indirizzo email</div>
          <Input v-model="email" />
        </div>
        <div v-show="sentOtp" class="mt-3">
          <div>Codice OTP ricevuto via mail</div>
          <Input v-model="otp" type="password" />
        </div>
        <div v-show="sentOtp" class="mt-3">
          <div>Nuova Password</div>
          <Input v-model="password" type="password" />
        </div>
        <div v-show="sentOtp" class="mt-3">
          <div>Conferma nuova Password</div>
          <Input v-model="password2" type="password" />
        </div>

        <div v-show="!sentOtp" class="mt-3">
          <Button text="Richiedi codice OTP" @click="askOtp()" />
        </div>

        <div v-show="sentOtp" class="mt-3">
          <Button text="Cambia password" @click="changePassword()" />
        </div>

        <div class="mt-3">
          <NuxtLink :to="{ path: '/signin' }">
            <Button text="Annulla" hollow />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      sentOtp: false,
      email: '',
      otp: '',
      password: '',
      password2: ''
    }
  },

  methods: {
    async askOtp () {
      if (this.email == '') {
        alert('Inserire l\'indirizzo email')
        return
      }

      this.loading = true

      const result = await this.$callApi('/api/forgotPassword/' + encodeURIComponent(this.email), 'GET')

      if (!result.error) {
        alert('Abbiamo inviato un codice OTP alla tua casella di posta elettronica. Inseriscilo per reimpostare la password')
        this.sentOtp = true
      } else if (result.errorStatus == 404) {
        alert('Indirizzo email non trovato')
      }
      this.loading = false
    },

    async changePassword () {
      if (this.email == '') {
        alert('Inserire l\'indirizzo email')
        return
      }

      if (this.otp == '') {
        alert('Inserire il codice OTP ottenuto per email')
        return
      }

      if (this.password == '') {
        alert('Inserire una password')
        return
      }

      if (this.password != this.password2) {
        alert('Le password devono coincidere')
        return
      }

      this.loading = true

      const result = await this.$callApi('/api/resetPassword', 'POST', {
        email: this.email,
        tempCode: this.otp,
        newPassword: this.password
      })

      if (!result.error) {
        alert('Password reimpostata correttamente')
        localStorage.setItem('token', result.data.token)
        localStorage.setItem('name', result.data.name + ' ' + result.data.surname)
        localStorage.setItem('userId', result.data.userId)
        this.$router.push({ path: '/' })
      } else if (result.errorStatus == 403) {
        alert('I dati inseriti non sono corretti. Riprovare')
      }
      this.loading = false
    }
  }
}
</script>
