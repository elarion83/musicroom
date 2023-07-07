
import React from "react";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

import SoundWave from "../../SoundWave";
import { Box } from "@mui/system";
import { ListItemIcon } from "@mui/material";

const DrawerPlayPauseButton = ({ isAdminView, isPlaying, changeIsPlaying, changeIdPlaying, idActuallyPlaying, idActuallyDisplaying }) => {

    return(
        <Box>
        {isAdminView && <ListItemIcon sx={{cursor:'pointer'}}>
                {idActuallyPlaying === idActuallyDisplaying && 
                    <>
                        {isPlaying && 
                            <Box sx={{pl:1}} onClick={e => changeIsPlaying(false)}>
                                <SoundWave waveNumber={7} isPlayingOrNo={isPlaying}  /></Box>
                        }
                        {!isPlaying && 
                            <PlayCircleOutlineIcon sx={{ml:1}} fontSize="large" onClick={e => changeIsPlaying(true)}  />
                        }
                    </>
                }
                {idActuallyPlaying !== idActuallyDisplaying && 
                    <PlayCircleOutlineIcon sx={{ml:1}} fontSize="large" onClick={e => changeIdPlaying(idActuallyDisplaying)}  />
                }
        </ListItemIcon>}
        {!isAdminView && (idActuallyPlaying === idActuallyDisplaying) && 
                <ListItemIcon sx={{cursor:'pointer'}}>
                <SoundWave waveNumber={7} sx={{pl:0.5}}isPlayingOrNo={isPlaying} />
            </ListItemIcon>}
        </Box>
    )
};

export default DrawerPlayPauseButton;