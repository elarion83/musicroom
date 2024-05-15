import { useState } from "react";
import { isFromDeezer } from "./utils";


export async function handleReady(isAdmin, isGuestSync, room, playerRef, setRoomIsPlaying, setPlayerReady, roomIdPlayed) {
    setPlayerReady(true);
    if(isAdmin || isGuestSync) {
        playerRef.current.seekTo(room.mediaActuallyPlayingAlreadyPlayedData.playedSeconds, 'seconds'); 
        setRoomIsPlaying(room.actuallyPlaying);
    }
    if(isFromDeezer(room.playlistUrls[roomIdPlayed])) {   
        playerRef.current.seekTo(room.mediaActuallyPlayingAlreadyPlayedData.playedSeconds, 'seconds');
    }
}