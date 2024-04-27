export function createDefaultRoomObject(roomId, roomOwner) {
    return {
        id: roomId.toLowerCase(),
        roomName:'',
        admin:roomOwner.displayName,
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
            interactionFrequence:20000,
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

export function getDisplayTitle(media) {
    return media.title ? media.title : media.url.substring(0,25)+'..'
}

export function formatNumberToMinAndSec(number) {
    var minute = ~~(Math.round(number)/60)+'m';
    var seconde = Math.round(number)%60+'s';
    return minute+' '+seconde;
}

export function isFromSource(itemSource, sourceCheck) {
    return itemSource === sourceCheck;
}

export function isFromSpotify(source) {
    return source === 'spotify';
}

export function isNotFromSpotify(source) {
    return source !== 'spotify';
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

export function isTokenInvalid(tokenTimestamp) {
    return (typeof(tokenTimestamp) === 'number' && tokenTimestamp > 0) && ((Date.now() - tokenTimestamp) > 3600000);
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