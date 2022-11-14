import React from 'react';
import './LoginStyles.scss';
import { useForm } from 'react-hook-form';

import type { UserResponse } from '../../App';
import fetchUserCredentials from '../../api/fetchUserCredentials';

export type UserCredentials = {
    username: string;
    password: string;
    confirmPassword?: string;
};

export default function Login({ setLoginStatus }: { setLoginStatus: React.Dispatch<React.SetStateAction<boolean>> }) {
    const { register, handleSubmit } = useForm<UserCredentials>();
    const [loginError, setLoginError] = React.useState<string | null>(null);

    const onSubmit = (data: UserCredentials) => {
        fetchUserCredentials('POST', false, data)
            .then((response: UserResponse) => {
                if (response.token) {
                    localStorage.setItem('token', response.token);
                    setLoginError(null);
                }
                if (response.error) setLoginError(response.error);
                setLoginStatus(response.loggedIn || false);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div className="login-wrapper">
            <form onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="chk" aria-hidden="true">
                    Login
                </label>
                <input {...register('username')} type="text" placeholder="User name" required />
                <input {...register('password')} type="password" placeholder="Password" autoComplete="on" required />
                <button type="submit">Submit</button>
                {loginError ? <p className="error">{loginError}</p> : null}
            </form>
        </div>
    );
}
