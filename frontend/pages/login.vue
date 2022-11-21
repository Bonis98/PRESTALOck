<template>
  <div>
    <Loader v-show="loading" />
    <TopBar />
    <div class="text-center w-11/12 m-auto mb-6 justify-around gap-24 pt-12">
      <div class="text-center mb-3 text-2xl"> Login </div>
      <div class="text-center">
        <div class="mt-3">
          <div>Indirizzo email</div>
          <Input v-model="email" />
        </div>
        <div class="mt-3">
          <div>Password</div>
          <Input v-model="password" type="password" />
        </div>
        <div class="mt-3">
          <Button text="Login" @click="login()" />
        </div>
        <div class="mt-12">
          <Button text="Registrati" @click="signup()" />
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
      email: '',
      password: ''
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
    async login () {
      this.loading = true

      if (this.email == '' || this.password == '') {
        alert('Inserire correttamente indirizzo e password')
        this.loading = false
        return
      }

      // chiamata simulata a backend
      const correctCredentials = true
      const token = 'j3urth24ur21o93r'
      const name = 'Nome Utente'

      if (!correctCredentials) {
        alert('Credenziali non corrette')
        this.loading = false
        return
      }

      localStorage.setItem('token', token)
      localStorage.setItem('name', name)
      this.loading = false
      this.$router.push({ path: '/' })
    },

    signup () {
      this.$router.push({ path: '/signup' })
    }
  },

  created () {
    localStorage.removeItem('token')
    localStorage.removeItem('name')
  }
}
</script>
