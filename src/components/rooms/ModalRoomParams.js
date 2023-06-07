import React, { useState } from "react";
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

import DialogTitle from '@mui/material/DialogTitle';

import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { Button } from "@mui/material";
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const ModalRoomParams = ({ roomParams,spotifyTokenProps }) => {

    
    const CLIENT_ID = "cd4558d83dd845139f3dfffecf48b903"
    const REDIRECT_URI = window.location.protocol+'//'+window.location.hostname+(window.location.port ? ":" + window.location.port : '');
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
    const RESPONSE_TYPE = "token"

    const marks = [
        {
            value: 5000,
            label: '5sec.',
        },
        {
            value: 20000,
            label: '20sec.',
        },
        {
            value: 60000,
            label: '1min.',
        },
        {
            value: 90000,
            label: '1min30',
        },
    ];

    
    function valuetext(value) {
        return `${value}°C`;
    }

    function valueLabelFormat(value) {
        return marks.findIndex((mark) => mark.value === value) + 1;
    }


    return(
        <Box sx={{ padding: '1em 2em 1em 1em' }} className='modal_share_room'>
            <DialogTitle sx={{padding:0}}>Paramètres de la room </DialogTitle>  
            
            <Typography variant="subtitle1" display="block">
                Connexion Spotify
            </Typography>
            {spotifyTokenProps.length === 0 && 
                <Button variant="contained" color="success" sx={{mt:0, display:'block'}} onClick={e => window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&scope=user-read-playback-state%20streaming%20user-read-email%20user-modify-playback-state%20user-read-private&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>
                Connecter la room a Spotify
                </Button>
            }
            
        </Box>
    )
};

export default ModalRoomParams;