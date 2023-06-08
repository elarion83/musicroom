import React, { useState } from "react";
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

import DialogTitle from '@mui/material/DialogTitle';

import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { Button } from "@mui/material";
import Alert from '@mui/material/Alert';
import TuneIcon from '@mui/icons-material/Tune';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const ModalRoomParams = ({ roomParams , handleDisconnectFromSpotify}) => {

    const REDIRECT_URI = window.location.protocol+'//'+window.location.hostname+(window.location.port ? ":" + window.location.port : '');

    console.log(process);
    return(
        <Box sx={{ padding: '1em 2em 1em 1em' }} className='modal_share_room'>
            <DialogTitle sx={{padding:0}}>
            <TuneIcon  fontSize="small" /> Paramètres de la room </DialogTitle>  
            {!roomParams.spotifyIsLinked && 
                <Button variant="contained" color="success" sx={{mt:2, display:'block'}} onClick={e => window.location.href = `${process.env.REACT_APP_ROOM_SPOTIFY_AUTH_ENDPOINT}?client_id=${process.env.REACT_APP_ROOM_SPOTIFY_CLIENT_ID}&scope=user-read-playback-state%20streaming%20user-read-email%20user-modify-playback-state%20user-read-private&redirect_uri=${REDIRECT_URI}&response_type=${process.env.REACT_APP_ROOM_SPOTIFY_RESPONSE_TYPE}`}>
                Connecter la room a Spotify
                </Button>
            }          
            %REACT_APP_CLIENT_ID%
            {process.env.REACT_APP_CLIENT_ID}  
            {roomParams.spotifyIsLinked && 
                <>
                    <Typography>La room est connectée a Spotify</Typography>
                    <Button color="success" onClick={e => handleDisconnectFromSpotify()}> forcer la déco</Button>
                </>
            }
        </Box>
    )
};

export default ModalRoomParams;