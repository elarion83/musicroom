'use client';

import React, { useEffect, useRef, useState } from "react";
import {  db } from "../services/firebase";
import { doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { useIdleTimer } from 'react-idle-timer'
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import 'animate.css';
import axios from "axios";
import ReactPlayer from 'react-player';
import SpotifyPlayer from 'react-spotify-web-playback';
import useKeypress from 'react-use-keypress';
import {isFromSpotify,isFromDeezer,getDisplayTitle,createInteractionAnimation, isPlaylistExistNotEmpty,mediaIndexExist,isLayoutDefault,isLayoutInteractive,isLayoutCompact, isLayoutFullScreen, playingFirstInList,playingLastInList,isTokenInvalid, createDefaultRoomObject, formatNumberToMinAndSec, delay, isVarExist,  isDevEnv, secondsSinceEventFromNow, autoAddYTObject, randomInt, isVarExistNotEmpty, setPageTitle, envAppNameUrl, isEmpty} from '../services/utils';
import RoomPlaylistDrawer from "./rooms/playlistSection/drawer/RoomPlaylistDrawer";

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
import { Forward10, Replay10 } from "@mui/icons-material";
import { emptyToken, interactionObject, playerRefObject, youtubeApiSearchObject, youtubeApiVideosParams } from "../services/utilsArray";
import { playedSeconds, playerNotSync, updateFirebaseRoom } from "../services/utilsRoom";
import ModalChangeRoomAdmin from "./rooms/modalsOrDialogs/ModalChangeRoomAdmin";
import RoomTutorial from "./rooms/RoomTutorial";
import { mockYoutubeMusicResult, mockYoutubeTrendResult } from "../services/mockedArray";
import SoundWave from "../services/SoundWave";

const Room = ({ t, currentUser, roomId, handleQuitRoom, setStickyDisplay }) => {

    // Firebase / firestore ref
	const roomRef = doc(db, process.env.REACT_APP_ROOM_COLLECTION, roomId.toLowerCase());

    // room local datas
	const [room, setRoom] = useState({});
    const [isActuallyAdmin, setIsActuallyAdmin] = useState(false);
    const [userCanMakeInteraction, setUserCanMakeInteraction]= useState(true);	
    const [roomInteractionsArray, setRoomInteractionsArray] = useState([]);
    const [interactionsDisplayedIdArray, setInteractionsDisplayedIdArray] = useState([]);
    const [loaded, setLoaded] = useState(false);

    // datas locales pour les anonymes (etc : savoir si il a déjà voté ou pas)
    const [localData] = useState({domain:window.location.hostname, currentUserVotes:{up:[], down:[]} });

    // sticky toolbar
    const [scrollFromTopTrigger] = useState(window.screen.height/4);
    const [isShowSticky, setIsShowSticky] = useState(false);

    useEffect(() => {
        const handleScroll = (event) => {
            setIsShowSticky(window.scrollY >= scrollFromTopTrigger);
            setStickyDisplay(window.scrollY >= scrollFromTopTrigger);
        };

        window.addEventListener('scroll', handleScroll);

    }, [scrollFromTopTrigger, setStickyDisplay]);

    // PLAYER DATA 
    const playerRef = useRef(playerRefObject);
	const [playerIdPlayed, setPlayerIdPlayed] = useState(0);
    const [playerControlsShown, setPlayerControlsShown] = useState(false);
	const [roomIsPlaying, setRoomIsPlaying] = useState(true);
    const [localVolume, setLocalVolume] = useState(1);
    const [pip] = useState(true);
    const [guestSynchroOrNot, setGuestSynchroOrNot] = useState(true);
    const [playerReady, setPlayerReady] = useState(false);
	const [playerBuffering, setPlayerBuffering] = useState(false);
    const [spotifyPlayerShow, setSpotifyPlayerShow] = useState(true);
	const [playedPercents, setPlayedPercents] = useState(0);

    // MODALS
    const [openInvitePeopleToRoomModal, setOpenInvitePeopleToRoomModal] = useState(false);
    const [openPassWordModal, setOpenPassWordModal] = useState(true);
    const [OpenAddToPlaylistModal, setOpenAddToPlaylistModal] = useState(false);
    const [addMediaModalAlreadyOpened, setAddMediaModalAlreadyOpened] = useState(false);
    const [openRoomParamModal, setOpenRoomParamModal] = useState(false);
    const [openRoomChangeAdminModal, setOpenRoomChangeAdminModal] = useState(false);
    const [openLeaveRoomModal, setOpenLeaveRoomModal] = useState(false);
    const [openForceDisconnectSpotifyModal, setOpenForceDisconnectSpotifyModal] = useState(false);
    const [openForceDisconnectDeezerModal, setOpenForceDisconnectDeezerModal] = useState(false);

    // drawer
    const [openRoomDrawer, setOpenRoomDrawer] = useState(false);
    const [mediaDataShowInDrawer, setMediaDataShowInDrawer] = useState();
    const [mediaDataDrawerOpen, setMediaDataDrawerOpen] = useState(false);

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

    // FULL SCREEN INACTIVITY
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
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setRemaining(Math.ceil(getRemainingTime() / 1000))
        }, 500)

        return () => {
            clearInterval(interval)
        }
    });

    // TUTORIAL
    const [isTutorialShown, setIsTutorialShown] = useState(true);
    const [tutoTranslateY, hideTuto] = useState('0');

    useEffect(() => {
        if(OpenAddToPlaylistModal && isTutorialShown) {
            setIsTutorialShown(false);
        }
    }, [OpenAddToPlaylistModal]) ;


    async function initTutorial() {
        if(isTutorialShown) {
            await delay(8000); 
            hideTuto('-35vh'); 
            await delay(2000);   
            setIsTutorialShown(false);    
        }
    }

    // GET DOCUMENT ON INIT (get firebase room datas)
	useEffect(() => {
        if(isVarExistNotEmpty(roomId)) {
            const initRoomFetchFirebase = async () => {
                const firebaseRoom = await getDoc(roomRef);
                var roomDatas = firebaseRoom.exists() ? firebaseRoom.data() : createDefaultRoomObject(roomId.toLowerCase(), currentUser);
                initRoom(roomDatas, roomId.toLowerCase(), !firebaseRoom.exists(), currentUser, roomRef);
            };
            initRoomFetchFirebase();
            setPageTitle('Playlist '+roomId+ ' - '+envAppNameUrl);
        }
	}, [roomId]);

    /* Init room : if new room, create it then next function */
    async function initRoom(roomDatas, roomId = '', create = true, currentUser, docRef = null) {
        if(create) {
            await setDoc(docRef, roomDatas);
            initRoomAsync(roomDatas, currentUser);
        } else {
            initRoomAsync(roomDatas, currentUser)
        }
    }

    /* create local room object, set player, admin, controls, ... then loaded */
    async function initRoomAsync(roomDatas, currentUser) {
        setRoom(roomDatas);
        setPlayerIdPlayed(roomDatas.playing);
        setIsActuallyAdmin(currentUser.uid === roomDatas.adminUid);
        setPlayerControlsShown(currentUser.uid === roomDatas.adminUid);
        setRoomIsPlaying(roomDatas.actuallyPlaying);
        setLoaded(true);
    }

    // AUTO UPDATE DOCUMENT ON USER IS SYNC
	useEffect(() => {
        let unsubscribe = () => {};
        if(loaded) {
            initTutorial();
            if(guestSynchroOrNot) {
                setPlayerControlsShown(isActuallyAdmin);
                unsubscribe = onSnapshot(roomRef, (doc) => {
                    var roomDataInFb = doc.data();
                    if(playerRef.current && playerRef.current.getCurrentTime && !isActuallyAdmin && playerNotSync(roomDataInFb, playerRef)) {
                        goToSecond(Math.floor(roomDataInFb.mediaActuallyPlayingAlreadyPlayedData.playedSeconds));
                    } 

                    if(!isActuallyAdmin) {
                        setPlayerIdPlayed(roomDataInFb.playing); 
                        setRoomIsPlaying(roomDataInFb.actuallyPlaying); 
                    }

                    setRoomInteractionsArray(roomDataInFb.interactionsArray);
                   
                    setIsActuallyAdmin(roomDataInFb.adminUid == currentUser.uid);
                    setRoom(roomDataInFb);
                });
            } else {
                if(!isActuallyAdmin) {
                    unsubscribe();
                    setPlayerControlsShown(true);
                    setRoomIsPlaying(false);
                    goToSecond(0);
                }
            }

            // DONT SYNC IF USER IS UNSYNC
            return () => unsubscribe();
        } 
	}, [guestSynchroOrNot, loaded, roomId]); 


    // INTERACTION ANIMATION (HEART / PARTY / SMILE)
	useEffect(() => {
        if(loaded) {
            if(isVarExist(roomInteractionsArray[roomInteractionsArray.length-1]) && (secondsSinceEventFromNow(roomInteractionsArray[roomInteractionsArray.length-1].timestamp) < 5000)) {
                if(!interactionsDisplayedIdArray.includes(roomInteractionsArray[roomInteractionsArray.length-1].key)) {
                    var lastInterKey = roomInteractionsArray[roomInteractionsArray.length-1].key;
                    interactionsDisplayedIdArray.push(lastInterKey);
                    createInteractionAnimation(roomInteractionsArray[roomInteractionsArray.length-1], layoutDisplay);
                }
            } 
        }
	}, [loaded,roomInteractionsArray]); 

	useEffect(() => {
        if(loaded) {
            if(room.localeYoutubeTrends.length < 1) {
                if(isDevEnv()) {
                    updateFirebaseRoom( roomRef , {
                        localeYoutubeTrends: mockYoutubeTrendResult,
                        localeYoutubeMusicTrends: mockYoutubeMusicResult});
                    return
                } else {
                    axios.get(process.env.REACT_APP_YOUTUBE_VIDEOS_URL, { 
                        params: youtubeApiVideosParams('0', 12, 'snippet,contentDetails') 
                    })
                    .then(function (response) {
                        updateFirebaseRoom( roomRef , {localeYoutubeTrends: response.data.items});
                        
                        axios.get(process.env.REACT_APP_YOUTUBE_VIDEOS_URL, { 
                            params: youtubeApiVideosParams('10', 12, 'snippet,contentDetails')
                            })
                        .then(function (musicResponse) {
                            updateFirebaseRoom( roomRef , {localeYoutubeMusicTrends: musicResponse.data.items});
                        })
                    });
                }
            }
        }
	}, [loaded]);

	useEffect(() => {
        setPlayerControlsShown(isActuallyAdmin);
	}, [isActuallyAdmin]);
    

    async function setIsPlaying(PlayingOrNot) {
        setRoomIsPlaying(PlayingOrNot);
        if(isActuallyAdmin) {
           updateFirebaseRoom( roomRef , {actuallyPlaying: PlayingOrNot})
        }
    }
    
    async function setIdPlaying(idPlaying) {
        goToSecond(0);
        setPlayedPercents(0);
        await delay(250);        
        let pageTitle = (roomIsPlaying && isVarExistNotEmpty(room.playlistUrls)) ? room.playlistUrls[idPlaying].title : 'Playlist '+roomId;
        setPageTitle(pageTitle+ ' - '+envAppNameUrl);
        setPlayerIdPlayed(idPlaying);
        if(isActuallyAdmin) {
           updateFirebaseRoom( roomRef , {
                playing: idPlaying,
                mediaActuallyPlayingAlreadyPlayedData:{
                    playedSeconds:0
                }
            })
        }
    }

    async function handleProgress(event) {
        setPlayedPercents(Math.floor(event.played*100));
        if(isActuallyAdmin) {
            if(Math.floor(event.played*100) > 90 && room.roomParams.isAutoPlayActivated && !mediaIndexExist(room.playlistUrls,playerIdPlayed+1)) {
                addMediaForAutoPlayByYoutubeId(room.playlistUrls[playerIdPlayed].title);
            }
            updateFirebaseRoom( roomRef , {
                mediaActuallyPlayingAlreadyPlayedData:{
                    playedSeconds:event.playedSeconds,
                    playedPercentage:event.played*100,
                    played:event.played
                }
            })
        } else {
            if(guestSynchroOrNot && playerNotSync(room, playerRef)) {
                goToSecond(Math.floor(room.mediaActuallyPlayingAlreadyPlayedData.playedSeconds));
            } 
        }
    }

    async function goToSecond(seconds) {
        playerRef.current.seekTo(seconds, 'seconds'); 
    }

    
    useEffect(() => {
        let pageTitle = (roomIsPlaying && isVarExistNotEmpty(room.playlistUrls)) ? room.playlistUrls[playerIdPlayed].title : 'Playlist '+roomId;
        setPageTitle(pageTitle+' - '+envAppNameUrl);
    }, [roomIsPlaying]);
            

    useKeypress([' '], () => {
        if(room && !OpenAddToPlaylistModal) {
            setIsPlaying(!roomIsPlaying);
        }
    });

    useKeypress(['Escape'], () => {
        if(isLayoutFullScreen(layoutDisplay) || isLayoutInteractive(layoutDisplay)) {
            setLayoutdisplay('default');
        }
    });
    
    async function disconnectSpotify() {
        updateFirebaseRoom( roomRef , {roomParams:{spotify:emptyToken}});
        setOpenForceDisconnectSpotifyModal(false);
    }

    async function disconnectDeezer() {
        updateFirebaseRoom( roomRef , {roomParams:{deezer:emptyToken}});
        setOpenForceDisconnectDeezerModal(false);
    }

    async function createNewRoomInteraction(type) {
        
        CreateGoogleAnalyticsEvent('Actions','Playlist Interaction','Playlist '+roomId+' - '+type);
        roomInteractionsArray.push(interactionObject(currentUser, type));
        updateFirebaseRoom( roomRef , {interactionsArray: room.interactionsArray});

        setUserCanMakeInteraction(false);
        await delay(room.roomParams.interactionFrequence);
        setUserCanMakeInteraction(true);
    }

    async function handleReady() {
        
        setPlayerReady(true);
        playerRef.current.seekTo(room.mediaActuallyPlayingAlreadyPlayedData.playedSeconds, 'seconds'); 
        if(isActuallyAdmin || guestSynchroOrNot) {  
            setRoomIsPlaying(room.actuallyPlaying);
        }
    }

    async function handleMediaEnd() {
        if(!mediaIndexExist(room.playlistUrls,playerIdPlayed+1)) {
            if(room.roomParams.isPlayingLooping) {
                await setIdPlaying(0);
            }
        } else {
            await goToSecond(0);
            setIdPlaying(playerIdPlayed+1);
        }
    }

    async function isSpotifyAndIsNotPlayableBySpotify(numberToPlay, spotifyIsLinked) {
        if(isFromSpotify(room.playlistUrls[numberToPlay]) && !spotifyIsLinked) {
            return true;
        }   
        return false;
    }
  

    function handleQuitRoomInComp() {
        room.notifsArray.push({type: 'userLeaved', timestamp: Date.now(), createdBy: currentUser.displayName});
        updateFirebaseRoom( roomRef , {notifsArray: room.notifsArray});
        handleQuitRoom();
    }

