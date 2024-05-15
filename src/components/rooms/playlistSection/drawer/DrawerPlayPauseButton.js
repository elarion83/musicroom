
import React from "react";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

import { Box } from "@mui/system";
import { ListItemIcon } from "@mui/material";
import SoundWave from "../../../../services/SoundWave";
import { changeMediaActuallyPlaying } from "../../../../services/utilsRoom";
const DrawerPlayPauseButton = ({ isAdminView,isPlayable, isPlaying, mediaDisplayingData, room, roomRef,changeIsPlaying, changeIdPlaying, idActuallyPlaying, idActuallyDisplaying }) => {
    return(
        <Box >
            <ListItemIcon sx={{cursor:'pointer', zIndex:2, position:'relative', display:'flex'}}>
                {isAdminView &&
                    <>
                        {idActuallyPlaying === idActuallyDisplaying && 
                            <>
                                {isPlaying &&
                                    <Box sx={{pl:2}} onClick={e => changeIsPlaying(false)}>
                                        <SoundWave waveNumber={7} isPlayingOrNo={isPlaying}  />
                                    </Box>
                                }
                                {!isPlaying &&
                                    <PlayCircleOutlineIcon sx={{ml:1}} fontSize="large" onClick={e => changeIsPlaying(true)}  />
                                }
                            </>
                        }
                    {idActuallyPlaying !== idActuallyDisplaying && isPlayable &&
                        <PlayCircleOutlineIcon sx={{ml:1}} fontSize="large" onClick={e => changeMediaActuallyPlaying(idActuallyDisplaying,'next',isAdminView,room, roomRef)}  />
                    }
                    </>
                }
                {!isAdminView && 
                    <Box sx={{pl:2}}>
                        <SoundWave waveNumber={7} isPlayingOrNo={idActuallyPlaying === idActuallyDisplaying && isPlaying}  />
                    </Box>
                }
            </ListItemIcon>
        </Box>
    )
};

export default DrawerPlayPauseButton;