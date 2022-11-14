import React from 'react';

import LogoutButton from './login/LogoutButton';

export default function Header({
    loginStatus,
    setLoginStatus,
}: {
    loginStatus: boolean;
    setLoginStatus: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    return (
        <header className="header">
            <div className="headerTitles">
                <h2>Annotation Tool</h2>
                <i>A fast solution for video labelling</i>
            </div>
            {loginStatus ? <LogoutButton setLoginStatus={setLoginStatus} /> : null}
        </header>
    );
}
