import React, { ReactElement } from 'react'
import { MdNotInterested } from 'react-icons/md'

import { camelCaseToClassicCase } from '../form/FormValues'
import type { Clip } from '../video_player/VideoPlayer'

export default function PreviousClipThumbnail({
  currentClip,
  setCurrentClip,
}: {
  currentClip: Clip | null
  setCurrentClip: React.Dispatch<React.SetStateAction<Clip | null>>
}): ReactElement {
  const [previousLabels, setPreviousLabels] = React.useState<string[]>([])

  React.useEffect(() => {
    setPreviousLabels([])
    if (currentClip && currentClip.previousClip) {
      const labelsArray: string[] = []
      Object.entries(currentClip.previousClip.labels).forEach(([k, v]: [string, boolean]) => {
        if (v) {
          labelsArray.push(`${camelCaseToClassicCase(k)} `)
        }
      })
      if (labelsArray.length > 0) {
        labelsArray[labelsArray.length - 1] = labelsArray[labelsArray.length - 1].slice(0, -1)
        setPreviousLabels(labelsArray)
      } else {
        setPreviousLabels(['No label'])
      }
    }
  }, [currentClip])

  function reloadPreviousClip(): void {
    if (currentClip) setCurrentClip(currentClip.previousClip)
  }

  return (
    <div className="previousClipThumbnail">
      {currentClip && currentClip.previousClip ? (
        <div
          className="thumbnailContainer"
          onClick={reloadPreviousClip}
          onKeyDown={reloadPreviousClip}
          role="button"
          tabIndex={0}
        >
          <img
            src={
              `${process.env.REACT_APP_BASE_URL}/thumbnail/${currentClip.previousClip.videoName}` +
              `/${currentClip.previousClip.startTime}`
            }
            crossOrigin="use-credentials"
            width="100%"
            height="100%"
            alt="Unable to render the thumbnail"
          />
          <div className="thumbnailLabel">{previousLabels}</div>
        </div>
      ) : (
        <div className="noThumbnailContainer">
          <div className="thumbnailLabel">
            <MdNotInterested size={50} />
          </div>
        </div>
      )}
    </div>
  )
}
