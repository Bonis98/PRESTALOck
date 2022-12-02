export default (context, inject) => {
  inject('callApi', async (url, method, body) => {
    method = method || 'GET'

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
          location.assign('/signin')
          return
        } else if (response.status == 403) {
          throw {
            message: 'Non sei autorizzato ad effettuare questa operazione',
            status: response.status
          }
        }
        if (contentType && contentType.includes('application/json')) {
          throw {
            message: (await response.json()).errorText,
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
      console.error(ex)
      alert(ex.message)
      return { errorCode: ex.status }
    }
  })

  inject('uploadFile', async (url, body) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Auth-Token': localStorage.getItem('token')
        },
        body
      })
      if (!response.ok) {
        console.error(response)
        const contentType = response.headers.get('content-type')
        if (response.status == 401) {
          location.assign('/signin')
          return
        } else if (response.status == 403) {
          throw {
            message: 'Non sei autorizzato ad effettuare questa operazione',
            status: response.status
          }
        }
        if (contentType && contentType.includes('application/json')) {
          throw {
            message: (await response.json()).errorText,
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
        console.log('POST', url, response.status, ':', data)
        return { error: false, data }
      } else {
        console.log('POST', url, response.status)
        return { error: false }
      }
    } catch (ex) {
      console.error(ex)
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
