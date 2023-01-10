/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-props-no-spreading */
import React, { ReactElement } from 'react'
import './LoginStyles.scss'
import { useForm } from 'react-hook-form'

import type { ErrorMessage, Message } from '../../App'
import type { UserCredentials } from './Login'
import fetchRegister from '../../api/fetchRegister'

export default function Register(): ReactElement {
  const { register, handleSubmit } = useForm<UserCredentials>()
  const [registerError, setRegisterError] = React.useState<string | null>(null)
  const [registerSuccess, setRegisterSuccess] = React.useState<string | null>(null)

  const onSubmit = (data: UserCredentials): void => {
    fetchRegister(data)
      .then((response: Message | ErrorMessage) => {
        if ('error' in response) {
          setRegisterError(response.error)
          setRegisterSuccess(null)
        } else {
          setRegisterError(null)
          setRegisterSuccess(response.message)
        }
      })
      .catch(err => {
        throw new Error(err.message)
      })
  }

  return (
    <div className="register-wrapper">
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="chk" aria-hidden="true">
          Sign Up
        </label>
        <input {...register('username')} type="text" placeholder="User name" required />
        <input {...register('password')} type="password" placeholder="Password" autoComplete="on" required />
        <input
          {...register('confirmPassword')}
          type="password"
          placeholder="Confirm password"
          autoComplete="on"
          required
        />
        <button type="submit">Sign up</button>
        {registerError ? <p className="regError">{registerError}</p> : null}
        {registerSuccess ? <p className="success">{registerSuccess}</p> : null}
      </form>
    </div>
  )
}
