
import React from "react";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

import { Box } from "@mui/system";
import { ListItemIcon } from "@mui/material";
import SoundWave from "../../../../services/SoundWave";

const DrawerPlayPauseButton = ({ isAdminView,isPlayable = true, isPlaying, setIsPlaying, setIdPlaying, idActuallyPlaying, idActuallyDisplaying }) => {

    function changePlayingInComp() {
        setIsPlaying(!isPlaying);
    }
    return(
        <Box >
            <ListItemIcon sx={{cursor:'pointer', zIndex:2, position:'relative', display:'flex'}}>
                {isAdminView &&
                    <>
                        {idActuallyPlaying === idActuallyDisplaying && 
                            <>
                                {isPlaying ? (
                                    <Box sx={{pl:2}} onClick={changePlayingInComp}>
                                        <SoundWave waveNumber={7} />
                                    </Box>
                                ) : (
                                    <PlayCircleOutlineIcon sx={{fontSize:'3em'}} onClick={changePlayingInComp}  />
                                )}
                            </>
                        }
                    {idActuallyPlaying !== idActuallyDisplaying && isPlayable &&
                        <PlayCircleOutlineIcon sx={{fontSize:'3em'}} onClick={e => setIdPlaying(idActuallyDisplaying)}  />
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