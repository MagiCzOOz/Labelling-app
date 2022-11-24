import React from 'react';
import './LoginStyles.scss';
import { useForm } from 'react-hook-form';

import type { Authentication, ErrorMessage } from '../../App';
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
            .then((response: Authentication | ErrorMessage) => {
                if ('error' in response) {
                    setLoginError(response.error);
                    setLoginStatus(false);
                } else {
                    if (response.accessToken) {
                        localStorage.setItem('accessToken', response.accessToken);
                        setLoginError(null);
                    }
                    if (response.refreshToken) {
                        localStorage.setItem('refreshToken', response.refreshToken);
                    }
                    setLoginStatus(response.loggedIn || false);
                }
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
