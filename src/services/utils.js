import React from 'react';
import i18n from "i18next";
import dateFormat from "dateformat";

import { v4 as uuid } from 'uuid';
import SearchResultItem from '../components/rooms/SearchResultItem';
import { getCleanRoomId, updateFirebaseUser } from './utilsRoom';
import { Store } from 'react-notifications-component';
import { Typography } from '@mui/material';

export const envAppNameUrl = process.env.REACT_APP_NAME_URL;
export const envAppNameHum = process.env.REACT_APP_NAME;

export function isProdEnv() {
    return process.env.NODE_ENV === "production";
}

export function isDevEnv() {
    return process.env.NODE_ENV === "development";
}

export function secondsSinceEventFromNow(event) {
    return Date.now() - event;
}

export function isUserAnon(user) {
    return user.loginType === 'anon';
}

export function createDefaultRoomObject(roomId, roomOwner) {
    return {
        id: roomId,
        roomName:'',
        admin:roomOwner.displayName,
        adminPass:uuid().slice(0,4).toLowerCase(),
        adminUid:roomOwner.uid  ? roomOwner.uid : 'anon',
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
        localisation:{
            lat:0,
            long:0,
        },
        roomParams:{
            isChatActivated:true,
            isPrivate:false,
            isLocalisable:false,
            isOnInvitation:false,
            isPasswordNeeded:false,
            password:'',
            isPlayingLooping:false,
            isAutoPlayActivated:true,
            syncPeopleByDefault:true,
            allowEverybodyToAddMedia:true,
            interactionsAllowed:true,
            interactionFrequence:5000,
        },
        enablerSpotify:{
                isLinked:false,
                isLinkable:true,
                alreadyHaveBeenLinked:false,
                token:'',
                tokenTimestamp:0,
                expirationTokenTimestamp:0,
                userConnected:''
        },
        localeYoutubeTrends : [],
        localeYoutubeEntertainmentTrends : [],
        localeYoutubeMusicTrends : [],
        localeYoutubeGamingTrends : [],
        interactionsArray:[],
        messagesArray:[],
        creationTimeStamp	: Date.now()
    };
}

export function cleanMediaTitle(mediaTitle) {
    mediaTitle = mediaTitle.replace('&amp;', '&');
    mediaTitle = mediaTitle.replace('&quot;', '"');
    mediaTitle = mediaTitle.replace('&#39;', "'");
    return mediaTitle;
}

export function getDisplayTitle(media, length = 25) {
    return media.title ? cleanMediaTitle(media.title) : media.url.substring(0,length)+'..'
}

export function formatNumberToMinAndSec(number) {
    var minute = ~~(Math.round(number)/60)+'m';
    var seconde = Math.round(number)%60+'s';
    return minute+' '+seconde;
}

export function isFromSource(itemSource, sourceCheck) {
    return itemSource === sourceCheck;
}

export function isFromSpotify(media = null) {
    return media.source === 'spotify';
}

export function isFromDeezer(media) {
    return media.source === 'deezer';
}

export function isVarNull(varTested) {
    return varTested === null;
}

export function isVarExist(varTested) {
    return typeof(varTested) !== 'undefined' && varTested;
}
export function isVarExistNotNull(varTested) {
    return typeof(varTested) !== 'undefined' && varTested !== null;
}
export function isVarExistNotNullNotempty(varTested) {
    return typeof(varTested) !== 'undefined' && varTested !== null && !isEmpty(varTested);
}

export function isVarExistNotEmpty(varTested) {
    return typeof(varTested) !== 'undefined' && varTested && (varTested.length > 0);
}

export function isPlaylistExistNotEmpty(playlist) {
    return typeof(playlist) !== 'undefined' && playlist && (playlist.length > 0);
}

export function playingFirstInList(currentPlayingIndex) {
    return currentPlayingIndex>0;
}

export function playingLastInList(playlistLength, currentPlayingIndex) {
    return playlistLength-1 === currentPlayingIndex;
}

