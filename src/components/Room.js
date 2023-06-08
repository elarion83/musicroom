'use client';

import React, { useState, useEffect, useRef, useCallback} from "react";
import { db } from "../services/firebase";

import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Dialog from '@mui/material/Dialog';
import ReactPlayer from 'react-player';
import Tooltip from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import TuneIcon from '@mui/icons-material/Tune';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import ShareIcon from '@mui/icons-material/Share';
import AppBar from '@mui/material/AppBar';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import Alert from '@mui/material/Alert';
import 'animate.css';
import SpotifyPlayer from 'react-spotify-web-playback';
import useKeypress from 'react-use-keypress';


import Fab from '@mui/material/Fab';
import Stack from '@mui/material/Stack';
//import screenfull from 'screenfull'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Notifications from './rooms/Notifications';
import FirstPageIcon from '@mui/icons-material/FirstPage';

import FavoriteIcon from '@mui/icons-material/Favorite';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import CelebrationIcon from '@mui/icons-material/Celebration';
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
import RoomTopBar from "./general_template/RoomTopBar";
import ModalRoomParams from '../components/rooms/ModalRoomParams'
import { TransitionProps } from '@mui/material/transitions';

import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import zIndex from "@mui/material/styles/zIndex";
const Room = ({ roomId }) => {


    const [localData, setLocalData] = useState({domain:window.location.hostname, synchro:false, currentUserVotes:{up:[], down:[]}, currentUserInfo: useState(localStorage.getItem("MusicRoom_UserInfoPseudo")) });
	const [loaded, setLoaded] = useState(false);
	const [room, setRoom] = useState({});
    const [OpenInvitePeopleToRoomModal, setOpenInvitePeopleToRoomModal] = useState(false);
    const [OpenAddToPlaylistModal, setOpenAddToPlaylistModal] = useState(false);
    const [openRoomParamModal, setOpenRoomParamModal] = useState(false);
    const [localVolume, setLocalVolume] = useState(0);
    const [pip, setPip] = useState(true);
	const roomRef = db.collection("rooms").doc(roomId.toLowerCase());
    const [userCanMakeInteraction, setUserCanMakeInteraction]= useState(true);
    const [openLeaveRoomModal, setOpenLeaveRoomModal] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [playerReady, setPlayerReady] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [spotifyPlayerShow, setSpotifyPlayerShow] = useState(true);
    const onScroll = (e) => {
        setScrollPosition(e.target.documentElement.scrollTop);
    }
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
                        notifsArray:[],
                        roomParams:{
                            isPrivate:false,
                            isOnInvitation:false,
                            isPlayingLooping:true,
                            allowEverybodyToAddMedia:true,
                            interactionsAllowed:true,
                            interactionFrequence:20000,
                            spotifyIsLinked:false,
                            spotifyToken:'',
                            spotifyTokenTimestamp:0,
                            spotifyUserConnected:''
                            },
                        interactionsArray:[],
                        creationTimeStamp	: Date.now()
                    };
                    db.collection("rooms").doc(roomId.toLowerCase()).set(docData).then(() => {});
                    setRoom(docData);
                }
            });
            setLoaded(true);
	};

    useKeypress([' '], () => {
        if(room) {
            handlePlay(!room.actuallyPlaying);
        }
    });

	useEffect(() => {
		getRoomData(roomId); 
        
        if(null === localStorage.getItem("MusicRoom_UserInfoVotes")) {
            localStorage.setItem("MusicRoom_UserInfoVotes", JSON.stringify({up:[], down:[]}));
        } else {
            localData.currentUserVotes = JSON.parse(localStorage.getItem("MusicRoom_UserInfoVotes"));
        }

        document.title = 'Room ID:' + roomId + ' - MusicRoom';
        
	}, [roomId]);
    
	useEffect(() => {
    }, [scrollPosition]);

	useEffect(() => {
        if(localData.currentUserInfo[0] === room.admin || localData.currentUserInfo === room.admin) {
            setIsActuallyAdmin(true);
        }
        if(room.actuallyPlaying) {
            document.title = 'En lecture - Room ID:' + roomId + ' - MusicRoom';
        } else {
            document.title = 'Room ID:' + roomId + ' - MusicRoom';
        }

        if(room.interactionsArray && room.interactionsArray.length > 0) {
            room.interactionsArray.forEach(function (item, index, object) {
                if(Date.now() - item.timestamp < 10000) { 
                    createInteractionAnimation(item.type);
                }
            });
        }
		getRoomData(roomId); 
    }, [loaded, localData,room]);

    async function handlePlay(playStatus) {
        console.log(room.roomParams.spotifyTokenTimestamp);
        if(room.roomParams.spotifyTokenTimestamp.length >= 1 && (Date.now() - room.roomParams.spotifyTokenTimestamp) > 3600000) {
            disconnectSpotify();
        }
        if(isActuallyAdmin) {
            roomRef.set({actuallyPlaying: playStatus, mediaActuallyPlayingAlreadyPlayed:room.mediaActuallyPlayingAlreadyPlayed}, { merge: true });
        } else {
            if(!localData.synchro) { // if pas synchro et lance la lecture et lecture en cours synchro
                playerRef.current.seekTo(room.mediaActuallyPlayingAlreadyPlayed, 'portion');
                localData.synchro = true;
            }
        }
    }

    async function disconnectSpotify() {
        roomRef.set({roomParams:{spotifyToken: '',spotifyIsLinked:false, spotifyTokenTimestamp: Date.now(), spotifyUserConnected:''}}, { merge: true });
    }

    async function handleNonAdminPlay() {
    }

    async function createInteractionAnimation(type) {
        var n = 0;
        while(n < 1) {
            const interactionDisplay = document.createElement("img");
            interactionDisplay.src = "img/"+type+".png";
            interactionDisplay.classList.add("interactionImageContainer");
            interactionDisplay.style.left = Math.random() * 100 + "vw";
            interactionDisplay.style.animationDuration = Math.random() * 5 + 3 + "s ";
            document.body.appendChild(interactionDisplay);
            setTimeout(() => {
                interactionDisplay.remove();
            }, 1000);
            n++
        }
    }

    async function createNewRoomInteraction(type) {
        
		getRoomData(roomId); 
        room.interactionsArray.push({timestamp:Date.now(), type:type, createdBy: localData.currentUserInfo[0]});
        roomRef.update({interactionsArray: room.interactionsArray});

        setUserCanMakeInteraction(false);
        await delay(room.roomParams.interactionFrequence);
        setUserCanMakeInteraction(true);
    }

    async function handleReady() {
        setPlayerReady(true);
        playerRef.current.seekTo(room.mediaActuallyPlayingAlreadyPlayed, 'seconds');
        if(isActuallyAdmin) {
            setLocalVolume(0.5);
        }
    }

    function handleMediaEnd() {
        if(room.playlistUrls[room.playing+1]) {
            handleChangeActuallyPlaying(room.playing+1);
        } else {
            if(room.roomParams.isPlayingLooping) {
                handleChangeActuallyPlaying(0);
            }
        }
    }
  
    function handleChangeActuallyPlaying(numberToPlay) {
        if(room.playlistUrls[numberToPlay]) {
            if(isActuallyAdmin) {
                if(room.playlistUrls[numberToPlay].source == 'spotify' && !room.roomParams.spotifyIsLinked ) {
                    handleChangeActuallyPlaying(numberToPlay+1);
                } else {
                    roomRef.set({playing: numberToPlay, actuallyPlaying:true,mediaActuallyPlayingAlreadyPlayed: 0}, { merge: true });   
                }
            }
        } else {
            if(room.roomParams.isPlayingLooping) {
                roomRef.set({playing: 0, actuallyPlaying:true,mediaActuallyPlayingAlreadyPlayed: 0}, { merge: true });
            } else {    
                roomRef.set({actuallyPlaying:false}, { merge: true });
            }
        }
    }

    function setPercentagePlayed(percentagePlayed) {
        roomRef.set({mediaActuallyPlayingAlreadyPlayed: percentagePlayed}, { merge: true });
        playerRef.current.seekTo(percentagePlayed, 'seconds');
    }

    function handleFastForward(percentagePlayed, room) {
   //     room.mediaActuallyPlayingAlreadyPlayed = percentagePlayed;
  //      setPercentagePlayed(room.mediaActuallyPlayingAlreadyPlayed);
    }

    function handleProgress(event) {
        if(room.actuallyPlaying) {
            if(isActuallyAdmin) {
                roomRef.set({mediaActuallyPlayingAlreadyPlayed: Math.round(event.played*100) }, { merge: true });
            } 
        }
    }

    function handleVolumeChange(e) {
        setLocalVolume(e.target.value);
    }

    
    function handleQuitRoom() {
        if(localStorage.getItem("MusicRoom_RoomId")) {
            
            localStorage.removeItem("MusicRoom_SpotifyToken");
            localStorage.removeItem("MusicRoom_RoomId");
            window.location.reload(false);
        } 
        window.location.href = "/";
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

    function handleVoteChange(idMedia, NewValue, mediaHashId, voteType) {
        room.playlistUrls[idMedia].vote = NewValue;

        if('up' == voteType) {
            if(!localData.currentUserVotes.up.includes(mediaHashId)) {
                localData.currentUserVotes.up.push(mediaHashId);
                roomRef.set({playlistUrls: room.playlistUrls}, { merge: true });
                localStorage.setItem("MusicRoom_UserInfoVotes",  JSON.stringify(localData.currentUserVotes));
            }
        }
        else {
            if(!localData.currentUserVotes.down.includes(mediaHashId)) {
                localData.currentUserVotes.down.push(mediaHashId);
                roomRef.set({playlistUrls: room.playlistUrls}, { merge: true });
                localStorage.setItem("MusicRoom_UserInfoVotes",  JSON.stringify(localData.currentUserVotes));
            }
        }
    }

    useEffect(() => {
        const hash = window.location.hash

        if (hash) {
            var token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]
            
            window.location.hash = ""
            window.localStorage.setItem("MusicRoom_SpotifyToken", token)
            handleChangeSpotifyToken(token)
        }
    }, [])


    async function handleChangeSpotifyToken(newToken) {
        roomRef.set({roomParams:{spotifyToken: newToken,spotifyIsLinked:true, spotifyTokenTimestamp: Date.now(), spotifyUserConnected:localStorage.getItem("MusicRoom_UserInfoPseudo")}}, { merge: true });
        
        await delay(2000);
        window.location.href = "/?rid="+roomId.replace(/\s/g,'');
    }



    function handleOpenShareModal(ShareModalIsOpen) {
        setOpenInvitePeopleToRoomModal(ShareModalIsOpen);
    }

    function handleOpenRoomParamModal(roomParamModalIsOpen) {
        setOpenRoomParamModal(roomParamModalIsOpen);
    }

    function handleOpenLeaveRoomModal(leaveRoomModalIsOpen) {
        setOpenLeaveRoomModal(leaveRoomModalIsOpen);
    }

    // display function
    function formatNumberToMinAndSec(number) {
        
        var minute = ~~(Math.round(number)/60)+'m';
        var seconde = Math.round(number)%60+'s';
        
        return minute+' '+seconde;
    }

    function handleUpdateRoomParams(newParams) {

        console.log(newParams);
    }

    const [spotifyEndSwitchTempFix, setSpotifyEndSwitchTempFix] = useState(true);
    function SpotifyPlayerCallBack(e){
        if(e.type == 'player_update') {
            if(e.previousTracks[0] && (e.track.id === e.previousTracks[0].id)) {
                if((e.track.uri !== room.playlistUrls[room.playing].source) && spotifyEndSwitchTempFix) {
                    setSpotifyPlayerShow(false);
                    setSpotifyEndSwitchTempFix(false);
                    handleChangeActuallyPlaying(room.playing+1);
                    setSpotifyPlayerShow(true);
                } else {
                    setSpotifyEndSwitchTempFix(true);
                }
            } 
        }
    }
  // transitions
  return (
    <div className="flex flex-col w-full gap-0 relative " style={{height:'auto'}} >
        {loaded && room.roomParams !== undefined && <RoomTopBar localData={localData} roomId={roomId} roomAdmin={room.admin} isLinkedToSpotify={room.roomParams.spotifyIsLinked}/>}
        <Container maxWidth={false} sx={{ padding: '0 !important'}} >
            { !<ActuallyPlaying roomRef={roomRef}/>}
            {loaded && room.playlistUrls && <div> 
                {!room.playlistEmpty && room.playlistUrls.length > 0 && room.playing !== null && 
                    <Box sx={{bgcolor:'#303030',borderBottom: '2px solid #3e464d', padding:"0px 0em"}}>
                        <Grid container spacing={0} sx={{ bgcolor:'#262626',}}>

                            <Grid item className={isFullScreen ? 'fullscreen' : ''} sm={(room.playlistUrls[room.playing].source == 'spotify') ? 12 : 4} xs={12} sx={{ pl:0,ml:0, pt: 0, position:'relative'}}>
                                {spotifyPlayerShow && isActuallyAdmin && room.playlistUrls[room.playing].source == 'spotify' &&
                                    <SpotifyPlayer
                                        callback={SpotifyPlayerCallBack}
                                        token={room.roomParams.spotifyToken}
                                        uris={room.playlistUrls[room.playing].url}
                                        play={room.actuallyPlaying}
                                        inlineVolume={localVolume}
                                        styles={{
                                            activeColor: '#b39f74',
                                            bgColor: '#262626',
                                            loaderColor: '#b39f74',
                                            sliderColor: '#ff5722',
                                            trackArtistColor: '#262626',
                                            trackNameColor: '#262626',
                                        }}
                                    />}
                                {!isActuallyAdmin && room.playlistUrls[room.playing].source == 'spotify' &&
                                    <Alert severity="warning" sx={{margin:2, border:'1px solid #F27C24'}}> Le lecteur Spotify n'est visible que par l'host de la room. <a href="#" onClick={(e) => setOpenAddToPlaylistModal(true)} ><b>Ajoute quelque chose dans la playlist en attendant !</b></a></Alert>
                                }
                                {isActuallyAdmin && room.playlistUrls[room.playing].source != 'spotify'  && <ReactPlayer sx={{ padding:0}}
                                    ref={playerRef}
                                    className='react-player'
                                    width='100%'
                                    pip={pip}
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
                                {!isActuallyAdmin && room.playlistUrls[room.playing].source != 'spotify'  && <ReactPlayer sx={{ padding:0}}
                                    ref={playerRef}
                                    className='react-player'
                                    width='100%'
                                    pip={pip}
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
                            <Grid item sm={(room.playlistUrls[room.playing].source == 'spotify') ? 12 : 8} xs={12} sx={{ padding:0,pl:0,ml:0, mb: 0,pt:0,height:'100%', color:'white' }} className={`player_right_side_container ${(room.playlistUrls[room.playing].source == 'spotify') ? "spotify_header" : ""}`}>
                                { /* pip ? 'Disable PiP' : 'Enable PiP' */ }
                                <Grid item sm={12} sx={{ padding:0,pl:1.5,ml:0, mb: 0 , mt:1, fill:'#f0f1f0'}}>
                                    { room.playlistUrls[room.playing].title && <Typography component={'span'} sm={12} >
                                       {room.playlistUrls[room.playing].title}
                                    </Typography>}
                                    
                                    <Typography sx={{ display:'block', width:'100%',ml:0, mb: 0, fontSize: '10px', textTransform:'uppercase' }}>
                                        {room.actuallyPlaying ? 'En lecture' : 'En pause'}
                                    </Typography>
                                    { room.playlistUrls[room.playing].url && room.playlistUrls[room.playing].url.length == 0 || !room.playlistUrls[room.playing].title && <Typography component={'span'} sm={12} >
                                        {room.playlistUrls[room.playing].url.substring(0, 50)+'...'} 
                                    </Typography>}
                                    {playerReady && playerRef.current !== null && room.playlistUrls[room.playing].source !== 'spotify' && <Typography sx={{ ml:0, mb: 1}}> {~~(Math.round(playerRef.current.getCurrentTime())/60) + 'm'+Math.round(playerRef.current.getCurrentTime()) % 60+ 's / ' + formatNumberToMinAndSec(playerRef.current.getDuration())}</Typography>}
                                    <Typography sx={{ ml:0, mb: 0, fontSize: '10px', textTransform:'uppercase' }}>
                                        Source : { room.playlistUrls[room.playing].source }
                                    </Typography>
                                    <Typography sx={{ ml:0, mb: 1.5, fontSize: '10px', textTransform:'uppercase' }}>
                                        Ajouté par : { room.playlistUrls[room.playing].addedBy }
                                    </Typography>
                                </Grid> 
                                <Grid className='player_button_container' item sm={12} sx={{ padding:0,pl:1.5,ml:0, pr:1.5,mb: 0 , mt:1, fill:'#f0f1f0'}}   >
                                    {isActuallyAdmin && <Grid item sm={12} sx={{ display:'flex',justifyContent: 'space-between', padding:0,pt:1,ml:0,mr:1,pr:2, mb: 1.5 }}>
                                        
                                        {room.playing > 0 && <IconButton onClick={e => handleChangeActuallyPlaying(0)}>
                                             <FirstPageIcon  fontSize="large" sx={{color:'#f0f1f0'}} />
                                        </IconButton>}
                                        {room.playing == 0 && <IconButton>
                                             <FirstPageIcon  fontSize="large" sx={{color:'#303134'}} />
                                        </IconButton>}
                                        
                                        {room.playing > 0 && <IconButton onClick={e => handleChangeActuallyPlaying(room.playing - 1)}>
                                            <SkipPreviousIcon fontSize="large" sx={{color:'#f0f1f0'}} />
                                        </IconButton>}
                                        {room.playing == 0 &&<IconButton>
                                            <SkipPreviousIcon fontSize="large" sx={{color:'#303134'}} />
                                        </IconButton>}
                                        { room.actuallyPlaying && <IconButton variant="contained" onClick={e => handlePlay(false)}sx={{position:'sticky', top:0, zIndex:2500}} >
                                            <PauseCircleOutlineIcon fontSize="large" sx={{color:'#f0f1f0'}} />
                                        </IconButton>}
                                        { !room.actuallyPlaying && <IconButton variant="contained" onClick={e => handlePlay(true)} sx={{position:'sticky', top:0, zIndex:2500}}>
                                            <PlayCircleOutlineIcon fontSize="large" sx={{color:'#f0f1f0'}}/>
                                        </IconButton>}
                                        {(room.playlistUrls.length -1) !== room.playing && <IconButton onClick={e => handleChangeActuallyPlaying(room.playing + 1)}>
                                            <SkipNextIcon fontSize="large" sx={{color:'#f0f1f0'}} />
                                        </IconButton>}
                                        {(room.playlistUrls.length -1) == room.playing && <IconButton>
                                            <SkipNextIcon fontSize="large" sx={{color:'#303134'}} />
                                        </IconButton>}

                                        
                                        {room.playlistUrls[room.playing].source === 'spotify' &&
                                            <IconButton>
                                                <SettingsBackupRestoreIcon fontSize="large" sx={{color:'#303134'}} />
                                            </IconButton>
                                        }
                                        {room.playlistUrls[room.playing].source !== 'spotify' &&
                                            <IconButton onClick={e => setPercentagePlayed(0)} >
                                                <SettingsBackupRestoreIcon fontSize="large" sx={{color:'#f0f1f0'}} />
                                            </IconButton>
                                        }
                                        {isFullScreen &&
                                            <IconButton onClick={e => setIsFullScreen(true)} >
                                                <SettingsBackupRestoreIcon fontSize="large" sx={{color:'#f0f1f0'}} />
                                            </IconButton>
                                        }
                                    </Grid>}
                                    {room.playlistUrls[room.playing].source !== 'spotify' && <Grid item sm={12} sx={{ pt:0,pl:2,pr:2,ml:0, mb: 0, pb:1, mt:3 }}>
                                        <Stack spacing={2} sm={8} direction="row" sx={{ mb: 1, mr:2 }} alignItems="center">
                                            <VolumeDown />
                                            <Slider step={0.01} min={0}  max={1} aria-label="Volume" value={localVolume} onChange={e => handleVolumeChange(e)} />
                                            <VolumeUp />
                                        </Stack>
                                        
                                        {isFullScreen &&
                                            <IconButton onClick={e => setIsFullScreen(true)} >
                                                <SettingsBackupRestoreIcon fontSize="large" sx={{color:'#f0f1f0'}} />
                                            </IconButton>
                                        }
                                    </Grid> }
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                }
                <Toolbar xs={12} sx={{ bgcolor: '#262626',borderBottom: '2px solid #3e464d', minHeight: '45px !important', fontFamily: 'Monospace', pl:'17px', pr:'25 px' }}>
                <Typography component="div" sx={{ flexGrow: 1, textTransform:'uppercase', fontSize:'12px', color:'white' }}> Playlist <b><span> ({ room.playlistUrls && room.playlistUrls.length } médias en playlist)</span></b>
                </Typography>
                </Toolbar>
                { room.playlistEmpty && 
                    <Alert severity="success" sx={{margin:2, border:'1px solid #F27C24'}}> Bienvenue dans la room ! <a href="#" onClick={(e) => setOpenAddToPlaylistModal(true)} ><b>Ajoute quelque chose dans la playlist !</b></a></Alert>
                }
                {typeof(room.playlistUrls) !== 'undefined' && room.playlistUrls && room.playlistUrls.length > 0 && <Box sx={{ padding:"0em",marginBottom:0, paddingLeft:0}}>
                    <RoomPlaylist isAdminView={isActuallyAdmin} roomPlaylist={room.playlistUrls} roomIdActuallyPlaying={room.playing} userVoteArray={localData.currentUserVotes} handleChangeIsActuallyPlaying={handlePlay} handleChangeIdActuallyPlaying={handleChangeIdActuallyPlaying}  handleVoteChange={handleVoteChange} roomIsActuallyPlaying={room.actuallyPlaying} roomPlayedActuallyPlayed={room.mediaActuallyPlayingAlreadyPlayed} />
                </Box>}
            </div>
            } 
        </Container>
        <Dialog fullScreen open={OpenAddToPlaylistModal} keepMounted onClose={(e) => setOpenAddToPlaylistModal(false)} className='black_style_dialog' >
            
            <Grid sx={{bgcolor:'#202124', pb:0 , flexFlow: 'nowrap'}} container>
                <Button 
                    className='modal_full_screen_close_left'
                    onClick={(e) => setOpenAddToPlaylistModal(false)}
                    aria-label="close"
                    sx={{bgcolor:'#131416', mr:2,borderRadius:0}}
                    xs={12}
                >
                    <ArrowBackIosNewIcon sx={{fontSize:'2em', color:'#b39f74', fill:'#b39f74'}} className='animate__animated animate__fadeInLeft animate__fast' />
                </Button >
                {room.playlistEmpty && <Box sx={{display:'flex',flexDirection:'column', padding:'1em'}}>
                    <Typography component="span"> Playlist vide </Typography>
                    <Typography sx={{color:'#d5cdcd', display:'block', width:'100%',ml:0, fontSize: '12px', textTransform:'uppercase' }} > Room n° { roomId }</Typography>
                </Box>}
                {typeof(room.playlistUrls) !== 'undefined' && loaded && !room.playlistEmpty && <Box sx={{display:'flex',flexDirection:'column',padding:'1em'}}>
                    <Typography sx={{color:'#d5cdcd', display:'block', width:'100%',ml:0, fontSize: '12px', textTransform:'uppercase' }} > Room n° { roomId }</Typography>
                    {room.playlistEmpty && <Typography component="span" sx={{color:'#d5cdcd', display:'block', width:'100%',ml:0, fontSize: '10px', textTransform:'uppercase' }}>  Playlist vide </Typography>}
                    <Typography sx={{color:'#d5cdcd', display:'block', width:'100%',ml:0, fontSize: '10px', textTransform:'uppercase' }} >{room.actuallyPlaying ? 'En lecture ' : 'En pause :'} <span>{ room.playlistUrls[room.playing].title ? room.playlistUrls[room.playing].title : room.playlistUrls[room.playing].url.substring(0,25)+'..' }</span></Typography>
                </Box>}
            </Grid>
            {OpenAddToPlaylistModal && <RoomModalAddMedia roomId={roomId} spotifyTokenProps={room.roomParams.spotifyToken} handleChangeSpotifyToken={handleChangeSpotifyToken} validatedObjectToAdd={handleAddValidatedObjectToPlaylist} /> }
        </Dialog>
        <Dialog onClose={(e) => setOpenInvitePeopleToRoomModal(false)} open={OpenInvitePeopleToRoomModal}>
            <ModalShareRoom roomUrl={ localData.domain +'/?rid='+roomId} />
        </Dialog>
        
        {loaded && room.roomParams && <Dialog onClose={(e) => setOpenRoomParamModal(false)} open={openRoomParamModal}>
            <ModalRoomParams  roomParams={room.roomParams} spotifyTokenProps={room.roomParams.spotifyToken} />
        </Dialog>} 

        <Dialog open={openLeaveRoomModal} keepMounted onClose={(e) => setOpenLeaveRoomModal(false)} >
            
            <DialogTitle id="alert-dialog-title">
                Quitter la room ?
            </DialogTitle>
            <DialogContent>
                <DialogContentText >
                Vous êtes sur le point de quitter la room pour retourner à l'accueil.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={(e) => handleQuitRoom(false)}>
                    Quitter
                </Button>
                <Button variant="outlined" onClick={(e) => setOpenLeaveRoomModal(false)} autoFocus>
                    Rester
                </Button>
            </DialogActions>
        </Dialog>


        {loaded && room.roomParams && <Grid className='room_bottom_interactions' item xs={3}>
            <Tooltip className='animate__animated animate__fadeInUp animate__delay-2s animate__faster' title={!userCanMakeInteraction ? "Toutes les "+  (room.roomParams.interactionFrequence/1000) +" secondes": ''}>  
                <Fab size="small" variant="extended" className='room_small_button_interactions' sx={{ mr:1, ...(userCanMakeInteraction && {bgcolor: 'orange'}) }} onClick={(e) => userCanMakeInteraction ? createNewRoomInteraction('laugh') : ''}>
                    <EmojiEmotionsIcon fontSize="small" sx={{color:'white'}} />
                    {!userCanMakeInteraction && <HourglassBottomIcon className="icon_overlay"/>}
                </Fab>
            </Tooltip>
            <Tooltip className='animate__animated animate__fadeInUp animate__delay-2s animate__fast' title={!userCanMakeInteraction ? "Toutes les "+  (room.roomParams.interactionFrequence/1000) +" secondes": ''}>  
                <Fab size="small" variant="extended" className='room_small_button_interactions' sx={{mr:1, ...(userCanMakeInteraction && {bgcolor: '#ff9c22 !important'}) }} onClick={(e) => userCanMakeInteraction ? createNewRoomInteraction('party') : ''}>
                    <CelebrationIcon fontSize="small" sx={{color:'white'}} />
                    {!userCanMakeInteraction && <HourglassBottomIcon className="icon_overlay"/>}
                </Fab>
            </Tooltip>
            <Tooltip className='animate__animated animate__fadeInUp animate__delay-2s' title={!userCanMakeInteraction ? "Toutes les "+  (room.roomParams.interactionFrequence/1000) +" secondes": ''}>  
                <Fab size="small" variant="extended" className='room_small_button_interactions' sx={{ mr:0, ...(userCanMakeInteraction && {bgcolor: '#ff5722 !important'}) }} onClick={(e) => userCanMakeInteraction ? createNewRoomInteraction('heart') : ''}>
                    <FavoriteIcon fontSize="small" sx={{color:'white'}} />
                    {!userCanMakeInteraction && <HourglassBottomIcon className="icon_overlay"/>}
                </Fab>
            </Tooltip>

            <Tooltip className='animate__animated animate__fadeInUp animate__delay-1s' placement="top" open={room && room.playlistEmpty && !OpenAddToPlaylistModal ? true : false} sx={{mt:-2}} title="Ajouter à la playlist" arrow>
                <Fab sx={{width:'56px',height:'56px', transform:'translateY(-20px) !important'}} color="primary" className={`main_bg_color `} aria-label="add" onClick={(e) => setOpenAddToPlaylistModal(true)}>
                    <SpeedDialIcon sx={{color:'white !important'}} className={room && room.playlistEmpty && !OpenAddToPlaylistModal ? 'main_add_media_button' : ''}/>
                </Fab>
            </Tooltip>
            
            <Tooltip className='animate__animated animate__fadeInUp animate__delay-2s' title="Paramètres">  
            <Badge invisible={room.roomParams.spotifyIsLinked} variant="dot" sx={{'& .MuiBadge-badge': {
                    right:'10px',
                    bgcolor:'#ff5722',
                    zIndex:10000
                }}} >
                <Fab size="small" variant="extended" className='room_small_button_interactions'  sx={{justifyContent: 'center', ml:0}} onClick={e => handleOpenRoomParamModal(true)} >
                    <TuneIcon  fontSize="small" />
                </Fab>
            </Badge>
            </Tooltip>
            <Tooltip className='animate__animated animate__fadeInUp animate__delay-2s animate__fast' title="Partager la room">  
                <Fab size="small" variant="extended" className='room_small_button_interactions'  sx={{justifyContent: 'center', ml:1}} onClick={e => handleOpenShareModal(true)} >
                    <ShareIcon  fontSize="small" />
                </Fab>
            </Tooltip>
            <Tooltip className='animate__animated animate__fadeInUp animate__delay-2s animate__faster' title="Quitter la room">  
                <Fab size="small" variant="extended" className='room_small_button_interactions'  sx={{justifyContent: 'center', ml:1}} onClick={e => handleOpenLeaveRoomModal(true)} >
                    <ExitToAppIcon  fontSize="small" />
                </Fab>
            </Tooltip>
            {loaded && room.interactionsArray.length > 0 && <Snackbar
                key = {room.interactionsArray[room.interactionsArray.length-1].timestamp+'_'+room.interactionsArray[room.interactionsArray.length-1].createdBy}
                open={ ((room.interactionsArray[room.interactionsArray.length-1].createdBy !== localData.currentUserInfo) && ((Date.now() - room.interactionsArray[room.interactionsArray.length-1].timestamp) < 1000)) ? true:false}
                autoHideDuration={1000}
                sx={{borderRadius:'2px'}}
                message= {room.interactionsArray[room.interactionsArray.length-1].createdBy +' a réagi :'+room.interactionsArray[room.interactionsArray.length-1].type+':' }
            />}
            <Snackbar
            open={(Date.now() - room.roomParams.spotifyTokenTimestamp) < 8000}
            autoHideDuration={8000}
            sx={{bgcolor:'#2e7d32 !important', borderRadius:'2px'}}
            message={room.roomParams.spotifyIsLinked ? room.roomParams.spotifyUserConnected + " a ajouté Spotify a la room !" : "La connexion spotify a expirée"}
            action = {
                <Button variant="extended" className='room_small_button_interactions' sx={{mr:1, ...(userCanMakeInteraction && {bgcolor: '#ff9c22 !important'}), ...(!room.roomParams.spotifyIsLinked && {display:'none'}) }} onClick={(e) => userCanMakeInteraction ? createNewRoomInteraction('party') : ''}>
                    <CelebrationIcon fontSize="small" sx={{color:'white'}} />
                </Button>
            }
            />
        </Grid>  } 
    </div>
  );
};

export default Room;
