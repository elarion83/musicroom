import { redirect, useNavigate } from "react-router-dom";
import { getCleanRoomId } from "./utilsRoom";

export const homeUrl = window.location.protocol+'//'+window.location.hostname+(window.location.port ? ":" + window.location.port : '');
export function replaceCurrentUrlWithHomeUrl() {
    window.history.replaceState('string','', window.location.protocol+'//'+window.location.hostname+(window.location.port ? ":" + window.location.port : ''));
}

export function replaceCurrentUrlWithRoomUrl(roomId) {  
    var redirectTo = homeUrl+'/'+getCleanRoomId(roomId);
    window.history.replaceState('string','', redirectTo);
}

export function replaceCurrentUrlWithRoomUrlForSpotify(roomId, token) {
    var redirectTo = homeUrl+'/'+getCleanRoomId(roomId)+'&spotoken='+token;
    window.history.replaceState('string','', redirectTo);
}

export function replaceCurrentUrlWithRoomUrlForDeezer(roomId, token) {
    var redirectTo = homeUrl+'/'+getCleanRoomId(roomId)+'&deetoken='+token;
    window.history.replaceState('string','', redirectTo);
}