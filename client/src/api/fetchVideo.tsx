import { Clip } from '../components/video_player/VideoPlayer'

export default async function fetchVideo(currentClip: Clip): Promise<string> {
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
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/videos/${currentClip.videoName}/${currentClip.startTime}/${currentClip.endTime}`,
      requestOptions,
    )
    const blob = await response.blob()
    const blobUrl = window.URL.createObjectURL(blob)
    return blobUrl
  } catch (err) {
    throw new Error(`${err}`)
  }
}
