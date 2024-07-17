import { Button, IconButton, LinearProgress, Typography } from "@mui/material";
import { delay, isVarExist, isVarExistNotEmpty, playingFirstInList } from "../../../services/utils";
import { actuallyPlayingFromSpotify, playedSeconds, playerNotSync } from "../../../services/utilsRoom";
import { Replay10,Forward10, SkipPrevious, Replay } from "@mui/icons-material";
import VolumeButton from "./VolumeButton";
import SyncIcon from '@mui/icons-material/Sync';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SyncProblemIcon from '@mui/icons-material/SyncProblem';
import { useState } from "react";
import SyncDisabledIcon from '@mui/icons-material/SyncDisabled';

const PlayerButtons = ({room,playerControlsShown,reSyncUserFunc, playerType,spotifyControlsShown, roomPlayedActuallyPlayed, playerRef,playingLastInListInComp, localVolume,playerIdPlayed,roomIsPlaying,playerIsPlaying, setLocalVolume,setIsPlaying,setIdPlaying, setLayoutdisplay,isLayoutFullScreen,layoutDisplay, goToSecond}) => {
    
    var button = (playerType === 'spotify') ? spotifyControlsShown ? 'full' : 'limited' : 'full';

    async function desyncUnsyncUser() {
        await reSyncUserFunc(false);
        await reSyncUserFunc(true);
    }
    
    return(
        <>
            <LinearProgress className="mediaPlayingBar"  variant="determinate" value={roomPlayedActuallyPlayed} />
            
            {playerControlsShown  && 
            <>
                <IconButton onClick={e => (playingFirstInList(playerIdPlayed)) ? setIdPlaying(playerIdPlayed-1) : ''}>
                    <SkipPrevious fontSize="medium" sx={{color:(playingFirstInList(playerIdPlayed)) ? '#f0f1f0': '#303134'}} />
                </IconButton>

                {button === 'full' && <IconButton onClick={e => (room.mediaActuallyPlayingAlreadyPlayedData.playedSeconds > 10) ? goToSecond(playedSeconds(playerRef, playerType) - 10) : ''}>
                    <Replay10 fontSize="medium" sx={{ color : room.mediaActuallyPlayingAlreadyPlayedData.playedSeconds > 10 ? '#f0f1f0': '#303134'}} />
                </IconButton>}

                {button === 'full' && <IconButton variant="contained" onClick={e => setIsPlaying(!roomIsPlaying)} sx={{ color:'#f0f1f0', position:'sticky', top:0, zIndex:2500}} >
                    { roomIsPlaying ? (
                            <PauseCircleOutlineIcon className='colorWhite' fontSize="large"  />
                        ) : (
                            <PlayCircleOutlineIcon className='colorWhite' fontSize="large"  />
                        )
                    }
                </IconButton>}
                
                {button === 'full' && <IconButton onClick={e => goToSecond(playedSeconds(playerRef, playerType) + 10)}>
                    <Forward10 fontSize="medium" sx={{color:'#f0f1f0'}} />
                </IconButton>}

                <IconButton onClick={e => !playingLastInListInComp(room.playlistUrls.length,playerIdPlayed) ? setIdPlaying(playerIdPlayed+1) : ''}>
                    <SkipNextIcon fontSize="medium" sx={{color: !playingLastInListInComp(room.playlistUrls.length,playerIdPlayed) ? '#f0f1f0' : '#303134'}} />
                </IconButton>
                
                {button === 'full' && <IconButton onClick={e => (room.mediaActuallyPlayingAlreadyPlayedData.playedSeconds > 10) ? goToSecond(0) : ''} >
                    <Replay sx={{ color : room.mediaActuallyPlayingAlreadyPlayedData.playedSeconds > 10 ? '#f0f1f0': '#303134'}}/>
                </IconButton>}
            </>}
            <VolumeButton volume={localVolume} setVolume={setLocalVolume}/>
            {!playerControlsShown && 
                <> {(roomIsPlaying === playerIsPlaying) && !playerNotSync(room, playerRef) ? (
                    <Button variant="text" size="small" startIcon={<SyncIcon className="colorGreen2" /> }>
                        <Typography className="colorGreen2 firstLetterCapitalize" fontSize='small' >Synchronisé</Typography>
                    </Button>
                ) : ( 
                    <Button  onClick={e => desyncUnsyncUser()} variant="text" size="small" startIcon={<SyncProblemIcon className={(playerIdPlayed === room.playing) ? "colorOrange" : "colorRed"} /> }>
                        <Typography className={(playerIdPlayed === room.playing) ? "colorOrange firstLetterCapitalize" : "colorRed firstLetterCapitalize"} fontSize='small' >{(playerIdPlayed === room.playing) ? "Synchro. moyenne" : "Echec de synchro."}</Typography>
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

export default PlayerButtons;