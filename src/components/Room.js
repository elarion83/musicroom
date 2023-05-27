import React, { useState, useEffect, useRef } from "react";
import { db } from "../services/firebase";


import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import ReactPlayer from 'react-player';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import Alert from '@mui/material/Alert';
import Fab from '@mui/material/Fab';
import Stack from '@mui/material/Stack';
//import screenfull from 'screenfull'
import Snackbar from '@mui/material/Snackbar';

import Typography from '@mui/material/Typography';

import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

import Slider from '@mui/material/Slider';
import VolumeDown from '@mui/icons-material/VolumeDown';
import VolumeUp from '@mui/icons-material/VolumeUp';

import ActuallyPlaying from '../components/rooms/ActuallyPlaying'
import RoomModalAddMedia from '../components/rooms/ModalAddMedia'
import ModalShareRoom from '../components/rooms/ModalShareRoom'
import RoomPlaylist from "./rooms/RoomPlaylist";
import RoomTopBar from "./rooms/RoomTopBar";

const Room = ({ roomId }) => {

    const [localData, setLocalData] = useState({domain:window.location.hostname,synchro:false, currentUserInfo: useState(localStorage.getItem("MusicRoom_UserInfoPseudo")) });
	const [loaded, setLoaded] = useState(false);
	const [room, setRoom] = useState({});
    const [OpenInvitePeopleToRoomModal, setOpenInvitePeopleToRoomModal] = useState(false);
    const [OpenAddToPlaylistModal, setOpenAddToPlaylistModal] = useState(false);
    const [localVolume, setLocalVolume] = useState(0);
	const roomRef = db.collection("rooms").doc(roomId.toLowerCase());
    const [roomRefUsed, setRoomRefUsed]= useState(false);
    const playerRef = useRef({
        url: null,
        pip: false,
        playing: true,
        controls: false,
        light: false,
        volume: 0,
        muted: false,
        played: 0,
        loaded: 0,
        duration: 0,
        playbackRate: 1.0,
        loop: false
    });
    const [isActuallyAdmin, setIsActuallyAdmin] = useState(false);
    const delay = ms => new Promise(res => setTimeout(res, ms));
    const getRoomData = (roomId) => {
            roomRef.get().then((doc) => {
                if (doc.exists) {
                    setRoom(doc.data());
                } else {
                    var docData = {
                        id: roomId.toLowerCase(),
                        admin:localStorage.getItem("MusicRoom_UserInfoPseudo"),
                        playing:0,
                        mediaActuallyPlayingAlreadyPlayed:0,
                        actuallyPlaying:false,
                        playlistUrls: [],
                        playlistEmpty: true,
                        creationTimeStamp	: Date.now()
                    };
                    db.collection("rooms").doc(roomId.toLowerCase()).set(docData).then(() => {});
                    setRoom(docData);
                }
            });
            setLoaded(true);
	};

	useEffect(() => {
		getRoomData(roomId); // A REPOSITIONNER

        document.title = 'Room ID:' + roomId + ' - MusicRoom';
	}, [roomId]);
    
	useEffect(() => {
        if(localData.currentUserInfo[0] === room.admin || localData.currentUserInfo === room.admin) {
            setIsActuallyAdmin(true);
        }
        if(room.actuallyPlaying) {
            document.title = 'En lecture - Room ID:' + roomId + ' - MusicRoom';
        } else {
            document.title = 'Room ID:' + roomId + ' - MusicRoom';
        }
		getRoomData(roomId); // A REPOSITIONNER
    }, [loaded, localData,room]);


    async function handlePlay(playStatus) {
        if(isActuallyAdmin) {
            roomRef.set({actuallyPlaying: playStatus, mediaActuallyPlayingAlreadyPlayed:room.mediaActuallyPlayingAlreadyPlayed}, { merge: true });
        } else {
            if(!localData.synchro) { // if pas synchro et lance la lecture et lecture en cours synchro
                playerRef.current.seekTo(room.mediaActuallyPlayingAlreadyPlayed, 'portion');
                localData.synchro = true;
            }
        }
    }
    
    async function handleNonAdminPlay() {
    }


    async function handleReady() {
        playerRef.current.seekTo(room.mediaActuallyPlayingAlreadyPlayed, 'seconds');
        if(isActuallyAdmin) {
            setLocalVolume(0.5);
        }
     //   room.mediaActuallyPlayingAlreadyPlayed = 40;
//        room.set({actuallyPlaying:true});
    //    console.log(playerRef.current.getSecondsLoaded());
    }

    function handleMediaEnd() {
        if(room.playlistUrls[room.playing+1]) {
            handleChangeActuallyPlaying(room.playing+1);
        } else {
            handlePlay(false);
        }
    }
  
    function handleChangeActuallyPlaying(numberToPlay) {
        if(isActuallyAdmin) {
            roomRef.set({playing: numberToPlay, actuallyPlaying:true,mediaActuallyPlayingAlreadyPlayed: 0}, { merge: true });
            
        }
    }

    function setPercentagePlayed(percentagePlayed) {
        roomRef.set({mediaActuallyPlayingAlreadyPlayed: percentagePlayed}, { merge: true });
        playerRef.current.seekTo(percentagePlayed, 'seconds');
    }

    function handleProgress(event) {
        if(room.actuallyPlaying) {
            if(isActuallyAdmin) {
            //    room.mediaActuallyPlayingAlreadyPlayed = ;
                roomRef.set({mediaActuallyPlayingAlreadyPlayed: Math.round(event.played*100) }, { merge: true });
            } 
        }
    }

    function handleVolumeChange(e) {
        setLocalVolume(e.target.value);
    }

    function handleFullScreen() {
        //findDOMNode(playerRef).requestFullscreen();
    }

// NEW FUNCTIONS FROM CHILD COMP
    function handleAddValidatedObjectToPlaylist(validatedObjectToAdd) {
        room.playlistUrls.push(validatedObjectToAdd);
        room.playlistEmpty = false;
        roomRef.set({playlistUrls: room.playlistUrls, playlistEmpty: false}, { merge: true });
    }

    function handleChangeIdActuallyPlaying(newIdToPlay) {
        if(isActuallyAdmin) {
            room.mediaActuallyPlayingAlreadyPlayed = 0;
            roomRef.set({playing: newIdToPlay, mediaActuallyPlayingAlreadyPlayed: 0}, { merge: true });
        }
    }

    function handleOpenShareModal(ShareModalIsOpen) {
        setOpenInvitePeopleToRoomModal(ShareModalIsOpen);
    }
  

  return (
    <div className="flex flex-col w-full gap-0 relative " style={{height:'calc(100vh - 10em)'}}>
        <RoomTopBar localData={localData} roomId={roomId} handleOpenShareModal={handleOpenShareModal} roomAdmin={room.admin}/>
        <Container maxWidth="sm" sx={{ padding: '0 !important'}} >
            { !<ActuallyPlaying roomRef={roomRef}/>}
            {loaded && room.playlistUrls && <div> 
                {!room.playlistEmpty && room.playlistUrls.length > 0 && room.playing !== null && 
                    <Box sx={{bgcolor:'#303030',borderBottom: '2px solid #3e464d', padding:"0px 0em"}}>
                        <Grid container spacing={0} sx={{ bgcolor:'#262626',}}>
                            <Grid item sm={4} xs={12} sx={{ pl:0,ml:0, pt: 0, position:'relative'}}>
                                {isActuallyAdmin && <ReactPlayer sx={{ padding:0}}
                                    ref={playerRef}
                                    className='react-player'
                                    width='100%'
                                    pip={true}
                                    height='100%'
                                    volume={localVolume}
                                    onProgress={e => handleProgress(e)}
                                    progressInterval = {2000}
                                    //onStart={e => handlePlay(true)}
                                    onReady={e => handleReady()}
                                    onPlay={e => handlePlay(true)}
                                    onPause={e => handlePlay(false)}
                                    onEnded={e => handleMediaEnd()}
                                    url={room.playlistUrls[room.playing].url}
                                    playing={room.actuallyPlaying} // is player actually playing
                                    controls={false}
                                    light={false}
                                    config={{
                                        youtube: {
                                            playerVars: { showinfo: 0, preload:1 }
                                        }
                                    }}
                                />}
                                {!isActuallyAdmin && <ReactPlayer sx={{ padding:0}}
                                    ref={playerRef}
                                    className='react-player'
                                    width='100%'
                                    pip={true}
                                    height='100%'
                                    volume={localVolume}
                                    onPlay={e => handleNonAdminPlay()}
                                    onReady={e => handleReady()}
                                    url={room.playlistUrls[room.playing].url}
                                    playing={room.actuallyPlaying} // is player actually playing
                                    controls={false}
                                    light={false}
                                    config={{
                                        youtube: {
                                            playerVars: { showinfo: 0, preload:1 }
                                        }
                                    }}
                                />}
                                {isActuallyAdmin && <div style={{width:'100%',height:'100%',opacity:0,top:0,position:'absolute'}}></div>}
                            </Grid>
                            <Grid item sm={8} xs={12} sx={{ padding:0,pl:0,ml:0, mb: 0,pt:0,height:'100%', color:'white' }}>
                                <Grid item sm={12} sx={{ padding:0,pl:1.5,ml:0, mb: 0 , mt:1, fill:'#f0f1f0'}}>
                                    { room.playlistUrls[room.playing].title && <Typography component={'span'} sm={12} >
                                       {room.playlistUrls[room.playing].title}
                                    </Typography>}
                                    { room.playlistUrls[room.playing].url && room.playlistUrls[room.playing].url.length == 0 || !room.playlistUrls[room.playing].title && <Typography component={'span'} sm={12} >
                                        {room.playlistUrls[room.playing].url.substring(0, 50)+'...'} 
                                    </Typography>}
                                    <Typography sx={{ ml:0, mb: 0, fontSize: '10px', textTransform:'uppercase' }}>
                                        Source : { room.playlistUrls[room.playing].source }
                                    </Typography>
                                    <Typography sx={{ ml:0, mb: 1.5, fontSize: '10px', textTransform:'uppercase' }}>
                                        Ajouté par : { room.playlistUrls[room.playing].addedBy }
                                    </Typography>
                                </Grid>
                                <Grid item sm={12} sx={{ padding:0,pl:1.5,ml:0, mb: 0 , mt:1, fill:'#f0f1f0'}}>
                                    {isActuallyAdmin && <Grid item sm={12} sx={{ display:'flex',justifyContent: 'space-between', padding:0,pt:1,ml:0,mr:1,pr:2, mb: 1.5 }}>
                                        {room.playing > 0 && <IconButton onClick={e => handleChangeActuallyPlaying(room.playing - 1)}>
                                            <SkipPreviousIcon fontSize="large" sx={{color:'#f0f1f0'}} />
                                        </IconButton>}
                                        { room.actuallyPlaying && <IconButton variant="contained" onClick={e => handlePlay(false)} >
                                            <PauseCircleOutlineIcon fontSize="large" sx={{color:'#f0f1f0'}} />
                                        </IconButton>}
                                        { !room.actuallyPlaying && <IconButton variant="contained" onClick={e => handlePlay(true)} >
                                            <PlayCircleOutlineIcon fontSize="large" sx={{color:'#f0f1f0'}}/>
                                        </IconButton>}
                                        {(room.playlistUrls.length -1) !== room.playing && <IconButton onClick={e => handleChangeActuallyPlaying(room.playing + 1)}>
                                            <SkipNextIcon fontSize="large" sx={{color:'#f0f1f0'}} />
                                        </IconButton>}
                                        <IconButton onClick={e => setPercentagePlayed(0)} >
                                            <SettingsBackupRestoreIcon fontSize="large" sx={{color:'#f0f1f0'}} />
                                        </IconButton>
                                        {<IconButton onClick={e => handleChangeActuallyPlaying(0)}>
                                             <RestartAltIcon fontSize="large" sx={{color:'#f0f1f0'}} />
                                        </IconButton>}
                                        
                                    </Grid>}
                                    <Grid item sm={12} sx={{ pt:0,pl:2,pr:2,ml:0, mb: 0, pb:1, mt:3 }}>
                                        <Stack spacing={2} sm={8} direction="row" sx={{ mb: 1, mr:2 }} alignItems="center">
                                            <VolumeDown />
                                            <Slider step={0.01} min={0}  max={1} aria-label="Volume" value={localVolume} onChange={e => handleVolumeChange(e)} />
                                            <VolumeUp />
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                }
                <Toolbar xs={12} sx={{ bgcolor: '#262626',borderBottom: '2px solid #3e464d', minHeight: '45px !important', fontFamily: 'Monospace', pl:'5px', pr:'25 px' }}>
                <Typography component="div" sx={{ flexGrow: 1, textTransform:'uppercase', fontSize:'12px', color:'white' }}> Playlist <span> ({ room.playlistUrls && room.playlistUrls.length } médias en playlist)</span>
                </Typography>
                </Toolbar>
                { room.playlistEmpty && 
                    <Alert severity="success" sx={{margin:2, border:'1px solid #F27C24'}}> Bienvenue dans la room ! <a href="#" onClick={(e) => setOpenAddToPlaylistModal(true)} ><b>Ajoutez quelque chose dans la playlist !</b></a></Alert>
                }
                {typeof(room.playlistUrls) !== 'undefined' && room.playlistUrls && room.playlistUrls.length > 0 && <Box sx={{ padding:"0em",marginBottom:2, paddingLeft:0}}>
                    <RoomPlaylist roomPlaylist={room.playlistUrls} roomIdActuallyPlaying={room.playing} handleChangeIdActuallyPlaying={handleChangeIdActuallyPlaying} roomIsActuallyPlaying={room.actuallyPlaying} roomPlayedActuallyPlayed={room.mediaActuallyPlayingAlreadyPlayed} />
                </Box>}
            </div>
            } 
        </Container>
        <Dialog onClose={(e) => setOpenAddToPlaylistModal(false)} open={OpenAddToPlaylistModal}>
            <RoomModalAddMedia validatedObjectToAdd={handleAddValidatedObjectToPlaylist}  /> 
        </Dialog>
        
        <Dialog onClose={(e) => setOpenInvitePeopleToRoomModal(false)} open={OpenInvitePeopleToRoomModal}>
            <ModalShareRoom roomUrl={ localData.domain +'/?rid='+roomId}/>
        </Dialog>
        <Grid item xs={3} sx={{position:'fixed', width:'250px', left:'calc(50% - 125px)', bottom:'20px', zIndex:3}}>
            <Fab variant="extended" style={{justifyContent: 'center'}} onClick={(e) => setOpenAddToPlaylistModal(true)}>
                <SpeedDialIcon sx={{ mr: 1 }} />
                Ajouter à la playlist
            </Fab>
        </Grid>  
    </div>
  );
};

export default Room;
