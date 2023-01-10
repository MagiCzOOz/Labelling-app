import React, { ReactElement } from 'react'
import { FaPlay, FaPause } from 'react-icons/fa'

export default function PlayerControls({
  playing,
  setPlaying,
  displayButton,
  clipProgress,
  clipDuration,
}: {
  playing: boolean
  setPlaying: React.Dispatch<React.SetStateAction<boolean>>
  displayButton: boolean
  clipProgress: number
  clipDuration: string
}): ReactElement | null {
  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {displayButton ? (
        <>
          <progress className="clipProgressBar" max={clipDuration} value={clipProgress} />
          {playing ? (
            <button type="button" className="playerButton" onClick={() => setPlaying(false)}>
              <FaPause size={22} />
            </button>
          ) : (
            <button type="button" className="playerButton" onClick={() => setPlaying(true)}>
              <FaPlay size={22} />
            </button>
          )}
        </>
      ) : null}
    </>
  )
}
