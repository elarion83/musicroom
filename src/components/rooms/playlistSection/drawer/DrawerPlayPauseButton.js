
import React from "react";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

import { Box } from "@mui/system";
import { ListItemIcon } from "@mui/material";
import SoundWave from "../../../../services/SoundWave";

const DrawerPlayPauseButton = ({ isAdminView,isPlayable, isPlaying, mediaDisplayingData, changeIsPlaying, changeIdPlaying, idActuallyPlaying, idActuallyDisplaying }) => {
    return(
        <Box>
        {isAdminView && <ListItemIcon sx={{cursor:'pointer', zIndex:2, position:'relative', display:'flex'}}>
                {idActuallyPlaying === idActuallyDisplaying && 
                    <>
                        {isPlaying &&
                            <Box sx={{pl:2}} onClick={e => changeIsPlaying(false)}>
                                <SoundWave waveNumber={7} isPlayingOrNo={isPlaying}  /></Box>
                        }
                        {!isPlaying &&
                            <PlayCircleOutlineIcon sx={{ml:1}} fontSize="large" onClick={e => changeIsPlaying(true)}  />
                        }
                    </>
                }
                {idActuallyPlaying !== idActuallyDisplaying && isPlayable &&
                    <PlayCircleOutlineIcon sx={{ml:1}} fontSize="large" onClick={e => changeIdPlaying(idActuallyDisplaying)}  />
                }
                {idActuallyPlaying !== idActuallyDisplaying && !isPlayable &&
                    <img src={mediaDisplayingData.visuel} width="50px" style={{paddingTop:'1em'}}/>
                }
        </ListItemIcon>}
        {!isAdminView && (idActuallyPlaying === idActuallyDisplaying) && 
            <ListItemIcon sx={{cursor:'pointer'}}>
            <SoundWave waveNumber={7} sx={{pl:0.5}}isPlayingOrNo={isPlaying} />
        </ListItemIcon>}
        {!isAdminView && (idActuallyPlaying !== idActuallyDisplaying) && 
            <ListItemIcon sx={{cursor:'pointer'}}>
            <img src={mediaDisplayingData.visuel} width="50px" style={{paddingTop:'1em'}}/>
        </ListItemIcon>}
        
        </Box>
    )
};

export default DrawerPlayPauseButton;