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
import axios from "axios";
import 'animate.css';
import { v4 as uuid } from 'uuid';  
import ReactPlayer from 'react-player';
import SpotifyPlayer from 'react-spotify-web-playback';
import useKeypress from 'react-use-keypress';

import YTSearch from 'youtube-api-search';

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

import {CreateGoogleAnalyticsEvent} from '../services/googleAnalytics';

import { withTranslation } from 'react-i18next';

const Room = ({ t, currentUser, roomId, handleQuitRoom }) => {

    const REDIRECT_URI = window.location.protocol+'//'+window.location.hostname+(window.location.port ? ":" + window.location.port : '');

    // global for room
	const roomRef = db.collection(process.env.REACT_APP_ROOM_COLLECTION).doc(roomId);
    const [localData, setLocalData] = useState({domain:window.location.hostname, currentUserVotes:{up:[], down:[]} });
	const [loaded, setLoaded] = useState(false);
	const [room, setRoom] = useState({});

    // sticky toolbar
    const [scrollFromTopTrigger, setScrollFromTopTrigger] = useState(window.screen.height/4);
    const [isShowSticky, setIsShowSticky] = useState(false);

    useEffect(() => {
        const handleScroll = (event) => {
            if(window.scrollY >= scrollFromTopTrigger) {
                setIsShowSticky(true);
            } else {
                setIsShowSticky(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

    }, []);

    // for desynchro || FINAL CLIENT ROOM DATAS
	const [roomIdPlayed, setRoomIdPlayed] = useState(0);
	const [roomIsPlaying, setRoomIsPlaying] = useState(0);
    const [guestSynchroOrNot, setGuestSynchroOrNot] = useState(true);

    const [openInvitePeopleToRoomModal, setOpenInvitePeopleToRoomModal] = useState(false);
    const [OpenAddToPlaylistModal, setOpenAddToPlaylistModal] = useState(false);
    const [openRoomParamModal, setOpenRoomParamModal] = useState(false);
    const [openLeaveRoomModal, setOpenLeaveRoomModal] = useState(false);

    const [openRoomDrawer, setOpenRoomDrawer] = useState(false);

    const [localVolume, setLocalVolume] = useState(0);
    const [pip, setPip] = useState(true);
    const [userCanMakeInteraction, setUserCanMakeInteraction]= useState(true);
    const [openForceDisconnectSpotifyModal, setOpenForceDisconnectSpotifyModal] = useState(false);

    const [playerReady, setPlayerReady] = useState(false);
    const [viewPlayer, setViewPlayer] = useState(true);
    const [spotifyPlayerShow, setSpotifyPlayerShow] = useState(true);

    // layout
    const [layoutDisplay, setLayoutdisplay] = useState('default');

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
                        roomName:'',
                        admin:currentUser.displayName,
                        adminUid:currentUser.uid  ? currentUser.uid : 'anon',
                        playing:0,
                        actuallyPlaying:false,
                        playlistUrls: [],
                        playlistEmpty: true,
                        notifsArray:[],
                        mediaActuallyPlayingAlreadyPlayedData:{
                            playedSeconds:0,
                            playedPercentage:0,
                            played:0
                        },
                        roomParams:{
                            isChatActivated:true,
                            isPrivate:false,
                            isOnInvitation:false,
                            isPlayingLooping:true,
                            isAutoPlayActivated:true,
                            syncPeopleByDefault:true,
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
                    db.collection(process.env.REACT_APP_ROOM_COLLECTION).doc(roomId).set(docData).then(() => {});
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
        if(layoutDisplay === 'fullscreen') {
            setLayoutdisplay('default');
        }
    });

	useEffect(() => {
        
		getRoomData(roomId); 
        localStorage.setItem("Play-It_SpotifyRoomId", roomId)
        if(null === localStorage.getItem("Play-It_UserInfoVotes")) {
            localStorage.setItem("Play-It_UserInfoVotes", JSON.stringify({up:[], down:[]}));
        } else {
            localData.currentUserVotes = JSON.parse(localStorage.getItem("Play-It_UserInfoVotes"));
        }

        document.title = 'Room ' + roomId + ' - Play-It';

	}, [roomId]);

	useEffect(() => {
        if( typeof playerRef.current.seekTo === 'function') {
            if(guestSynchroOrNot) {
                roomRef.get().then((doc) => {
                    playerRef.current.seekTo(doc.data().mediaActuallyPlayingAlreadyPlayedData.playedSeconds, 'seconds');   
                    
                    room.notifsArray.push({type: 'userSync', timestamp: Date.now(), createdBy: currentUser.displayName});
                    roomRef.set({notifsArray: room.notifsArray},{merge:true});     
                    CreateGoogleAnalyticsEvent('Actions','Room synchro','Room '+roomId);
                });
            } else {
                room.notifsArray.push({type: 'userUnSync', timestamp: Date.now(), createdBy: currentUser.displayName});
                roomRef.set({notifsArray: room.notifsArray},{merge:true});   
                playerRef.current.seekTo(0, 'seconds');
                CreateGoogleAnalyticsEvent('Actions','Room désynchro','Room '+roomId);
            }
        }
	}, [guestSynchroOrNot]);

    useEffect(() => {
        if(loaded) {
            room.notifsArray.push({type: 'userArrived', timestamp: Date.now(), createdBy: currentUser.displayName});
            roomRef.set({notifsArray: room.notifsArray},{merge:true});
            setRoomIdPlayed(room.playing);
            setRoomIsPlaying(room.actuallyPlaying);
        } 
    }, [loaded, guestSynchroOrNot]);

    useEffect(() => {
        if(guestSynchroOrNot) {
            setRoomIsPlaying(room.actuallyPlaying);
        } 
    }, [room.actuallyPlaying]);

    useEffect(() => {
        if(guestSynchroOrNot) {
            setRoomIdPlayed(room.playing);
        } 
    }, [room.playing]);

	useEffect(() => {
        if(currentUser.displayName === room.admin || currentUser.displayName === room.admin) {
            setIsActuallyAdmin(true);
        }
        if(roomIsPlaying) {
            document.title = 'En lecture - Room ' + roomId + ' - Play-It';
        } else {
            document.title = 'Room ' + roomId + ' - Play-It';
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
            roomRef.set({actuallyPlaying: playStatus,mediaActuallyPlayingAlreadyPlayedData:{
                        playedSeconds:room.mediaActuallyPlayingAlreadyPlayedData.playedSeconds,
                        playedPercentage:room.mediaActuallyPlayingAlreadyPlayedData.played*100,
                        played:room.mediaActuallyPlayingAlreadyPlayedData.played
                    }}, { merge: true });
        } else {
            setRoomIsPlaying(roomIsPlaying);
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
        
        CreateGoogleAnalyticsEvent('Actions','Room Interaction','Room '+roomId+' - '+type);
		getRoomData(roomId); 
        room.interactionsArray.push({timestamp:Date.now(), type:type, createdBy: currentUser.displayName});
        roomRef.update({interactionsArray: room.interactionsArray});

        setUserCanMakeInteraction(false);
        await delay(room.roomParams.interactionFrequence);
        setUserCanMakeInteraction(true);
    }

    async function handleReady() {
        setPlayerReady(true);
        playerRef.current.seekTo(room.mediaActuallyPlayingAlreadyPlayedData.playedSeconds, 'seconds');
    }

    
    async function handleMediaEnd() {
        
        if(!isActuallyAdmin && !guestSynchroOrNot) { 
            if(room.playlistUrls[roomIdPlayed+1]) {
                setRoomIdPlayed(roomIdPlayed+1);
            }
        }
        else {
            if(room.playlistUrls[room.playing+1]) {
                handleChangeActuallyPlaying(room.playing+1);
            } 
            else {
                if(isActuallyAdmin) {
                    if(room.roomParams.isAutoPlayActivated) {
                        addMediaForAutoPlay();
                    }
                    else if(room.roomParams.isPlayingLooping) {
                        handleChangeActuallyPlaying(0);
                    }
                }
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
        if(isActuallyAdmin) {
            if(room.playlistUrls[numberToPlay]) {
                if(room.playlistUrls[numberToPlay].source === 'spotify' && !room.roomParams.spotifyIsLinked) {
                    handleChangeActuallyPlaying(numberToPlay+1);
                    return
                }
                roomRef.set({playing: numberToPlay, actuallyPlaying:true,mediaActuallyPlayingAlreadyPlayedData:{
                        playedSeconds:0,
                        playedPercentage:0,
                        played:0
                    }}, { merge: true });  
            } else {
                if(room.roomParams.isPlayingLooping) {
                    roomRef.set({playing: 0, actuallyPlaying:true,mediaActuallyPlayingAlreadyPlayedData:{
                        playedSeconds:0,
                        playedPercentage:0,
                        played:0
                    }}, { merge: true });
                } else {    
                    roomRef.set({actuallyPlaying:false}, { merge: true });
                }
            }
        }
    }

    function setPercentagePlayed(percentagePlayed) {
        
        roomRef.set({mediaActuallyPlayingAlreadyPlayedData:{
            playedSeconds:percentagePlayed,
            playedPercentage:percentagePlayed,
            played:percentagePlayed
        }}, { merge: true });
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
                roomRef.set({
                    mediaActuallyPlayingAlreadyPlayedData:{
                        playedSeconds:event.playedSeconds,
                        playedPercentage:event.played*100,
                        played:event.played
                    } }, { merge: true });
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
            roomRef.set({playing: newIdToPlay, 
            mediaActuallyPlayingAlreadyPlayedData:{
                playedSeconds:0,
                playedPercentage:0,
                played:0
            }
            }, { merge: true });
        }
    }

    function handleVoteChange(idMedia, NewValue, mediaHashId, voteType) {
        
        CreateGoogleAnalyticsEvent('Actions','Vote','Vote');
        room.playlistUrls[idMedia].vote = NewValue;

        if('up' === voteType) {
            if(!localData.currentUserVotes.up.includes(mediaHashId)) {
                localData.currentUserVotes.up.push(mediaHashId);
                roomRef.set({playlistUrls: room.playlistUrls}, { merge: true });
                localStorage.setItem("Play-It_UserInfoVotes",  JSON.stringify(localData.currentUserVotes));
            }
        }
        else {
            if(!localData.currentUserVotes.down.includes(mediaHashId)) {
                localData.currentUserVotes.down.push(mediaHashId);
                roomRef.set({playlistUrls: room.playlistUrls}, { merge: true });
                localStorage.setItem("Play-It_UserInfoVotes",  JSON.stringify(localData.currentUserVotes));
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
        var queryParameters = new URLSearchParams(window.location.search);
        if(queryParameters.get("token")) {
        console.log('bbaa');
            var token = queryParameters.get("token") ? queryParameters.get("token") : '';
            window.location.hash = "";
            window.localStorage.setItem("Play-It_SpotifyToken", token)
            handleChangeSpotifyToken(token)

        }
    })

    async function handleChangeSpotifyToken(newToken) {
        roomRef.set({roomParams:{spotifyToken: newToken,spotifyIsLinked:true,spotifyAlreadyHaveBeenLinked:true, spotifyTokenTimestamp: Date.now(), spotifyUserConnected:currentUser.displayName}}, { merge: true });
        window.history.replaceState('string','', window.location.protocol+'//'+window.location.hostname+(window.location.port ? ":" + window.location.port : '')+'?rid='+roomId.replace(/\s/g,''));

    }

    function handleOpenShareModal(ShareModalIsOpen) {
        if(ShareModalIsOpen) {
            CreateGoogleAnalyticsEvent('Actions','Open shareModal','Open shareModal');
        }
        setOpenInvitePeopleToRoomModal(ShareModalIsOpen);
    }

    function handleOpenRoomParamModal(roomParamModalIsOpen) {
        if(roomParamModalIsOpen) {
            CreateGoogleAnalyticsEvent('Actions','Open paramModal','Open paramModal');
        }
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
                    handleMediaEnd();
                    setSpotifyPlayerShow(true);
                } else {
                    handleMediaEnd();
                    setSpotifyEndSwitchTempFix(true);
                }
            } 
        }
    }

    async function addMediaForAutoPlayByYoutubeId(mediaYoutubeId) {
        
        var params = {
            part: 'snippet',
            key: process.env.REACT_APP_YOUTUBE_API_KEY,
            type:'video',
            relatedToVideoId: mediaYoutubeId,
        }; 

        await axios.get('https://www.googleapis.com/youtube/v3/search', { params: params })
            .then(function(response) {
                var suggestMedia = {
                    addedBy : 'App_AutoPlay',
                    hashId: uuid().slice(0,10).toLowerCase(),
                    source: 'youtube',
                    platformId:response.data.items[0].id.videoId,
                    title:response.data.items[0].snippet.title,
                    url:'https://www.youtube.com/watch?v='+response.data.items[0].id.videoId, 
                    vote: {'up':0,'down':0}
                }
                handleAddValidatedObjectToPlaylist(suggestMedia);
                CreateGoogleAnalyticsEvent('Actions','Autoplay add', 'Autoplay add');
                handleChangeActuallyPlaying(room.playing+1);  
            })
        .catch(function(error) {
        });
    }

    async function addMediaForAutoPlay() {
            if('youtube' !== room.playlistUrls[room.playing].source) {
                YTSearch({key: process.env.REACT_APP_YOUTUBE_API_KEY, term: room.playlistUrls[room.playing].title}, (videos) => {
                    if(videos[1]) {
                        addMediaForAutoPlayByYoutubeId(videos[1].id.videoId);  
                    } 
                });
            } else {
                addMediaForAutoPlayByYoutubeId(room.playlistUrls[room.playing].platformId);
            } 
    }
   
  return (
    <div className="flex flex-col w-full gap-0 relative " style={{height:'auto'}} > 
        {loaded && room.roomParams !== undefined && 
            <RoomTopBar     
                room={room}
                roomIsPlaying={roomIsPlaying}
                setRoomIsPlaying={setRoomIsPlaying}
                roomIdPlayed={roomIdPlayed}
                setRoomIdPlayed={setRoomIdPlayed}
                isAdminView={isActuallyAdmin}
                isShowSticky={isShowSticky}
                handlePlay={handlePlay}
                isSpotifyAndIsNotPlayableBySpotify={isSpotifyAndIsNotPlayableBySpotify}
                handleChangeActuallyPlaying={handleChangeActuallyPlaying}
                handleChangeIdActuallyPlaying={handleChangeIdActuallyPlaying}
                handleOpenRoomParamModal={handleOpenRoomParamModal}
                handleOpenShareModal={handleOpenShareModal}
                guestSynchroOrNot={guestSynchroOrNot}
                setGuestSynchroOrNot={setGuestSynchroOrNot}
                paramDrawerIsOpen={openRoomDrawer}
                handleOpenDrawerParam={setOpenRoomDrawer}
                handleOpenLeaveRoomModal={handleOpenLeaveRoomModal}
                localData={localData} 
                roomId={roomId} 
                roomAdmin={room.admin} 
                isLinkedToSpotify={room.roomParams.spotifyIsLinked}/>
        }
        <Container maxWidth={false} sx={{ padding: '0 !important'}} >
            {loaded && room.playlistUrls && <div>
                {!room.playlistEmpty && room.playlistUrls.length > 0 && room.playing !== null && 
                    <Box sx={{bgcolor:'#303030',borderBottom: '2px solid var(--border-color)', padding:"0px 0em"}}> 
                        <Grid container spacing={0} sx={{ bgcolor:'var(--grey-dark)'}} className={viewPlayer ? 'playerShow' : 'playerHide'}>

                            <Grid item className={layoutDisplay === 'fullscreen' ? 'fullscreen' : 'playerContainer'} sm={(room.playlistUrls[room.playing].source === 'spotify' ) ? 12 : 4} xs={12} sx={{ pl:0,ml:0, pt: 0, position:'relative'}}>
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
                                    progressInterval = {1000}
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
                                {!isActuallyAdmin && room.playlistUrls[roomIdPlayed] && room.playlistUrls[roomIdPlayed].source !== 'spotify'  && <ReactPlayer sx={{ padding:0}}
                                    ref={playerRef}
                                    className='react-player'
                                    width='100%'
                                    pip={pip}
                                    height='100%'
                                    volume={localVolume}
                                    onPlay={e => handleNonAdminPlay()}
                                    onReady={e => handleReady()}
                                    onEnded={e => handleMediaEnd()}
                                    url={room.playlistUrls[roomIdPlayed].url}
                                    playing={roomIsPlaying} // is player actually playing
                                    controls={false}
                                    light={false}
                                    config={{
                                        youtube: {
                                            playerVars: { showinfo: 0, preload:1 }
                                        }
                                    }}
                                />}
                                <div style={{display:'none',width:'100%',height:'100%',opacity:0,top:0,position:'absolute'}}></div>
                            </Grid>
                            <Grid item sm={(room.playlistUrls[roomIdPlayed].source === 'spotify' || !viewPlayer) ? 12 : 8} xs={12} sx={{ padding:0,pl:0,ml:0, mb: 0,pt:0,height:'100%', color:'white' }} className={`player_right_side_container ${(room.playlistUrls[roomIdPlayed].source === 'spotify') ? "spotify_header" : ""}`}>
                                { /* pip ? 'Disable PiP' : 'Enable PiP' */ }
                                 <Grid item sm={12} sx={{ padding:0,pl:1.5,ml:0, mb: 0 , mt:1, fill:'#f0f1f0'}}>
                                    <Grid item 
                                    sx={[{pb:1}, room.playlistUrls[roomIdPlayed].source === 'spotify' &&  { justifyContent: 'center' } ]} 
                                    className="flexRowCenterH">
                                        <Tooltip title="Afficher / Cacher le lecteur">
                                                <Icon icon={viewPlayer ? 'ep:view' : 'carbon:view-off'} 
                                                style={{flexShrink:0,cursor:'pointer',marginRight:'20px'}} onClick={e => setViewPlayer(!viewPlayer)} />
                                        </Tooltip>
                                        { room.playlistUrls[roomIdPlayed].title && <Typography component={'span'}>
                                        {room.playlistUrls[roomIdPlayed].title} 
                                        </Typography>}
                                        { room.playlistUrls[roomIdPlayed].url && room.playlistUrls[roomIdPlayed].url.length === 0 || !room.playlistUrls[roomIdPlayed].title && 
                                        <Typography component={'span'}  >
                                            {room.playlistUrls[roomIdPlayed].url.substring(0, 50)+'...'} 
                                        </Typography>} 
                                        </Grid>
                                    
                                    <Grid item sm={12} md={12} >
                                        <Typography sx={{ display:'block', width:'100%',ml:0, mb: 0, fontSize: '10px', textTransform:'uppercase' }}>
                                            {roomIsPlaying ? 'En lecture' : 'En pause'}
                                        </Typography>
                                        {playerReady && playerRef.current !== null && room.playlistUrls[roomIdPlayed].source !== 'spotify' && 
                                        <Typography sx={{ fontSize: '10px', ml:0, mb: 1}}> {~~(Math.round(playerRef.current.getCurrentTime())/60) + 'm'+Math.round(playerRef.current.getCurrentTime()) % 60+ 's / ' + formatNumberToMinAndSec(playerRef.current.getDuration())}</Typography>}
                                        <Typography sx={{ ml:0, mb: 0, fontSize: '10px', textTransform:'uppercase' }}>
                                            Source : { room.playlistUrls[roomIdPlayed].source }
                                        </Typography>
                                        <Typography sx={{ ml:0, mb: 1.5, fontSize: '10px', textTransform:'uppercase' }}>
                                            Ajouté par : { room.playlistUrls[roomIdPlayed].addedBy }
                                        </Typography>
                                    </Grid>
                                </Grid> 
                                <Grid className='player_button_container' item sm={12} sx={{ padding:0,pl:1.5,ml:0, pr:1.5,mb: 0 , mt:1, fill:'#f0f1f0'}}   >
                                    {isActuallyAdmin && 
                                        <Grid item sm={12} sx={{ display:'flex',justifyContent: 'space-between', padding:0,pt:1,ml:0,mr:1,pr:2, mb: 1.5 }}>
                                            
                                            <IconButton onClick={e => roomIdPlayed > 0 ? handleChangeActuallyPlaying(0) : ''}>
                                                <FirstPageIcon  fontSize="large" sx={{color:roomIdPlayed > 0 ? '#f0f1f0': '#303134'}} />
                                            </IconButton>
                                            
                                            <IconButton onClick={e => ((roomIdPlayed > 0) && isSpotifyAndIsNotPlayableBySpotify(roomIdPlayed-1, room.roomParams.isLinkedToSpotify)) ? handleChangeActuallyPlaying(roomIdPlayed - 1) : ''}>
                                                <SkipPrevious fontSize="large" sx={{color:((roomIdPlayed > 0) && isSpotifyAndIsNotPlayableBySpotify(roomIdPlayed-1, room.roomParams.isLinkedToSpotify)) ? '#f0f1f0': '#303134'}} />
                                            </IconButton>

                                            <IconButton variant="contained" onClick={e => handlePlay(!room.actuallyPlaying)} sx={{position:'sticky', top:0, zIndex:2500}} >
                                                { room.actuallyPlaying && <PauseCircleOutlineIcon fontSize="large" sx={{color:'#f0f1f0'}} />}
                                                { !room.actuallyPlaying && <PlayCircleOutlineIcon fontSize="large" sx={{color:'#f0f1f0'}} />}
                                            </IconButton>
                                           
                                            <IconButton onClick={e => (room.playlistUrls.length -1) !== roomIdPlayed ? handleChangeActuallyPlaying(room.playing + 1) : ''}>
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
                                                    {layoutDisplay !== 'fullscreen' && <IconButton onClick={e => setLayoutdisplay('fullscren')} >
                                                        <FullscreenIcon fontSize="large" sx={{color:'#f0f1f0'}} />
                                                    </IconButton>}
                                                </>
                                            }
                                        </Grid>
                                    }
                                    {!isActuallyAdmin && !guestSynchroOrNot && <Grid item sm={12} sx={{ display:'flex',justifyContent: 'space-between', padding:0,pt:1,ml:0,mr:1,pr:2, mb: 1.5 }}>
                                            <IconButton onClick={e => roomIdPlayed > 0 ? setRoomIdPlayed(roomIdPlayed-1) : ''}>
                                                <FirstPageIcon  fontSize="large" sx={{color:roomIdPlayed > 0 ? '#f0f1f0': '#303134'}} />
                                            </IconButton>
                                            
                                            <IconButton variant="contained" onClick={e => setRoomIsPlaying(!roomIsPlaying)} sx={{position:'sticky', top:0, zIndex:2500}} >
                                                { roomIsPlaying && <PauseCircleOutlineIcon fontSize="large" sx={{color:'#f0f1f0'}} />}
                                                { !roomIsPlaying && <PlayCircleOutlineIcon fontSize="large" sx={{color:'#f0f1f0'}} />}
                                            </IconButton>

                                            <IconButton onClick={e => (room.playlistUrls.length -1) !== roomIdPlayed ? setRoomIdPlayed(roomIdPlayed+1) : ''}>
                                                <LastPageIcon  fontSize="large" sx={{color: (room.playlistUrls.length -1) !== roomIdPlayed ? '#f0f1f0' : '#303134'}} />
                                            </IconButton>
                                            
                                    </Grid>}

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
                        
                        {layoutDisplay === 'fullscreen' &&
                            <IconButton className="fullscreenoff" onClick={e => setLayoutdisplay('fullscren')} >
                                <FullscreenExitIcon fontSize="large" sx={{color:'#f0f1f0', position:'absolute'}} />
                            </IconButton>
                        }
                    </Box>
                }
                { !room.playlistEmpty && <Toolbar xs={12} sx={{ bgcolor: 'var(--grey-dark)',borderBottom: '2px solid var(--border-color)', minHeight: '45px !important', fontFamily: 'Monospace', pl:'17px', pr:'25 px' }}>
                     <Typography component="div" sx={{ flexGrow: 1, textTransform:'uppercase', fontSize:'12px', color:'white' }}> Playlist <b><span> ({ room.playlistUrls && room.playlistUrls.length } médias en playlist)</span></b>
                    </Typography>
                </Toolbar>}
                { room.playlistEmpty && 
                    <>
                        <Alert severity="success" variant="filled" 
                            icon={<Icon icon="uil:smile-beam" width="35"/>} 
                            className='animate__animated animate__fadeInUp animate__slow'
                            onClick={(e) => setOpenInvitePeopleToRoomModal(true)}
                            sx={{m:2, border:'2px solid var(--green-2)', cursor:'pointer'}}> 
                            <AlertTitle sx={{mb:0}}>{t('RoomEmptyAlertWelcome')} </AlertTitle> 
                            <p style={{color:'var(--white)', margin:0}}>{t('RoomEmptyAlertWelcomeClickHere')}</p>
                        </Alert>
                        <Alert severity="warning" 
                            variant="filled" 
                            icon={<Icon icon="iconoir:music-double-note-add" width="35" />} 
                            sx={{m:2, border:'2px solid #febc21', cursor:'pointer'}} 
                            className='animate__animated animate__fadeInUp animate__slow'
                            onClick={(e) => setOpenAddToPlaylistModal(true)} >
                            <AlertTitle>{t('RoomEmptyAlertPlaylist')}</AlertTitle>
                            <p style={{color:'var(--white)', margin:0}}>{t('RoomEmptyAlertPlaylistClickHere')}</p>
                        </Alert>
                        
                        {!room.roomParams.spotifyIsLinked && 
                            <Alert severity="warning" variant="filled" 
                            icon={<Icon icon="mdi:spotify" width="30" />} 
                            sx={{m:2, border:'2px solid #febc21',cursor:'pointer'}} 
                            className='animate__animated animate__fadeInUp animate__slow'
                            onClick={e => window.location.href = `${process.env.REACT_APP_ROOM_SPOTIFY_AUTH_ENDPOINT}?client_id=${process.env.REACT_APP_ROOM_SPOTIFY_CLIENT_ID}&scope=user-read-playback-state%20streaming%20user-read-email%20user-modify-playback-state%20user-read-private&redirect_uri=${REDIRECT_URI}&response_type=${process.env.REACT_APP_ROOM_SPOTIFY_RESPONSE_TYPE}`}>
                            <AlertTitle>{t('RoomEmptyAlertSpotify')}</AlertTitle>
                            <p style={{color:'var(--white)', margin:0}}> {t('RoomEmptyAlertSpotifyClickHere')} <br /> <b>{t('RoomEmptyAlertSpotifyBold')}</b> </p>
                        </Alert>}
                    </>
                }
                {typeof(room.playlistUrls) !== 'undefined' && room.playlistUrls && room.playlistUrls.length > 0 && <Box sx={{ p:0,mb:0}}>
                    <RoomPlaylist isSpotifyAvailable={room.roomParams.spotifyIsLinked} isAdminView={isActuallyAdmin} 
                    roomPlaylist={room.playlistUrls} 
                    roomIdActuallyPlaying={roomIdPlayed} userVoteArray={localData.currentUserVotes} handleChangeIsActuallyPlaying={handlePlay} handleChangeIdActuallyPlaying={handleChangeIdActuallyPlaying}  handleVoteChange={handleVoteChange} roomIsActuallyPlaying={roomIsPlaying} roomPlayedActuallyPlayed={room.mediaActuallyPlayingAlreadyPlayedData.playedPercentage} />
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
                            <SoundWave waveNumber={7} isPlayingOrNo={roomIsPlaying}  /> 
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
                currentUser={currentUser}
                roomId={roomId}
                roomParams={room.roomParams}
                roomNotifs={(room.notifsArray) ? room.notifsArray: ''}
                userCanMakeInteraction={userCanMakeInteraction}
                OpenAddToPlaylistModal={OpenAddToPlaylistModal}
                setOpenAddToPlaylistModal={setOpenAddToPlaylistModal}
                createNewRoomInteraction={createNewRoomInteraction}
                paramDrawerIsOpen={openRoomDrawer}
                handleOpenDrawerParam={setOpenRoomDrawer}
                handleOpenShareModal={handleOpenShareModal}
                handleOpenLeaveRoomModal={handleOpenLeaveRoomModal}
                checkRoomExist={(room && room.playlistEmpty) ? true:false}
                checkInterractionLength={(room.roomParams.interactionsArray && room.roomParams.interactionsArray.length > 0) ? true:false}
                checkNotificationsLength={(room.notifsArray && room.notifsArray.length > 0) ? true:false}
                layoutDisplay={layoutDisplay}
                setLayoutdisplay={setLayoutdisplay}
            />  } 

    </div>
  );
};

export default withTranslation()(Room);