export function mediaIndexExist(playlist, index) {
    return 'undefined' !== typeof playlist[index];
}

export function isTokenInvalid(tokenTimestamp, delay) {
    return (typeof(tokenTimestamp) === 'number' && tokenTimestamp > 0) && ((Date.now() - tokenTimestamp) > delay);
}

export function isLayoutFullScreen(actualLayout) {
    return actualLayout === 'fullscreen';
}

export function isLayoutDefault(actualLayout) {
    return actualLayout === 'default';
}

export function isLayoutInteractive(actualLayout) {
    return actualLayout === 'interactive';
}

export function isLayoutCompact(actualLayout) {
    return actualLayout === 'compact';
}

export function lastItemInObj(object) {
    return object.reverse().splice(0,1);
}

export const UserIsFromApp = navigator.userAgent.includes ('wv');

export function createInteractionAnimation(interaction, layoutDisplay = 'unknown') {
    const interactionDisplay = document.createElement("img");
    interactionDisplay.src = "img/"+interaction.type+".png";
    interactionDisplay.classList.add("interactionImageContainer");
    if(layoutDisplay === 'interactive') {
        interactionDisplay.style.zIndex = 1000;
    }
    interactionDisplay.style.left = interaction.left+'vw';
    interactionDisplay.style.animationDuration = interaction.speed;
    document.body.appendChild(interactionDisplay);
    setTimeout(() => {
        interactionDisplay.remove();
    }, 2000);
}

export function waitingTextReaction(delayMs) {
    return i18n.t('GeneralEvery')+' '+ (delayMs/1000)  +" "+i18n.t('GeneralSeconds');
}
export function waitingTextChat(delay) {
    return i18n.t('GeneralWait')+' '+delay+' '+i18n.t('GeneralSeconds');
}

export function isUndefined(val) {
    return typeof(val) === 'undefined';
}

export function isEmpty(val) {
    return val.length === 0;
}

export function getRandomHexColor() {
  const r = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  const g = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  const b = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  
  const hexColor = `#${r}${g}${b}`;
  
  return hexColor;
}

export function GFontIcon({icon, customClass = '', style = ''}) {
    const combinedClass = `material-symbols-outlined ${customClass}`;
    return <span className={combinedClass}>{icon}</span>;
}

export const delay = ms => new Promise(res => setTimeout(res, ms));

export function randomInt(min, max) {
    return Math.floor(Math.random()*max) + min;
}

export function getLocale() {
    var lang = 'en';
    if(navigator.language === 'fr' || navigator.language === 'fr-FR') {
        lang = 'fr';
    }
    return lang;
}

export function enablersDurationToReadable(duration, enabler = 'youtube') {
    switch(enabler) {
        case 'youtube': 
            // youtube send a weird format
            var match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

            match = match.slice(1).map(function(x) {
                if (x != null) {
                    return x.replace(/\D/, '');
                }
            });

            var hours = (parseInt(match[0]) || 0);
            var minutes = (parseInt(match[1]) || 0);
            var seconds = (parseInt(match[2]) || 0);
            return hours * 3600 + minutes * 60 + seconds;

        case 'spotify':
            // spotify send millisecond
            return Math.floor(duration / 1000);
        default:
        break;
    }
 
}

export function getCarouselItemsArray(youtubeResults,addingObject, addItemToPlaylist) {
    var carouselItems = [];
    youtubeResults.forEach(media => {
        carouselItems.push({
                id: media.id,
                renderItem: 
                <SearchResultItem
                    key={media.id}
                    image={media.snippet.thumbnails.high.url}
                    title={cleanMediaTitle(media.snippet.title)}
                    description={media.snippet.description}
                    source='youtube'
                    uid={uuid().slice(0, 10).toLowerCase()}
                    platformId={media.id}
                    duration={media.contentDetails.duration ? enablersDurationToReadable(media.contentDetails.duration, 'youtube') : null}
                    addedBy={addingObject.addedBy}
                    url={'https://www.youtube.com/watch?v=' + media.id}
                    date={dateFormat(media.snippet.publishedAt, 'd mmm yyyy')}
                    channelOrArtist={media.snippet.channelTitle}
                    addItemToPlaylist={addItemToPlaylist}
                />,
        })
    });

    return carouselItems;
    
}

