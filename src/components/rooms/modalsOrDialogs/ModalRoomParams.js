import React from "react";

import DialogTitle from '@mui/material/DialogTitle';


import { Icon } from '@iconify/react';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import TuneIcon from '@mui/icons-material/Tune';
import { AlertTitle, Button, Dialog, DialogContent, Divider, FormControlLabel, FormGroup, Switch, Typography } from "@mui/material";
import Alert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';

const ModalRoomParams = ({ adminView, open, changeOpen, roomParams , handleDisconnectFromSpotifyModal, handleChangeRoomParams}) => {

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
                <TuneIcon fontSize="small" sx={{mr:1}} /> Paramètres de la room 
            </DialogTitle>  
            <DialogContent dividers sx={{pt:2}}>
                <FormGroup>
                    {!roomParams.spotifyIsLinked && 
                            <Button
                                startIcon={<Icon style={{display:'inline',  marginRight:'0.5em'}} icon="mdi:spotify" />}
                                variant="contained" 
                                color="success"  
                                onClick={e => window.location.href = `${process.env.REACT_APP_ROOM_SPOTIFY_AUTH_ENDPOINT}?client_id=${process.env.REACT_APP_ROOM_SPOTIFY_CLIENT_ID}&scope=user-read-playback-state%20streaming%20user-read-email%20user-modify-playback-state%20user-read-private&redirect_uri=${REDIRECT_URI}&response_type=${process.env.REACT_APP_ROOM_SPOTIFY_RESPONSE_TYPE}`}>
                                Connecter a Spotify
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
                            La room est connectée a Spotify
                        </Alert>
                    }

                    <Alert sx={{pl:0, mt:3, mb:2}} icon={<Switch checked={roomParams.isPlayingLooping} onChange={handleChangeIsPlayingLooping} 
                            disabled={adminView? false:true}
                            name="switchIsPlayingLooping" />} severity={roomParams.isPlayingLooping ? 'success' : 'warning'}>
                        <AlertTitle sx={{fontWeight:'bold'}}>Lecture en boucle</AlertTitle>
                        <Typography fontSize='small'>Si la playlist est finie, le lecteur reviens au premier média.</Typography>
                    </Alert>

                    <Alert sx={{pl:0, mb:2}} icon={<Switch checked={roomParams.interactionsAllowed} onChange={handleChangeIsInterractionsAllowed} 
                            disabled={adminView? false:true}
                            name="switchInteractionsAllowed" />} severity={roomParams.interactionsAllowed ? 'success' : 'warning'}>
                        <AlertTitle sx={{fontWeight:'bold'}}>Autoriser les interactions</AlertTitle>
                        <Typography fontSize='small'>Permet aux membres de la room d'intéragir avec les emoticones.</Typography>
                    </Alert>
                    
                    <Alert sx={{pl:0, mb:2}} icon={<Switch checked={roomParams.isAutoPlayActivated} onChange={handleChangeIsAutoPlayActivated} 
                            disabled={adminView? false:true}
                            name="switchIsAutoPlayActivated" />} severity={roomParams.isAutoPlayActivated ? 'success' : 'warning'}>
                        <AlertTitle sx={{fontWeight:'bold'}}>Lecture automatique</AlertTitle>
                        <Typography fontSize='small'>Le lecteur ajoutera automatiquement des médias à la playlist.</Typography>
                    </Alert>

                    <Alert sx={{pl:0, mb:2}} icon={<Switch checked={roomParams.isChatActivated} onChange={handleChangeIsChatActivated} 
                            disabled={adminView? false:true}
                            name="switchIsChatActivated" />} severity={roomParams.isChatActivated ? 'success' : 'warning'}>
                        <AlertTitle sx={{fontWeight:'bold'}}>Activer le chat de room</AlertTitle>
                        <Typography fontSize='small'>Active le chat de la room.</Typography>
                    </Alert>
                    
                </FormGroup>
            </DialogContent>
        </Dialog>
    )
};

export default ModalRoomParams;