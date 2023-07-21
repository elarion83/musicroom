import { Icon } from "@iconify/react";
import { Alert, AlertTitle } from "@mui/material";
import { withTranslation } from 'react-i18next';

const EmptyPlaylist = ({t, setOpenInvitePeopleToRoomModal, setOpenAddToPlaylistModal, spotifyIsLinked, deezerIsLinked  }) => {
    
    const REDIRECT_URI = window.location.protocol+'//'+window.location.hostname+(window.location.port ? ":" + window.location.port : '');
    
    return(
       <>
        <Alert severity="success" variant="filled" 
            icon={<Icon icon="uil:smile-beam" width="35"/>} 
            className='animate__animated animate__fadeInUp animate__slow'
            onClick={(e) => setOpenInvitePeopleToRoomModal(true)}
            sx={{m:2, border:'2px solid var(--green-2)', cursor:'pointer'}}> 
            <AlertTitle sx={{mb:0}}>{t('RoomEmptyAlertWelcome')} </AlertTitle> 
            <p style={{color:'var(--white)', margin:0}}>{t('RoomEmptyAlertWelcomeClickHere')}</p>
        </Alert>
        <Alert severity="warning" 
            variant="filled" 
            icon={<Icon icon="iconoir:music-double-note-add" width="35" />} 
            sx={{m:2, border:'2px solid #febc21', cursor:'pointer'}} 
            className='animate__animated animate__fadeInUp animate__slow'
            onClick={(e) => setOpenAddToPlaylistModal(true)} >
            <AlertTitle>{t('RoomEmptyAlertPlaylist')}</AlertTitle>
            <p style={{color:'var(--white)', margin:0}}>{t('RoomEmptyAlertPlaylistClickHere')}</p>
        </Alert>
        
        {!spotifyIsLinked && 
            <Alert severity="warning" variant="filled" 
            icon={<Icon icon="mdi:spotify" width="30" />} 
            sx={{m:2, border:'2px solid #febc21',cursor:'pointer'}} 
            className='animate__animated animate__fadeInUp animate__slow'
            onClick={e => window.location.href = `${process.env.REACT_APP_ROOM_SPOTIFY_AUTH_ENDPOINT}?client_id=${process.env.REACT_APP_ROOM_SPOTIFY_CLIENT_ID}&scope=user-read-playback-state%20streaming%20user-read-email%20user-modify-playback-state%20user-read-private&redirect_uri=${REDIRECT_URI}&response_type=${process.env.REACT_APP_ROOM_SPOTIFY_RESPONSE_TYPE}`}>
            <AlertTitle>{t('RoomEmptyAlertSpotify')}</AlertTitle>
            <p style={{color:'var(--white)', margin:0}}> {t('RoomEmptyAlertSpotifyClickHere')} <br /> <b>{t('RoomEmptyAlertSpotifyBold')}</b> </p>
        </Alert>}

        {!deezerIsLinked && 
            <Alert severity="warning" variant="filled" 
            icon={<Icon icon="jam:deezer" width="30" />} 
            sx={{m:2, border:'2px solid #febc21',cursor:'pointer'}} 
            className='animate__animated animate__fadeInUp animate__slow'
                onClick={e => window.location.href = `${process.env.REACT_APP_ROOM_DEEZER_AUTH_ENDPOINT}?app_id=${process.env.REACT_APP_ROOM_DEEZER_APP_ID}&redirect_uri=${REDIRECT_URI}&perms=basic_access,email`}>
            <AlertTitle>{t('RoomEmptyAlertDeezer')}</AlertTitle>
            <p style={{color:'var(--white)', margin:0}}> {t('RoomEmptyAlertDeezerClickHere')} <br /> </p>
        </Alert>}
    </>
    )
};

export default withTranslation()(EmptyPlaylist);