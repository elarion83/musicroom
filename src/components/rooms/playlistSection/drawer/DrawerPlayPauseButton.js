
import React from "react";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

import { Box } from "@mui/system";
import { ListItemIcon } from "@mui/material";
import SoundWave from "../../../../services/SoundWave";

const DrawerPlayPauseButton = ({ isAdminView,isPlayable = true, isPlaying, setIsPlaying, setIdPlaying, idActuallyPlaying, idActuallyDisplaying }) => {
    return(
        <Box >
            <ListItemIcon sx={{cursor:'pointer', zIndex:2, position:'relative', display:'flex'}}>
                {isAdminView &&
                    <>
                        {idActuallyPlaying === idActuallyDisplaying && 
                            <>
                                {isPlaying ? (
                                    <Box sx={{pl:2}} onClick={e => setIsPlaying(false)}>
                                        <SoundWave waveNumber={7} isPlayingOrNo={isPlaying}  />
                                    </Box>
                                ) : (
                                    <PlayCircleOutlineIcon sx={{ml:1}} fontSize="large" onClick={e => setIsPlaying(true)}  />
                                )}
                            </>
                        }
                    {idActuallyPlaying !== idActuallyDisplaying && isPlayable &&
                        <PlayCircleOutlineIcon sx={{ml:1}} fontSize="large" onClick={e => setIdPlaying(idActuallyDisplaying)}  />
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