import React from 'react';

import type { ErrorMessage } from '../../App';
import fetchNextClip from '../../api/fetchNextClip';
import type { Clip } from './VideoPlayer';

export default function initClip(loginStatus: boolean) {
    const [currentClip, setCurrentClip] = React.useState<Clip | null>(null);
    const [previousClip, setPreviousClip] = React.useState<Clip | null>(null);

    React.useEffect(() => {
        if (!currentClip && loginStatus) {
            fetchNextClip()
                .then((nextClip: Clip | ErrorMessage) => {
                    if (!('error' in nextClip)) setCurrentClip(nextClip);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [previousClip, currentClip, loginStatus]);

    return {
        currentClip,
        setCurrentClip,
        setPreviousClip,
    };
}
