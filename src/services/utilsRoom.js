import { isFromSpotify } from "./utils"; 

export function changeMediaActuallyPlaying(numberToPlay, wayOfChange = 'next', isAdmin = false, room, roomRef) {
    if(isAdmin) {
        if(room.playlistUrls[numberToPlay] || room.roomParams.isPlayingLooping) {
            var playingUsed = (!room.playlistUrls[numberToPlay] && room.roomParams.isPlayingLooping) ? 0 : numberToPlay;
            if(isFromSpotify(room.playlistUrls[playingUsed]) && !room.roomParams.spotify.IsLinked) {
                changeMediaActuallyPlaying(('next' === wayOfChange) ? numberToPlay+1 : numberToPlay-1, wayOfChange);
                return
            }
            roomRef.set({playing: playingUsed, actuallyPlaying:true,mediaActuallyPlayingAlreadyPlayedData:{
                    playedSeconds:0,
                    playedPercentage:0,
                    played:0
            }}, { merge: true });  
        } else {  
            roomRef.set({actuallyPlaying:false}, { merge: true });
        }
    }
}

export function getLastNotif(roomNotifs = []) {
    return roomNotifs[roomNotifs.length - 1];
}

export function playedSeconds(player) {
    return Math.abs(player.current.getCurrentTime());
}

export function playerNotSync(room, player) {
    return((Math.abs(room.mediaActuallyPlayingAlreadyPlayedData.playedSeconds) - playedSeconds(player) > 5) || (Math.abs(room.mediaActuallyPlayingAlreadyPlayedData.playedSeconds) - playedSeconds(player) < -5));
}