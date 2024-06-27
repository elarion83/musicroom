import { updateDoc } from "firebase/firestore";
import { isFromSpotify } from "./utils"; 
import { v4 as uuid } from 'uuid';

export function getLastNotif(roomNotifs = []) {
    return roomNotifs[roomNotifs.length - 1];
}

export function getCleanRoomId(id = null) {
    if(id) {
        return id.toUpperCase().trim().replace(/\s/g,'')
    } else {
        return uuid().slice(0,5).toUpperCase();
    }
}

/* PLAYER HELPERS */
export function playedSeconds(player) {
    return Math.abs(player.current.getCurrentTime());
}

export function playerNotSync(room, player) {
    return((Math.abs(room.mediaActuallyPlayingAlreadyPlayedData.playedSeconds) - playedSeconds(player) > 3) || (Math.abs(room.mediaActuallyPlayingAlreadyPlayedData.playedSeconds) - playedSeconds(player) < -3));
}

/* FIREBASE HELPERS */
export async function updateFirebaseRoom(roomRef, newRoomDatas, merge = true) {
    await updateDoc(roomRef, newRoomDatas);
}
