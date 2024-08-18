import { Box, Button, IconButton, LinearProgress, Typography } from "@mui/material";
import { playingFirstInList } from "../../../services/utils";
import { playedSeconds, playerNotSync } from "../../../services/utilsRoom";
import { Replay10,Forward30, SkipPrevious, Replay } from "@mui/icons-material";
import VolumeButton from "./VolumeButton";
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SyncProblemIcon from '@mui/icons-material/SyncProblem';
import { withTranslation } from "react-i18next";
import { useState } from "react";

const PlayerButtons = ({t,room,playerControlsShown,reSyncUserFunc, playerType,spotifyControlsShown, roomPlayedActuallyPlayed, playerRef,playingLastInListInComp, localVolume,playerIdPlayed,roomIsPlaying,playerIsPlaying, setLocalVolume,setIsPlaying,setIdPlaying, setLayoutdisplay,isLayoutFullScreen,layoutDisplay, goToSecond}) => {
    
    var controlsType = (playerType === 'spotify') ? spotifyControlsShown ? 'full' : 'limited' : 'full';

    async function manuallyResync() {
        await reSyncUserFunc(false);
        await reSyncUserFunc(true);
    }

    function playedMoreThan10Sec() {
        return (room.mediaActuallyPlayingAlreadyPlayedData.playedSeconds > 10);
    }
    return(
        <>
            <LinearProgress className="mediaPlayingBar"  variant="determinate" value={roomPlayedActuallyPlayed} />
            
            {playerControlsShown  && 
            <>
                <IconButton onClick={e => (playingFirstInList(playerIdPlayed)) ? setIdPlaying(playerIdPlayed-1) : ''}>
                    <SkipPrevious fontSize="medium" sx={{color:(playingFirstInList(playerIdPlayed)) ? '#f0f1f0': '#303134'}} />
                </IconButton>

                {controlsType === 'full' && 
                    <>
                        <IconButton onClick={e => playedMoreThan10Sec() ? goToSecond(playedSeconds(playerRef, playerType) - 10) : ''}>
                            <Replay10 fontSize="medium" sx={{ color : playedMoreThan10Sec() ? '#f0f1f0': '#303134'}} />
                        </IconButton>

                        <IconButton variant="contained" onClick={e => setIsPlaying(!roomIsPlaying)} sx={{ color:'#f0f1f0', position:'sticky', top:0, zIndex:2500}} >
                            { playerIsPlaying ? (
                                    <PauseCircleOutlineIcon className='colorWhite' fontSize="large"  />
                                ) : (
                                    <PlayCircleOutlineIcon className='colorWhite' fontSize="large"  />
                                )
                            }
                        </IconButton>
                            
                        <IconButton onClick={e => goToSecond(playedSeconds(playerRef, playerType) + 30)}>
                            <Forward30 fontSize="medium" sx={{color:'#f0f1f0'}} />
                        </IconButton>
                    </>
                }

                <IconButton onClick={e => !playingLastInListInComp(room.playlistUrls.length,playerIdPlayed) ? setIdPlaying(playerIdPlayed+1) : ''}>
                    <SkipNextIcon fontSize="medium" sx={{color: !playingLastInListInComp(room.playlistUrls.length,playerIdPlayed) ? '#f0f1f0' : '#303134'}} />
                </IconButton>
                
                {controlsType === 'full' && <IconButton onClick={e => playedMoreThan10Sec() ? goToSecond(0) : ''} >
                    <Replay sx={{ color : playedMoreThan10Sec() ? '#f0f1f0': '#303134'}}/>
                </IconButton>}
            </>}
            
            <VolumeButton volume={localVolume} setVolume={setLocalVolume}/>
            {!playerControlsShown && 
                <>
                    {(roomIsPlaying === playerIsPlaying) && !playerNotSync(room, playerRef) ? (
                        <Button variant="text" size="small" startIcon={<PublishedWithChangesIcon className="colorGreen" sx={{marginRight:'-5px !important'}}/> }>
                            <Typography className="colorGreen firstLetterCapitalize" fontSize='small' >{t('GeneralSync')}</Typography>
                        </Button>
                    ) : ( 
                        <Button sx={{ pl:1,pr:1}} onClick={e => manuallyResync()} variant="text" size="small" startIcon={<SyncProblemIcon sx={{marginRight:'-5px !important'}} className={(playerIdPlayed === room.playing) ? "colorOrange" : "colorRed "} /> }>
                            <Typography className={(playerIdPlayed === room.playing) ? "colorOrange firstLetterCapitalize" : "colorRed firstLetterCapitalize"} fontSize='small' >{t('GeneralSyncRestart')}</Typography>
                        </Button>
                    )}
                </>
            }         
            
            
            {isLayoutFullScreen(layoutDisplay) && 
                <IconButton onClick={e => setLayoutdisplay('default')} >
                    <FullscreenExitIcon fontSize="large"  sx={{color: '#f0f1f0' }} />
                </IconButton>
            }
        </>
    )
};

export default  withTranslation()(PlayerButtons);