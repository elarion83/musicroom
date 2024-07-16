import { IconButton, LinearProgress } from "@mui/material";
import { playingFirstInList } from "../../../services/utils";
import { playedSeconds } from "../../../services/utilsRoom";
import { Replay10,Forward10, SkipPrevious, Replay } from "@mui/icons-material";
import VolumeButton from "./VolumeButton";

import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import SkipNextIcon from '@mui/icons-material/SkipNext';

const PlayerButtons = ({room,playerControlsShown,playerType,spotifyControlsShown, roomPlayedActuallyPlayed, playerRef,playingLastInListInComp, localVolume,playerIdPlayed,roomIsPlaying, setLocalVolume,setIsPlaying,setIdPlaying, setLayoutdisplay,isLayoutFullScreen,layoutDisplay, goToSecond}) => {
   
    var button = (playerType === 'spotify') ? spotifyControlsShown ? 'full' : 'limited' : 'full';
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
            
            {isLayoutFullScreen(layoutDisplay) &&
                <IconButton onClick={e => setLayoutdisplay('default')} >
                    <FullscreenExitIcon fontSize="large"  sx={{color: '#f0f1f0' }} />
                </IconButton>
            }
        </>
    )
};

export default PlayerButtons;