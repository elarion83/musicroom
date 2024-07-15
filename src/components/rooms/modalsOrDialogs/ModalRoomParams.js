import React, { useState } from "react";

import TuneIcon from '@mui/icons-material/Tune';
import { AlertTitle, Button, Dialog, DialogContent, FormGroup, IconButton, InputAdornment, Switch, TextField, Typography } from "@mui/material";
import Alert from '@mui/material/Alert';

import { Visibility, VisibilityOff } from "@mui/icons-material";
import SaveIcon from '@mui/icons-material/Save';
import { withTranslation } from 'react-i18next';
import { SlideUp } from "../../../services/materialSlideTransition/Slide";
import ModalsHeader from "../../generalsTemplates/modals/ModalsHeader";

const ModalRoomParams = ({ t, adminView, open, changeOpen, roomParams, handleDisconnectFromSpotifyModal, handleDisconnectFromDeezerModal, handleChangeGeoloc, handleChangeRoomParams }) => {

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
        },
        isLocalisable: {
            checked:roomParams.isLocalisable,
            change : handleChangeGeoloc,
            title:t('RoomEmptyAlterGeolocTitleDisabled'),
            text:t('RoomEmptyAlterGeolocTextDisabled')
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