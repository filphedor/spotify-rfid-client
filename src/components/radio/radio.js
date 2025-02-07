import './radio.scss';

import React, { useState, useEffect } from "react";

import Dependencies from '/util/dependencies';

import Search from '/components/search/search';


let SpotifyRadio = function() {
    let [currentSong, setCurrentSong] = useState(null);

    const spotifyService = Dependencies.getDependency('spotifyService');
    const queueService = Dependencies.getDependency('queueService');
    const notificationService = Dependencies.getDependency('notificationService');

    return (
        <div className={'radio'}>
            <div className={'radio__search'}>
                <Search/>
            </div>
        </div>
    );
};

export default SpotifyRadio;