import { Authentication, ErrorMessage } from '../App'
import type { UserCredentials } from '../components/login/Login'

export default async function fetchUserCredentials(
  method: 'POST' | 'GET',
  register: boolean,
  credentials?: UserCredentials,
): Promise<Authentication | ErrorMessage> {
  try {
    // eslint-disable-next-line no-undef
    const allowCredentials: RequestCredentials = 'include'
    const requestOptions = {
      method,
      credentials: allowCredentials,
      headers: {
        'Content-Type': 'application/json',

        ...(method === 'GET' ? { 'x-access-token': localStorage.getItem('accessToken') || '' } : null),
      },

      ...(method === 'POST' ? { body: JSON.stringify(credentials) } : {}),
    }

    let endpoint = 'login'
    if (register) {
      endpoint = 'register'
    }

    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/${endpoint}`, requestOptions)
    const result = response.json()
    return result
  } catch (err) {
    throw new Error(err as string)
  }
}
