import { Icon } from "@iconify/react";
import { Alert, AlertTitle, CircularProgress, Typography } from "@mui/material";
import NotListedLocationOutlinedIcon from '@mui/icons-material/NotListedLocationOutlined';
import { withTranslation } from "react-i18next";
import { useState } from "react";
import WhereToVoteOutlinedIcon from '@mui/icons-material/WhereToVoteOutlined';
import { addPlaylistNotif } from "../../../services/utilsRoom";
import { auth } from "../../../services/firebase";

const EmptyPlaylist = ({t,isAdminView, setOpenInvitePeopleToRoomModal, setOpenAddToPlaylistModal, roomRef, roomParams, updateFirebaseRoom }) => {
       
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
                    addPlaylistNotif(auth.currentUser.displayName, 'a géolocalisé la playlist.', 'info', 2500, roomRef);
                    updateFirebaseRoom( roomRef , {localisation: posObject, roomParams:tempParams});
                    setLocalisationLoading(false);
                });
        } else {
            tempParams.isLocalisable = false;
            addPlaylistNotif(auth.currentUser.displayName, 'a désactivé la géolocalisation.', 'warning', 2500, roomRef);
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
    </>
    )
};

export default withTranslation()(EmptyPlaylist);