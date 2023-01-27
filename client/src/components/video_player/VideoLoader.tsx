import React, { ReactElement } from 'react'

export default function VideoLoader({ isReady }: { isReady: boolean }): ReactElement {
  return (
    <div className="videoLoader" hidden={isReady}>
      <div className="loaderOutter" />
      <div className="loaderInner" />
    </div>
  )
}
