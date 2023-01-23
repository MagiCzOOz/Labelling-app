// As we often want to process a large amount of videos we usually dont have captions available for all
/* eslint-disable jsx-a11y/media-has-caption */
import React, { ReactElement } from 'react'
import './VideoStyles.scss'

import VideoLoader from './VideoLoader'

export type Clip = {
  id: number
  videoName: string
  startTime: number
  endTime: number
  labels: Record<string, boolean>
  previousClip: Clip | null
}

export default function VideoPlayer({ currentClip }: { currentClip: Clip | null }): ReactElement {
  return (
    <div className="videoPlayer">
      {currentClip ? (
        <div className="reactPlayer">
          <video controls id="player" crossOrigin="use-credentials" width="100%" height="100%" preload="metadata">
            <source
              src={
                `${process.env.REACT_APP_BASE_URL}/videos/${currentClip.videoName}` +
                `/${currentClip.startTime}/${currentClip.endTime}`
              }
              type="video/mp4"
            />
          </video>
        </div>
      ) : (
        <VideoLoader />
      )}
    </div>
  )
}
