import React from 'react';

const applyFetchInterceptor = (setLoginStatus: React.Dispatch<React.SetStateAction<boolean>>) => {
    const { fetch: originalFetch } = window;
    window.fetch = (...args) => {
        const [resource, config] = args;

        return new Promise(async (resolve, reject) => {
            const response = await originalFetch(resource, config);
            if (response.status !== 401) {
                resolve(response);
            } else {
                const requestOptions = {
                    method: 'GET',
                    credentials: 'include' as RequestCredentials,
                    headers: {
                        'Content-Type': 'application/json',
                        'x-refresh-token': localStorage.getItem('refreshToken') || '',
                    },
                };
                const tokenResp = await originalFetch(process.env.REACT_APP_BASE_URL + '/token', requestOptions);
                tokenResp
                    .json()
                    .then(async (token) => {
                        if (token.accessToken) {
                            localStorage.setItem('accessToken', token.accessToken);
                            const newResponse = await originalFetch(resource, {
                                method: config?.method,
                                credentials: config?.credentials,
                                headers: {
                                    'Content-Type': 'application/json',
                                    'x-access-token': token.accessToken,
                                },
                                body: config?.body,
                            });
                            resolve(newResponse);
                        } else {
                            setLoginStatus(false);
                            resolve(response);
                        }
                    })
                    .catch((err) => {
                        reject(err);
                    });
            }
        });
    };
};

export default applyFetchInterceptor;
