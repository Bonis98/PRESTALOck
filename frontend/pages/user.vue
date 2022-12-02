<template>
  <div>
    <Loader v-show="loading" />
    <TopBar go-back />
    <div v-if="user" class="text-center w-11/12 m-auto mb-6 justify-around gap-24 pt-12">
      <div class="text-center mb-3 text-2xl">
        Utente {{ user.name }} {{ user.surname }}
      </div>
      <div v-if="user.lockerList?.length > 0" class="text-center mb-3 text-xl">
        Locker vicini all'utente:
      </div>
      <div v-if="user.lockerList?.length > 0" class="text-center mb-3">
        <div v-for="locker in user.lockerList" :key="locker.id">
          {{ locker.name }} ({{ locker.address }}, {{ locker.province }})
        </div>
      </div>

      <div v-if="userId == myUserId" class="text-center mt-4">
        <div class="mt-1">
          <Button text="Modifica lista locker" @click="goToEditLockers()" />
        </div>
        <div class="mt-1">
          <Button text="Logout" hollow icon="logout" @click="logout()" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: true,
      userId: this.$route.query.userId,
      user: null,
      myUserId: localStorage.getItem('userId')
    }
  },

  mounted () {
    this.getUserInfo()
  },

  methods: {
    async getUserInfo () {
      const result = await this.$callApi('/api/user/' + this.userId, 'GET')
      if (result.data) {
        this.user = result.data.user
      } else {
        this.$router.replace('/')
      }

      this.loading = false
    },

    logout () {
      console.log('aaaaaaaa')
      if (confirm('Sei sicuro di voler uscire?')) {
        this.$router.push({ path: '/signin' })
      }
    },

    goToEditLockers () {
      this.$router.push({ path: '/editLocker' })
    }
  }
}
</script>
