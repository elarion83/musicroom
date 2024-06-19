import React, { useState } from "react";

import { Icon } from '@iconify/react';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import TuneIcon from '@mui/icons-material/Tune';
import { AlertTitle, Button, Dialog, DialogContent, FormGroup, IconButton, InputAdornment, Switch, TextField, Typography } from "@mui/material";
import Alert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';

import { Visibility, VisibilityOff } from "@mui/icons-material";
import SaveIcon from '@mui/icons-material/Save';
import { withTranslation } from 'react-i18next';
import { SlideUp } from "../../../services/materialSlideTransition/Slide";
import ModalsHeader from "../../generalsTemplates/modals/ModalsHeader";
import { timestampToHoursAndMinOptions } from "../../../services/utilsArray";

const ModalRoomParams = ({ t, adminView, open, changeOpen, roomParams, handleDisconnectFromSpotifyModal, handleDisconnectFromDeezerModal, handleChangeRoomParams }) => {

    const REDIRECT_URI = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ":" + window.location.port : '');

    const [showPassword, setShowPassword] = useState(false);

    const [password, setPassword] = useState(roomParams.password);

    async function savePassword() {
        roomParams.password = password;
        handleChangeRoomParams(roomParams);
        setShowPassword(false);
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
        if (!roomParams.isPasswordNeeded) {
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

    async function handleChangeIsChatActivated() {
        roomParams.isChatActivated = !roomParams.isChatActivated;
        handleChangeRoomParams(roomParams);
    }

    async function changeOpenInComp() {
        if (roomParams.isPasswordNeeded && password.length === 0 && roomParams.password.length === 0) {
            roomParams.isPasswordNeeded = false;
            handleChangeRoomParams(roomParams);
        }
        changeOpen(false);
    }

    var paramsArray = {
        playingLooping : {
            checked:roomParams.isPlayingLooping,
            change : handleChangeIsPlayingLooping,
            title:t('ModalParamsRoomLoopPlayingTitle'),
            text:t('ModalParamsRoomLoopPlayingText')
        },
        autoplay : {
            checked:roomParams.isAutoPlayActivated,
            change : handleChangeIsAutoPlayActivated,
            title:t('ModalParamsRoomAutoPlayingTitle'),
            text:t('ModalParamsRoomAutoPlayingText')
        },
        interractionsAllowed: {
            checked:roomParams.interactionsAllowed,
            change : handleChangeIsInterractionsAllowed,
            title:t('ModalParamsRoomInteractionAllowedTitle'),
            text:t('ModalParamsRoomInteractionAllowedText')
        },
        chatAllowed: {
            checked:roomParams.isChatActivated,
            change : handleChangeIsChatActivated,
            title:t('ModalParamsRoomChatAllowedTitle'),
            text:t('ModalParamsRoomChatAllowedText')
        },
        syncByDefault: {
            checked:roomParams.syncPeopleByDefault,
            change : handleChangeSyncPeopleByDefault,
            title:t('ModalParamsRoomAutoSyncTitle'),
            text:t('ModalParamsRoomAutoSyncText')
        }
    }

    return (
        <Dialog open={open} TransitionComponent={SlideUp} onClose={(e) => changeOpenInComp(false)}>
            <ModalsHeader icon={() => <TuneIcon />} title={t('ModalParamsRoomTitle')} />

            <DialogContent dividers sx={{ pt: 2 }}>
                <FormGroup>

                    {/*!roomParams.deezer.IsLinked &&
                        <Button
                            sx={{ mb: 1, bgcolor: '#b560ff' }}
                            startIcon={<Icon style={{ display: 'inline', color: 'white', marginRight: '0.5em' }} icon="jam:deezer" />}
                            variant="contained"
                            color="success"
                            onClick={e => window.location.href = `${process.env.REACT_APP_ROOM_DEEZER_AUTH_ENDPOINT}?app_id=${process.env.REACT_APP_ROOM_DEEZER_APP_ID}&redirect_uri=${REDIRECT_URI}&perms=basic_access,email`}>
                            {t('ModalParamsRoomConnectToDeezerText')}
                        </Button>
                    }
                    {roomParams.deezer.IsLinked &&
                        <Alert
                            sx={{ mb: 1 }}
                            action={
                                <Tooltip title="Forcer la déconnexion">
                                    <Button onClick={e => handleDisconnectFromDeezerModal(true)}>
                                        <ExitToAppIcon fontSize="small" />
                                    </Button>
                                </Tooltip>
                            }
                        >
                            {t('ModalParamsRoomConnectedToDeezerText')}
                        </Alert>
                    */}

                    {roomParams.spotify.IsLinked &&
                        <Button
                            sx={{ bgcolor: '#1ed760', mb:3 }}
                            startIcon={<Icon style={{ display: 'inline', color: 'white', marginRight: '0.5em' }} icon="mdi:spotify" />}
                            variant="contained"
                            color="success"
                            onClick={e => window.location.href = `${process.env.REACT_APP_ROOM_SPOTIFY_AUTH_ENDPOINT}?client_id=${process.env.REACT_APP_ROOM_SPOTIFY_CLIENT_ID}&scope=user-read-playback-state%20streaming%20user-read-email%20user-modify-playback-state%20user-read-private&redirect_uri=${REDIRECT_URI}&response_type=${process.env.REACT_APP_ROOM_SPOTIFY_RESPONSE_TYPE}`}>
                            {t('ModalParamsRoomConnectToSpotifyText')}
                        </Button>
                    }
                    {roomParams.spotify.IsLinked &&
                        <Alert
                        sx={{mb:3}}
                            action={
                                <Tooltip title="Forcer la déconnexion">
                                    <Button onClick={e => handleDisconnectFromSpotifyModal(true)}>
                                        <ExitToAppIcon fontSize="small" />
                                    </Button>
                                </Tooltip>
                            }
                        >
                            <b>{t('ModalParamsRoomConnectedToSpotifyText')}</b>
                            <Typography fontSize='small' className='fontFamilyNunito'>
                                Grâce à {roomParams.spotify.UserConnected} à {' '}
                                {new Date(roomParams.spotify.TokenTimestamp).toLocaleTimeString('fr-FR', timestampToHoursAndMinOptions).replace(':', 'h')}
                            </Typography>
                        </Alert>
                    }

                    {Object.entries(paramsArray).map(([key, param]) => {
                        return(
                        <Alert key={key} sx={{ pl: 0, mb: 2, alignItems: 'center' }}  icon={<Switch checked={param.checked} onChange={param.change}
                            disabled={!adminView} 
                            name={key} />} severity={param.checked ? 'success' : 'warning'}>
                            <AlertTitle sx={{ fontWeight: 'bold' }} className='fontFamilyOpenSans'>{param.title}</AlertTitle>
                            <Typography fontSize='small' className='fontFamilyNunito'>{adminView ? param.text : t('ModalParamsRoomNotAllowedText')}</Typography>
                        </Alert>
                        )
                    })}

                    <Alert sx={{ pl: 0, mb: 2, alignItems: 'center' }}  icon={<Switch checked={roomParams.isPasswordNeeded} onChange={handleChangeIsPasswordNeeded}
                        disabled={!adminView} 
                        name="switchInteractionsAllowed" />} severity={roomParams.isPasswordNeeded ? 'success' : 'warning'}>
                        <AlertTitle sx={{ fontWeight: 'bold' }} className='fontFamilyOpenSans'>Mot de passe requis</AlertTitle>
                        {!adminView && 
                            <Typography fontSize='small'>{t('ModalParamsRoomNotAllowedText')}</Typography>
                        }
                        {adminView && !roomParams.isPasswordNeeded && <Typography fontSize='small'>Rendre la playlist accessible par mot de passe</Typography>}
                        {adminView && roomParams.isPasswordNeeded &&
                            <TextField
                                value={password}
                                type={showPassword ? 'text' : 'password'}
                                onChange={(e) => setPassword(e.target.value)}
                                sx={{ bgcolor: 'var(--white)', mt: 1 }}
                                size="small"
                                id="outlined-basic"
                                label="Mot de passe"
                                variant="outlined"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment sx={{ ml: '-10px', maxHeight:0 }} position="start">
                                            <IconButton
                                                aria-label="Afficher / Cacher le mot de passe de la playlist"
                                                onClick={(e) => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <>{password !== roomParams.password && <InputAdornment sx={{ maxHeight:0 }} position="end">
                                            <IconButton
                                                onClick={(e) => savePassword()}
                                                edge="end"
                                            >
                                                <SaveIcon />
                                            </IconButton>
                                        </InputAdornment>}</>
                                    )
                                }}
                            />
                        }
                    </Alert>
                </FormGroup>
            </DialogContent>
        </Dialog>
    )
};

export default withTranslation()(ModalRoomParams);