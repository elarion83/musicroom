import { isFromSpotify } from "./utils"; 

export function getLastNotif(roomNotifs = []) {
    return roomNotifs[roomNotifs.length - 1];
}

export function playedSeconds(player) {
    return Math.abs(player.current.getCurrentTime());
}

export function playerNotSync(room, player) {
    return((Math.abs(room.mediaActuallyPlayingAlreadyPlayedData.playedSeconds) - playedSeconds(player) > 5) || (Math.abs(room.mediaActuallyPlayingAlreadyPlayedData.playedSeconds) - playedSeconds(player) < -5));
}