import React from 'react';
import './VideoStyles.scss';
import ReactPlayer from 'react-player';

import PlayerControls from './PlayerControls';
import VideoLoader from './VideoLoader';

export type Clip = {
    id: number;
    videoName: string;
    startTime: number;
    endTime: number;
    labels: Record<string, boolean>;
    previousClip: Clip | null;
};

export default function VideoPlayer({ currentClip }: { currentClip: Clip | null }) {
    const [playing, setPlaying] = React.useState<boolean>(false);
    const [displayButton, setDisplayButton] = React.useState<boolean>(false);
    const [clipProgress, setClipProgress] = React.useState<number>(0);
    const playerRef = React.useRef<ReactPlayer>(null);
    const clipDuration = String((currentClip?.endTime || 0) - (currentClip?.startTime || 0));

    const playPauseOnClick = () => {
        playing ? setPlaying(false) : setPlaying(true);
    };

    React.useEffect(() => {
        if (playing) {
            setPlaying(false);
        }
    }, [currentClip]);

    return (
        <div
            className="videoPlayer"
            onMouseEnter={() => {
                setDisplayButton(true);
            }}
            onMouseLeave={() => {
                setDisplayButton(false);
            }}
            onClick={playPauseOnClick}
        >
            {currentClip ? (
                <div className="reactPlayer">
                    <ReactPlayer
                        playing={playing}
                        id="player"
                        url={
                            process.env.REACT_APP_BASE_URL +
                            `/videos/${currentClip.videoName}` +
                            `#t=${currentClip.startTime},${currentClip.endTime}`
                        }
                        config={{
                            file: {
                                attributes: {
                                    crossOrigin: 'use-credentials',
                                },
                            },
                        }}
                        width="100%"
                        height="100%"
                        ref={playerRef}
                        progressInterval={200}
                        onProgress={(progress) => {
                            setClipProgress(progress.playedSeconds - currentClip.startTime);
                            if (progress.playedSeconds >= currentClip.endTime) {
                                playerRef.current?.seekTo(currentClip.startTime);
                                setPlaying(false);
                            }
                        }}
                        onSeek={() => setPlaying(false)}
                    />
                    <PlayerControls
                        playing={playing}
                        setPlaying={setPlaying}
                        displayButton={displayButton}
                        clipProgress={clipProgress}
                        clipDuration={clipDuration}
                    />
                </div>
            ) : (
                <VideoLoader />
            )}
        </div>
    );
}
