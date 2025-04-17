import './spotify-radio.scss';

import React from "react";

import Rfid from '/components/rfid/rfid';

import NavBar from '/components/nav-bar/nav-bar';


let SpotifyRadio = function() {
    return (
        <div className={'spotify-radio'}>
            <div className={'spotify-radio__nav'}>
                <NavBar/>
            </div>
            <div className={'spotify-radio__content'}>
                <Rfid/>
            </div>
        </div>
    );
};

export default SpotifyRadio;