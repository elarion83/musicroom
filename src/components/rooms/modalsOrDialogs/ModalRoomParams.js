import React from "react";

import DialogTitle from '@mui/material/DialogTitle';


import { Icon } from '@iconify/react';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import TuneIcon from '@mui/icons-material/Tune';
import { AlertTitle, Button, Dialog, DialogContent, Divider, FormControlLabel, FormGroup, Switch, Typography } from "@mui/material";
import Alert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';

import { withTranslation } from 'react-i18next';

const ModalRoomParams = ({ t,  adminView, open, changeOpen, roomParams , handleDisconnectFromSpotifyModal, handleDisconnectFromDeezerModal, handleChangeRoomParams}) => {

    const REDIRECT_URI = window.location.protocol+'//'+window.location.hostname+(window.location.port ? ":" + window.location.port : '');

    
    async function handleChangeIsPlayingLooping() {
        roomParams.isPlayingLooping = !roomParams.isPlayingLooping;
        handleChangeRoomParams(roomParams);
    }


    async function handleChangeIsInterractionsAllowed() {
        roomParams.interactionsAllowed = !roomParams.interactionsAllowed;
        handleChangeRoomParams(roomParams);
    }
    
    async function handleChangeAllowEverybodyToAddMedia() {
        roomParams.allowEverybodyToAddMedia = !roomParams.allowEverybodyToAddMedia;
        handleChangeRoomParams(roomParams);
    }

    async function handleChangeIsAutoPlayActivated() {
        roomParams.isAutoPlayActivated = !roomParams.isAutoPlayActivated;
        handleChangeRoomParams(roomParams);
    }

    async function handleChangeIsOnInvitation() {
        roomParams.isOnInvitation = !roomParams.isOnInvitation;
        handleChangeRoomParams(roomParams);
    }

    async function handleChangeIsChatActivated() {
        roomParams.isChatActivated = !roomParams.isChatActivated;
        handleChangeRoomParams(roomParams);
    }

    return(
        <Dialog open={open} onClose={(e) => changeOpen(false)}>
            <DialogTitle className='flexRowCenterH' sx={{ m: 0,p:1 }}>
                <TuneIcon fontSize="small" sx={{mr:1}} /> {t('ModalParamsRoomTitle')}
            </DialogTitle>  
            <DialogContent dividers sx={{pt:2}}>
                <FormGroup>
                    
                    {!roomParams.deezer.IsLinked && 
                            <Button
                            sx={{mb:1}}
                                startIcon={<Icon style={{display:'inline',  marginRight:'0.5em'}} icon="mdi:deezer" />}
                                variant="contained" 
                                color="success"  
                                onClick={e => window.location.href = `${process.env.REACT_APP_ROOM_DEEZER_AUTH_ENDPOINT}?app_id=${process.env.REACT_APP_ROOM_DEEZER_APP_ID}&redirect_uri=${REDIRECT_URI}&perms=basic_access,email`}>
                                {t('ModalParamsRoomConnectToDeezerText')}
                            </Button>
                    }          
                    {roomParams.deezer.IsLinked && 
                        <Alert
                        sx={{mb:1}}
                            action={
                                <Tooltip title="Forcer la déconnexion">
                                    <Button onClick={e => handleDisconnectFromDeezerModal(true)}>
                                        <ExitToAppIcon  fontSize="small" />
                                    </Button>
                                </Tooltip>
                            }
                        >
                            {t('ModalParamsRoomConnectedToDeezerText')}
                        </Alert>
                    }

                    {!roomParams.spotifyIsLinked && 
                            <Button
                                startIcon={<Icon style={{display:'inline',  marginRight:'0.5em'}} icon="mdi:spotify" />}
                                variant="contained" 
                                color="success"  
                                onClick={e => window.location.href = `${process.env.REACT_APP_ROOM_SPOTIFY_AUTH_ENDPOINT}?client_id=${process.env.REACT_APP_ROOM_SPOTIFY_CLIENT_ID}&scope=user-read-playback-state%20streaming%20user-read-email%20user-modify-playback-state%20user-read-private&redirect_uri=${REDIRECT_URI}&response_type=${process.env.REACT_APP_ROOM_SPOTIFY_RESPONSE_TYPE}`}>
                                {t('ModalParamsRoomConnectToSpotifyText')}
                            </Button>
                    }          
                    {roomParams.spotifyIsLinked && 
                        <Alert
                            action={
                                <Tooltip title="Forcer la déconnexion">
                                    <Button onClick={e => handleDisconnectFromSpotifyModal(true)}>
                                        <ExitToAppIcon  fontSize="small" />
                                    </Button>
                                </Tooltip>
                            }
                        >
                            {t('ModalParamsRoomConnectedToSpotifyText')}
                        </Alert>
                    }

                    <Alert sx={{pl:0, mt:3, mb:2, alignItems: 'center'}} icon={<Switch checked={roomParams.interactionsAllowed} onChange={handleChangeIsInterractionsAllowed} 
                            disabled={adminView? false:true}
                            name="switchInteractionsAllowed" />} severity={roomParams.interactionsAllowed ? 'success' : 'warning'}>
                        <AlertTitle sx={{fontWeight:'bold'}}>{t('ModalParamsRoomInteractionAllowedTitle')}</AlertTitle>
                        <Typography fontSize='small'>{adminView? t('ModalParamsRoomInteractionAllowedText') : t('ModalParamsRoomNotAllowedText')}</Typography>
                    </Alert>
                    
                    <Alert sx={{pl:0, mb:2, alignItems: 'center'}} icon={<Switch checked={roomParams.isChatActivated} onChange={handleChangeIsChatActivated} 
                            disabled={adminView? false:true}
                            name="switchIsChatActivated" />} severity={roomParams.isChatActivated ? 'success' : 'warning'}>
                        <AlertTitle sx={{fontWeight:'bold'}}>{t('ModalParamsRoomChatAllowedTitle')}</AlertTitle>
                        <Typography fontSize='small'>{adminView? t('ModalParamsRoomChatAllowedText') : t('ModalParamsRoomNotAllowedText')}</Typography>
                    </Alert>

                    <Alert sx={{pl:0, mb:2, alignItems: 'center'}} icon={<Switch checked={roomParams.isPlayingLooping} onChange={handleChangeIsPlayingLooping} 
                            disabled={adminView? false:true}
                            name="switchIsPlayingLooping" />} severity={roomParams.isPlayingLooping ? 'success' : 'warning'}>
                        <AlertTitle sx={{fontWeight:'bold'}}>{t('ModalParamsRoomLoopPlayingTitle')}</AlertTitle>
                        <Typography fontSize='small'>{adminView? t('ModalParamsRoomLoopPlayingText') : t('ModalParamsRoomNotAllowedText')}</Typography>
                    </Alert>
                    <Alert sx={{pl:0, mb:2, alignItems: 'center'}} icon={<Switch checked={roomParams.isAutoPlayActivated} onChange={handleChangeIsAutoPlayActivated} 
                            disabled={adminView? false:true}
                            name="switchIsAutoPlayActivated" />} severity={roomParams.isAutoPlayActivated ? 'success' : 'warning'}>
                        <AlertTitle sx={{fontWeight:'bold'}}>{t('ModalParamsRoomAutoPlayingTitle')}</AlertTitle>
                        <Typography fontSize='small'>{adminView? t('ModalParamsRoomAutoPlayingText') : t('ModalParamsRoomNotAllowedText')}</Typography>
                    </Alert>

                    
                </FormGroup>
            </DialogContent>
        </Dialog>
    )
};

export default withTranslation()(ModalRoomParams);