export function isPseudoEnteredValid(pseudo) {
    return (pseudo.trim().length >= 5 && pseudo.trim().length <= 15);
}

export function cleanPseudoEntered(pseudo) {
    return pseudo.charAt(0).toUpperCase() + pseudo.slice(1);
}

export async function getPlayerSec(playerRef) {
    var playerSec = 0;
    if(typeof playerRef.current.getCurrentTime !== "undefined") {
        playerSec = Math.floor(playerRef.current.getCurrentTime());
    } 
    return playerSec;
}

export async function getLocStorVotes() {
    if(null === localStorage.getItem("Play-It_UserInfoVotes")) {
        localStorage.setItem("Play-It_UserInfoVotes", JSON.stringify({up:[], down:[]}));
    }
    return JSON.parse(localStorage.getItem("Play-It_UserInfoVotes"));
}

export function getYTVidId(media) {
    return media.id.videoId ? media.id.videoId : media.id;
}

export function setPageTitle(title) {
    document.title = title;
}

export function autoAddYTObject(item) {
    return {
        addedBy : 'App_AutoPlay',
        visuel: item.snippet.thumbnails.high.url,
        hashId: uuid().slice(0,10).toLowerCase(),
        source: 'youtube',
        channelOrArtist:item.snippet.channelTitle,
        description:item.snippet.description,
        platformId:item.id.videoId,
        title:cleanMediaTitle(item.snippet.title),
        url:'https://www.youtube.com/watch?v='+item.id.videoId, 
        vote: {'up':0,'down':0}
    }
}

export function hexColorToRgb(hex) {
    // Supprime le "#" du début si présent
    hex = hex.replace('#', '');

    // Décompose la couleur hexadécimale en composantes RGB
    let r, g, b;
    if (hex.length === 3) {
        // Gestion du format raccourci "#RGB"
        r = parseInt(hex.charAt(0) + hex.charAt(0), 16);
        g = parseInt(hex.charAt(1) + hex.charAt(1), 16);
        b = parseInt(hex.charAt(2) + hex.charAt(2), 16);
    } else if (hex.length === 6) {
        // Gestion du format complet "#RRGGBB"
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
    } else {
        // Format incorrect de la couleur hexadécimale
        throw new Error('Format de couleur hexadécimale incorrect.');
    }

    // Retourne les composantes RGB sous forme d'objet
    return +r+', '+g+','+ b ;
}

export function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Rayon de la Terre en mètres

    const toRadians = (degrees) => degrees * (Math.PI / 180);

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance en mètres
    return distance;
}

export function getReadeableDistance(distanceInMeters) {
    if (distanceInMeters < 100) {
        return distanceInMeters.toFixed(0) + ' cm';
    }
    if (distanceInMeters < 1000) {
        return distanceInMeters.toFixed(0) + 'm';
    } 
    else {
        let distanceInKilometers = distanceInMeters / 1000;
        return distanceInKilometers.toFixed(2) +' km';
    }
}

export const appApkFileUrl = process.env.REACT_APP_FRONT_HOME_URL+"/play-it.apk";

// retourne le timestamp d'un certain moment
export function getTimeStampOfMoment(moment) {
    let hoursOffset = parseFloat(moment);

    // Obtenir le timestamp actuel en millisecondes
    let currentTimestamp = Date.now();

    // Calculer le décalage en millisecondes
    let offsetMilliseconds = hoursOffset * 60 * 60 * 1000;

    // Calculer le nouveau timestamp en ajoutant ou soustrayant le décalage
    let newTimestamp = currentTimestamp + offsetMilliseconds;

    // Retourner le nouveau timestamp
    return newTimestamp;

}

