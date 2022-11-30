export default (context, inject) => {
  inject('callApi', async (url, method, body) => {
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Auth-Token': localStorage.getItem('token')
        },
        body: JSON.stringify(body)
      })
      if (!response.ok) {
        console.error(response)
        const contentType = response.headers.get('content-type')
        if (response.status == 401) {
          location.assign('/login')
          return
        }
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

      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const data = (await response.json())
        console.log(method, url, response.status, ':', data)
        return { error: false, data }
      } else {
        console.log(method, url, response.status)
        return { error: false }
      }
    } catch (ex) {
      console.error(ex.message)
      alert(ex.message)
      return { errorCode: ex.status }
    }
  })

  inject('formatDate', (date) => {
    try {
      let result = new Date(date).toLocaleString('it-IT', {
        // timeStyle: 'short',
        dateStyle: 'long'
      })
      result = result == 'Invalid Date' ? '' : result
      return result
    } catch (ex) {
      return ''
    }
  })
}
