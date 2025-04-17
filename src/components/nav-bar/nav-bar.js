import './nav-bar.scss';

import React, {useState, useEffect} from "react";

import Dependencies from '/util/dependencies';

import Auth from '/components/auth/auth'

const NavBar = function() {
    const [user, setUser] = useState(null);
    const [isApiConnected, setIsApiConnected] = useState(false);

    const spotifyService = Dependencies.getDependency('spotifyService');
    const apiService = Dependencies.getDependency('apiService');
    const notificationService = Dependencies.getDependency('notificationService');

    const setUpUser = async function() {
        try {
            let currentUser = await spotifyService.getUser();
            setUser(currentUser);
        } catch(error) {
            setUser(null);
        }
    };

    const setUpApiConnected = async function() {
        try {
            let isApiConnected = await apiService.isApiConnected();
            setIsApiConnected(isApiConnected);
        } catch(error) {
            setIsApiConnected(false);
        }
    };

    useEffect(() => {
        return notificationService.listen((notif) => {
            alert(notif.message);
        });
    }, []);

    useEffect(() => {
        setUpUser();
        setUpApiConnected();
    }, []);

    const logIn = function() {
        spotifyService.authenticate(process.env.REDIRECT_URI);
    };

    const logOut = function() {
        spotifyService.logOut();
    };

    const getUserSection = function() {
        if (user) {
            return (
                <>
                    <div className={'nav-bar__user'}>
                        {user}
                    </div>
                    <div className={'nav-bar__log-in'} onClick={logOut}>
                        {'Log Out'}
                    </div>
                </>
            );
        }

        return (
            <div className={'nav-bar__log-in'} onClick={logIn}>
                {'Log In'}
            </div>
        );
    };

    return (
        <div className={'nav-bar'}>
            <div className={'nav-bar__spacer'}></div>
            <div className={'nav-bar__auth'}>
                <Auth/>
            </div>
        </div>
    )
};

export default NavBar;