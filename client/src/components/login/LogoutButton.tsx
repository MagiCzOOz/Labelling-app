import React, { ReactElement } from 'react'
import { MdLogout } from 'react-icons/md'

import fetchLogout from '../../api/fetchLogout'

const logout = (setLoginStatus: React.Dispatch<React.SetStateAction<boolean>>): void => {
  fetchLogout()
    .then(() => {
      setLoginStatus(false)
      localStorage.clear()
    })
    .catch(err => {
      throw new Error(err.message)
    })
}

export default function LogoutButton({
  setLoginStatus,
}: {
  setLoginStatus: React.Dispatch<React.SetStateAction<boolean>>
}): ReactElement {
  return (
    <div className="logoutButton">
      <button
        onClick={() => {
          logout(setLoginStatus)
        }}
        type="button"
      >
        Logout <MdLogout />
      </button>
    </div>
  )
}
