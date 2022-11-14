export default async function fetchNextClip() {
    try {
        const allowCredentials: RequestCredentials = 'include';
        const requestOptions = {
            method: 'GET',
            credentials: allowCredentials,
            headers: {
                'x-access-token': localStorage.getItem('token') as string,
            },
        };
        const response = await fetch(process.env.REACT_APP_BASE_URL + '/clip', requestOptions);
        const nextClip = response.json();
        return nextClip;
    } catch (err) {
        throw new Error(err as string);
    }
}
