'use client';

import React, { useEffect, useRef, useState } from "react";
import { db } from "../services/firebase";

import { Icon } from '@iconify/react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import 'animate.css';
import ReactPlayer from 'react-player';
import SpotifyPlayer from 'react-spotify-web-playback';
import useKeypress from 'react-use-keypress';

import Stack from '@mui/material/Stack';
//import screenfull from 'screenfull'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';

import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import ReplayIcon from '@mui/icons-material/Replay';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPrevious from '@mui/icons-material/SkipPrevious';
import Typography from '@mui/material/Typography';

import VolumeDown from '@mui/icons-material/VolumeDown';
import VolumeUp from '@mui/icons-material/VolumeUp';
import Slider from '@mui/material/Slider';

import RoomModalAddMedia from './rooms/modalsOrDialogs/ModalAddMedia';
import ModalForceSpotifyDisconnect from "./rooms/modalsOrDialogs/ModalForceSpotifyDisconnect";
import ModalLeaveRoom from './rooms/modalsOrDialogs/ModalLeaveRoom';
import ModalRoomParams from './rooms/modalsOrDialogs/ModalRoomParams';
import ModalShareRoom from './rooms/modalsOrDialogs/ModalShareRoom';

import { AlertTitle, Tooltip } from "@mui/material";
import BottomInteractions from "./rooms/BottomInteractions";
import RoomPlaylist from "./rooms/RoomPlaylist";
import RoomTopBar from "./rooms/RoomTopBar";
import SoundWave from "./rooms/SoundWave";

