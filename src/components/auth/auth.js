import './auth.scss';

import React, { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import Dependencies from '/util/dependencies';

let Auth = function() {
    let spotifyService = Dependencies.getDependency('spotifyService');
    let apiService = Dependencies.getDependency('apiService');

    const navigate = useNavigate();

    const urlParams = new URLSearchParams(window.location.search);

    let code = urlParams.get('code');
    let error = urlParams.get('error');

    if (error) {
      return <div>{'Access not granted:' + error.error}</div>
    }

    if (!code) {
      return <div>{'Authorization code not present'}</div>
    }


    let finishAuth = async function() {
        await spotifyService.setUpToken(process.env.REDIRECT_URI, code);

        let fullToken = spotifyService.getFullToken();

        await apiService.auth(fullToken);

        navigate('/radio');
    };

    useEffect(() => {
      finishAuth();
    }, []);

    return (
        <div className={'auth'}>
            {'Welcome to Fil Radio'}
        </div>
    );
};

export default Auth;