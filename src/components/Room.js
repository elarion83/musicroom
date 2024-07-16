'use client';

import React, { useEffect, useRef, useState } from "react";
import {  db } from "../services/firebase";
import { doc, getDoc, onSnapshot, setDoc, } from 'firebase/firestore';
import { useIdleTimer } from 'react-idle-timer'
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import 'animate.css';
import axios from "axios";
import ReactPlayer from 'react-player';
import SpotifyPlayer from 'react-spotify-web-playback';
import useKeypress from 'react-use-keypress';
import {isFromSpotify,getDisplayTitle,createInteractionAnimation, isPlaylistExistNotEmpty,mediaIndexExist,isLayoutDefault,isLayoutInteractive,isLayoutCompact, isLayoutFullScreen, playingLastInList, createDefaultRoomObject, formatNumberToMinAndSec, delay, isVarExist,  isDevEnv, secondsSinceEventFromNow, autoAddYTObject, randomInt, isVarExistNotEmpty, setPageTitle, envAppNameUrl, isEmpty, roomSpotifyTokenObject, spotifyConnectUrl, goToSpotifyConnectUrl} from '../services/utils';
import RoomPlaylistDrawer from "./rooms/playlistSection/drawer/RoomPlaylistDrawer";

import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import Typography from '@mui/material/Typography';

import RoomModalAddMedia from './rooms/modalsOrDialogs/ModalAddMedia';
import ModalLeaveRoom from './rooms/modalsOrDialogs/ModalLeaveRoom';
import ModalRoomParams from './rooms/modalsOrDialogs/ModalRoomParams';
import ModalShareRoom from './rooms/modalsOrDialogs/ModalShareRoom';

import BottomInteractions from "./rooms/bottomSection/BottomInteractions";
import RoomTopBar from "./rooms/RoomTopBar";
import RoomPlaylist from "./rooms/playlistSection/RoomPlaylist";

import { CreateGoogleAnalyticsEvent } from '../services/googleAnalytics';

