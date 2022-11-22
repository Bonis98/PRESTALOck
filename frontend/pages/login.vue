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
        alert('Inserire correttamente email e password')
        this.loading = false
        return
      }

      try {
        const response = await fetch('/api/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password
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
        localStorage.setItem('token', data.token)
        localStorage.setItem('name', data.name + ' ' + data.surname)
        this.$router.push({ path: '/' })
      } catch (ex) {
        console.error(ex)
        alert(ex)
        this.loading = false
        return
      }
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
