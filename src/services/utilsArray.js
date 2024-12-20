import React from 'react';
import i18n from "i18next";
import CelebrationIcon from '@mui/icons-material/Celebration';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { EmailIcon, EmailShareButton, FacebookIcon, FacebookShareButton, InstapaperIcon, InstapaperShareButton, RedditIcon, RedditShareButton, TelegramIcon, TelegramShareButton, TwitterIcon, TwitterShareButton, WhatsappIcon, WhatsappShareButton } from 'react-share';
import { UserIsFromApp, getLocale, getLocaleYoutube, getRandomHexColor, hexColorToRgb, randomInt } from './utils';
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

export const searchTextArray = [i18n.t('GeneralSearchFor') + i18n.t('GeneralMusics'),
        i18n.t('GeneralSearchFor') + i18n.t('GeneralSmthTrendings', {what:i18n.t('GeneralVideos')}),
        i18n.t('GeneralSearchFor') + i18n.t('GeneralMovieTrailers'),
    ];

export const joinRoomNotifTextArray = ['est arrivé !', 'est dans la place !', 'viens de débarquer !', 'arrive sur le dancefloor !', 'viens d\'atterrir ici !'];

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
        authorUid: user.uid,
        authorColor: user.customDatas.color ?? 'var(--main-color)',
        roomId: roomId,
        uid: uuid().slice(0, 8).toLowerCase(),
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
export function youtubeApiSearchObject(search, maxResults, order = 'viewCount') {
    return {
        part: 'snippet',
        key: process.env.REACT_APP_YOUTUBE_API_KEY,
        q: search,
        relevanceLanguage:getLocale(),
        regionCode:getLocaleYoutube(),
        order:order,
        maxResults: maxResults,
        videoEmbeddable:true,
        type: 'video'
    }
}

export function youtubeApiVideosParams(categoryId = '0', number, parts) {
    // https://gist.github.com/dgp/1b24bf2961521bd75d6c youtube video categories id list
    return  {
        part: parts,
        key: process.env.REACT_APP_YOUTUBE_API_KEY,
        chart: 'mostPopular',
        maxResults: number,
        videoCategoryId:categoryId, 
        regionCode: getLocaleYoutube(),
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

export function spotifyApiTopTracksObject() {
    return {
        limit: 50,
        type: "tracks"
    }
}
export function spotifyApiPlaylistTracksObject(playlistId) {
    return {
        limit: 50,
        market: getLocale()
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


// end spotify helpers */

export function createUserDataObject(userUid = 0, registerType, pseudo, anonLogin = false) {
    var userColor = getRandomHexColor();
    var nowTimestamp = Date.now();
    return {
        displayName:pseudo, 
        creationTime:nowTimestamp,
        lastSignInTime:nowTimestamp,
        color: userColor,
        colorRgb:hexColorToRgb(userColor),
        avatarId:randomInt(1,9),
        uid:userUid,
        createdFrom: UserIsFromApp ? 'app' : 'web',
        loginType: anonLogin ? 'anon' : registerType,
        spotifyConnect: {
            token : '',
            refreshtoken:'',
            expiration: 0,
            alreadyConnected:false,
            connected:false,
            lastConnexionTimestamp:null,
        },
        userParams:{
            NotifsActivated:true
        }
        
    }
}