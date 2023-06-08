import Box from '@mui/material/Box';
import React from "react";

import DialogTitle from '@mui/material/DialogTitle';


import { Icon } from '@iconify/react';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import TuneIcon from '@mui/icons-material/Tune';
import { Button } from "@mui/material";
import Alert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';

const ModalRoomParams = ({ roomParams , handleDisconnectFromSpotifyModal}) => {

    const REDIRECT_URI = window.location.protocol+'//'+window.location.hostname+(window.location.port ? ":" + window.location.port : '');

    return(
        <Box sx={{ padding: '1em 2em 1em 1em' }} className='modal_share_room'>
            <DialogTitle sx={{padding:0}}>
            <TuneIcon  fontSize="small" /> Paramètres de la room </DialogTitle>  
            {!roomParams.spotifyIsLinked && 
                <Button
                    startIcon={<Icon style={{display:'inline',  marginRight:'0.5em'}} icon="mdi:spotify" />}
                    variant="contained" 
                    color="success" 
                    sx={{mt:2}} 
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
        </Box>
    )
};

export default ModalRoomParams;