const Room = ({ currentUser, roomId, handleQuitRoom }) => {

    const REDIRECT_URI = window.location.protocol+'//'+window.location.hostname+(window.location.port ? ":" + window.location.port : '');

    const [localData, setLocalData] = useState({domain:window.location.hostname, synchro:false, currentUserVotes:{up:[], down:[]} });
	const [loaded, setLoaded] = useState(false);
	const [room, setRoom] = useState({});
    const [openInvitePeopleToRoomModal, setOpenInvitePeopleToRoomModal] = useState(false);
    const [OpenAddToPlaylistModal, setOpenAddToPlaylistModal] = useState(false);
    const [openRoomParamModal, setOpenRoomParamModal] = useState(false);
    const [localVolume, setLocalVolume] = useState(0);
    const [pip, setPip] = useState(true);
	const roomRef = db.collection("rooms").doc(roomId);
    const [userCanMakeInteraction, setUserCanMakeInteraction]= useState(true);
    const [openLeaveRoomModal, setOpenLeaveRoomModal] = useState(false);
    const [openForceDisconnectSpotifyModal, setOpenForceDisconnectSpotifyModal] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [playerReady, setPlayerReady] = useState(false);
    const [viewPlayer, setViewPlayer] = useState(true);
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
                        admin:currentUser.displayName,
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
                            spotifyAlreadyHaveBeenLinked:false,
                            spotifyToken:'',
                            spotifyTokenTimestamp:0,
                            spotifyUserConnected:''
                            },
                        interactionsArray:[],
                        creationTimeStamp	: Date.now()
                    };
                    db.collection("rooms").doc(roomId).set(docData).then(() => {});
                    setRoom(docData);
                }
                setLoaded(true);
            });
	};

    useKeypress([' '], () => {
        if(room && !OpenAddToPlaylistModal) {
            handlePlay(!room.actuallyPlaying);
        }
    });

    useKeypress(['Escape'], () => {
        if(isFullScreen) {
            setIsFullScreen(false);
        }
    });

	useEffect(() => {
        
		getRoomData(roomId); 
        localStorage.setItem("MusicRoom_SpotifyRoomId", roomId)
        if(null === localStorage.getItem("MusicRoom_UserInfoVotes")) {
            localStorage.setItem("MusicRoom_UserInfoVotes", JSON.stringify({up:[], down:[]}));
        } else {
            localData.currentUserVotes = JSON.parse(localStorage.getItem("MusicRoom_UserInfoVotes"));
        }

        document.title = 'Room ' + roomId + ' - MusicRoom';

	}, [roomId]);

    useEffect(() => {
        if(loaded) {
            room.notifsArray.push({type: 'userArrived', timestamp: Date.now(), createdBy: currentUser.displayName});
            roomRef.set({notifsArray: room.notifsArray},{merge:true});
        } 
    }, [loaded]);

	useEffect(() => {
        if(currentUser.displayName === room.admin || currentUser.displayName === room.admin) {
            setIsActuallyAdmin(true);
        }
        if(room.actuallyPlaying) {
            document.title = 'En lecture - Room ' + roomId + ' - MusicRoom';
        } else {
            document.title = 'Room ' + roomId + ' - MusicRoom';
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
        if((typeof(room.roomParams.spotifyTokenTimestamp) === 'number' && room.roomParams.spotifyTokenTimestamp > 0) && ((Date.now() - room.roomParams.spotifyTokenTimestamp) > 3600000)) {   
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
        setOpenForceDisconnectSpotifyModal(false);
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
        room.interactionsArray.push({timestamp:Date.now(), type:type, createdBy: currentUser.displayName});
        roomRef.update({interactionsArray: room.interactionsArray});

        setUserCanMakeInteraction(false);
        await delay(room.roomParams.interactionFrequence);
        setUserCanMakeInteraction(true);
    }

    async function handleReady() {
        setPlayerReady(true);
        playerRef.current.seekTo(room.mediaActuallyPlayingAlreadyPlayed, 'seconds');
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

    async function isSpotifyAndIsNotPlayableBySpotify(numberToPlay, spotifyIsLinked) {
        if(room.playlistUrls[numberToPlay].source === 'spotify' && !spotifyIsLinked) {
            return true;
        }
        
        return false;
    }
  
    function handleChangeActuallyPlaying(numberToPlay) {
        if(room.playlistUrls[numberToPlay]) {
            if(isActuallyAdmin) {
                if(room.playlistUrls[numberToPlay].source === 'spotify' && !room.roomParams.spotifyIsLinked) {
                    handleChangeActuallyPlaying(numberToPlay+1);
                    return
                }
                roomRef.set({playing: numberToPlay, actuallyPlaying:true,mediaActuallyPlayingAlreadyPlayed: 0}, { merge: true });  
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
//        setRoom({playing:false}, {merge:true});
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

    
    function handleQuitRoomInComp() {
        room.notifsArray.push({type: 'userLeaved', timestamp: Date.now(), createdBy: currentUser.displayName});
        roomRef.set({notifsArray: room.notifsArray},{merge:true}).then(() => {handleQuitRoom();});
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

        if('up' === voteType) {
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

    function handleChangeRoomParams(newParams) {
        roomRef.set({roomParams: newParams}, { merge: true });
    }

    function handleDisconnectFromSpotify(type) {
        disconnectSpotify();
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
        roomRef.set({roomParams:{spotifyToken: newToken,spotifyIsLinked:true,spotifyAlreadyHaveBeenLinked:true, spotifyTokenTimestamp: Date.now(), spotifyUserConnected:currentUser.displayName}}, { merge: true });
        window.history.replaceState('string','', window.location.href.replace('#','')+"?rid="+roomId.replace(/\s/g,''));
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


    const [spotifyEndSwitchTempFix, setSpotifyEndSwitchTempFix] = useState(true);
    function SpotifyPlayerCallBack(e){
        if(e.type === 'player_update') {
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
            {loaded && room.playlistUrls && <div>
                {!room.playlistEmpty && room.playlistUrls.length > 0 && room.playing !== null && 
                    <Box sx={{bgcolor:'#303030',borderBottom: '2px solid var(--border-color)', padding:"0px 0em"}}> 
                        <Grid container spacing={0} sx={{ bgcolor:'var(--grey-dark)',}} className={viewPlayer ? 'playerShow' : 'playerHide'}>

                            <Grid item className={isFullScreen ? 'fullscreen' : 'playerContainer'} sm={(room.playlistUrls[room.playing].source === 'spotify' ) ? 12 : 4} xs={12} sx={{ pl:0,ml:0, pt: 0, position:'relative'}}>
                                {spotifyPlayerShow && isActuallyAdmin && room.playlistUrls[room.playing].source === 'spotify' &&
                                    <SpotifyPlayer
                                        callback={SpotifyPlayerCallBack}
                                        token={room.roomParams.spotifyToken}
                                        uris={room.playlistUrls[room.playing].url}
                                        play={room.actuallyPlaying}
                                        inlineVolume={localVolume}
                                        styles={{
                                            activeColor: 'var(--main-color)',
                                            bgColor: 'var(--grey-dark)',
                                            loaderColor: 'var(--main-color)',
                                            sliderColor: 'var(--red-2)',
                                            trackArtistColor: 'var(--grey-dark)',
                                            trackNameColor: 'var(--grey-dark)',
                                        }}
                                    />}
                                {!isActuallyAdmin && room.playlistUrls[room.playing].source === 'spotify' &&
                                    <Alert severity="warning" sx={{m:2, border:'1px solid #F27C24'}}> Le lecteur Spotify n'est visible que par l'host de la room. 
                                        <a href="#" onClick={(e) => setOpenAddToPlaylistModal(true)} sx={{color:'var(--main-color-darker)'}}>
                                            <b>Ajoute quelque chose dans la playlist en attendant !</b>
                                        </a>
                                    </Alert>
                                }
                                {isActuallyAdmin && room.playlistUrls[room.playing].source !== 'spotify'  && <ReactPlayer sx={{ padding:0}}
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
                                            playerVars: { showinfo: 0, preload:0 }
                                        }
                                    }}
                                />}
                                {!isActuallyAdmin && room.playlistUrls[room.playing].source !== 'spotify'  && <ReactPlayer sx={{ padding:0}}
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
                            <Grid item sm={(room.playlistUrls[room.playing].source === 'spotify' || !viewPlayer) ? 12 : 8} xs={12} sx={{ padding:0,pl:0,ml:0, mb: 0,pt:0,height:'100%', color:'white' }} className={`player_right_side_container ${(room.playlistUrls[room.playing].source === 'spotify') ? "spotify_header" : ""}`}>
                                { /* pip ? 'Disable PiP' : 'Enable PiP' */ }
                                <Grid item sm={12} sx={{ padding:0,pl:1.5,ml:0, mb: 0 , mt:1, fill:'#f0f1f0'}}>
                                    <Grid item 
                                    sx={[{pb:1}, room.playlistUrls[room.playing].source === 'spotify' &&  { justifyContent: 'center' } ]} 
                                    className="flexRowCenterH">
                                        <Tooltip title="Afficher / Cacher le lecteur">
                                                <Icon icon={viewPlayer ? 'ep:view' : 'carbon:view-off'} style={{cursor:'pointer',marginRight:'20px'}} onClick={e => setViewPlayer(!viewPlayer)} />
                                        </Tooltip>
                                        { room.playlistUrls[room.playing].title && <Typography component={'span'}>
                                        {room.playlistUrls[room.playing].title} 
                                        </Typography>}
                                        { room.playlistUrls[room.playing].url && room.playlistUrls[room.playing].url.length === 0 || !room.playlistUrls[room.playing].title && 
                                        <Typography component={'span'}  >
                                            {room.playlistUrls[room.playing].url.substring(0, 50)+'...'} 
                                        </Typography>} 
                                    </Grid>
                                    
                                    <Typography sx={{ display:'block', width:'100%',ml:0, mb: 0, fontSize: '10px', textTransform:'uppercase' }}>
                                        {room.actuallyPlaying ? 'En lecture' : 'En pause'}
                                    </Typography>
                                    {playerReady && playerRef.current !== null && room.playlistUrls[room.playing].source !== 'spotify' && 
                                    <Typography sx={{ fontSize: '10px', ml:0, mb: 1}}> {~~(Math.round(playerRef.current.getCurrentTime())/60) + 'm'+Math.round(playerRef.current.getCurrentTime()) % 60+ 's / ' + formatNumberToMinAndSec(playerRef.current.getDuration())}</Typography>}
                                    <Typography sx={{ ml:0, mb: 0, fontSize: '10px', textTransform:'uppercase' }}>
                                        Source : { room.playlistUrls[room.playing].source }
                                    </Typography>
                                    <Typography sx={{ ml:0, mb: 1.5, fontSize: '10px', textTransform:'uppercase' }}>
                                        Ajouté par : { room.playlistUrls[room.playing].addedBy }
                                    </Typography>
                                </Grid> 
                                <Grid className='player_button_container' item sm={12} sx={{ padding:0,pl:1.5,ml:0, pr:1.5,mb: 0 , mt:1, fill:'#f0f1f0'}}   >
                                    {isActuallyAdmin && 
                                        <Grid item sm={12} sx={{ display:'flex',justifyContent: 'space-between', padding:0,pt:1,ml:0,mr:1,pr:2, mb: 1.5 }}>
                                            
                                            <IconButton onClick={e => room.playing > 0 ? handleChangeActuallyPlaying(0) : ''}>
                                                <FirstPageIcon  fontSize="large" sx={{color:room.playing > 0 ? '#f0f1f0': '#303134'}} />
                                            </IconButton>
                                            
                                            <IconButton onClick={e => ((room.playing > 0) && isSpotifyAndIsNotPlayableBySpotify(room.playing-1, room.roomParams.isLinkedToSpotify)) ? handleChangeActuallyPlaying(room.playing - 1) : ''}>
                                                <SkipPrevious fontSize="large" sx={{color:((room.playing > 0) && isSpotifyAndIsNotPlayableBySpotify(room.playing-1, room.roomParams.isLinkedToSpotify)) ? '#f0f1f0': '#303134'}} />
                                            </IconButton>

                                            <IconButton variant="contained" onClick={e => handlePlay(!room.actuallyPlaying)} sx={{position:'sticky', top:0, zIndex:2500}} >
                                                { room.actuallyPlaying && <PauseCircleOutlineIcon fontSize="large" sx={{color:'#f0f1f0'}} />}
                                                { !room.actuallyPlaying && <PlayCircleOutlineIcon fontSize="large" sx={{color:'#f0f1f0'}} />}
                                            </IconButton>
                                           
                                            <IconButton onClick={e => (room.playlistUrls.length -1) !== room.playing ? handleChangeActuallyPlaying(room.playing + 1) : ''}>
                                                <SkipNextIcon fontSize="large" sx={{color: (room.playlistUrls.length -1) !== room.playing ? '#f0f1f0' : '#303134'}} />
                                            </IconButton>

                                            <IconButton onClick={e => (room.playlistUrls.length -1) !== room.playing ? handleChangeActuallyPlaying(room.playlistUrls.length-1) : ''}>
                                                <LastPageIcon  fontSize="large" sx={{color: (room.playlistUrls.length -1) !== room.playing ? '#f0f1f0' : '#303134'}} />
                                            </IconButton>
                                            
                                            {room.playlistUrls[room.playing].source !== 'spotify' && 
                                                <>
                                                    <IconButton onClick={e => setPercentagePlayed(0)} >
                                                        <ReplayIcon fontSize="large" sx={{color:'#f0f1f0'}} />
                                                    </IconButton>
                                                    {!isFullScreen && <IconButton onClick={e => setIsFullScreen(true)} >
                                                        <FullscreenIcon fontSize="large" sx={{color:'#f0f1f0'}} />
                                                    </IconButton>}
                                                </>
                                            }
                                        </Grid>
                                    }
                                    {room.playlistUrls[room.playing].source !== 'spotify' && 
                                        <Grid item sm={12} sx={{ pt:0,pl:2,pr:2,ml:0, mb: 0, pb:1, mt:3 }}>
                                            <Stack spacing={2} sm={8} direction="row" sx={{ mb: 1, mr:2 }} alignItems="center">
                                                <VolumeDown />
                                                <Slider step={0.01} min={0}  max={1} aria-label="Volume" value={localVolume} onChange={e => handleVolumeChange(e)} />
                                                <VolumeUp />
                                            </Stack>
                                        </Grid> 
                                    }
                                </Grid>
                            </Grid>
                        </Grid>
                        
                        {isFullScreen &&
                            <IconButton className="fullscreenoff" onClick={e => setIsFullScreen(false)} >
                                <FullscreenExitIcon fontSize="large" sx={{color:'#f0f1f0', position:'absolute'}} />
                            </IconButton>
                        }
                    </Box>
                }
                <Toolbar xs={12} sx={{ bgcolor: 'var(--grey-dark)',borderBottom: '2px solid var(--border-color)', minHeight: '45px !important', fontFamily: 'Monospace', pl:'17px', pr:'25 px' }}>
                    <Typography component="div" sx={{ flexGrow: 1, textTransform:'uppercase', fontSize:'12px', color:'white' }}> Playlist <b><span> ({ room.playlistUrls && room.playlistUrls.length } médias en playlist)</span></b>
                    </Typography>
                </Toolbar>
                { room.playlistEmpty && 
                    <>
                        <Alert severity="success" variant="filled" 
                            icon={<Icon icon="uil:smile-beam" width="35"/>} 
                            className='animate__animated animate__fadeInUp animate__slow'
                            onClick={(e) => setOpenInvitePeopleToRoomModal(true)}
                            sx={{m:2, border:'2px solid var(--green-2)', cursor:'pointer'}}> 
                            <AlertTitle sx={{mb:0}}>Bienvenue dans la room ! </AlertTitle> 
                            <p style={{color:'var(--white)', margin:0}}>Clique ici pour la partager</p>
                        </Alert>
                        <Alert severity="warning" 
                            variant="filled" 
                            icon={<Icon icon="iconoir:music-double-note-add" width="35" />} 
                            sx={{m:2, border:'2px solid #febc21', cursor:'pointer'}} 
                            className='animate__animated animate__fadeInUp animate__slow'
                            onClick={(e) => setOpenAddToPlaylistModal(true)} >
                            <AlertTitle>La Playlist est vide !</AlertTitle>
                            <p style={{color:'var(--white)', margin:0}}>Clique ici pour commencer</p>
                        </Alert>
                        
                        {!room.roomParams.spotifyIsLinked && 
                            <Alert severity="warning" variant="filled" 
                            icon={<Icon icon="mdi:spotify" width="30" />} 
                            sx={{m:2, border:'2px solid #febc21',cursor:'pointer'}} 
                            className='animate__animated animate__fadeInUp animate__slow'
                            onClick={e => window.location.href = `${process.env.REACT_APP_ROOM_SPOTIFY_AUTH_ENDPOINT}?client_id=${process.env.REACT_APP_ROOM_SPOTIFY_CLIENT_ID}&scope=user-read-playback-state%20streaming%20user-read-email%20user-modify-playback-state%20user-read-private&redirect_uri=${REDIRECT_URI}&response_type=${process.env.REACT_APP_ROOM_SPOTIFY_RESPONSE_TYPE}`}>
                            <AlertTitle>Spotify n'est pas lié à la room !</AlertTitle>
                            <p style={{color:'var(--white)', margin:0}}> Clique ici pour lier les deux <br /> <b>Spotify Premium requis</b> </p>
                        </Alert>}
                    </>
                }
                {typeof(room.playlistUrls) !== 'undefined' && room.playlistUrls && room.playlistUrls.length > 0 && <Box sx={{ p:0,mb:0}}>
                    <RoomPlaylist isSpotifyAvailable={room.roomParams.spotifyIsLinked} isAdminView={isActuallyAdmin} roomPlaylist={room.playlistUrls} roomIdActuallyPlaying={room.playing} userVoteArray={localData.currentUserVotes} handleChangeIsActuallyPlaying={handlePlay} handleChangeIdActuallyPlaying={handleChangeIdActuallyPlaying}  handleVoteChange={handleVoteChange} roomIsActuallyPlaying={room.actuallyPlaying} roomPlayedActuallyPlayed={room.mediaActuallyPlayingAlreadyPlayed} />
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
                    sx={{bgcolor:'#131416', mr:1,borderRadius:0}}
                    xs={12}
                >
                    <ArrowBackIosNewIcon sx={{fontSize:'2em', color:'var(--main-color)', fill:'var(--main-color)'}} className='animate__animated animate__fadeInLeft animate__fast' />
                </Button >
                {room.playlistEmpty && 
                    <Box sx={{display:'flex',flexDirection:'column', padding:'1em'}}>
                        <Typography component="span"> Playlist vide </Typography>
                        <Typography sx={{color:'var(--white)', display:'block', width:'100%',ml:0, fontSize: '12px', textTransform:'uppercase' }} > Room n° { roomId }</Typography>
                    </Box>}
                {typeof(room.playlistUrls) !== 'undefined' && loaded && !room.playlistEmpty && 
                    <Box sx={{display:'flex',flexDirection:'column',p:'8px'}}>
                        <Typography sx={{color:'var(--white)', display:'block', width:'100%',ml:0, pl:0,fontSize: '12px', textTransform:'uppercase' }} > Room n° { roomId }</Typography>

                        <Typography sx={{color:'var(--white)', display:'flex',gap:'10px',flexDirection:'row', alignItems:'center', width:'100%',ml:1,mt:1, fontSize: '10px', textTransform:'uppercase' }} >
                            <SoundWave waveNumber={7} isPlayingOrNo={room.actuallyPlaying}  /> 
                            <span >
                                { room.playlistUrls[room.playing].title ? room.playlistUrls[room.playing].title : room.playlistUrls[room.playing].url.substring(0,25)+'..' }
                            </span>
                        </Typography>
                    </Box>}
            </Grid>
            {OpenAddToPlaylistModal && <RoomModalAddMedia roomId={roomId} currentUser={currentUser} spotifyTokenProps={room.roomParams.spotifyToken} handleChangeSpotifyToken={handleChangeSpotifyToken} validatedObjectToAdd={handleAddValidatedObjectToPlaylist} /> }
        </Dialog>
        
        {loaded && room.roomParams && <ModalRoomParams adminView={isActuallyAdmin} open={openRoomParamModal} changeOpen={setOpenRoomParamModal} handleChangeRoomParams={handleChangeRoomParams} handleDisconnectFromSpotifyModal={setOpenForceDisconnectSpotifyModal} roomParams={room.roomParams} />} 
        <ModalShareRoom open={openInvitePeopleToRoomModal} changeOpen={setOpenInvitePeopleToRoomModal} roomUrl={ localData.domain +'/?rid='+roomId} />
        <ModalLeaveRoom open={openLeaveRoomModal} changeOpen={setOpenLeaveRoomModal} handleQuitRoom={handleQuitRoomInComp} />
        <ModalForceSpotifyDisconnect open={openForceDisconnectSpotifyModal} changeOpen={setOpenForceDisconnectSpotifyModal} handleDisconnectSpotify={disconnectSpotify} />


        {loaded && room.roomParams && 
            <BottomInteractions 
                roomParams={room.roomParams}
                roomNotifs={(room.notifsArray) ? room.notifsArray: ''}
                userCanMakeInteraction={userCanMakeInteraction}
                OpenAddToPlaylistModal={OpenAddToPlaylistModal}
                setOpenAddToPlaylistModal={setOpenAddToPlaylistModal}
                createNewRoomInteraction={createNewRoomInteraction}
                handleOpenRoomParamModal={handleOpenRoomParamModal}
                handleOpenShareModal={handleOpenShareModal}
                handleOpenLeaveRoomModal={handleOpenLeaveRoomModal}
                checkRoomExist={(room && room.playlistEmpty) ? true:false}
                checkInterractionLength={(room.roomParams.interactionsArray && room.roomParams.interactionsArray.length > 0) ? true:false}
                checkNotificationsLength={(room.notifsArray && room.notifsArray.length > 0) ? true:false}
            />  } 

    </div>
  );
};

export default Room;
