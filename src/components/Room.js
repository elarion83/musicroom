'use client';

import React, { useEffect, useRef, useState } from "react";
import { db } from "../services/firebase";
import { useIdleTimer } from 'react-idle-timer'
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import 'animate.css';
import axios from "axios";
import ReactPlayer from 'react-player';
import SpotifyPlayer from 'react-spotify-web-playback';
import useKeypress from 'react-use-keypress';
import { v4 as uuid } from 'uuid';
import {cleanMediaTitle,isFromSpotify,isFromDeezer,isUndefined,getDisplayTitle,createInteractionAnimation, isPlaylistExistNotEmpty,isFromSource,mediaIndexExist,isLayoutDefault,isLayoutInteractive,isLayoutCompact, isLayoutFullScreen, playingFirstInList,playingLastInList,isTokenInvalid, createDefaultRoomObject, formatNumberToMinAndSec} from '../services/utils';
import RoomPlaylistDrawer from "./rooms/playlistSection/drawer/RoomPlaylistDrawer";

//import screenfull from 'screenfull'
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';

import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPrevious from '@mui/icons-material/SkipPrevious';
import Typography from '@mui/material/Typography';

import RoomModalAddMedia from './rooms/modalsOrDialogs/ModalAddMedia';
import ModalForceDeezerDisconnect from "./rooms/modalsOrDialogs/ModalForceDeezerDisconnect";
import ModalForceSpotifyDisconnect from "./rooms/modalsOrDialogs/ModalForceSpotifyDisconnect";
import ModalLeaveRoom from './rooms/modalsOrDialogs/ModalLeaveRoom';
import ModalRoomParams from './rooms/modalsOrDialogs/ModalRoomParams';
import ModalShareRoom from './rooms/modalsOrDialogs/ModalShareRoom';

import BottomInteractions from "./rooms/bottomSection/BottomInteractions";
import RoomTopBar from "./rooms/RoomTopBar";
import RoomPlaylist from "./rooms/playlistSection/RoomPlaylist";

import { CreateGoogleAnalyticsEvent } from '../services/googleAnalytics';

import { withTranslation } from 'react-i18next';
import ModalEnterRoomPassword from "./rooms/modalsOrDialogs/ModalEnterRoomPassword";
import VolumeButton from "./rooms/playerSection/VolumeButton";
import EmptyPlaylist from "./rooms/playlistSection/EmptyPlaylist";
import { Icon } from "@iconify/react";

