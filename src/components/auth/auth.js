import './auth.scss';

import React, { useState, useEffect } from "react";

import Dependencies from '/util/dependencies';


let Auth = function() {
    const [user, setUser] = useState(null);
    const [isApiConnected, setIsApiConnected] = useState(false);

    let spotifyService = Dependencies.getDependency('spotifyService');
    let apiService = Dependencies.getDependency('apiService');


    const setUpUser = async function() {
        try {
            let currentUser = await spotifyService.getUser();
            setUser(currentUser);
        } catch(error) {
            setUser(null);
        }
    };

    let updateAuthApi = async function() {
        let connected = false;
        
        try {
            connected = await apiService.isApiConnected();
        } catch {
            connected = false;
        }

        if (connected) {
            setIsApiConnected(true);
            return;
        }

        try {
            let fullToken = spotifyService.getFullToken();

            await apiService.auth(fullToken);

            connected = await apiService.isApiConnected();
        } catch {
            setIsApiConnected(false);
        }

        setIsApiConnected(connected);
    }

    let finishAuth = async function(code) {
        await spotifyService.setUpToken(process.env.REDIRECT_URI, code);

        const urlObject = new URL(window.location);
        urlObject.search = '';
        
        window.location = urlObject.toString();
    };

    const checkForAuth = async function() {
        const urlParams = new URLSearchParams(window.location.search);

        let code = urlParams.get('code');
        let error = urlParams.get('error');

        if (code && !error) {
            console.log(code)
            await finishAuth(code);
            return;
        }

        if (error) {
            alert('need to do something here');
            return;
        }

        setUpUser();
    };

    useEffect(() => {
      checkForAuth();
    }, []);

    useEffect(() => {
        updateAuthApi();
    }, [user]);

    const logIn = function() {
        spotifyService.authenticate(process.env.REDIRECT_URI);
    };

    const logOut = function() {
        spotifyService.logOut();
    };

    if (user === null) {
      return (
          <div className={'auth'}>
              <div className={'auth__info'}>
                  <div className={'auth__log-in'} onClick={logIn}>
                      {'Log In'}
                  </div>
                </div>
          </div>
      );
    }

    return (
      <div className={'auth'}>
          <div className={'auth__info'}>
            <div className={'auth__user'}>
                {user.display_name}{isApiConnected.toString()}
            </div>
            <div className={'auth__log-out'}>
                {'Log Out'}
            </div>
          </div>
      </div>
  );
};

export default Auth;