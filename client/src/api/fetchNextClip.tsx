import { Clip } from '../components/video_player/VideoPlayer'

export default async function fetchNextClip(): Promise<Clip> {
  try {
    // eslint-disable-next-line no-undef
    const allowCredentials: RequestCredentials = 'include'
    const requestOptions = {
      method: 'GET',
      credentials: allowCredentials,
      headers: {
        'x-access-token': localStorage.getItem('accessToken') as string,
      },
    }
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/clip`, requestOptions)
    const nextClip = response.json()
    return nextClip
  } catch (err) {
    throw new Error(err as string)
  }
}
