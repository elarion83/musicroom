import React from "react";

import DialogTitle from '@mui/material/DialogTitle';


import { Icon } from '@iconify/react';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import TuneIcon from '@mui/icons-material/Tune';
import { Button, Dialog, DialogContent, FormControlLabel, FormGroup, Switch } from "@mui/material";
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

    async function handleChangeIsOnInvitation() {
        roomParams.isOnInvitation = !roomParams.isOnInvitation;
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

                    <FormControlLabel
                        sx={{mt:1}}
                        control={
                            <Switch checked={roomParams.isPlayingLooping} onChange={handleChangeIsPlayingLooping} 
                            disabled={adminView? false:true}
                            name="switchIsPlayingLooping" />
                        }
                        label="Lire la playlist en boucle"
                    />

                    <FormControlLabel
                        control={
                            <Switch checked={roomParams.interactionsAllowed} onChange={handleChangeIsInterractionsAllowed} 
                            disabled={adminView? false:true}
                            name="switchInteractionsAllowed" />
                        }
                        label="Autoriser les interactions"
                    />
                    
                    <FormControlLabel
                    sx={{display:'none'}}
                        control={
                            <Switch checked={roomParams.allowEverybodyToAddMedia} onChange={handleChangeAllowEverybodyToAddMedia} 
                            disabled={adminView? false:true}
                            name="switchAllowEverybodyToAddMedia" />
                        }
                        label="Tout le monde peut ajouter des médias"
                    />
                    
                    <FormControlLabel
                    sx={{display:'none'}}
                        control={
                            <Switch checked={roomParams.isOnInvitation} onChange={handleChangeIsOnInvitation} 
                            disabled={adminView? false:true}
                            name="switchIsOnInvitation" />
                        }
                        label="Room accessible sur invitation uniquement"
                    />
                </FormGroup>
            </DialogContent>
        </Dialog>
    )
};

export default ModalRoomParams;