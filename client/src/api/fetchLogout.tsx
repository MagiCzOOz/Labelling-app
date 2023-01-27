export default async function fetchLogout(): Promise<string> {
  try {
    // eslint-disable-next-line no-undef
    const allowCredentials: RequestCredentials = 'include'
    const requestOptions = {
      method: 'POST',
      credentials: allowCredentials,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    }
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/logout`, requestOptions)
    const message = response.text()
    return message
  } catch (err) {
    throw new Error(`${err}`)
  }
}