export function userSpotifyTokenObject(token = null, connectOrReset = 'connect') {
    return {
        token: (connectOrReset === 'connect') ? token : '',
        refreshtoken:null,
        expiration: (connectOrReset === 'connect') ? getTimeStampOfMoment('+1') : '',
        alreadyConnected:true,
        connected:(connectOrReset === 'connect') ? true : false,
        lastConnexionTimestamp: (connectOrReset === 'connect') ? Date.now() : '',
    }
}

export function roomSpotifyTokenObject(userToken = null, userUid = null, connectOrReset = 'reset') {
    return {
        isLinked: (connectOrReset === 'connect') ? true : false,
        isLinkable:true,
        token:(connectOrReset === 'connect') ? userToken.token : '',
        expirationTokenTimestamp: (connectOrReset === 'connect') ? userToken.expiration : '',
        alreadyHaveBeenLinked:true,
        userConnected:(connectOrReset === 'connect') ? userUid : '',
        tokenTimestamp: (connectOrReset === 'connect') ? userToken.lastConnexionTimestamp : '',
    }
}



export function checkStorageRoomId(roomId = '', joinRoomByRoomId ) { // handle recovery of room id (from url or local memory)
    if(localStorage.getItem("Play-It_RoomId")) { // check if user have roomid in memory storage
        isEmpty(roomId) ?  
            joinRoomByRoomId(localStorage.getItem("Play-It_RoomId")) // if don't have room id in url then join the one in memory
            : // in url (new access or redirect)
            localStorage.setItem("Play-It_RoomId", getCleanRoomId(roomId)) // if have room id in url keep going,just set it in memory 
        ;
    }
}



// TEST SAVE USER SPOTIFY TOKEN IN FIREBASE
export async function saveSpotifyToken(userRef,SpotifyTokenObject,userInfos, setUserInfo, joinRoomByRoomId) {
    await updateFirebaseUser(userRef,{spotifyConnect:SpotifyTokenObject});

    showLocalNotification('Lecteur Spotify', 'Connexion établie !', 'success', 2500 );
    userInfos.customDatas.spotifyConnect = SpotifyTokenObject;
    setUserInfo(userInfos);
    joinRoomByRoomId(localStorage.getItem("Play-It_RoomId"));
}

export function getArtistsSpotify(artistsArray) {
    var returnString = '';
    var i = 0;
    artistsArray.forEach(artist => {
        returnString = (i === 0) ? artist.name : returnString+ ' & ' +artist.name;
        i++;
    });
    return returnString;
}

export const spotifyConnectUrl = process.env.REACT_APP_ROOM_SPOTIFY_AUTH_ENDPOINT+'?client_id='+process.env.REACT_APP_ROOM_SPOTIFY_CLIENT_ID+'&scope=user-read-playback-state%20streaming%20user-read-email%20user-modify-playback-state%20user-read-private%20user-top-read%20playlist-read-private&redirect_uri='+process.env.REACT_APP_FRONT_HOME_URL+'&response_type='+process.env.REACT_APP_ROOM_SPOTIFY_RESPONSE_TYPE

export function goToSpotifyConnectUrl() {
    window.location.href = spotifyConnectUrl;
}

// add local only  notifs
export function showLocalNotification(title,message,type,duration) {
    Store.addNotification({
                title: title,
                message: <Typography>{message}</Typography>,
                type: type,
                insert: "bottom",
                container: "bottom-right",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: {
                    duration: duration,
                    onScreen: true,
                    pauseOnHover: true,
                    showIcon: true,
                    click: true,
                    touch: true
                },
                touchSlidingExit: {
                    swipe: {
                        duration: 400,
                        timingFunction: 'ease-out',
                        delay: 0,
                    },
                    fade: {
                        duration: 400,
                        timingFunction: 'ease-out',
                        delay: 0
                    }
                }
            });
}