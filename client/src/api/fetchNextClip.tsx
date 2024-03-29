import { Clip } from '../components/video_player/VideoPlayer'

export default async function fetchNextClip(): Promise<Clip> {
  try {
    // eslint-disable-next-line no-undef
    const allowCredentials: RequestCredentials = 'include'
    const requestOptions = {
      method: 'GET',
      credentials: allowCredentials,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    }
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/clip`, requestOptions)
    const nextClip = response.json()
    return nextClip
  } catch (err) {
    throw new Error(`${err}`)
  }
}
