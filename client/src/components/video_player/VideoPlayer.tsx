import React, { ReactElement } from 'react'
import './VideoStyles.scss'
import ReactPlayer from 'react-player'

import PlayerControls from './PlayerControls'
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
  const [playing, setPlaying] = React.useState<boolean>(false)
  const [displayButton, setDisplayButton] = React.useState<boolean>(false)
  const [clipProgress, setClipProgress] = React.useState<number>(0)
  const playerRef = React.useRef<ReactPlayer>(null)
  const clipDuration = String((currentClip?.endTime || 0) - (currentClip?.startTime || 0))

  function playPauseOnClick(): void {
    // eslint-disable-next-line no-unused-expressions
    playing ? setPlaying(false) : setPlaying(true)
  }

  React.useEffect(() => {
    if (playing) {
      setPlaying(false)
    }
    // Here we do not want have playing as dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentClip])

  return (
    <div
      className="videoPlayer"
      onMouseEnter={() => {
        setDisplayButton(true)
      }}
      onMouseLeave={() => {
        setDisplayButton(false)
      }}
      onClick={playPauseOnClick}
      onKeyDown={playPauseOnClick}
      role="button"
      tabIndex={0}
    >
      {currentClip ? (
        <div className="reactPlayer">
          <ReactPlayer
            playing={playing}
            id="player"
            url={
              `${process.env.REACT_APP_BASE_URL}/videos/${currentClip.videoName}` +
              `#t=${currentClip.startTime},${currentClip.endTime}`
            }
            config={{
              file: {
                attributes: {
                  crossOrigin: 'use-credentials',
                  preload: 'metadata',
                },
              },
            }}
            width="100%"
            height="100%"
            ref={playerRef}
            progressInterval={200}
            onProgress={progress => {
              setClipProgress(progress.playedSeconds - currentClip.startTime)
              if (progress.playedSeconds >= currentClip.endTime) {
                playerRef.current?.seekTo(currentClip.startTime)
                setPlaying(false)
              }
            }}
            onSeek={() => setPlaying(false)}
          />
          <PlayerControls
            playing={playing}
            setPlaying={setPlaying}
            displayButton={displayButton}
            clipProgress={clipProgress}
            clipDuration={clipDuration}
          />
        </div>
      ) : (
        <VideoLoader />
      )}
    </div>
  )
}
