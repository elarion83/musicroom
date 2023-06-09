
import React from "react";

const SoundWave = ({ waveNumber, isPlayingOrNo }) => {

    var animations = ['boxNormal', 'boxQuiet', 'boxLoud', 'boxNormal', 'boxQuiet', 'boxLoud','boxNormal', 'boxQuiet', 'boxLoud'];
    return(
        <span className={isPlayingOrNo ? 'animated soundWaveContainer' : 'waiting soundWaveContainer'}>
            {[...Array(waveNumber)].map((object, i) => <div key={i} className={`box ${(animations[i])}`} ></div>)}
        </span>
    )
};

export default SoundWave;