import React from 'react';
import i18n from "i18next";
import CelebrationIcon from '@mui/icons-material/Celebration';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { EmailIcon, EmailShareButton, FacebookIcon, FacebookShareButton, InstapaperIcon, InstapaperShareButton, RedditIcon, RedditShareButton, TelegramIcon, TelegramShareButton, TwitterIcon, TwitterShareButton, WhatsappIcon, WhatsappShareButton } from 'react-share';
import { formatNumberToMinAndSec, getLocale, getRandomHexColor, randomInt } from './utils';
import { v4 as uuid } from 'uuid';

export const notifsTextArray = {
    userArrived:'//AUTHOR// a rejoins la playlist !',
    userLeaved: '//AUTHOR// a quitté la playlist !',
    userSync:'//AUTHOR// s\'est synchronisé!',
    userUnSync: '//AUTHOR// s\'est désynchronisé!',
    AccNotPremium: "Le compte utilisé n'est pas premium.",
    changeAdmin: "//AUTHOR// est désormais hôte !"
};  

export const reactsArray = {
    laugh: {
        name:'laugh',
        color:'orange',
        animation:'animate__animated animate__fadeInUp animate__delay-1s animate__faster',
        icon:<EmojiEmotionsIcon fontSize="small" sx={{color:'var(--white)'}} />
    },
    heart: {
        name:'heart',
        color:'var(--red-2) !important',
        animation:'animate__animated animate__fadeInUp animate__delay-1s',
        icon:<FavoriteIcon fontSize="small" sx={{color:'var(--white)'}} />
    },
    party: {
        name:'party',
        color:'#ff9c22 !important',
        animation:'animate__animated animate__fadeInUp animate__delay-1s animate__fast',
        icon:<CelebrationIcon fontSize="small" sx={{color:'var(--white)'}} />
    }
}

export const shareArray = {
    email: {
        button:EmailShareButton,
        icon:EmailIcon
    },
    reddit: {
        button:RedditShareButton,
        icon:RedditIcon
    },
    whatsapp: {
        button:WhatsappShareButton,
        icon:WhatsappIcon
    },
    telegram: {
        button:TelegramShareButton,
        icon:TelegramIcon
    },
    twitter: {
        button:TwitterShareButton,
        icon:TwitterIcon
    },
    facebook: {
        button:FacebookShareButton,
        icon:FacebookIcon
    },
    instagram:{
        button:InstapaperShareButton,
        icon:InstapaperIcon
    }
}

export function searchTextArray() {
    return [i18n.t('GeneralSearchOn') + ' YOUTUBE'];
}

export const playerRefObject = {
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
}

/*
 CHAT DEFAULT MESSAGE OBJECT 
********** */
export function createMessageObject(user, roomId, text) {
    return {
        author: user.displayName,
        authorColor: user.color ?? 'var(--main-color)',
        roomId: roomId,
        text:text,
        timestamp: Date.now(),
    };
}

/* INTERACTION DEFAULT OBJECT
******* */
export function interactionObject(user,type) {
    return {
        timestamp:Date.now(), 
        type:type, 
        displayed:false,
        createdBy: user.displayName, 
        key:uuid().slice(0,10),
        left: Math.floor(Math.random() * 95),
        speed:Math.random() * 5 + 3 + "s ",
    }
}

/*
 API YOUTUBE
***************/
export function youtubeApiSearchObject(search, maxResults) {
    return {
        part: 'snippet',
        key: process.env.REACT_APP_YOUTUBE_API_KEY,
        q: search,
        relevanceLanguage:getLocale(),
        regionCode:getLocale(),
        order:'viewCount',
        maxResults: maxResults,
        videoEmbeddable:true,
        type: 'video'
    }
}

export function youtubeApiVideosParams(categoryId = '0', number, parts) {
    return  {
        part: parts,
        key: process.env.REACT_APP_YOUTUBE_API_KEY,
        chart: 'mostPopular',
        maxResults: number,
        videoCategoryId:categoryId, // music
        regionCode: getLocale(),
    }
}

export function youtubeApiVideoInfoParams(videoId) {
    return {
        part: 'snippet',
        key: process.env.REACT_APP_YOUTUBE_API_KEY,
        id: videoId,
    };
}

/*
 API SPOTFY
***************/
export function spotifyApiSearchObject(search) {
    return {
        q: search,
        type: "track"
    }
}

export const emptyToken = {
    IsLinked:false,
    AlreadyHaveBeenLinked:true,
    Token:'',
    TokenTimestamp:Date.now(),
    UserConnected:''
}

export const timestampToDateoptions = {
  day: '2-digit', 
  month: 'long', 
  year: 'numeric'
};

export const timestampToHoursAndMinOptions = {
  hour: '2-digit', 
  minute: '2-digit', 
  hour12: false
};

export function createUserDataObject(userUid = 0, registerType, pseudo, anonLogin = false) {
    if(anonLogin) {
        return {
            displayName:pseudo,
            loginType:'anon',
            color: getRandomHexColor(),
            avatarId:randomInt(1,9),
        }
    } else {
        return {
            displayName:pseudo, 
            creationTime:Date.now(),
            color: getRandomHexColor(),
            avatarId:randomInt(1,9),
            uid:userUid,
            loginType:registerType,
            userParams:{
            NotifsActivated:true
            }
        }
    }
}