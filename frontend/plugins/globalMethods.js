export default (context, inject) => {
  inject('callApi', async (url, method, body) => {
    try {
      const response = await fetch(url, {
        method,
        body,
        headers: {
          'Auth-Token': localStorage.getItem('token')
        }
      })
      if (!response.ok) {
        console.error(response)
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          throw {
            message: (await response.json()).errortext,
            status: response.status
          }
        } else {
          throw {
            message: `Si è verificato un errore. (${response.status})`,
            status: response.status
          }
        }
      }

      const data = (await response.json())
      console.log(method, url, ':', data)
      return { error: false, data }
    } catch (ex) {
      console.error(ex.message)
      alert(ex.message)
      return { errorCode: ex.status }
    }
  })

  inject('formatDate', (date) => {
    try {
      let result = new Date(date).toLocaleString('it-IT', {
        timeStyle: 'short',
        dateStyle: 'long'
      })
      result = result == 'Invalid Date' ? '' : result
      return result
    } catch (ex) {
      return ''
    }
  })
}
