import React from 'react';
import { MdLogout } from 'react-icons/md';

import fetchLogout from '../../api/fetchLogout';

const logout = (setLoginStatus: React.Dispatch<React.SetStateAction<boolean>>) => {
    fetchLogout()
        .then(() => {
            setLoginStatus(false);
            localStorage.clear();
        })
        .catch((err) => {
            console.log(err);
        });
};

export default function LogoutButton({
    setLoginStatus,
}: {
    setLoginStatus: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    return (
        <div className="logoutButton">
            <button
                onClick={() => {
                    logout(setLoginStatus);
                }}
            >
                <a>Logout</a>
                <MdLogout />
            </button>
        </div>
    );
}
