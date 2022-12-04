<template>
  <div>
    <Loader v-show="loading" />
    <TopBar />
    <div class="text-center w-11/12 m-auto mb-6 justify-around gap-24 pt-12">
      <div class="h-16 flex justify-center">
        <img class="h-full" src="/title.png">
      </div>
      <div class="text-center mb-3 text-2xl">
        Login
      </div>
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
          <Button text="Login" @click="signin()" />
        </div>
        <div class="mt-3">
          <NuxtLink :to="{ path: '/forgotPassword' }">
            <Button text="Password dimenticata" hollow />
          </NuxtLink>
        </div>
        <div class="mt-12">
          <Button text="Registrati" @click="signup()" />
        </div>
        <div class="mt-3">
          <Button text="Accedi con Google" hollow icon="google" @click="google()" />
        </div>
        <div class="mt-3">
          <Button text="Accedi con Facebook" hollow icon="facebook" @click="facebook()" />
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

  methods: {
    async signin () {
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
            throw data.errorText
          } else {
            throw `Si è verificato un errore. (${response.status})`
          }
        }

        const data = await response.json()
        localStorage.setItem('token', data.token)
        localStorage.setItem('name', data.name + ' ' + data.surname)
        localStorage.setItem('userId', data.userId)
        this.$router.replace({ path: '/' })
      } catch (ex) {
        console.error(ex)
        alert(ex)
        this.loading = false
      }
    },

    signup () {
      this.$router.push({ path: '/signup' })
    },

    google () {
      location.assign('/api/signinGoogle')
    },

    facebook () {
      alert('Il login con Facebook non è abilitato: essendo un\'app in fase di test, solo gli account degli sviluppatori sono autorizzati')
      // location.assign('/api/signinFacebook')
    }
  }
}
</script>
