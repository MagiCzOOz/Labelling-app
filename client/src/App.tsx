import React, { ReactElement } from 'react'
import './App.scss'

import applyFetchInterceptor from './api/applyFetchInterceptor'
import fetchUserCredentials from './api/fetchUserCredentials'
import Footer from './components/Footer'
import Header from './components/Header'
import Dashboard from './components/dashboard/Dashboard'
import LabelForm from './components/form/LabelForm'
import useLabels from './components/form/useLabels'
import UserForm from './components/login/UserForm'
import useClip from './components/video_player/useClip'
import VideoPlayer from './components/video_player/VideoPlayer'

export type LabelConfig = {
  labels: Record<string, string[]>
  labelNames: string[]
  issueNames: string[]
  totalLabelNames: string[]
  labelFormModel: Record<string, boolean>
}

export type ErrorMessage = {
  error: string
}

export type Message = {
  message: string
}

export type Authentication = {
  loggedIn: boolean
  accessToken?: string
  refreshToken?: string
}

export default function App(): ReactElement {
  const [loginStatus, setLoginStatus] = React.useState<boolean>(false)

  applyFetchInterceptor(setLoginStatus)

  const { labelConfig } = useLabels(loginStatus)
  const { currentClip, setCurrentClip, setPreviousClip } = useClip(loginStatus)

  React.useEffect(() => {
    fetchUserCredentials('GET', false)
      .then((response: Authentication | ErrorMessage) => {
        if (!('error' in response)) setLoginStatus(response.loggedIn || false)
      })
      .catch(err => {
        throw new Error(err.message)
      })
  }, [])

  return (
    <div className="App">
      <Header loginStatus={loginStatus} setLoginStatus={setLoginStatus} />
      {loginStatus ? (
        <div className="row">
          <div className="mainColumn">
            <VideoPlayer currentClip={currentClip} />
            <LabelForm
              labelConfig={labelConfig}
              currentClip={currentClip}
              setCurrentClip={setCurrentClip}
              setPreviousClip={setPreviousClip}
            />
          </div>
          <div className="sideColumn">
            <Dashboard currentClip={currentClip} setCurrentClip={setCurrentClip} labelConfig={labelConfig} />
          </div>
        </div>
      ) : (
        <div className="loginRegister">
          <UserForm setLoginStatus={setLoginStatus} />
        </div>
      )}
      <Footer />
    </div>
  )
}