const Room = ({ t, currentUser, roomId, handleQuitRoom, setStickyDisplay }) => {

    // global for room
	const roomRef = db.collection(process.env.REACT_APP_ROOM_COLLECTION).doc(roomId);
    const [localData] = useState({domain:window.location.hostname, currentUserVotes:{up:[], down:[]} });
	const [loaded, setLoaded] = useState(false);
	const [room, setRoom] = useState({});

    // sticky toolbar
    const [scrollFromTopTrigger] = useState(window.screen.height/6);
    const [isShowSticky, setIsShowSticky] = useState(false);

    useEffect(() => {
        const handleScroll = (event) => {
            if(window.scrollY >= scrollFromTopTrigger) {
                setIsShowSticky(true);
                setStickyDisplay(true);
            } else {
                setIsShowSticky(false);
                setStickyDisplay(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

    }, [scrollFromTopTrigger, setStickyDisplay]);

    // for desynchro || FINAL CLIENT ROOM DATAS
	const [roomIdPlayed, setRoomIdPlayed] = useState(0);
	const [roomIsPlaying, setRoomIsPlaying] = useState(0);
    const [guestSynchroOrNot, setGuestSynchroOrNot] = useState(true);

    const [openInvitePeopleToRoomModal, setOpenInvitePeopleToRoomModal] = useState(false);
    const [openPassWordModal, setOpenPassWordModal] = useState(true);
    const [OpenAddToPlaylistModal, setOpenAddToPlaylistModal] = useState(false);
    const [openRoomParamModal, setOpenRoomParamModal] = useState(false);
    const [openLeaveRoomModal, setOpenLeaveRoomModal] = useState(false);

    const [openRoomDrawer, setOpenRoomDrawer] = useState(false);

    const [mediaDataShowInDrawer, setMediaDataShowInDrawer] = useState();
    const [mediaDataDrawerOpen, setMediaDataDrawerOpen] = useState(false);

    const [localVolume, setLocalVolume] = useState(1);

    const [pip] = useState(true);
    const [userCanMakeInteraction, setUserCanMakeInteraction]= useState(true);
    const [openForceDisconnectSpotifyModal, setOpenForceDisconnectSpotifyModal] = useState(false);
    const [openForceDisconnectDeezerModal, setOpenForceDisconnectDeezerModal] = useState(false);

    const [playerReady, setPlayerReady] = useState(false);
    const [spotifyPlayerShow, setSpotifyPlayerShow] = useState(true);

    // layout
    const [layoutDisplay, setLayoutdisplay] = useState('default');
    const [layoutDisplayClass, setLayoutDisplayClass] = useState('defaultLayout');

    useEffect(() => {
        switch (layoutDisplay) {
            case 'compact':
                setLayoutDisplayClass('compactLayout');
                break;
            case 'fullscreen':
                setLayoutDisplayClass('fullscreenLayout');
                break;
            case 'interactive':
                setLayoutDisplayClass('interactiveLayout');
                break;
            default:
                setLayoutDisplayClass('defaultLayout');
        }
    }, [layoutDisplay]);

    // inactivity on fullscreen
    const [remaining, setRemaining] = useState(0)
    const [layoutIdle, setLayoutIdle] = useState(false);

    const onIdle = () => {
        if(isLayoutFullScreen(layoutDisplay)) {
            setLayoutIdle(true);
        }
    }

    const onActive = () => {
        if(isLayoutFullScreen(layoutDisplay)) {
            setLayoutIdle(false);
        }
    }
    const { getRemainingTime } = useIdleTimer({
        onIdle,
        onActive,
        timeout: 5_000,
        throttle: 1000
    })

    useEffect(() => {
        const interval = setInterval(() => {
            setRemaining(Math.ceil(getRemainingTime() / 1000))
        }, 500)

        return () => {
            clearInterval(interval)
        }
    });

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
                    var docData = createDefaultRoomObject(roomId.toLowerCase(), currentUser);
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
        if(isLayoutFullScreen(layoutDisplay) || isLayoutInteractive(layoutDisplay) ) {
            setLayoutdisplay('default');
        }
    });

	useEffect(() => {
        
		getRoomData(roomId); 
        localStorage.setItem("Play-It_RoomId", roomId)
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
        if(loaded && room) {
            room.notifsArray.push({type: 'userArrived', timestamp: Date.now(), createdBy: currentUser.displayName});
            roomRef.set({notifsArray: room.notifsArray},{merge:true});
            
            setRoomIdPlayed(room.playing);
            setRoomIsPlaying(room.actuallyPlaying);
        } 
    }, [loaded, guestSynchroOrNot]);

    useEffect(() => {
        if(guestSynchroOrNot) {
            setRoomIsPlaying(room.actuallyPlaying);
            setRoomIdPlayed(room.playing);
        } 
    }, [room.actuallyPlaying, room.playing]);


	useEffect(() => {
        if(currentUser.displayName === room.admin || currentUser.displayName === room.admin) {
            setIsActuallyAdmin(true);
        } 

        if(roomIsPlaying) {
            document.title = t('GeneralPlaying')+' - Room ' + roomId + ' - Play-It';
        } else {
            document.title = 'Room ' + roomId + ' - Play-It';
        }
        
		getRoomData(roomId); 
    }, [loaded, localData,room]);

	useEffect(() => {
        if(room.interactionsArray && room.interactionsArray.length > 0) {
            room.interactionsArray.forEach(function (item, index, object) {
                if(Date.now() - item.timestamp < 500) { 
                    createInteractionAnimation(item.type, layoutDisplay);
                }
            });
        }
        
    }, [room.interactionsArray]);
    
    async function handlePlay(playStatus) {
        if(isTokenInvalid(room.roomParams.spotify.TokenTimestamp)) {   
            disconnectSpotify();
        }
        if(isTokenInvalid(room.roomParams.deezer.TokenTimestamp)) {
            disconnectDeezer();
        }
        if(isActuallyAdmin) {
            roomRef.set({
                actuallyPlaying: playStatus,
                mediaActuallyPlayingAlreadyPlayedData:{
                    playedSeconds:room.mediaActuallyPlayingAlreadyPlayedData.playedSeconds,
                    playedPercentage:room.mediaActuallyPlayingAlreadyPlayedData.played*100,
                    played:room.mediaActuallyPlayingAlreadyPlayedData.played
                }
                }, { merge: true });
        } else {
            setRoomIsPlaying(roomIsPlaying);
        }
    }

    async function disconnectSpotify() {
         roomRef.set({roomParams:{
            spotify:{
                IsLinked:false,
                AlreadyHaveBeenLinked:true,
                Token:'',
                TokenTimestamp:Date.now(),
                UserConnected:''
            }}}, { merge: true });
        setOpenForceDisconnectSpotifyModal(false);
    }

    async function disconnectDeezer() {
        roomRef.set({roomParams:{
            deezer:{
                IsLinked:false,
                AlreadyHaveBeenLinked:true,
                Token:'',
                TokenTimestamp:Date.now(),
                UserConnected:''
            }}}, { merge: true });
        setOpenForceDisconnectDeezerModal(false);
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
        if(isFromDeezer(room.playlistUrls[roomIdPlayed])) {   
            playerRef.current.seekTo(room.mediaActuallyPlayingAlreadyPlayedData.playedSeconds, 'seconds');
        }
    }

    
    async function handleMediaEnd() {
        
        if(!isActuallyAdmin && !guestSynchroOrNot) { 
            if(mediaIndexExist(room.playlistUrls,roomIdPlayed+1)) {
                setRoomIdPlayed(roomIdPlayed+1);
            }
        }
        else {
            if(mediaIndexExist(room.playlistUrls, room.playing+1)) {
                handleChangeActuallyPlaying(room.playing+1);
            } 
            else {
                if(isActuallyAdmin) {
                    if(room.roomParams.isAutoPlayActivated) {
                        addMediaForAutoPlayByYoutubeId(room.playlistUrls[room.playing].title);
                    }
                    else if(room.roomParams.isPlayingLooping) {
                        handleChangeActuallyPlaying(0);
                    }
                }
            }
        }
    }
    async function isSpotifyAndIsNotPlayableBySpotify(numberToPlay, spotifyIsLinked) {
        if(isFromSpotify(room.playlistUrls[numberToPlay]) && !spotifyIsLinked) {
            return true;
        }
        
        return false;
    }
  
    function handleChangeActuallyPlaying(numberToPlay) {
        if(isActuallyAdmin) {
            var playingUsed = 0;
            if(room.playlistUrls[numberToPlay]) {
                if(isFromSpotify(room.playlistUrls[numberToPlay]) && !room.roomParams.spotify.IsLinked) {
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
    
    function handleQuitRoomInComp() {
        room.notifsArray.push({type: 'userLeaved', timestamp: Date.now(), createdBy: currentUser.displayName});
        roomRef.set({notifsArray: room.notifsArray},{merge:true}).then(() => {handleQuitRoom();});
    }

// NEW FUNCTIONS FROM CHILD COMP
    function handleAddValidatedObjectToPlaylist(validatedObjectToAdd) {
        validatedObjectToAdd.timestamp = Date.now();
        room.playlistUrls.push(validatedObjectToAdd);
        room.playlistEmpty = false;
        roomRef.set({playlistUrls: room.playlistUrls, playlistEmpty: false}, { merge: true });
    }

    function handleChangeIdActuallyPlaying(newIdToPlay) {
        if(isActuallyAdmin) {
            roomRef.set({
                playing: newIdToPlay, 
                mediaActuallyPlayingAlreadyPlayedData:{
                    playedSeconds:0,
                    playedPercentage:0,
                    played:0
                }
            }, { merge: true });
        }
    }

    function handleChangeIdShownInDrawer(idToShow) {
        setMediaDataShowInDrawer(idToShow);
        setMediaDataDrawerOpen(true);
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

    function handleRemoveMediaFromPlaylist(indexToRemove) {
        room.playlistUrls.splice(indexToRemove, 1);
        roomRef.set({playlistUrls: room.playlistUrls}, { merge: true });
    }

    function handleChangeRoomParams(newParams) {
        roomRef.set({roomParams: newParams}, { merge: true });
    }

    useEffect(() => {
        var queryParameters = new URLSearchParams(window.location.search);
        var token = queryParameters.get("deetoken") ? queryParameters.get("deetoken") : queryParameters.get("spotoken") ? queryParameters.get("spotoken") : '';
        var itemtoAdd = queryParameters.get("deetoken") ? "Play-It_DeezerToken" : queryParameters.get("spotoken") ? "Play-It_SpotifyToken" : '';
        var enablerSource = queryParameters.get("deetoken") ? "deezer" : queryParameters.get("spotoken") ? "spotify" : '';
        
        if(enablerSource) {
            window.location.hash = "";
            window.localStorage.setItem(itemtoAdd, token);
            updateEnablerToken(token,enablerSource);
        }
    });

    async function updateEnablerToken(newToken, enabler) {
        var obj = {
            [enabler]: {
                IsLinked:true,
                AlreadyHaveBeenLinked:true,
                Token:newToken,
                TokenTimestamp:Date.now(),
                UserConnected:currentUser.displayName
            }
        };
        roomRef.set({roomParams:obj}, { merge: true });
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

    const [spotifyEndSwitchTempFix, setSpotifyEndSwitchTempFix] = useState(true);

    async function SpotifyPlayerCallBack(e){
        if(e.errorType === 'account_error') {
            room.notifsArray.push({type: 'AccNotPremium', timestamp: Date.now(), createdBy: currentUser.displayName});
            roomRef.set({notifsArray: room.notifsArray},{merge:true}); 
            disconnectSpotify();
        }

        if(e.type === 'player_update') {
            if(e.previousTracks[0] && (e.track.id === e.previousTracks[0].id && spotifyEndSwitchTempFix)) {
                if((e.track.uri !== room.playlistUrls[room.playing].source)) {
                    setSpotifyPlayerShow(false);
                    setSpotifyEndSwitchTempFix(false);
                    handleMediaEnd();
                    setSpotifyPlayerShow(true);
                }
            } else {
                setSpotifyEndSwitchTempFix(true);
            }
        }
    }

    async function addMediaForAutoPlayByYoutubeId(lastMediaTitle) {
        
        var params = {
            part: 'snippet',
            key: process.env.REACT_APP_YOUTUBE_API_KEY,
            type:'video',
            maxResults:6,
            q:lastMediaTitle,
            videoEmbeddable:true,
        }; 

        await axios.get(process.env.REACT_APP_YOUTUBE_SEARCH_URL, { params: params })
            .then(function(response) {

                var responseItemLength = response.data.items.length-1;
                var suggestMedia = {
                    addedBy : 'App_AutoPlay',
                    hashId: uuid().slice(0,10).toLowerCase(),
                    source: 'youtube',
                    platformId:response.data.items[responseItemLength].id.videoId,
                    title:cleanMediaTitle(response.data.items[responseItemLength].snippet.title),
                    url:'https://www.youtube.com/watch?v='+response.data.items[responseItemLength].id.videoId, 
                    vote: {'up':0,'down':0}
                }
                handleAddValidatedObjectToPlaylist(suggestMedia);
                CreateGoogleAnalyticsEvent('Actions','Autoplay add', 'Autoplay add');
                handleChangeActuallyPlaying(room.playing+1);  
            })
        .catch(function(error) {
        });
    }
    return (
        <div className="flex flex-col w-full gap-0 relative " style={{height:'auto'}} > 
            {loaded && room.roomParams !== undefined && room.roomParams.spotify !== undefined && room.roomParams.deezer !== undefined && 
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
                    volume={localVolume}
                    setVolume={setLocalVolume}
                    isLinkedToSpotify={room.roomParams.spotify.IsLinked}
                    isLinkedToDeezer={room.roomParams.deezer.IsLinked}
                />
            }
            <Container maxWidth={false} sx={{ padding: '0 !important'}} className={layoutDisplayClass} >
                {loaded && room.playlistUrls && <div>
                    {!room.playlistEmpty && room.playlistUrls.length > 0 && room.playing !== null && 
                        <Box sx={{bgcolor:'#303030',borderBottom: '2px solid var(--border-color)', padding:"0px 0em"}} className={room.playlistUrls[roomIdPlayed].source+'Display'}> 
                            <Grid container spacing={0} sx={{ bgcolor:'var(--grey-dark)'}} className={ isLayoutCompact(layoutDisplay) ? 'playerHide' : 'playerShow'}>

                                <Grid item className={isLayoutFullScreen(layoutDisplay) ? 'fullscreen' : 'playerContainer'} sm={(isFromSpotify(room.playlistUrls[roomIdPlayed])) ? 12 : 4} xs={12} sx={{ pl:0,ml:0, pt: 0, position:'relative'}}>
                                    {isFromSpotify(room.playlistUrls[roomIdPlayed]) && spotifyPlayerShow &&
                                        <>
                                            {isActuallyAdmin &&
                                                <SpotifyPlayer
                                                    callback={SpotifyPlayerCallBack}
                                                    token={room.roomParams.spotify.Token}
                                                    uris={room.playlistUrls[roomIdPlayed].url}
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
                                                />
                                            }
                                            {!isActuallyAdmin &&
                                                <>
                                                    {guestSynchroOrNot &&
                                                        <Alert severity="warning" sx={{m:2, border:'1px solid #F27C24'}}> {t('RoomAlertSpotifyNotVisibleTitle')}
                                                            <a href="#" onClick={(e) => setOpenAddToPlaylistModal(true)} sx={{color:'var(--main-color-darker)'}}>
                                                                <b>{t('RoomAlertSpotifyNotVisibleText')}</b>
                                                            </a>
                                                        </Alert>
                                                    }
                                                    {!guestSynchroOrNot &&
                                                        <Alert severity="warning" sx={{m:2, border:'1px solid #F27C24'}}> {t('RoomAlertSpotifyNotVisibleUnsyncTitle')}
                                                                <b>{t('RoomAlertSpotifyNotVisibleUnsyncText')}</b>
                                                        </Alert>
                                                    }
                                                </> 
                                            }
                                        </>
                                    }
                                    
                                    {isFromDeezer(room.playlistUrls[roomIdPlayed]) && 
                                        <img className="coverImg" src={room.playlistUrls[roomIdPlayed].visuel} />
                                    }

                                    {!isFromSpotify(room.playlistUrls[roomIdPlayed]) && room.playlistUrls[roomIdPlayed] && 
                                        <ReactPlayer sx={{ padding:0}}
                                            ref={playerRef}
                                            className='react-player'
                                            width='100%'
                                            pip={pip}
                                            height='100%'
                                            volume={localVolume}
                                            onProgress={e => isActuallyAdmin ? handleProgress(e) : ''}
                                            progressInterval = {1000}
                                            //onStart={e => handlePlay(true)}
                                            onReady={e => handleReady()}
                                            onPlay={e => isActuallyAdmin ? handlePlay(true) : ''}
                                            onPause={e => handlePlay(false)}
                                            onEnded={e => handleMediaEnd()}
                                            url={isActuallyAdmin ? room.playlistUrls[room.playing].url : room.playlistUrls[roomIdPlayed].url}
                                            playing={isActuallyAdmin ? room.actuallyPlaying : roomIsPlaying} // is player actually playing
                                            controls={false}
                                            light={false}
                                            config={{
                                                youtube: {
                                                    playerVars: { showinfo: 0, preload:1 }
                                                }
                                            }}
                                        />
                                    }
                                    <div style={{width:'100%',height:'100%',opacity:0,top:0,position:'absolute'}}></div>
                                </Grid>
                                <Grid item sm={(isFromSpotify(room.playlistUrls[roomIdPlayed]) || isLayoutCompact(layoutDisplay)) ? 12 : 8} xs={12} sx={{ padding:0,pl:0,ml:0, mb: 0,pt:0,height:'100%', color:'white' }} className={`player_right_side_container ${(['spotify', 'deezer'].includes(room.playlistUrls[roomIdPlayed].source)) ? "musicOnlyPlayer_header" : ""}`}>
                                    { /* pip ? 'Disable PiP' : 'Enable PiP' */ }
                                    <Grid item sm={12} sx={{ padding:0,pl:1.5,ml:0, mb: 0 , mt:1, fill:'#f0f1f0'}}>
                                        <Grid item 
                                        sx={[{pb:1}, isFromSpotify(room.playlistUrls[roomIdPlayed]) &&  { justifyContent: 'center' } ]} 
                                        className="flexRowCenterH">
                                            <Typography component={'span'} className='mediaTitle varelaFontTitle'>
                                                {getDisplayTitle(room.playlistUrls[roomIdPlayed], 50)}
                                            </Typography>
                                        </Grid>
                                        
                                        <Grid item sm={12} md={12} >
                                            <Typography sx={{ display:'block', width:'100%',ml:0, mb: 0, fontSize: '10px', textTransform:'uppercase', color:'var(--grey-inspired)' }} className='fontFamilyNunito'>
                                                {roomIsPlaying ? t('GeneralPlaying') : t('GeneralPause')}
                                            </Typography>
                                            {(playerReady && playerRef.current !== null && !isFromSpotify(room.playlistUrls[roomIdPlayed])) && 
                                            <Typography sx={{ fontSize: '10px', ml:0, mb: 1, color:'var(--grey-inspired)'}} className='fontFamilyNunito'> {~~(Math.round(playerRef.current.getCurrentTime())/60) + 'm'+Math.round(playerRef.current.getCurrentTime()) % 60+ 's / ' + formatNumberToMinAndSec(playerRef.current.getDuration())}</Typography>}
                                        </Grid>
                                    </Grid> 
                                    {!layoutIdle && 
                                        <Grid className='player_button_container' item sm={12} sx={{ display:'flex', flexWrap:'wrap',padding:0,pl:1.5,ml:0, pr:1.5,mb: 0 , mt:1, fill:'#f0f1f0'}}   >
                                            {!(isShowSticky && isLayoutDefault(layoutDisplay)) &&
                                                <>
                                                    <Grid item sm={6} className={isActuallyAdmin ? "adminButtons" : guestSynchroOrNot ? 'guestButtons guestSync' : 'guestButtons guestNotSync'} xs={12} sx={{ display:'flex',justifyContent: 'space-between', padding:0,pt:1,ml:0,mr:1,pr:0, mb: 1.5 }}>
                                                        {isActuallyAdmin && 
                                                            <>
                                                                <IconButton onClick={e => roomIdPlayed > 0 ? handleChangeActuallyPlaying(0) : ''}>
                                                                    <FirstPageIcon  fontSize="large" sx={{color:playingFirstInList(roomIdPlayed) ? '#f0f1f0': '#303134'}} />
                                                                </IconButton>
                                                                
                                                                <IconButton onClick={e => (playingFirstInList(roomIdPlayed) && isSpotifyAndIsNotPlayableBySpotify(roomIdPlayed-1, room.roomParams.isLinkedToSpotify)) ? handleChangeActuallyPlaying(roomIdPlayed - 1) : ''}>
                                                                    <SkipPrevious fontSize="large" sx={{color:(playingFirstInList(roomIdPlayed) && isSpotifyAndIsNotPlayableBySpotify(roomIdPlayed-1, room.roomParams.isLinkedToSpotify)) ? '#f0f1f0': '#303134'}} />
                                                                </IconButton>

                                                                <IconButton variant="contained" onClick={e => handlePlay(!room.actuallyPlaying)} sx={{position:'sticky', top:0, zIndex:2500}} >
                                                                    { room.actuallyPlaying && <PauseCircleOutlineIcon fontSize="large" sx={{color:'#f0f1f0'}} />}
                                                                    { !room.actuallyPlaying && <PlayCircleOutlineIcon fontSize="large" sx={{color:'#f0f1f0'}} />}
                                                                </IconButton>
                                                            
                                                                <IconButton onClick={e => !playingLastInList(room.playlistUrls.length,room.playing) ? handleChangeActuallyPlaying(room.playing + 1) : ''}>
                                                                    <SkipNextIcon fontSize="large" sx={{color: !playingLastInList(room.playlistUrls.length,room.playing) ? '#f0f1f0' : '#303134'}} />
                                                                </IconButton>

                                                                <IconButton onClick={e => !playingLastInList(room.playlistUrls.length,room.playing) ? handleChangeActuallyPlaying(room.playlistUrls.length-1) : ''}>
                                                                    <LastPageIcon  fontSize="large" sx={{color: !playingLastInList(room.playlistUrls.length,room.playing) ? '#f0f1f0' : '#303134'}} />
                                                                </IconButton>

                                                                {isLayoutFullScreen(layoutDisplay) &&
                                                                    <IconButton onClick={e => setLayoutdisplay('default')} >
                                                                        <FullscreenExitIcon  fontSize="large" sx={{color: '#f0f1f0' }} />
                                                                    </IconButton>
                                                                }
                                                                
                                                                {!isFromSpotify(room.playlistUrls[room.playing]) && 
                                                                    <>
                                                                        <IconButton onClick={e => setPercentagePlayed(0)} >
                                                                            <Icon icon="icon-park-outline:replay-music" width="30" style={{color:'#f0f1f0'}} />
                                                                        </IconButton>
                                                                        {!isShowSticky &&
                                                                            <VolumeButton volume={localVolume} setVolume={setLocalVolume}/>
                                                                        }
                                                                    </>
                                                                }
                                                            </>
                                                        }
                                                        {!isActuallyAdmin && 
                                                            <>
                                                            {!guestSynchroOrNot && 
                                                                <>
                                                                    <IconButton onClick={e => playingFirstInList(roomIdPlayed) ? setRoomIdPlayed(roomIdPlayed-1) : ''}>
                                                                        <FirstPageIcon  fontSize="large" sx={{color :playingFirstInList(roomIdPlayed) ? '#f0f1f0': '#303134'}} />
                                                                    </IconButton>
                                                                
                                                                    {!isFromSpotify(room.playlistUrls[roomIdPlayed]) && 
                                                                        <IconButton variant="contained" onClick={e => setRoomIsPlaying(!roomIsPlaying)} sx={{position:'sticky', top:0, zIndex:2500}} >
                                                                            { roomIsPlaying && <PauseCircleOutlineIcon fontSize="large" sx={{color:'#f0f1f0'}} />}
                                                                            { !roomIsPlaying && <PlayCircleOutlineIcon fontSize="large" sx={{color:'#f0f1f0'}} />}
                                                                        </IconButton>
                                                                    }

                                                                    <IconButton onClick={e => !playingLastInList(room.playlistUrls.length, roomIdPlayed) ? setRoomIdPlayed(roomIdPlayed+1) : ''}>
                                                                        <LastPageIcon  fontSize="large" sx={{color: !playingLastInList(room.playlistUrls.length, roomIdPlayed) ? '#f0f1f0' : '#303134'}} />
                                                                    </IconButton>
                                                                </>
                                                            }
                                                            {!isFromSpotify(room.playlistUrls[room.playing]) && 
                                                                <>
                                                                    {!isShowSticky && 
                                                                        <VolumeButton volume={localVolume} setVolume={setLocalVolume}/>
                                                                    }
                                                                    
                                                                    {isLayoutFullScreen(layoutDisplay) &&
                                                                        <IconButton onClick={e => setLayoutdisplay('default')} >
                                                                            <FullscreenExitIcon fontSize="large"  sx={{color: '#f0f1f0' }} />
                                                                        </IconButton>
                                                                    }
                                                                </>
                                                            }
                                                            </>
                                                        }
                                                    </Grid>
                                                </>
                                            }
                                        </Grid>
                                    }
                                </Grid>
                            </Grid>
                        </Box>
                    }
                    { !room.playlistEmpty && 
                        <Toolbar xs={12} sx={{ bgcolor: 'var(--grey-dark)',borderBottom: '2px solid var(--border-color)', minHeight: '45px !important', fontFamily: 'Monospace', pl:'15px', pr:'25 px' }}>
                            <Typography component="span" sx={{ flexGrow: 1, textTransform:'uppercase', fontSize:'12px', color:'white' }}>
                                    { room.playlistUrls && room.playlistUrls.length } {t('GeneralMediasInPlaylist')}
                            </Typography>
                        </Toolbar>
                    }
                    { room.playlistEmpty && 
                        <EmptyPlaylist 
                            setOpenInvitePeopleToRoomModal={setOpenInvitePeopleToRoomModal}
                            setOpenAddToPlaylistModal={setOpenAddToPlaylistModal}
                            spotifyIsLinked={room.roomParams.spotify.IsLinked}
                            deezerIsLinked={room.roomParams.deezer.IsLinked}
                        />
                    }
                    {isPlaylistExistNotEmpty(room.playlistUrls) && 
                        <Box className="roomPlaylistbloc" sx={{ p:0,mb:0}}>
                            <RoomPlaylist 
                                isSpotifyAvailable={room.roomParams.spotify.IsLinked} 
                                roomPlaylist={room.playlistUrls} 
                                roomIdActuallyPlaying={roomIdPlayed} 
                                handleChangeIsActuallyPlaying={handlePlay} 
                                handleChangeIdShownInDrawer={handleChangeIdShownInDrawer}  
                                roomIsActuallyPlaying={roomIsPlaying} 
                                roomPlayedActuallyPlayed={room.mediaActuallyPlayingAlreadyPlayedData.playedPercentage} 
                            />
                            
                            <RoomPlaylistDrawer 
                                open={mediaDataDrawerOpen} 
                                changeOpen={setMediaDataDrawerOpen} 
                                isAdminView={isActuallyAdmin} 
                                data={room.playlistUrls[mediaDataShowInDrawer]} 
                                roomIsActuallyPlaying={roomIsPlaying}
                                roomIdActuallyDisplaying={mediaDataShowInDrawer}
                                roomIdActuallyPlaying={roomIdPlayed}
                                changeIdPlaying={handleChangeIdActuallyPlaying}
                                changeIsPlaying={handlePlay}
                                handleVoteChange={handleVoteChange} 
                                handleRemoveMediaFromPlaylist={handleRemoveMediaFromPlaylist}
                                userVoteArray={localData.currentUserVotes} 
                                roomPlaylist={room.playlistUrls} 
                                isSpotifyAvailable={room.roomParams.spotify.IsLinked} 
                                roomPlayedActuallyPlayed={room.mediaActuallyPlayingAlreadyPlayedData.playedPercentage} 
                            />
                        </Box>
                    }
                </div>
                } 
            </Container>
        
            {loaded && room.roomParams && 
                <>
                    <RoomModalAddMedia 
                        room={room}
                        roomIsPlaying={roomIsPlaying}
                        open={OpenAddToPlaylistModal} 
                        changeOpen={setOpenAddToPlaylistModal}
                        currentUser={currentUser} 
                        DeezerTokenProps={room.roomParams.deezer.Token} 
                        spotifyTokenProps={room.roomParams.spotify.Token} 
                        validatedObjectToAdd={handleAddValidatedObjectToPlaylist} 
                    /> 
                    <ModalRoomParams 
                        adminView={isActuallyAdmin} 
                        open={openRoomParamModal} 
                        changeOpen={setOpenRoomParamModal} 
                        handleChangeRoomParams={handleChangeRoomParams} 
                        handleDisconnectFromDeezerModal={setOpenForceDisconnectDeezerModal} 
                        handleDisconnectFromSpotifyModal={setOpenForceDisconnectSpotifyModal} 
                        roomParams={room.roomParams} 
                    />
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
                    />

                    {room.roomParams.isPasswordNeeded && !isActuallyAdmin && openPassWordModal && 
                        <ModalEnterRoomPassword 
                            password={room.roomParams.password}
                            open={room.roomParams.isPasswordNeeded && !isActuallyAdmin}
                            changeOpen={setOpenPassWordModal}
                        /> 
                    }
                </>
            } 

            <ModalShareRoom open={openInvitePeopleToRoomModal} changeOpen={setOpenInvitePeopleToRoomModal} roomUrl={ localData.domain +'/?rid='+roomId} />
            <ModalLeaveRoom open={openLeaveRoomModal} changeOpen={setOpenLeaveRoomModal} handleQuitRoom={handleQuitRoomInComp} />
            <ModalForceSpotifyDisconnect open={openForceDisconnectSpotifyModal} changeOpen={setOpenForceDisconnectSpotifyModal} handleDisconnectSpotify={disconnectSpotify} />
            <ModalForceDeezerDisconnect open={openForceDisconnectDeezerModal} changeOpen={setOpenForceDisconnectDeezerModal} handleDisconnectDeezer={disconnectDeezer} />
        </div>
    );
};

export default withTranslation()(Room);