import { withTranslation } from 'react-i18next';
import ModalEnterRoomPassword from "./rooms/modalsOrDialogs/ModalEnterRoomPassword";
import EmptyPlaylist from "./rooms/playlistSection/EmptyPlaylist";
import { emptyToken, interactionObject, playerRefObject, youtubeApiSearchObject, youtubeApiVideosParams } from "../services/utilsArray";
import { addPlaylistNotif, checkCurrentUserSpotifyTokenExpiration, playedSeconds, playerNotSync, updateFirebaseRoom } from "../services/utilsRoom";
import ModalChangeRoomAdmin from "./rooms/modalsOrDialogs/ModalChangeRoomAdmin";
import RoomTutorial from "./rooms/RoomTutorial";
import { mockYoutubeGamingResult, mockYoutubeMusicResult, mockYoutubeTrendResult } from "../services/mockedArray";
import SoundWave from "../services/SoundWave";
import { returnAnimateReplace } from "../services/animateReplace";
import PlayerButtons from "./rooms/playerSection/PlayerButtons";
import { AlertTitle } from "@mui/material";
import Notifications from "./rooms/Notifications";

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
    const spotifyPlayerRef = useRef();
	const [playerIdPlayed, setPlayerIdPlayed] = useState(0);
    const [playerControlsShown, setPlayerControlsShown] = useState(false);
	const [roomIsPlaying, setRoomIsPlaying] = useState(true);
    const [playingJustChanged, setPlayingJustChanged] = useState(false);
    const [localVolume, setLocalVolume] = useState(1);
    const [pip] = useState(true);
    const [guestSynchroOrNot, setGuestSynchroOrNot] = useState(true);
    const [playerReady, setPlayerReady] = useState(false);
	const [playerBuffering, setPlayerBuffering] = useState(false);
    const [spotifyPlayerIsPlaying, setSpotifyPlayerIsPlaying] = useState(false);
	const [playedPercents, setPlayedPercents] = useState(0);

    // MODALS
    const [openInvitePeopleToRoomModal, setOpenInvitePeopleToRoomModal] = useState(false);
    const [openPassWordModal, setOpenPassWordModal] = useState(true);
    const [OpenAddToPlaylistModal, setOpenAddToPlaylistModal] = useState(false);
    const [openRoomParamModal, setOpenRoomParamModal] = useState(false);
    const [openRoomChangeAdminModal, setOpenRoomChangeAdminModal] = useState(false);
    const [openLeaveRoomModal, setOpenLeaveRoomModal] = useState(false);

    // drawer
    const [openRoomDrawer, setOpenRoomDrawer] = useState(false);
    const [mediaDataShowInDrawer, setMediaDataShowInDrawer] = useState();
    const [mediaDataDrawerOpen, setMediaDataDrawerOpen] = useState(false);

    // layout and display elements
    const [layoutDisplay, setLayoutdisplay] = useState('default');
    const [layoutDisplayClass, setLayoutDisplayClass] = useState('defaultLayout');
    const [barPercentage, setBarPercentage] = useState(0);

    // animated elements
    const animatedElementsRef = [];

    useEffect(() => {
        var adminClass = guestSynchroOrNot ? isActuallyAdmin ? 'adminView' : 'guestView' : '';
        switch (layoutDisplay) {
            case 'fullscreen':
                setLayoutDisplayClass('fullscreenLayout '+adminClass);
                break;
            default:
                setLayoutDisplayClass('defaultLayout '+adminClass);
        }
    }, [layoutDisplay, guestSynchroOrNot, isActuallyAdmin]);

    // FULL SCREEN INACTIVITY
    const [remaining, setRemaining] = useState(0)
    const [layoutIdle, setLayoutIdle] = useState(false);

    const onIdle = async() => {
        if(isLayoutFullScreen(layoutDisplay) || (isLayoutDefault(layoutDisplay) && window.innerWidth < 600)) {
            returnAnimateReplace(animatedElementsRef, {Right:"Left",Up:"Down", In:"Out"}, /Right|Up|In/gi);
            await delay(500);
            setLayoutIdle(true);
        }
    }

    const onActive = async() => {
        if(isLayoutFullScreen(layoutDisplay) || (isLayoutDefault(layoutDisplay) && window.innerWidth < 600)) {
            returnAnimateReplace(animatedElementsRef, {Left:"Right",Down:"Up", Out:"In"}, /Left|Down|Out/gi);     
            setLayoutIdle(false);
        }
    }

    const { getRemainingTime } = useIdleTimer({
        onIdle,
        onActive,
        timeout: 12_000,
        throttle: 2000,
        events:[
            'mousemove',
            'keydown',
            'wheel',
            'DOMMouseScroll',
            'mousewheel',
            'mouseover',
            'mousedown',
            'touchstart',
            'touchmove',
            'MSPointerDown',
            'pointermove',
            'MSPointerMove',
            'visibilitychange',
            'scroll'
            ]
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setRemaining(Math.ceil(getRemainingTime() / 1000))
        }, 500)

        return () => {
            clearInterval(interval);
        }
    });

    // TUTORIAL
    const [isTutorialShown, setIsTutorialShown] = useState(true);

    useEffect(() => {
        if(OpenAddToPlaylistModal && isTutorialShown) {
            setIsTutorialShown(false);
        }
    }, [OpenAddToPlaylistModal]) ;

    // GET DOCUMENT ON INIT (get firebase room datas)
	useEffect(() => {
        if(isVarExistNotEmpty(roomId)) {
            const initRoomFetchFirebase = async () => {
                const firebaseRoom = await getDoc(roomRef);
                var roomDatas = firebaseRoom.exists() ? firebaseRoom.data() : createDefaultRoomObject(roomId.toLowerCase(), currentUser);
                initRoom(roomDatas, roomId.toLowerCase(), !firebaseRoom.exists(), currentUser, roomRef);
            };
            initRoomFetchFirebase();
            setPageTitle('Playlist '+roomId+ ' | '+envAppNameUrl);
        }
	}, [roomId]);

    /* Init room : if new room, create it then next function */
    async function initRoom(roomDatas, roomId = '', create = true, currentUser, docRef = null) {
        if(create) {
            await setDoc(docRef, roomDatas);
            initRoomAsync(roomDatas, currentUser, create);
        } else {
            initRoomAsync(roomDatas, currentUser, create)
        }
    }

    /* create local room object, set player, admin, controls, ... then loaded */
    async function initRoomAsync(roomDatas, currentUser, create) {
        setRoom(roomDatas);
        setPlayerIdPlayed(roomDatas.playing);
        setIsActuallyAdmin(currentUser.uid === roomDatas.adminUid);
        setPlayerControlsShown(currentUser.uid === roomDatas.adminUid);
        setRoomIsPlaying(roomDatas.actuallyPlaying);
        setLoaded(true);
        addPlaylistNotif(currentUser.displayName, create ? 'a crée la playlist.' : 'est arrivé !', create ? 'success' : 'info', 4500, roomRef);
    }

    // AUTO UPDATE DOCUMENT ON USER IS SYNC
	useEffect(() => {
        let unsubscribe = () => {};
        if(loaded) {
            if(guestSynchroOrNot) {
                setPlayerControlsShown(isActuallyAdmin);
                unsubscribe = onSnapshot(roomRef, async (doc) => {
                    var roomDataInFb = doc.data();
                    if(isVarExist(roomDataInFb)) {
                        var actualMessagesLength = room.messagesArray.length;
                        
                        if(!roomDataInFb.playlistEmpty) {
                            var playerRefObject = isFromSpotify(roomDataInFb.playlistUrls[roomDataInFb.playing]) ? spotifyPlayerRef : playerRef;
                            if(isVarExist(playerRefObject.current) && !isActuallyAdmin && playerNotSync(roomDataInFb, playerRefObject)) {
                                goToSecond(Math.floor(roomDataInFb.mediaActuallyPlayingAlreadyPlayedData.playedSeconds));
                            } 
                        }

                        if(!isActuallyAdmin) {

                            setPlayerIdPlayed(roomDataInFb.playing); 
                            setRoomIsPlaying(roomDataInFb.actuallyPlaying); 
                        }

                        setRoomInteractionsArray(roomDataInFb.interactionsArray);
                    
                        setIsActuallyAdmin(roomDataInFb.adminUid == currentUser.uid);
                        
                        setRoom(roomDataInFb);
                    }
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


    /*  LOAD YOUTUBE TRENDS
    * connect room to spotify user token
    * DONE AFTER CAUSE I DON'T WANT TO LOSE TIME WHEN CREATING/FETCHING ROOM
    *   BUT IT STILL SO UGLY OMG
    * */
	useEffect(() => {
        if(loaded) {
            if(isEmpty(room.localeYoutubeEntertainmentTrends)) {
                if(isDevEnv()) {
                    updateFirebaseRoom( roomRef , {
                        localeYoutubeEntertainmentTrends: mockYoutubeTrendResult,
                        localeYoutubeGamingTrends: mockYoutubeGamingResult,
                        localeYoutubeMusicTrends: mockYoutubeMusicResult});
                    return
                } else {
                    axios.get(process.env.REACT_APP_YOUTUBE_VIDEOS_URL, { 
                        params: youtubeApiVideosParams('24', 32, 'snippet,contentDetails') 
                    })
                    .then(function (response) {
                        updateFirebaseRoom( roomRef , {localeYoutubeEntertainmentTrends: response.data.items});
                        
                        axios.get(process.env.REACT_APP_YOUTUBE_VIDEOS_URL, { 
                            params: youtubeApiVideosParams('10', 32, 'snippet,contentDetails')
                            })
                        .then(function (musicResponse) {
                            updateFirebaseRoom( roomRef , {localeYoutubeMusicTrends: musicResponse.data.items});
                            
                            axios.get(process.env.REACT_APP_YOUTUBE_VIDEOS_URL, { 
                                params: youtubeApiVideosParams('20', 32, 'snippet,contentDetails')
                            })
                            .then(function (gamingResponse) {
                                updateFirebaseRoom( roomRef , {localeYoutubeGamingTrends: gamingResponse.data.items});
                            })
                        })
                    });
                }
            }

            /* GET USER SPOTIFY TOKEN AND USE IT IN THE ROOM */
            if(currentUser.customDatas.spotifyConnect && !isEmpty(currentUser.customDatas.spotifyConnect.token)) {
                if(!room.enablerSpotify.isLinked) {
                    var userSpotifyToken = currentUser.customDatas.spotifyConnect;
                    var playlistSpotifyTokenObject = roomSpotifyTokenObject(userSpotifyToken, currentUser.customDatas.uid, 'connect');
                    addPlaylistNotif('Recherche Spotify', 'activée par '+currentUser.customDatas.displayName, 'success', 3500, roomRef);
                    updateFirebaseRoom( roomRef , {enablerSpotify: playlistSpotifyTokenObject});
                }
            }
        }
	}, [loaded, currentUser]);

	useEffect(() => {
        setPlayerControlsShown(isActuallyAdmin);
	}, [isActuallyAdmin]);
    

    async function setIsPlaying(PlayingOrNot) {
        setRoomIsPlaying(PlayingOrNot);
        checkCurrentUserSpotifyTokenExpiration();
        if(isActuallyAdmin) {
           updateFirebaseRoom( roomRef , {actuallyPlaying: PlayingOrNot})
        }
        setPlayingJustChanged(true);
        await delay(100000);
        setPlayingJustChanged(false);
    }
    
    async function setIdPlaying(idPlaying) {
        await delay(250);   
        setPlayerIdPlayed(idPlaying);
        await goToSecond(0);
        setPlayedPercents(0);
        setBarPercentage(0);
        await delay(250);        
        let pageTitle = (roomIsPlaying && isVarExistNotEmpty(room.playlistUrls)) ? room.playlistUrls[idPlaying].title : 'Playlist '+roomId;
        setPageTitle(pageTitle+ ' | '+envAppNameUrl);
        if(isActuallyAdmin) {
           updateFirebaseRoom( roomRef , {
                playing: idPlaying,
                mediaActuallyPlayingAlreadyPlayedData:{
                    playedSeconds:0
                }
            })
        }
    }

    const [isLookingAutoAdd, setIsLookingAutoAdd] = useState(false);
    async function handleProgress(event, playerObjectRef, setBar = true) {
        if(setBar) {
            setBarPercentage(Math.floor(event.played*100));
        }
        if(isActuallyAdmin) {
            if(Math.floor(event.played*100) > 85 && room.roomParams.isAutoPlayActivated && !mediaIndexExist(room.playlistUrls,playerIdPlayed+1) && !isLookingAutoAdd) { 
                setIsLookingAutoAdd(true);
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
        }
    }

    async function goToSecond(seconds) {
        if(!room.playlistEmpty) {
            if(isFromSpotify(room.playlistUrls[playerIdPlayed])) {
                if(spotifyPlayerRef.current && spotifyPlayerRef.current.player) {
                    spotifyPlayerRef.current.player.seek(seconds*1000);
                }
            } else {
                if(playerRef.current) {
                    playerRef.current.seekTo(seconds, 'seconds'); 
                }
            }
        }
    }
    
    useEffect(() => {
        let pageTitle = (roomIsPlaying && isVarExistNotEmpty(room.playlistUrls)) ? room.playlistUrls[playerIdPlayed].title : 'Playlist '+roomId;
        setPageTitle(pageTitle+' | '+envAppNameUrl);
    }, [roomIsPlaying]);
            
    useKeypress(['Escape'], () => {
        if(isLayoutFullScreen(layoutDisplay) || isLayoutInteractive(layoutDisplay)) {
            setLayoutdisplay('default');
        }
    });
    
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
  

    async function handleQuitRoomInComp() {
        await addPlaylistNotif(currentUser.displayName, 'est parti', 'danger', 2500, roomRef);
        handleQuitRoom();
    }

// NEW FUNCTIONS FROM CHILD COMP
    async function handleAddValidatedObjectToPlaylist(validatedObjectToAdd) {
        validatedObjectToAdd.timestamp = Date.now();
        room.playlistUrls.push(validatedObjectToAdd);
        
        updateFirebaseRoom( roomRef , {playlistUrls: room.playlistUrls, playlistEmpty: false});        
        room.playlistEmpty = false;
        await addPlaylistNotif(validatedObjectToAdd.addedBy +' a ajouté', validatedObjectToAdd.title, 'info', 4500, roomRef);
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

    async function handleUpdateRoomGeoloc() {
        let posObject = {lat:0,long:0};
        let tempParams = room.roomParams;

        if(!tempParams.isLocalisable) {
            navigator.geolocation.getCurrentPosition(async function(position) {
                posObject = {
                    lat:position.coords.latitude,
                    long:position.coords.longitude,
                }
                tempParams.isLocalisable = true;
                updateFirebaseRoom( roomRef , {localisation: posObject, roomParams:tempParams});        
                await addPlaylistNotif(currentUser.displayName, 'a géolocalisé la playlist.', 'info', 2500, roomRef);
            });
        } else {
            tempParams.isLocalisable = false;
            updateFirebaseRoom( roomRef , {localisation: posObject, roomParams:tempParams});
            await addPlaylistNotif(currentUser.displayName, 'a désactivé la géolocalisation.', 'warning', 2500, roomRef);
        }  
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

    useEffect(() => {
        
        var updateSpotifyPlayerInfos = async () => {};
        if(spotifyPlayerIsPlaying) {
            updateSpotifyPlayerInfos = async () => {
                if (spotifyPlayerRef.current) {
                    var SpotifyPlayedPercents = Math.floor(spotifyPlayerRef.current.state.position);
                    var SpotifyplayedSeconds = spotifyPlayerRef.current.state.progressMs/1000;

                    var progressObjectEvent = {
                        playedSeconds:SpotifyplayedSeconds,
                        playedPercentage:SpotifyPlayedPercents,
                        played : SpotifyPlayedPercents/100
                    }

                    await handleProgress(progressObjectEvent, spotifyPlayerRef, false);
                    
                    setBarPercentage(SpotifyPlayedPercents);
                }
            };
        } else {
            updateSpotifyPlayerInfos = async () => {};
        }
        let intervalId = setInterval(updateSpotifyPlayerInfos, 2000); // Toutes les 2 secondes
        return () => {
            clearInterval(intervalId);
        };
    
    }, [spotifyPlayerIsPlaying]);

    async function SpotifyPlayerCallBack(e){
        if(e.type === 'player_update') {
            if(spotifyPlayerIsPlaying !== e.isPlaying) {
                setSpotifyPlayerIsPlaying(e.isPlaying); 
            }
            if(e.previousTracks[0] && (e.track.id === e.previousTracks[0].id)) {
               await handleMediaEnd();
            }
        }
    }
   
    // use state change to change spotify volume
    useEffect(() => {
        if(loaded && isVarExist(spotifyPlayerRef.current)) { 
            spotifyPlayerRef.current.setVolume(localVolume);
        }
    }, [localVolume,loaded]);

    async function addMediaForAutoPlayByYoutubeId(lastMediaTitle) {
        var params = youtubeApiSearchObject(lastMediaTitle.split('-')[0],6 );

        await axios.get(process.env.REACT_APP_YOUTUBE_SEARCH_URL, { params: params })
        .then(async function(response) {
            if(!isEmpty(response.data.items)) {
                var addedItemIndex = randomInt(0,response.data.items.length-1);
                var suggestMedia = autoAddYTObject(response.data.items[addedItemIndex]);
                if(suggestMedia.platformId === room.playlistUrls[playerIdPlayed].platformId) {
                    response.data.items.splice(addedItemIndex, 1);
                    addedItemIndex = randomInt(0,response.data.items.length-1);
                    suggestMedia = autoAddYTObject(response.data.items[addedItemIndex]);
                }
                await handleAddValidatedObjectToPlaylist(suggestMedia);
                setIsLookingAutoAdd(false);
                CreateGoogleAnalyticsEvent('Actions','Autoplay add', 'Autoplay add');
            }
        });
    }

    async function changeAdmin() {
        addPlaylistNotif(currentUser.displayName, ' est désormais hôte !', 'info', 2500,  roomRef);
        updateFirebaseRoom( roomRef , {admin: currentUser.displayName, adminUid: currentUser.uid}); 
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
                    isLinkedToSpotify={room.enablerSpotify.IsLinked}
                    isLinkedToDeezer={true}
                />
            
                <Container maxWidth={false} sx={{ padding: '0 !important'}} className={layoutDisplayClass} >
                    <>
                        {!room.playlistEmpty && 
                            <>
                                {isVarExistNotEmpty(room.playlistUrls) && 
                                    <Box p={0} sx={{bgcolor:'#303030',borderBottom: '2px solid var(--border-color)'}} className={'youtubeDisplay'}> 
                                        <Grid container spacing={0} sx={{ bgcolor:'var(--grey-dark)'}} className={ isLayoutCompact(layoutDisplay) ? 'playerHide playerSection' : 'playerShow playerSection'}>
                                            
                                            <Grid item className='playerContainer' sm={4} xs={12} sx={{ pl:0,ml:0, pt: 0, position:'relative'}}>
                                                {playingJustChanged && 
                                                    <Box className="iconOverPlayer">
                                                        { roomIsPlaying ? (
                                                                <PlayCircleOutlineIcon className='colorWhite' />
                                                            ) : (
                                                                <PauseCircleOutlineIcon className='colorWhite' />
                                                            )
                                                        }
                                                    </Box>
                                                }
                                                
                                                {room.playlistUrls[playerIdPlayed] && 
                                                    <>
                                                        {!isFromSpotify(room.playlistUrls[playerIdPlayed]) ? 
                                                            (
                                                                <>
                                                                    <ReactPlayer 
                                                                        ref={playerRef}
                                                                        className='react-player'
                                                                        width='100%'
                                                                        pip={pip}
                                                                        height='100%'
                                                                        volume={localVolume}
                                                                        onProgress={e => handleProgress(e, playerRef)}
                                                                        progressInterval = {1000}
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
                                                                </>
                                                            ) : (
                                                                <>
                                                                    {(!currentUser.customDatas.spotifyConnect.connected && isFromSpotify(room.playlistUrls[playerIdPlayed])) &&
                                                                        <Alert className="animate__animated animate__fadeInUp animate__slow texturaBgButton bord2 bordGreen bordSolid alertConnectSpotify" onClick={(e) => goToSpotifyConnectUrl()} >
                                                                            <AlertTitle sx={{fontWeight:"bold"}}>Spotify Player</AlertTitle>
                                                                            <Typography fontSize="small" component="p">
                                                                                Connecte ton compte pour profiter du player Spotify toi aussi !
                                                                            </Typography>
                                                                        </Alert>
                                                                    }
                                                                    <Grid className="react-player" >
                                                                        <img style={{marginLeft:'auto', display:'block',marginRight:'auto',maxHeight:'240px'}} src={room.playlistUrls[room.playing].visuel} />
                                                                        {currentUser.customDatas.spotifyConnect.connected ? 
                                                                            (
                                                                                <SpotifyPlayer
                                                                                    ref={spotifyPlayerRef}
                                                                                    callback={SpotifyPlayerCallBack}
                                                                                    seekUpdateInterval={1}
                                                                                    playerProgressInterval={1000}
                                                                                    token={currentUser.customDatas.spotifyConnect.token}
                                                                                    uris={room.playlistUrls[playerIdPlayed].url}
                                                                                    play={roomIsPlaying}
                                                                                    autoPlay={roomIsPlaying}
                                                                                    initialVolume={localVolume}
                                                                                />
                                                                            ) : (<></>
                                                                            )
                                                                        }
                                                                    </Grid>
                                                                </>
                                                            )
                                                        }
                                                        
                                                        {(isActuallyAdmin || !guestSynchroOrNot) && 
                                                            <div onClick={e => playerControlsShown ? setIsPlaying(!roomIsPlaying) : ''}>
                                                            </div>
                                                        }
                                                    </>
                                                }
                                                 
                                            </Grid>
                                            <Grid item sm={8} xs={12} sx={{ padding:0,pl:0,ml:0, mb: 0,pt:0,height:'100%', color:'white' }} className={`player_right_side_container`}>
                                                { /* pip ? 'Disable PiP' : 'Enable PiP' */ }
                                                <Grid item sm={12} sx={{ padding:0,pl:1.5,ml:0, mb: 0 , mt:1, fill:'#f0f1f0'}}>
                                                    <Grid item 
                                                    className="flexRowCenterH">
                                                        <Typography component={'span'} className='colorWhite varelaFontTitle'>
                                                            {getDisplayTitle(room.playlistUrls[playerIdPlayed], 50)}
                                                        </Typography>
                                                    </Grid>

                                                    <Typography sx={{ display:'block', width:'100%',ml:0, mb: 1, fontSize: '14px', color:'var(--grey-lighter)' }} className='textCapialize fontFamilyNunito'>
                                                        {room.playlistUrls[playerIdPlayed].channelOrArtist}
                                                    </Typography> 

                                                    <Grid item sm={12} md={12} >
                                                        <Typography sx={{ display:'block', width:'100%',ml:0, mb: 0, fontSize: '10px', color:'var(--grey-inspired)' }} className='textCapialize fontFamilyNunito'>
                                                            {/*roomIsPlaying ? t('GeneralPlaying') : t('GeneralPause') */}
                                                            {playerBuffering ? ' Loading' : ''}
                                                        </Typography> 
                                                        {(playerReady && playerRef.current !== null && !isFromSpotify(room.playlistUrls[playerIdPlayed])) && 
                                                            <Typography sx={{ fontSize: '10px', ml:0, mb: 1, color:'var(--grey-inspired)'}} className='fontFamilyNunito'>
                                                                {formatNumberToMinAndSec(playedSeconds(playerRef, 'youtube')) +' / ' + formatNumberToMinAndSec(playerRef.current.getDuration())}
                                                            </Typography>
                                                        }
                                                        {isVarExist(spotifyPlayerRef.current) && isFromSpotify(room.playlistUrls[playerIdPlayed]) && 
                                                            <Typography sx={{ fontSize: '10px', ml:0, mb: 1, color:'var(--grey-inspired)'}} className='fontFamilyNunito'>
                                                                {formatNumberToMinAndSec(playedSeconds(spotifyPlayerRef, 'spotify'))} / {room.playlistUrls[playerIdPlayed].duration}
                                                            </Typography>
                                                        }
                                                    </Grid>
                                                </Grid>                                                 

                                                {!layoutIdle && 
                                                    <Grid className='player_button_container' item sm={12} sx={{ display:'flex', flexWrap:'wrap',padding:0,pl:1.5,ml:0, pr:1.5,mb: 0 , mt:1, fill:'#f0f1f0'}}   >
                                                        {(isLayoutDefault(layoutDisplay) || isLayoutFullScreen(layoutDisplay)) &&
                                                            <Box sx={{width:'100%'}} ref={el => animatedElementsRef.push(el)} className='animate__animated animate__fadeInUp animate__fast'>
                                                                <Grid 
                                                                item sm={6} className='playerButtons' xs={12} 
                                                                sx={{ display:'flex',justifyContent: 'space-between', padding:0,pt:1,ml:0,mr:1,pr:0, mb: 1.5 }}>
                                                                    
                                                                        <PlayerButtons 
                                                                            playerControlsShown={playerControlsShown}
                                                                            room={room}
                                                                            playerRef={isFromSpotify(room.playlistUrls[playerIdPlayed]) ? spotifyPlayerRef : playerRef}
                                                                            localVolume={localVolume}
                                                                            setLocalVolume={setLocalVolume}
                                                                            playerIdPlayed={playerIdPlayed}
                                                                            roomIsPlaying={roomIsPlaying}
                                                                            setIsPlaying={setIsPlaying}
                                                                            setIdPlaying={setIdPlaying}
                                                                            setLayoutdisplay={setLayoutdisplay}
                                                                            goToSecond={goToSecond}
                                                                            playingLastInList={playingLastInList}
                                                                            isLayoutFullScreen={isLayoutFullScreen}
                                                                            layoutDisplay={layoutDisplay}
                                                                            playingLastInListInComp={playingLastInList}
                                                                            roomPlayedActuallyPlayed={barPercentage} 
                                                                            playerType={room.playlistUrls[playerIdPlayed].source}
                                                                            spotifyControlsShown={currentUser.customDatas.spotifyConnect.connected}
                                                                        />
                                                                </Grid>
                                                            </Box>
                                                        }
                                                    </Grid>
                                                }
                                            </Grid>
                                        </Grid>
                                    </Box>
                                }
                                <Toolbar className="playlistToolbar">
                                    <Typography component="h6" className="fontFamilyNunito textCapitalize colorWhite" sx={{ flexGrow: 1, fontSize:'12px' }}>
                                             {t('GeneralInPlaylist')} 
                                    </Typography>
                                </Toolbar>
                            </>
                        }
                        { room.playlistEmpty && 
                            <EmptyPlaylist 
                                isAdminView={isActuallyAdmin} 
                                setOpenInvitePeopleToRoomModal={setOpenInvitePeopleToRoomModal}
                                setOpenAddToPlaylistModal={setOpenAddToPlaylistModal}
                                spotifyIsLinked={room.enablerSpotify.IsLinked}
                                roomParams={room.roomParams}
                                roomRef={roomRef}
                                updateFirebaseRoom={updateFirebaseRoom}
                            />
                        }
                        {isPlaylistExistNotEmpty(room.playlistUrls) && 
                            <Box className="roomPlaylistbloc" sx={{ p:0,mb:0}}>
                                <RoomPlaylist 
                                    isSpotifyAvailable={currentUser.customDatas.spotifyConnect.connected} 
                                    roomPlaylist={room.playlistUrls} 
                                    roomIdActuallyPlaying={playerIdPlayed} 
                                    handleChangeIsActuallyPlaying={setIsPlaying} 
                                    handleChangeIdShownInDrawer={handleChangeIdShownInDrawer}  
                                    roomIsActuallyPlaying={roomIsPlaying} 
                                    roomPlayedActuallyPlayed={barPercentage} 
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
                        playlistId={room.id}
                        enablerSpotify={room.enablerSpotify}
                        playlistEmpty={room.playlistEmpty}
                        roomIsPlaying={roomIsPlaying}
                        open={OpenAddToPlaylistModal} 
                        changeOpen={setOpenAddToPlaylistModal}
                        currentUser={currentUser} 
                        youtubeLocaleTrends={room.youtubeLocaleTrends}
                        DeezerTokenProps={false} 
                        spotifyTokenProps={room.enablerSpotify.token} 
                        validatedObjectToAdd={handleAddValidatedObjectToPlaylist} 
                    /> 
                    <ModalRoomParams 
                        adminView={isActuallyAdmin} 
                        open={openRoomParamModal} 
                        changeOpen={setOpenRoomParamModal} 
                        handleChangeRoomParams={handleChangeRoomParams} 
                        roomParams={room.roomParams}
                        handleChangeGeoloc={handleUpdateRoomGeoloc} 
                        roomRef={roomRef}
                        currentUser={currentUser}
                    />
                    <BottomInteractions 
                        currentUser={currentUser}
                        roomId={roomId}
                        roomRef={roomRef}
                        roomParams={room.roomParams}
                        roomMessages={room.messagesArray ?? ''}
                        roomNotifs={room.notifsArray ?? ''}
                        userCanMakeInteraction={userCanMakeInteraction}
                        setOpenAddToPlaylistModal={setOpenAddToPlaylistModal}
                        createNewRoomInteraction={createNewRoomInteraction}
                        paramDrawerIsOpen={openRoomDrawer}
                        handleOpenDrawerParam={setOpenRoomDrawer}
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
                        
                    <Notifications roomRef={roomRef} initialCount={room.notifsArray.length} />

                    {isTutorialShown && <RoomTutorial 
                        layout={isPlaylistExistNotEmpty(room.playlistUrls) ? room.playlistUrls.length > 6 ? 'small': 'classic' : 'classic'}
                    />}
                </> 
            </>}
            {!loaded && <Box className="loadingRoomInfo"> <SoundWave waveNumber={450} isPlayingOrNo={true} /><Typography  className="fontFamilyNunito"> Loading ..</Typography></Box>}
        </div>
    );
};

export default withTranslation()(Room);
