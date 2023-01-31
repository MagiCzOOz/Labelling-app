import React from 'react'

const applyFetchInterceptor = (setLoginStatus: React.Dispatch<React.SetStateAction<boolean>>): void => {
  const { fetch: originalFetch } = window
  window.fetch = async (...args): Promise<Response> => {
    const [resource, config] = args

    const response = await originalFetch(resource, config)
    if (response.status === 401) {
      const requestOptions = {
        method: 'GET',
        // eslint-disable-next-line no-undef
        credentials: 'include' as RequestCredentials,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('refreshToken')}`,
        },
      }
      const tokenResp = await originalFetch(`${process.env.REACT_APP_BASE_URL}/token`, requestOptions)
      tokenResp
        .json()
        .then(async token => {
          if (token.accessToken) {
            localStorage.setItem('accessToken', token.accessToken)
            const newResponse = await originalFetch(resource, {
              method: config?.method,
              credentials: config?.credentials,
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token.accessToken}`,
              },
              body: config?.body,
            })
            return newResponse
          }
          setLoginStatus(false)
          return response
        })
        .catch(err => {
          return Promise.reject(err)
        })
    }
    return response
  }
}

export default applyFetchInterceptor
