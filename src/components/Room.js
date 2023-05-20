import React, { useState, useEffect, useRef } from "react";
import { db } from "../services/firebase";

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import Toolbar from '@mui/material/Toolbar';
import ReactPlayer from 'react-player';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import Alert from '@mui/material/Alert';
import Fab from '@mui/material/Fab';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';


import LinearProgress from '@mui/material/LinearProgress';

import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Settings from '@mui/icons-material/Settings';
import ShareIcon from '@mui/icons-material/Share';

import Slider from '@mui/material/Slider';
import VolumeDown from '@mui/icons-material/VolumeDown';
import VolumeUp from '@mui/icons-material/VolumeUp';

import ActuallyPlaying from '../components/rooms/ActuallyPlaying'
import RoomModalAddMedia from '../components/rooms/ModalAddMedia'
import ModalShareRoom from '../components/rooms/ModalShareRoom'
import RoomPlaylist from "./rooms/RoomPlaylist";

const Room = ({ roomId }) => {

    const [localData, setLocalData] = useState({volume:0.5, currentUserInfo: useState(localStorage.getItem("MusicRoom_UserInfoPseudo")) });
	const [loaded, setLoaded] = useState(false);
	const [room, setRoom] = useState({});
    const [OpenInvitePeopleToRoomModal, setOpenInvitePeopleToRoomModal] = useState(false);
    const [OpenAddToPlaylistModal, setOpenAddToPlaylistModal] = useState(false);
    const [recentlyAdded, setRecentlyAdded]= useState(false);
	const roomRef = db.collection("rooms").doc(roomId);
    const playerRef = useRef();

    const getRoomData = (roomId) => {
		roomRef.get().then((doc) => {
			if (doc.exists) {
				setRoom(doc.data());
			} else {
				var docData = {
					id: roomId,
                    playing:0,
                    mediaActuallyPlayingAlreadyPlayed:0,
                    actuallyPlaying:false,
					playlistUrls: [],
					playlistEmpty: true,
					creationTimeStamp	: Date.now()
				};
				db.collection("rooms").doc(roomId).set(docData).then(() => {});
				setRoom(docData);
			}
            setLoaded(true);
		});
	};
	
	useEffect(() => {
		getRoomData(roomId);
        document.title = 'Room n°' + roomId + ' - MusicRoom';
	}, [room, roomId]);

    function handlePlay(playStatus) {
        roomRef.set({actuallyPlaying: playStatus}, { merge: true });
        setIsPlayerAtLeastStarted(true);
    }
    function handlePlayerStart() {
        setIsPlayerAtLeastStarted(true);
    }

    function handleMediaEnd() {
        if(room.playlistUrls[room.playing+1]) {
            handleChangeActuallyPlaying(room.playing+1);
        } else {
            handlePlay(false);
        }
    }
  
    function handleChangeActuallyPlaying(numberToPlay) {
        roomRef.set({playing: numberToPlay}, { merge: true });
    }
        
    function handleQuitRoom() {

        if(localStorage.getItem("MusicRoom_RoomId")) {
            localStorage.removeItem("MusicRoom_RoomId");
            window.location.reload(false);
        } 
        window.location.href = "/";
    }

    function setPercentagePlayed(percentagePlayed) {
        roomRef.set({mediaActuallyPlayingAlreadyPlayed: percentagePlayed}, { merge: true });
    }

    function handleProgress(event) {
            roomRef.set({mediaActuallyPlayingAlreadyPlayed: event.played*100}, { merge: true });
    }

    function handleVolumeChange(e) {
        var localDataTemps = localData;
        console.log(localDataTemps);
        localDataTemps.volume = e.target.value;
        setLocalData(localDataTemps);
    }

// NEW FUNCTIONS FROM CHILD COMP
    function handleAddValidatedObjectToPlaylist(validatedObjectToAdd) {
        room.playlistUrls.push(validatedObjectToAdd);
        roomRef.set({playlistUrls: room.playlistUrls, playlistEmpty: false}, { merge: true });
        
        setOpenAddToPlaylistModal(false);
    }

    function handleChangeIdActuallyPlaying(newIdToPlay) {
        roomRef.set({playing: newIdToPlay, mediaActuallyPlayingAlreadyPlayed: 0}, { merge: true });
    }

    async function fastForward(timeToGo) {
     /*   setPlayerSeeking(true);
        roomRef.set({mediaActuallyPlayingAlreadyPlayed: timeToGo}, { merge: true });
        playerRef.current.seekTo(timeToGo);
        setPlayerSeeking(false);*/
    }
    
  /*function handleSeekChange(e) {
    console.log(e);
        if(playerRef) {
            setPlayerSeeking(true);
            console.log(playerRef);
            roomRef.set({mediaActuallyPlayingAlreadyPlayed: e}, { merge: true });
            console.log(e);
            playerRef.current.seekTo(parseFloat(e/100))
            setPlayerSeeking(false);
        }
  }*/

  
  return (
    <div className="flex flex-col w-full gap-0 h-screen relative ">
        <AppBar position="static">
            <Toolbar sx={{ bgcolor: '#b79f6e', fontFamily: 'Monospace' }}>
                
                <Typography  component="div" sx={{ flexGrow: 1 }}>
                    Room n° <b>{ roomId } </b> { localData.currentUserInfo }
                </Typography>
                <Tooltip title="Partager la room" >
                    <IconButton
                        onClick={e => setOpenInvitePeopleToRoomModal(true)}
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <ShareIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title='Quitter la room' >
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: '-15px' }}
                        onClick={e => handleQuitRoom()}
                    >
                        <ExitToAppIcon />
                    </IconButton>
                </Tooltip>
                
            </Toolbar>
        </AppBar>

        <Container maxWidth="sm" sx={{ padding: '0 !important'}} >
            { !room.playlistEmpty && <ActuallyPlaying roomRef={roomRef}/>}
            {loaded && <div> 
                { !room.playlistEmpty && 
                    <Box sx={{bgcolor:'#c8b795', padding:"0px 0em"}}>
                        <Grid container spacing={0}>
                            <Grid item sm={4} sx={{ pl:0,ml:0, pt: 0}}>
                               
                                {loaded && room.playlistUrls &&<ReactPlayer sx={{ padding:0, bgcolor:"red"}}
                                    ref={playerRef}
                                    className='react-player'
                                    width='100%'
                                    pip={true}
                                    height='100%'
                                    volume={localData.volume}
                                    onProgress={e => handleProgress(e)}
                                    onStart={e => handlePlayerStart()}
                                    onReady={e => handlePlay(true)}
                                    onPlay={e => handlePlay(true)}
                                    onPause={e => handlePlay(false)}
                                    onEnded={e => handleMediaEnd()}
                                    url={room.playlistUrls[room.playing].url}
                                    pip={true}
                                    playing={room.actuallyPlaying} // is player actually playing
                                    controls={false}
                                    light="false"
                                    config={{
                                        youtube: {
                                            playerVars: { showinfo: 0 }
                                        }
                                    }}
                                />}
                            </Grid>
                            <Grid item sm={8} sx={{ padding:0,pl:0,ml:0, mb: 0 }}>
                                <Grid item sm={12} sx={{ padding:0,pl:1.5,ml:0, mb: 0 }}>
                                    { room.playlistUrls[room.playing].title && <Typography component={'span'} sm={12} >
                                        <ListItemText primary={room.playlistUrls[room.playing].title} />
                                    </Typography>}
                                    { room.playlistUrls[room.playing].url && room.playlistUrls[room.playing].url.length == 0 || !room.playlistUrls[room.playing].title && <Typography component={'span'} sm={12} >
                                        <ListItemText primary={room.playlistUrls[room.playing].url.substring(0, 50)+'...'} />
                                    </Typography>}
                                    
                                    <Typography sx={{ ml:0, mb: 0, fontSize: '10px', textTransform:'uppercase' }}>
                                        Source : { room.playlistUrls[room.playing].source }
                                    </Typography>
                                    <Typography sx={{ ml:0, mb: 1.5, fontSize: '10px', textTransform:'uppercase' }}>
                                        Ajouté par : { room.playlistUrls[room.playing].addedBy }
                                    </Typography>
                                </Grid>
                                <LinearProgress sx={{height:'10px'}} variant="determinate" value={room.mediaActuallyPlayingAlreadyPlayed} />
                                <Grid item sm={12} sx={{bgcolor:'#aa9c7f', padding:0,pl:1.5,ml:0, mb: 0 }}>
                                    <Grid item sm={12} sx={{ display:'flex',justifyContent: 'space-between', padding:0,pt:1,ml:0,mr:1,pr:2, mb: 1.5 }}>
                                        {room.playing > 0 && <IconButton onClick={e => handleChangeActuallyPlaying(room.playing - 1)}>
                                            <SkipPreviousIcon fontSize="large"  />
                                        </IconButton>}
                                        { room.actuallyPlaying && <IconButton variant="contained" onClick={e => handlePlay(false)} >
                                            <PauseCircleOutlineIcon fontSize="large"/>
                                        </IconButton>}
                                        { !room.actuallyPlaying && <IconButton variant="contained" onClick={e => handlePlay(true)} >
                                            <PlayCircleOutlineIcon fontSize="large"/>
                                        </IconButton>}
                                        {(room.playlistUrls.length -1) !== room.playing && <IconButton onClick={e => handleChangeActuallyPlaying(room.playing + 1)}>
                                            <SkipNextIcon fontSize="large"  />
                                        </IconButton>}
                                        <IconButton onClick={e => setPercentagePlayed(0)} >
                                            <SettingsBackupRestoreIcon fontSize="large" />
                                        </IconButton>
                                        {<IconButton onClick={e => handleChangeActuallyPlaying(0)}>
                                             <RestartAltIcon fontSize="large" />
                                        </IconButton>}
                                    </Grid>
                                    
                                    <Grid item sm={12} sx={{ pt:0,pl:2,pr:2,ml:0, mb: 0, pb:1 }}>
                                        <Stack spacing={2} sm={8} direction="row" sx={{ mb: 1, mr:2 }} alignItems="center">
                                            <VolumeDown />
                                            <Slider step={0.01} min={0.1}  max={1} aria-label="Volume" value={localData.volume} onChange={e => handleVolumeChange(e)} />
                                            <VolumeUp />
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                }
                <Typography sx={{bgcolor:'#645a47', color:'white', padding:'0.5em'}}> Playlist <span> ({ loaded && room.playlistUrls && room.playlistUrls.length } médias en playlist)</span>
                </Typography>
                { room.playlistEmpty && 
                    <Alert severity="success"> Bienvenue dans la room ! <a href="#" onClick={(e) => setOpenAddToPlaylistModal(true)} >Ajoutez quelque chose dans la playlist !</a></Alert>
                }
                {loaded && room.playlistUrls && room.playlistUrls.length > 0 &&<Box sx={{ padding:"0em",marginBottom:2, paddingLeft:0}}>
                    <RoomPlaylist roomPlaylist={room.playlistUrls} roomIdActuallyPlaying={room.playing} handleChangeIdActuallyPlaying={handleChangeIdActuallyPlaying} roomIsActuallyPlaying={room.actuallyPlaying} roomPlayedActuallyPlayed={room.mediaActuallyPlayingAlreadyPlayed} />
                </Box>}
                { room.playlistUrls[0] && <Snackbar 
                    severity="success"
                    open={recentlyAdded}
                    autoHideDuration={6000}
                    message={room.playlistUrls[room.playlistUrls.length-1].addedBy+' a ajouté un lien '+room.playlistUrls[room.playlistUrls.length-1].source}
                />}
            </div>
            } 
        </Container>
        <Dialog onClose={(e) => setOpenAddToPlaylistModal(false)} open={OpenAddToPlaylistModal}>
            <RoomModalAddMedia validatedObjectToAdd={handleAddValidatedObjectToPlaylist} /> 
        </Dialog>
        
        <Dialog onClose={(e) => setOpenInvitePeopleToRoomModal(false)} open={OpenInvitePeopleToRoomModal}>
            <ModalShareRoom roomUrl={ document.URL +'?rid='+roomId}/>
        </Dialog>

        <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: '100vh' }}
        >
            <Grid item xs={3} sx={{mt:2}}>
                <Stack direction="row" spacing={2}>
                    {!recentlyAdded && <Fab variant="extended" onClick={(e) => setOpenAddToPlaylistModal(true)}>
                        <SpeedDialIcon sx={{ mr: 1 }} />
                        Ajouter à la playlist
                    </Fab>}
                </Stack>
            </Grid>   
        </Grid> 
        <SpeedDial
            ariaLabel="SpeedDial basic example"
            sx={{ position: 'absolute', bottom: 36, right: 16 }}
            icon={<Settings />}
        >
            <SpeedDialAction
                onClick={e => handleQuitRoom()}
                key='LeaveRoom'
                icon={<ExitToAppIcon />}
                tooltipTitle='Quitter la room'
            />
            
            <SpeedDialAction
                onClick={e => setOpenInvitePeopleToRoomModal(true)}
                key='ShareRoom'
                icon={<ShareIcon />}
                tooltipTitle='Partager la room'
            />
        </SpeedDial>
    </div>
  );
};

export default Room;
