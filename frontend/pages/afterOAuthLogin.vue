<script>
export default {
  mounted () {
    const data = new URLSearchParams(window.location.search).get('data')
    const parsedData = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'))

    if (parsedData.userData) {
      // New user
      this.$router.replace({ path: '/signup', query: { data } })
    } else {
      // User already registered
      localStorage.setItem('token', parsedData.token)
      localStorage.setItem('name', parsedData.name + ' ' + parsedData.surname)
      console.log(parsedData)
      this.$router.replace({ path: '/' })
    }
  }
}
</script>
