import React, { ReactElement } from 'react'

import Login from './Login'
import Register from './Register'

export default function UserForm({
  setLoginStatus,
}: {
  setLoginStatus: React.Dispatch<React.SetStateAction<boolean>>
}): ReactElement {
  return (
    <div className="userForm">
      <input type="checkbox" id="chk" aria-hidden="true" />
      <Register />
      <Login setLoginStatus={setLoginStatus} />
    </div>
  )
}
