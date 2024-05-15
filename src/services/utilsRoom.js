import { db } from "./firebase";
import { createDefaultRoomObject, isFromSpotify } from "./utils"; 

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

export async function getRoomTest(roomRef, roomId, currentUser) {
    
    const fireBaseEntry = await roomRef.get().then((doc) => {
        return doc;
    });

    var roomDataInit = fireBaseEntry.exists ? fireBaseEntry.data() : createDefaultRoomObject(roomId, currentUser);
    if(!fireBaseEntry.exists) { db.collection(process.env.REACT_APP_ROOM_COLLECTION).doc(roomId).set(roomDataInit).then(() => {});}

    return roomDataInit;
}