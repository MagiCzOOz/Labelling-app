import type { Clip } from '../components/video_player/VideoPlayer';

export default async function fetchLabel(method: 'POST' | 'GET', clipLabels?: Record<string, boolean>, clip?: Clip) {
    try {
        const allowCredentials: RequestCredentials = 'include';
        const requestOptions = {
            method: method,
            credentials: allowCredentials,
            headers: { 'Content-Type': 'application/json' },
            ...(method === 'POST' ? { body: JSON.stringify({ clipLabels: clipLabels, clip: clip }) } : {}),
        };

        let endpoint = 'labelled';
        if (method === 'GET') endpoint = 'labels';

        const response = await fetch(process.env.REACT_APP_BASE_URL + `/${endpoint}`, requestOptions);
        const result = response.json();
        return result;
    } catch (err) {
        throw new Error(err as string);
    }
}
