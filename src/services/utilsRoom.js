import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { isDevEnv, isEmpty, isFromSpotify, isVarExist, isVarNull, roomSpotifyTokenObject, showLocalNotification, userSpotifyTokenObject } from "./utils"; 
import { v4 as uuid } from 'uuid';
import { auth, db } from "./firebase";

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
export function playedSeconds(player, origin = 'youtube') {
    if(isVarExist(player.current) && !isVarNull(player.current)) {
        if('spotify' === origin) {
            return Math.floor(player.current.state.progressMs/1000);
        }
        else {
            return Math.floor(player.current.getCurrentTime());
        }
    }
}

export function playerNotSync(room, player) { // check if user is not sync with the datas
    var source = room.playlistUrls[room.playing].source;
    var delay = ('spotify' === source) ? 5 : isDevEnv() ? 3 : 2;
    var firebasePlayedSeconds = Math.abs(room.mediaActuallyPlayingAlreadyPlayedData.playedSeconds);
    return((firebasePlayedSeconds - playedSeconds(player, source) > delay) || (firebasePlayedSeconds - playedSeconds(player, source) < -delay));
}

/* FIREBASE HELPERS */
export async function updateFirebaseRoom(roomRef, newRoomDatas, merge = true) {
    await updateDoc(roomRef, newRoomDatas);
}

export async function updateFirebaseUser(userRef, newUserData, merge=true) {
    await updateDoc(userRef, newUserData);
}

export async function addPlaylistNotif(title, message, type, duration = 5000, roomRef) {
    var notifObject = {
        title:title,
        message:message,
        type:type,
        duration:duration,
        timestamp:Date.now(), 
        createdByUid: auth.currentUser.uid
    }
    await updateDoc(roomRef, {
      notifsArray: arrayUnion(notifObject)
    });
}

export function roomIdLocallyStored() {
    return localStorage.getItem("Play-It_RoomId");
}

export function checkCurrentUserSpotifyTokenExpiration() {
    var userSpotifyDatas = auth.currentUser.customDatas;
    var secondsUntilExpiration = (Date.now() - userSpotifyDatas.spotifyConnect.expiration);
    if(secondsUntilExpiration === 900 ) {
        showLocalNotification('Lecteur Spotify', 'Connexion expire dans 15 min.', 'warning', 2500 );
    }
    if(secondsUntilExpiration === 600 ) {
        showLocalNotification('Lecteur Spotify', 'Connexion expire dans 10 min.', 'warning', 2500 );
    }
    if(secondsUntilExpiration === 300 ) {
        showLocalNotification('Lecteur Spotify', 'Connexion expire dans 5 min.', 'warning', 2500 );
    }
    if(secondsUntilExpiration === 180 ) {
        showLocalNotification('Lecteur Spotify', 'Connexion expire dans 3 min.', 'error', 2500 );
    }

    if(userSpotifyDatas.spotifyConnect.expiration < Date.now()) {
        let userRef = doc(db, process.env.REACT_APP_USERS_COLLECTION, userSpotifyDatas.uid);
        updateFirebaseUser(userRef,{spotifyConnect:userSpotifyTokenObject(null, 'reset')});
    }
}


export function checkRoomSpotifyTokenExpiration(room) {
    if(!isEmpty(room.enablerSpotify.expirationTokenTimestamp) && room.enablerSpotify.expirationTokenTimestamp < Date.now()) {
        let roomRef = doc(db, process.env.REACT_APP_ROOM_COLLECTION, room.id);
        if(room.enablerSpotify.alreadyHaveBeenLinked) {
            addPlaylistNotif('Recherche Spotify', 'Connexion expirée.', 'warning', 3500, roomRef);
            updateFirebaseRoom(roomRef,{enablerSpotify:roomSpotifyTokenObject(null,null, 'reset')});
        }
    }
}


export function actuallyPlayingFromSpotify(room) {
    return isFromSpotify(room.playlistUrls[room.playing]);
}
