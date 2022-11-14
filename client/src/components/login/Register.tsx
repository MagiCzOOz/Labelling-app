import React from 'react';
import './LoginStyles.scss';
import { useForm } from 'react-hook-form';

import type { UserResponse } from '../../App';
import fetchUserCredentials from '../../api/fetchUserCredentials';
import type { UserCredentials } from './Login';

export default function Register() {
    const { register, handleSubmit } = useForm<UserCredentials>();
    const [registerError, setRegisterError] = React.useState<string | null>(null);
    const [registerSuccess, setRegisterSuccess] = React.useState<string | null>(null);

    const onSubmit = (data: UserCredentials) => {
        fetchUserCredentials('POST', true, data)
            .then((response: UserResponse) => {
                if (response.error) {
                    setRegisterError(response.error);
                    setRegisterSuccess(null);
                } else if (response.message) {
                    setRegisterError(null);
                    setRegisterSuccess(response.message);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

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
    );
}
