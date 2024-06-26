import { Box, Grid, Icon, IconButton, LinearProgress } from "@mui/material";
import { playingFirstInList } from "../../../services/utils";
import { playedSeconds } from "../../../services/utilsRoom";
import { Replay10,Forward10, SkipPrevious, Replay } from "@mui/icons-material";
import VolumeButton from "./VolumeButton";

import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SoundWave from "../../../services/SoundWave";

const PlayerButtons = ({room,playerControlsShown,roomPlayedActuallyPlayed, playerRef,playingLastInListInComp, localVolume,playerIdPlayed,roomIsPlaying, setLocalVolume,setIsPlaying,setIdPlaying, setLayoutdisplay,isLayoutFullScreen,layoutDisplay, goToSecond}) => {
   
    return(
        <>
            <LinearProgress className="mediaPlayingBar"  variant="determinate" value={roomPlayedActuallyPlayed} />
            <Box sx={{width:roomPlayedActuallyPlayed+'%'}} className="mediaPlayingBarSoundWave"><SoundWave isPlayingOrNo={roomIsPlaying} waveNumber={150} /></Box>
            {playerControlsShown && 
            <>
                <IconButton onClick={e => (playingFirstInList(playerIdPlayed)) ? setIdPlaying(playerIdPlayed-1) : ''}>
                    <SkipPrevious fontSize="medium" sx={{color:(playingFirstInList(playerIdPlayed)) ? '#f0f1f0': '#303134'}} />
                </IconButton>

                <IconButton onClick={e => (room.mediaActuallyPlayingAlreadyPlayedData.playedSeconds > 10) ? goToSecond(playedSeconds(playerRef) - 10) : ''}>
                    <Replay10 fontSize="medium" sx={{ color : room.mediaActuallyPlayingAlreadyPlayedData.playedSeconds > 10 ? '#f0f1f0': '#303134'}} />
                </IconButton>

                <IconButton variant="contained" onClick={e => setIsPlaying(!roomIsPlaying)} sx={{ color:'#f0f1f0', position:'sticky', top:0, zIndex:2500}} >
                    { roomIsPlaying && <PauseCircleOutlineIcon fontSize="large" />}
                    { !roomIsPlaying && <PlayCircleOutlineIcon fontSize="large" />}
                </IconButton>
                
                <IconButton onClick={e => goToSecond(playedSeconds(playerRef) + 10)}>
                    <Forward10 fontSize="medium" sx={{color:'#f0f1f0'}} />
                </IconButton>

                <IconButton onClick={e => !playingLastInListInComp(room.playlistUrls.length,playerIdPlayed) ? setIdPlaying(playerIdPlayed+1) : ''}>
                    <SkipNextIcon fontSize="medium" sx={{color: !playingLastInListInComp(room.playlistUrls.length,playerIdPlayed) ? '#f0f1f0' : '#303134'}} />
                </IconButton>
                
                <IconButton onClick={e => (room.mediaActuallyPlayingAlreadyPlayedData.playedSeconds > 10) ? goToSecond(0) : ''} >
                    <Replay sx={{ color : room.mediaActuallyPlayingAlreadyPlayedData.playedSeconds > 10 ? '#f0f1f0': '#303134'}}/>
                </IconButton>
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