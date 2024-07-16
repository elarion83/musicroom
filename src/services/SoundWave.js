
import React from "react";

const SoundWave = ({ waveNumber, isPlayingOrNo }) => {

    var animations = ['boxNormal', 'boxQuiet', 'boxLoud'];
    var selectedAnimation = 0;
    return(
        <span className={isPlayingOrNo ? 'animated soundWaveContainer' : 'waiting soundWaveContainer'}>
            {[...Array(waveNumber)].map((object, i) => {
                selectedAnimation++;
                if(selectedAnimation > animations.length-1) {
                    selectedAnimation = 0;
                }
                return(
                <div key={i} className={`box ${(animations[selectedAnimation])}`} ></div>
                );
            })
            }
        </span>
    )
};

export default SoundWave;