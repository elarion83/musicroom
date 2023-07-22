import React, { useState } from "react";

import DialogTitle from '@mui/material/DialogTitle';


import { Icon } from '@iconify/react';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import TuneIcon from '@mui/icons-material/Tune';
import { AlertTitle, Button, Dialog, DialogContent, Divider, FormControlLabel, FormGroup, IconButton, InputAdornment, Switch, TextField, Typography } from "@mui/material";
import Alert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';

import { withTranslation } from 'react-i18next';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import SaveIcon from '@mui/icons-material/Save';
import { SlideUp } from "../../../services/materialSlideTransition/Slide";

const ModalRoomParams = ({ t, adminView, open, changeOpen, roomParams , handleDisconnectFromSpotifyModal, handleDisconnectFromDeezerModal, handleChangeRoomParams}) => {

    const REDIRECT_URI = window.location.protocol+'//'+window.location.hostname+(window.location.port ? ":" + window.location.port : '');

    const [showPassword, setShowPassword] = useState(false);

    const [password, setPassword] = useState(roomParams.password);
    
    async function savePassword() {
        roomParams.password = password;
        handleChangeRoomParams(roomParams);
    }

    async function handleChangeIsPlayingLooping() {
        roomParams.isPlayingLooping = !roomParams.isPlayingLooping;
        handleChangeRoomParams(roomParams);
    }

    async function handleChangeIsInterractionsAllowed() {
        roomParams.interactionsAllowed = !roomParams.interactionsAllowed;
        handleChangeRoomParams(roomParams);
    }
    
    async function handleChangeIsPasswordNeeded() {
        roomParams.isPasswordNeeded = !roomParams.isPasswordNeeded;
        if(!roomParams.isPasswordNeeded) {
            roomParams.password = '';
        }
        handleChangeRoomParams(roomParams);
    }

    async function handleChangeIsAutoPlayActivated() {
        roomParams.isAutoPlayActivated = !roomParams.isAutoPlayActivated;
        handleChangeRoomParams(roomParams);
    }

    async function handleChangeSyncPeopleByDefault() {
        roomParams.syncPeopleByDefault = !roomParams.syncPeopleByDefault;
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

    async function changeOpenInComp() {
        if(roomParams.isPasswordNeeded && password.length === 0 && roomParams.password.length === 0 ) {
            roomParams.isPasswordNeeded = false;
            handleChangeRoomParams(roomParams);
        }
        changeOpen(false);
    }

    return(
        <Dialog open={open} TransitionComponent={SlideUp}  onClose={(e) => changeOpenInComp(false)}>
            <DialogTitle className='flexRowCenterH' sx={{ m: 0,p:1 }}>
                <TuneIcon fontSize="small" sx={{mr:1}} /> {t('ModalParamsRoomTitle')}
            </DialogTitle>  
            <DialogContent dividers sx={{pt:2}}>
                <FormGroup>
                    
                    {!roomParams.deezer.IsLinked && 
                            <Button
                            sx={{mb:1}}
                                startIcon={<Icon style={{display:'inline',  marginRight:'0.5em'}} icon="jam:deezer" />}
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

                    {!roomParams.spotify.IsLinked && 
                            <Button
                                startIcon={<Icon style={{display:'inline',  marginRight:'0.5em'}} icon="mdi:spotify" />}
                                variant="contained" 
                                color="success"  
                                onClick={e => window.location.href = `${process.env.REACT_APP_ROOM_SPOTIFY_AUTH_ENDPOINT}?client_id=${process.env.REACT_APP_ROOM_SPOTIFY_CLIENT_ID}&scope=user-read-playback-state%20streaming%20user-read-email%20user-modify-playback-state%20user-read-private&redirect_uri=${REDIRECT_URI}&response_type=${process.env.REACT_APP_ROOM_SPOTIFY_RESPONSE_TYPE}`}>
                                {t('ModalParamsRoomConnectToSpotifyText')}
                            </Button>
                    }          
                    {roomParams.spotify.IsLinked && 
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

                    <Alert sx={{pl:0,mt:3,  mb:2, alignItems: 'center'}} icon={<Switch checked={roomParams.isPlayingLooping} onChange={handleChangeIsPlayingLooping} 
                            disabled={adminView? false:true}
                            name="switchIsPlayingLooping" />} severity={roomParams.isPlayingLooping ? 'success' : 'warning'}>
                        <AlertTitle sx={{fontWeight:'bold'}} className='fontFamilyOpenSans'>{t('ModalParamsRoomLoopPlayingTitle')}</AlertTitle>
                        <Typography fontSize='small' className='fontFamilyNunito'>{adminView? t('ModalParamsRoomLoopPlayingText') : t('ModalParamsRoomNotAllowedText')}</Typography>
                    </Alert>

                    <Alert sx={{pl:0, mb:2, alignItems: 'center'}} icon={<Switch checked={roomParams.isAutoPlayActivated} onChange={handleChangeIsAutoPlayActivated} 
                            disabled={adminView? false:true}
                            name="switchIsAutoPlayActivated" />} severity={roomParams.isAutoPlayActivated ? 'success' : 'warning'}>
                        <AlertTitle sx={{fontWeight:'bold'}} className='fontFamilyOpenSans'>{t('ModalParamsRoomAutoPlayingTitle')}</AlertTitle>
                        <Typography fontSize='small' className='fontFamilyNunito'>{adminView? t('ModalParamsRoomAutoPlayingText') : t('ModalParamsRoomNotAllowedText')}</Typography>
                    </Alert>

                    <Alert sx={{pl:0, mb:2, alignItems: 'center'}} icon={<Switch checked={roomParams.interactionsAllowed} onChange={handleChangeIsInterractionsAllowed} 
                            disabled={adminView? false:true}
                            name="switchInteractionsAllowed" />} severity={roomParams.interactionsAllowed ? 'success' : 'warning'}>
                        <AlertTitle sx={{fontWeight:'bold'}} className='fontFamilyOpenSans'>{t('ModalParamsRoomInteractionAllowedTitle')}</AlertTitle>
                        <Typography fontSize='small' className='fontFamilyNunito'>{adminView? t('ModalParamsRoomInteractionAllowedText') : t('ModalParamsRoomNotAllowedText')}</Typography>
                    </Alert>
                    
                    <Alert sx={{pl:0, mb:2, alignItems: 'center'}} icon={<Switch checked={roomParams.isChatActivated} onChange={handleChangeIsChatActivated} 
                            disabled={adminView? false:true}
                            name="switchIsChatActivated" />} severity={roomParams.isChatActivated ? 'success' : 'warning'}>
                        <AlertTitle sx={{fontWeight:'bold'}} className='fontFamilyOpenSans'>{t('ModalParamsRoomChatAllowedTitle')}</AlertTitle>
                        <Typography fontSize='small' className='fontFamilyNunito'>{adminView? t('ModalParamsRoomChatAllowedText') : t('ModalParamsRoomNotAllowedText')}</Typography>
                    </Alert>

                    <Alert sx={{pl:0, mb:2, alignItems: 'center'}} icon={<Switch checked={roomParams.isPasswordNeeded} onChange={handleChangeIsPasswordNeeded} 
                            disabled={adminView? false:true}
                            name="switchInteractionsAllowed" />} severity={roomParams.isPasswordNeeded ? 'success' : 'warning'}>
                        <AlertTitle sx={{fontWeight:'bold'}} className='fontFamilyOpenSans'>Mot de passe requis</AlertTitle>
                        {!adminView && <Typography fontSize='small'>{t('ModalParamsRoomNotAllowedText')}</Typography>}
                        {adminView && !roomParams.isPasswordNeeded && <Typography fontSize='small'>Rendre la room accessible par mot de passe</Typography>}
                        {adminView && roomParams.isPasswordNeeded && 
                            <TextField
                                value={password}
                                type={showPassword ? 'text' : 'password'} 
                                onChange={(e) => setPassword(e.target.value)} 
                                sx={{bgcolor:'var(--white)', mt:1}} 
                                size="small" 
                                id="outlined-basic" 
                                label="Mot de passe" 
                                variant="outlined" 
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment sx={{ml:'-10px'}} position="start">
                                            <IconButton
                                                aria-label="Afficher / Cacher le mot de passe de la room"
                                                onClick={(e) => setShowPassword(!showPassword)}
                                                edge="end"
                                                >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            {password !== roomParams.password && <IconButton
                                                onClick={(e) => savePassword()}
                                                edge="end"
                                                >
                                                <SaveIcon />
                                            </IconButton>}
                                        </InputAdornment>
                                    )
                                }}
                            />
                        }
                    </Alert>
                    
                    <Alert sx={{pl:0, mb:2, alignItems: 'center'}} icon={<Switch checked={roomParams.syncPeopleByDefault} onChange={handleChangeSyncPeopleByDefault} 
                            disabled={adminView? false:true}
                            name="switchSyncPeopleByDefault" />} severity={roomParams.syncPeopleByDefault ? 'success' : 'warning'}>
                        <AlertTitle sx={{fontWeight:'bold'}}>Synchronisés par défaut</AlertTitle>
                        <Typography fontSize='small'>{adminView? 'Synchronise automatiquement les utilisateurs a l\'hôte de la room' : t('ModalParamsRoomNotAllowedText')}</Typography>
                    </Alert>

                    
                </FormGroup>
            </DialogContent>
        </Dialog>
    )
};

export default withTranslation()(ModalRoomParams);