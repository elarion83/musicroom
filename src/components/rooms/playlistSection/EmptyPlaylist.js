import { Icon } from "@iconify/react";
import { Alert, AlertTitle, CircularProgress, Typography } from "@mui/material";
import NotListedLocationOutlinedIcon from '@mui/icons-material/NotListedLocationOutlined';
import { withTranslation } from "react-i18next";
import { useState } from "react";
import WhereToVoteOutlinedIcon from '@mui/icons-material/WhereToVoteOutlined';

const EmptyPlaylist = ({t,isAdminView, setOpenInvitePeopleToRoomModal, setOpenAddToPlaylistModal, roomRef, roomParams, updateFirebaseRoom }) => {
    
    const REDIRECT_URI = window.location.protocol+'//'+window.location.hostname+(window.location.port ? ":" + window.location.port : '');
    
    const [localisationLoading, setLocalisationLoading] = useState(false);
    async function localizeRoom() {
        setLocalisationLoading(true);
        let posObject = {lat:0,long:0};
        let tempParams = roomParams;

        if(!tempParams.isLocalisable) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    posObject = {
                        lat:position.coords.latitude,
                        long:position.coords.longitude,
                    }
                    tempParams.isLocalisable = true;
                    setLocalisationLoading(false);
                    updateFirebaseRoom( roomRef , {localisation: posObject, roomParams:tempParams});
                });
        } else {
            tempParams.isLocalisable = false;
            updateFirebaseRoom( roomRef , {localisation: posObject, roomParams:tempParams});
            setLocalisationLoading(false);
        }      
    }

    return(
       <>
        <Alert 
            severity="success" variant="filled" 
            icon={<Icon icon="uil:smile-beam" width="35"/>} 
            className='animate__animated animate__fadeInUp animate__slow texturaBgButton bord2 bordGreenLight bordSolid'
            onClick={(e) => setOpenInvitePeopleToRoomModal(true)}
            sx={{m:2, cursor:'pointer'}}
        > 
            <AlertTitle className='varelaFontTitle' sx={{mb:0}}>{t('RoomEmptyAlertWelcome')} </AlertTitle> 
            <Typography fontSize='small' className="fontFamilyNunito colorWhite">{t('RoomEmptyAlertWelcomeClickHere')}</Typography>
        </Alert>

        {isAdminView && 
            <Alert 
                severity={roomParams.isLocalisable ? "success" : "info"}
                variant="filled" 
                icon={localisationLoading ? 
                    <CircularProgress className="colorWhite" sx={{maxHeight:'35px',maxWidth:'35px'}} /> : 
                    roomParams.isLocalisable ?                     
                        <WhereToVoteOutlinedIcon fontSize="large" sx={{maxHeight:'35px',maxWidth:'35px'}}/> :
                        <NotListedLocationOutlinedIcon fontSize="large" sx={{maxHeight:'35px',maxWidth:'35px'}}/>
                    } 
                sx={{m:2, cursor:'pointer'}} 
                className={`animate__animated animate__fadeInUp animate__slow texturaBgButton bord2  bordSolid ${roomParams.isLocalisable ? "bordGreenLight" : "bordLight"}`}
                onClick={(e) => localizeRoom()} >
                <AlertTitle className='varelaFontTitle'>{roomParams.isLocalisable ? t('RoomEmptyAlterGeolocTitleEnabled') : t('RoomEmptyAlterGeolocTitleDisabled')}</AlertTitle>
                <Typography fontSize='small' className="fontFamilyNunito colorWhite">
                    {roomParams.isLocalisable ? t('RoomEmptyAlterGeolocTextEnabled') : t('RoomEmptyAlterGeolocTextDisabled')}
                </Typography>
            </Alert>
        }

        <Alert 
            severity="warning" 
            variant="filled" 
            icon={<Icon icon="iconoir:music-double-note-add" width="35" />} 
            sx={{m:2, cursor:'pointer'}} 
            className='animate__animated animate__fadeInUp animate__slow texturaBgButton bord2 bordOrange bordSolid'
            onClick={(e) => setOpenAddToPlaylistModal(true)} 
        >
            <AlertTitle className='varelaFontTitle'>{t('RoomEmptyAlertPlaylist')}</AlertTitle>
            <Typography fontSize='small' className="fontFamilyNunito colorWhite">{t('RoomEmptyAlertPlaylistClickHere')}</Typography>
        </Alert>
        
        
       {/* {!deezerIsLinked && 
            <Alert severity="warning" variant="filled" 
            icon={<Icon icon="jam:deezer" width="30" />} 
            sx={{m:2, border:'2px solid #febc21',cursor:'pointer'}} 
            className='animate__animated animate__delay-1s animate__fadeInUp animate__slow'
                onClick={e => window.location.href = `${process.env.REACT_APP_ROOM_DEEZER_AUTH_ENDPOINT}?app_id=${process.env.REACT_APP_ROOM_DEEZER_APP_ID}&redirect_uri=${REDIRECT_URI}&perms=basic_access,email`}>
            <AlertTitle className='varelaFontTitle' sx={{margin:'3px 0 0 0'}}>{t('RoomEmptyAlertDeezer')}</AlertTitle>
        </Alert>}

        }

        {!spotifyIsLinked && 
            <Alert severity="warning" variant="filled" 
            icon={<Icon icon="mdi:spotify" width="30" />} 
            sx={{m:2, border:'2px solid #febc21',cursor:'pointer'}} 
            className='animate__animated animate__delay-1s animate__fadeInUp animate__slow emptyPlaylistAlert'
            onClick={e => window.location.href = `${process.env.REACT_APP_ROOM_SPOTIFY_AUTH_ENDPOINT}?client_id=${process.env.REACT_APP_ROOM_SPOTIFY_CLIENT_ID}&scope=user-read-playback-state%20streaming%20user-read-email%20user-modify-playback-state%20user-read-private&redirect_uri=${REDIRECT_URI}&response_type=${process.env.REACT_APP_ROOM_SPOTIFY_RESPONSE_TYPE}`}>
            <AlertTitle className='varelaFontTitle' sx={{margin:'3px 0 0 0'}}>{t('RoomEmptyAlertSpotify')}</AlertTitle>
        </Alert>*/}
    </>
    )
};

export default withTranslation()(EmptyPlaylist);