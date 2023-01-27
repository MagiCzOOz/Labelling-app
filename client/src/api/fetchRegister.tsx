import { ErrorMessage, Message } from '../App'
import type { UserCredentials } from '../components/login/Login'

export default async function fetchRegister(credentials: UserCredentials): Promise<Message | ErrorMessage> {
  try {
    // eslint-disable-next-line no-undef
    const allowCredentials: RequestCredentials = 'include'
    const requestOptions = {
      method: 'POST',
      credentials: allowCredentials,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    }

    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/register`, requestOptions)
    const result = response.json()
    return result
  } catch (err) {
    throw new Error(`${err}`)
  }
}
