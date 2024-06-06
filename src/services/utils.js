import React from 'react';
import i18n from "i18next";
import dateFormat from "dateformat";

import { v4 as uuid } from 'uuid';
import axios from 'axios';
import SearchResultItemNew from '../components/rooms/searchResultItemNew';

export function isProdEnv() {
    return process.env.NODE_ENV === "production";
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
        roomParams:{
            isChatActivated:true,
            isPrivate:false,
            isOnInvitation:false,
            isPasswordNeeded:false,
            password:'',
            isPlayingLooping:true,
            isAutoPlayActivated:true,
            syncPeopleByDefault:true,
            allowEverybodyToAddMedia:true,
            interactionsAllowed:true,
            interactionFrequence:5000,
            deezer:{
                IsLinked:false,
                AlreadyHaveBeenLinked:false,
                Token:'',
                TokenTimestamp:0,
                UserConnected:''
            },
            spotify:{
                IsLinked:false,
                AlreadyHaveBeenLinked:false,
                Token:'',
                TokenTimestamp:0,
                UserConnected:''
            }
        },
        localeYoutubeTrends : [],
        localeYoutubeMusicTrends : [],
        interactionsArray:[],
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
    return media.title ? media.title : media.url.substring(0,length)+'..'
}

export function formatNumberToMinAndSec(number) {
    var minute = ~~(Math.round(number)/60)+'m';
    var seconde = Math.round(number)%60+'s';
    return minute+' '+seconde;
}

export function isFromSource(itemSource, sourceCheck) {
    return itemSource === sourceCheck;
}

export function isFromSpotify(media) {
    return media.source === 'spotify';
}

export function isFromDeezer(media) {
    return media.source === 'deezer';
}

export function isVarExist(varTested) {
    return typeof(varTested) !== 'undefined' && varTested;
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

export async function createInteractionAnimation(type, layoutDisplay = 'unknown') {
    const interactionDisplay = document.createElement("img");
    interactionDisplay.src = "img/"+type+".png";
    interactionDisplay.classList.add("interactionImageContainer");
    interactionDisplay.style.left = Math.random() * 100 + "vw";
    if(layoutDisplay === 'interactive') {
        interactionDisplay.style.zIndex = 2100;
    }
    interactionDisplay.style.animationDuration = Math.random() * 5 + 3 + "s ";
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

export function YTV3APIDurationToReadable(duration) {
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

}

export function getCarouselItemsArray(youtubeResults,addingObject, addItemToPlaylist) {
    var carouselItems = [];
    youtubeResults.forEach(media => {
        carouselItems.push({
                id: media.id.videoId,
                renderItem: 
                <SearchResultItemNew
                    key={media.id}
                    image={media.snippet.thumbnails.high.url}
                    title={media.snippet.title}
                    source='youtube'
                    uid={uuid().slice(0, 10).toLowerCase()}
                    platformId={media.id}
                    duration={media.contentDetails.duration ? YTV3APIDurationToReadable(media.contentDetails.duration) : null}
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