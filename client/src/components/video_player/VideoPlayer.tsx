// As we often want to process a large amount of videos we usually dont have captions available for all
/* eslint-disable jsx-a11y/media-has-caption */
import React, { ReactElement } from 'react'
import './VideoStyles.scss'

import VideoLoader from './VideoLoader'
import fetchVideo from '../../api/fetchVideo'

export type Clip = {
  id: number
  videoName: string
  startTime: number
  endTime: number
  labels: Record<string, boolean>
  previousClip: Clip | null
}

export default function VideoPlayer({ currentClip }: { currentClip: Clip | null }): ReactElement {
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const [stream, setStream] = React.useState<string>()
  const [isReady, setIsReady] = React.useState<boolean>(true)

  function onReady(): void {
    setIsReady(true)
  }

  React.useEffect(() => {
    async function fetchStream(): Promise<void> {
      if (currentClip) {
        setIsReady(false)
        setStream(await fetchVideo(currentClip))
      }
    }
    fetchStream()
  }, [currentClip])

  return (
    <div className="videoPlayer">
      <div className="reactPlayer">
        <video
          hidden={!isReady}
          controls
          controlsList="nodownload"
          id="player"
          ref={videoRef}
          crossOrigin="use-credentials"
          width="100%"
          height="100%"
          preload="auto"
          src={stream}
          onLoadedData={onReady}
        />
      </div>
      <VideoLoader isReady={isReady} />
    </div>
  )
}
