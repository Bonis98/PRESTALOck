<template>
  <div>
    <Loader v-show="loading" />
    <TopBar />
    <div class="text-center w-11/12 m-auto mb-6 justify-around gap-24 pt-12">
      <div class="text-center mb-3 text-2xl">
        Titolo
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: true
    }
  },

  methods: {
    async methodThatCallsTheBackend () {
      // 'methods' can be: "GET", "POST", "PUT",
      // body is used in "POST" and "PUT" requests
      // result is an object that can have a number called `errorStatus` (is the HTTP error status) or an object/array called `data` and a status code if there
      const result = await this.$callApi('/api/url', 'POST', { key: 'value' })
      if (result.data) {
        console.log(result.data)
      } else {
        // optional: do something if there's an error (result.errorStatus)
      }

      this.loading = false
    }
  }
}
</script>
