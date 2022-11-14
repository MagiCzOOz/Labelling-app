import React from 'react';
import './App.scss';

import fetchUserCredentials from './api/fetchUserCredentials';
import VideoPlayer from './components//video_player/VideoPlayer';
import Footer from './components/Footer';
import Header from './components/Header';
import Dashboard from './components/dashboard/Dashboard';
import LabelForm from './components/form/LabelForm';
import initLabels from './components/form/initLabels';
import UserForm from './components/login/UserForm';
import initClip from './components/video_player/initClip';

export type LabelConfig = {
    labels: Record<string, string[]>;
    labelNames: string[];
    issueNames: string[];
    labelFormModel: Record<string, boolean>;
};

export type UserResponse = {
    loggedIn?: boolean;
    user?: {
        id: number;
        username: string;
    };
    message?: string;
    token?: string;
    error?: string;
};

export default function App() {
    const [loginStatus, setLoginStatus] = React.useState<boolean>(false);
    const { labelConfig } = initLabels(loginStatus);
    const { currentClip, setCurrentClip, setPreviousClip } = initClip(loginStatus);

    React.useEffect(() => {
        fetchUserCredentials('GET', false)
            .then((response: UserResponse) => {
                setLoginStatus(response.loggedIn || false);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <div className="App">
            <Header loginStatus={loginStatus} setLoginStatus={setLoginStatus} />
            {loginStatus ? (
                <div className="row">
                    <div className="mainColumn">
                        <VideoPlayer currentClip={currentClip} />
                        <LabelForm
                            labelConfig={labelConfig}
                            currentClip={currentClip}
                            setCurrentClip={setCurrentClip}
                            setPreviousClip={setPreviousClip}
                        />
                    </div>
                    <div className="sideColumn">
                        <Dashboard
                            currentClip={currentClip}
                            setCurrentClip={setCurrentClip}
                            labelConfig={labelConfig}
                        />
                    </div>
                </div>
            ) : (
                <div className="loginRegister">
                    <UserForm setLoginStatus={setLoginStatus} />
                </div>
            )}
            <Footer />
        </div>
    );
}