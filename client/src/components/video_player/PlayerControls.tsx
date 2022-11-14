import React from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';

export default function PlayerControls({
    playing,
    setPlaying,
    displayButton,
    clipProgress,
    clipDuration,
}: {
    playing: boolean;
    setPlaying: React.Dispatch<React.SetStateAction<boolean>>;
    displayButton: boolean;
    clipProgress: number;
    clipDuration: string;
}) {
    return (
        <>
            {displayButton ? (
                <>
                    <progress className="clipProgressBar" max={clipDuration} value={clipProgress}></progress>
                    {playing ? (
                        <button className="playerButton" onClick={() => setPlaying(false)}>
                            <FaPause size={22} />
                        </button>
                    ) : (
                        <button className="playerButton" onClick={() => setPlaying(true)}>
                            <FaPlay size={22} />
                        </button>
                    )}
                </>
            ) : null}
        </>
    );
}
