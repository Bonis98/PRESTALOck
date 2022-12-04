<template>
  <div>
    <Loader v-show="loading" />
    <TopBar go-back />
    <div v-if="user" class="text-center w-11/12 m-auto mb-6 justify-around gap-24 pt-12">
      <div class="mb-1">
        <img class="w-16 m-auto" src="/icons/user-inverted.png">
      </div>
      <div class="text-center mb-3 text-2xl">
        Utente <span class="font-bold">{{ user.name }} {{ user.surname }}</span>
      </div>
      <div v-if="user.lockerList?.length > 0" class="text-center mb-3 text-xl">
        Locker preferiti di {{ user.name }}:
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
          <Button text="Mostra prestiti attivi" @click="goToActiveLoans()" />
        </div>
        <div class="mt-1">
          <Button text="Logout" hollow icon="logout" @click="logout()" />
        </div>
      </div>

      <div v-if="userProducts.length > 0" class="text-center mt-3 mb-2 text-xl">
        Oggetti messi in prestito da {{ user.name }}:
      </div>

      <div class="flex flex-wrap w-11/12 m-auto mb-6 justify-around gap-24">
        <ProductCard v-for="product in userProducts" :key="product.id" :passed-product="product" />
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
      myUserId: localStorage.getItem('userId'),
      userProducts: []
    }
  },

  mounted () {
    this.getUserInfo()
  },

  methods: {
    async getUserInfo () {
      const userResult = await this.$callApi('/api/user/' + this.userId, 'GET')
      const productsResult = await this.$callApi('/api/user/' + this.userId + '/products', 'GET')

      if (userResult.data && productsResult.data) {
        this.user = userResult.data.user
        this.userProducts = productsResult.data.products
      } else {
        this.$router.replace('/')
      }

      this.loading = false
    },

    logout () {
      if (confirm('Sei sicuro di voler uscire?')) {
        this.$router.push({ path: '/signin' })
      }
    },

    goToEditLockers () {
      this.$router.push({ path: '/editLockers' })
    },

    goToActiveLoans () {
      this.$router.push({ path: '/activeLoans' })
    }
  }
}
</script>
