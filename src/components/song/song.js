import './song.scss';

import React from "react";


let Song = function(props) {
    const {
        song,
        hoverContent
    } = props;

    return (
        <div className={'song'}>
            <div className={'song__hover-content'}>
                {hoverContent}
            </div>
            <div className={'song__art'}>
                <img className={'song__art-image'} src={song.imageUrl}/>
            </div>
        </div>
    )
};

export default Song;