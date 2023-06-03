import React, { useState } from "react";
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

import DialogTitle from '@mui/material/DialogTitle';

import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const ModalRoomParams = ({ roomParams }) => {
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
            
            <p>Qui peut ajouter à la playlist ?</p>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={'all'}
            >
                <MenuItem value={'all'}>Tout le monde </MenuItem>
                <MenuItem value={25}>Moi uniquement</MenuItem>
            </Select>
            <p>Activer les réactions en temps réel</p>
            <FormControlLabel control={<Switch checked={true} />} />
            <p>Délai des réactions en temps réel</p>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={25}
            >
                <MenuItem value={15}>15 secondes</MenuItem>
                <MenuItem value={25}>25 secondes</MenuItem>
                <MenuItem value={60}>1 minute</MenuItem>
                <MenuItem value={120}>2 minute</MenuItem>
            </Select>
        </Box>
    )
};

export default ModalRoomParams;