// NEW FUNCTIONS FROM CHILD COMP
    async function handleAddValidatedObjectToPlaylist(validatedObjectToAdd) {
        validatedObjectToAdd.timestamp = Date.now();
        room.playlistUrls.push(validatedObjectToAdd);
        updateFirebaseRoom( roomRef , {playlistUrls: room.playlistUrls, playlistEmpty: false});        
        room.playlistEmpty = false;
    }

    function handleChangeIdShownInDrawer(idToShow) {
        setMediaDataShowInDrawer(idToShow);
        setMediaDataDrawerOpen(true);
    }

    function handleVoteChange(idMedia, NewValue, mediaHashId, voteType) {
        CreateGoogleAnalyticsEvent('Actions','Vote','Vote');
        room.playlistUrls[idMedia].vote = NewValue;

        if(!localData.currentUserVotes[voteType].includes(mediaHashId)) {
            localData.currentUserVotes[voteType].push(mediaHashId);
            updateFirebaseRoom( roomRef , {playlistUrls: room.playlistUrls});
            localStorage.setItem("Play-It_UserInfoVotes",  JSON.stringify(localData.currentUserVotes));
        }
    }

    function handleRemoveMediaFromPlaylist(indexToRemove) {
        room.playlistUrls.splice(indexToRemove, 1);
        updateFirebaseRoom( roomRef , {playlistUrls: room.playlistUrls});
    }

    function handleChangeRoomParams(newParams) {
        updateFirebaseRoom( roomRef , {roomParams: newParams});
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
        updateFirebaseRoom( roomRef , {roomParams:obj});
        window.history.replaceState('string','', window.location.protocol+'//'+window.location.hostname+(window.location.port ? ":" + window.location.port : '')+'?rid='+roomId.replace(/\s/g,''));
    }

    function handleOpenShareModal(ShareModalIsOpen) {
        if(ShareModalIsOpen) {
            CreateGoogleAnalyticsEvent('Actions','Open shareModal','Open shareModal');
        }
        setOpenInvitePeopleToRoomModal(ShareModalIsOpen);
    }

    function handleOpenChangeAdminModal(changeAdminModalIsOpen) {
        setOpenRoomChangeAdminModal(changeAdminModalIsOpen);
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
            updateFirebaseRoom( roomRef , {notifsArray: room.notifsArray}); 
            disconnectSpotify();
        }

        if(e.type === 'player_update') {
            if(e.previousTracks[0] && (e.track.id === e.previousTracks[0].id && spotifyEndSwitchTempFix)) {
                if((e.track.uri !== room.playlistUrls[playerIdPlayed].source)) {
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
        
        var params = youtubeApiSearchObject(lastMediaTitle.split('-')[0],5);

        await axios.get(process.env.REACT_APP_YOUTUBE_SEARCH_URL, { params: params })
        .then(async function(response) {
            if(!isEmpty(response.data.items)) {
                var responseItemLength = randomInt(0,response.data.items.length-1);
                var suggestMedia = autoAddYTObject(response.data.items[responseItemLength]);
                await handleAddValidatedObjectToPlaylist(suggestMedia);
                CreateGoogleAnalyticsEvent('Actions','Autoplay add', 'Autoplay add');
            }
        });
    }

    async function changeAdmin() {
        room.notifsArray.push({type: 'changeAdmin', timestamp: Date.now(), createdBy: currentUser.displayName});
        updateFirebaseRoom( roomRef , {notifsArray: room.notifsArray, admin: currentUser.displayName, adminUid: currentUser.uid}); 
        setOpenRoomDrawer(false);
    }
    return (
        <div className="flex flex-col w-full gap-0 relative " style={{height:'auto'}}> 
            {loaded && <>
                <RoomTopBar     
                    room={room}
                    roomRef={roomRef}
                    roomIsPlaying={roomIsPlaying}
                    setRoomIsPlaying={setRoomIsPlaying}
                    playerControlsShown={playerControlsShown}
                    playerIdPlayed={playerIdPlayed}
                    setPlayerIdPlayed={setIdPlaying}
                    isAdminView={isActuallyAdmin}
                    isShowSticky={isShowSticky}
                    setIsPlaying={setIsPlaying}
                    isSpotifyAndIsNotPlayableBySpotify={isSpotifyAndIsNotPlayableBySpotify}
                    handleOpenRoomParamModal={handleOpenRoomParamModal}
                    handleOpenShareModal={handleOpenShareModal}
                    handleOpenChangeAdminModal={handleOpenChangeAdminModal}
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
            
                <Container maxWidth={false} sx={{ padding: '0 !important'}} className={layoutDisplayClass} >
                    <>
                        {!room.playlistEmpty && 
                            <>
                                {isVarExistNotEmpty(room.playlistUrls) && 
                                    <Box sx={{bgcolor:'#303030',borderBottom: '2px solid var(--border-color)', padding:"0px 0em"}} className={room.playlistUrls[playerIdPlayed].source+'Display'}> 
                                        <Grid container spacing={0} sx={{ bgcolor:'var(--grey-dark)'}} className={ isLayoutCompact(layoutDisplay) ? 'playerHide' : 'playerShow'}>

                                            <Grid item className={isLayoutFullScreen(layoutDisplay) ? 'fullscreen' : 'playerContainer'} sm={(isFromSpotify(room.playlistUrls[playerIdPlayed])) ? 12 : 4} xs={12} sx={{ pl:0,ml:0, pt: 0, position:'relative'}}>
                                                {isFromSpotify(room.playlistUrls[playerIdPlayed]) && spotifyPlayerShow &&
                                                    <>
                                                        {isActuallyAdmin &&
                                                            <SpotifyPlayer
                                                                callback={SpotifyPlayerCallBack}
                                                                token={room.roomParams.spotify.Token}
                                                                uris={room.playlistUrls[playerIdPlayed].url}
                                                                play={roomIsPlaying}
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
                                                
                                                {isFromDeezer(room.playlistUrls[playerIdPlayed]) && 
                                                    <img className="coverImg" alt={"Cover of "+room.playlistUrls[playerIdPlayed].title} src={room.playlistUrls[playerIdPlayed].visuel} />
                                                }

                                                {!isFromSpotify(room.playlistUrls[playerIdPlayed]) && room.playlistUrls[playerIdPlayed] && 
                                                    <ReactPlayer sx={{ padding:0}}
                                                        ref={playerRef}
                                                        className='react-player'
                                                        width='100%'
                                                        pip={pip}
                                                        height='100%'
                                                        volume={localVolume}
                                                        onProgress={e => handleProgress(e)}
                                                        progressInterval = {500}
                                                        //onStart={e => handlePlay(true)}
                                                        onReady={e => handleReady()}
                                                        onBuffer={e => setPlayerBuffering(true)}
                                                        onBufferEnd={e => setPlayerBuffering(false)}
                                                        onEnded={e => handleMediaEnd()}
                                                        url={room.playlistUrls[playerIdPlayed].url}
                                                        playing={roomIsPlaying} // is player actually playing
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
                                            <Grid item sm={(isFromSpotify(room.playlistUrls[playerIdPlayed]) || isLayoutCompact(layoutDisplay)) ? 12 : 8} xs={12} sx={{ padding:0,pl:0,ml:0, mb: 0,pt:0,height:'100%', color:'white' }} className={`player_right_side_container ${(['spotify', 'deezer'].includes(room.playlistUrls[playerIdPlayed].source)) ? "musicOnlyPlayer_header" : ""}`}>
                                                { /* pip ? 'Disable PiP' : 'Enable PiP' */ }
                                                <Grid item sm={12} sx={{ padding:0,pl:1.5,ml:0, mb: 0 , mt:1, fill:'#f0f1f0'}}>
                                                    <Grid item 
                                                    sx={[isFromSpotify(room.playlistUrls[playerIdPlayed]) &&  { justifyContent: 'center' } ]} 
                                                    className="flexRowCenterH">
                                                        <Typography component={'span'} className='mediaTitle varelaFontTitle'>
                                                            {getDisplayTitle(room.playlistUrls[playerIdPlayed], 50)}
                                                        </Typography>
                                                    </Grid>

                                                    <Typography sx={{ display:'block', width:'100%',ml:0, mb: 1, fontSize: '12px', textTransform:'uppercase', color:'var(--grey-lighter)' }} className='fontFamilyNunito'>
                                                        {room.playlistUrls[playerIdPlayed].channelOrArtist}
                                                    </Typography> 

                                                    <Grid item sm={12} md={12} >
                                                        <Typography sx={{ display:'block', width:'100%',ml:0, mb: 0, fontSize: '10px', textTransform:'uppercase', color:'var(--grey-inspired)' }} className='fontFamilyNunito'>
                                                            {roomIsPlaying ? t('GeneralPlaying') : t('GeneralPause')}
                                                            {playerBuffering ? ' | Loading' : ''}
                                                        </Typography> 
                                                        {(playerReady && playerRef.current !== null && !isFromSpotify(room.playlistUrls[playerIdPlayed])) && 
                                                        <Typography sx={{ fontSize: '10px', ml:0, mb: 1, color:'var(--grey-inspired)'}} className='fontFamilyNunito'> {~~(Math.round(playerRef.current.getCurrentTime())/60) + 'm'+Math.round(playerRef.current.getCurrentTime()) % 60+ 's / ' + formatNumberToMinAndSec(playerRef.current.getDuration())}</Typography>}
                                                    </Grid>
                                                </Grid> 
                                                {!layoutIdle && 
                                                    <Grid className='player_button_container' item sm={12} sx={{ display:'flex', flexWrap:'wrap',padding:0,pl:1.5,ml:0, pr:1.5,mb: 0 , mt:1, fill:'#f0f1f0'}}   >
                                                        {!(isShowSticky && isLayoutDefault(layoutDisplay)) &&
                                                            <>
                                                                <Grid item sm={6} className={isActuallyAdmin ? "adminButtons" : guestSynchroOrNot ? 'guestButtons guestSync' : 'guestButtons guestNotSync'} xs={12} 
                                                                sx={{ display:'flex',justifyContent: 'space-between', padding:0,pt:1,ml:0,mr:1,pr:0, mb: 1.5, color:'red' }}>
                                                                    {playerControlsShown &&  
                                                                        <>
                                                                            <IconButton onClick={e => (playingFirstInList(playerIdPlayed) && isSpotifyAndIsNotPlayableBySpotify(playerIdPlayed-1, room.roomParams.isLinkedToSpotify)) ? setIdPlaying(playerIdPlayed-1) : ''}>
                                                                                <SkipPrevious fontSize="large" sx={{color:(playingFirstInList(playerIdPlayed) && isSpotifyAndIsNotPlayableBySpotify(playerIdPlayed-1, room.roomParams.isLinkedToSpotify)) ? '#f0f1f0': '#303134'}} />
                                                                            </IconButton>

                                                                            <IconButton onClick={e => (room.mediaActuallyPlayingAlreadyPlayedData.playedSeconds > 10) ? goToSecond(playedSeconds(playerRef) - 10) : ''}>
                                                                                <Replay10 fontSize="large" sx={{ color : room.mediaActuallyPlayingAlreadyPlayedData.playedSeconds > 10 ? '#f0f1f0': '#303134'}} />
                                                                            </IconButton>

                                                                            <IconButton variant="contained" onClick={e => setIsPlaying(!roomIsPlaying)} sx={{ color:'#f0f1f0', position:'sticky', top:0, zIndex:2500}} >
                                                                                { roomIsPlaying && <PauseCircleOutlineIcon fontSize="large" />}
                                                                                { !roomIsPlaying && <PlayCircleOutlineIcon fontSize="large" />}
                                                                            </IconButton>
                                                                            
                                                                            <IconButton onClick={e => goToSecond(playedSeconds(playerRef) + 10)}>
                                                                                <Forward10 fontSize="large" sx={{color:'#f0f1f0'}} />
                                                                            </IconButton>

                                                                            <IconButton onClick={e => !playingLastInList(room.playlistUrls.length,playerIdPlayed) ? setIdPlaying(playerIdPlayed+1) : ''}>
                                                                                <SkipNextIcon fontSize="large" sx={{color: !playingLastInList(room.playlistUrls.length,playerIdPlayed) ? '#f0f1f0' : '#303134'}} />
                                                                            </IconButton>
                                                                        </>
                                                                    }
                                                                    {!isFromSpotify(room.playlistUrls[playerIdPlayed]) && 
                                                                        <>
                                                                            {isActuallyAdmin && 
                                                                                <IconButton onClick={e => goToSecond(0)} >
                                                                                    <Icon icon="icon-park-outline:replay-music" width="30" style={{color:'#f0f1f0'}} />
                                                                                </IconButton>
                                                                            }

                                                                            {isLayoutFullScreen(layoutDisplay) &&
                                                                                <IconButton onClick={e => setLayoutdisplay('default')} >
                                                                                    <FullscreenExitIcon fontSize="large"  sx={{color: '#f0f1f0' }} />
                                                                                </IconButton>
                                                                            }

                                                                            {!isShowSticky && 
                                                                                <VolumeButton volume={localVolume} setVolume={setLocalVolume}/>
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
                                <Toolbar className="playlistToolbar">
                                    <Typography component="h6" className="fontFamilyNunito" sx={{ flexGrow: 1, textTransform:'uppercase', fontSize:'12px', color:'white' }}>
                                            { room.playlistUrls && room.playlistUrls.length } {t('GeneralMediasInPlaylist')} :
                                    </Typography>
                                </Toolbar>
                            </>
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
                                    roomIdActuallyPlaying={playerIdPlayed} 
                                    handleChangeIsActuallyPlaying={setIsPlaying} 
                                    handleChangeIdShownInDrawer={handleChangeIdShownInDrawer}  
                                    roomIsActuallyPlaying={roomIsPlaying} 
                                    roomPlayedActuallyPlayed={playedPercents} 
                                />
                                
                                <RoomPlaylistDrawer 
                                    open={mediaDataDrawerOpen} 
                                    changeOpen={setMediaDataDrawerOpen} 
                                    isAdminView={isActuallyAdmin} 
                                    data={room.playlistUrls[mediaDataShowInDrawer]} 
                                    roomIsActuallyPlaying={roomIsPlaying}
                                    roomIdActuallyDisplaying={mediaDataShowInDrawer}
                                    roomIdActuallyPlaying={playerIdPlayed}
                                    setIdPlaying={setIdPlaying}
                                    setIsPlaying={setIsPlaying}
                                    handleVoteChange={handleVoteChange} 
                                    handleRemoveMediaFromPlaylist={handleRemoveMediaFromPlaylist}
                                    userVoteArray={localData.currentUserVotes} 
                                    roomPlaylist={room.playlistUrls} 
                                    isSpotifyAvailable={room.roomParams.spotify.IsLinked} 
                                    room={room}
                                    roomRef={roomRef}
                                />
                            </Box>
                        }
                    </>
                </Container>
            
                <>
                    <RoomModalAddMedia 
                        room={room}
                        roomIsPlaying={roomIsPlaying}
                        open={OpenAddToPlaylistModal} 
                        changeOpen={setOpenAddToPlaylistModal}
                        currentUser={currentUser} 
                        youtubeLocaleTrends={room.youtubeLocaleTrends}
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
                        roomRef={roomRef}
                        roomParams={room.roomParams}
                        roomNotifs={room.notifsArray ?? ''}
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

                    <ModalEnterRoomPassword 
                        password={room.roomParams.password}
                        open={room.roomParams.isPasswordNeeded && !isActuallyAdmin && openPassWordModal}
                        changeOpen={setOpenPassWordModal}
                    /> 
            
                <ModalChangeRoomAdmin open={openRoomChangeAdminModal} changeAdmin={changeAdmin} playlistAdminPass={room.adminPass} changeOpen={setOpenRoomChangeAdminModal} adminView={isActuallyAdmin} />
                <ModalShareRoom open={openInvitePeopleToRoomModal} changeOpen={setOpenInvitePeopleToRoomModal} />
                <ModalLeaveRoom open={openLeaveRoomModal} changeOpen={setOpenLeaveRoomModal} handleQuitRoom={handleQuitRoomInComp} />
                <ModalForceSpotifyDisconnect open={openForceDisconnectSpotifyModal} changeOpen={setOpenForceDisconnectSpotifyModal} handleDisconnectSpotify={disconnectSpotify} />
                <ModalForceDeezerDisconnect open={openForceDisconnectDeezerModal} changeOpen={setOpenForceDisconnectDeezerModal} handleDisconnectDeezer={disconnectDeezer} />
                {isTutorialShown && 
                    <RoomTutorial 
                        slideOutProp={tutoTranslateY}
                        layout={isPlaylistExistNotEmpty(room.playlistUrls) ? room.playlistUrls.length > 6 ? 'small': 'classic' : 'classic'}
                    />
                }
                </> 
            </>}
            {!loaded && <Box className="loadingRoomInfo"> <SoundWave waveNumber={450} isPlayingOrNo={true} /><Typography  className="fontFamilyNunito"> Loading ..</Typography></Box>}
        </div>
    );
};

export default withTranslation()(Room);
