import React, { useState } from "react";
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

import DialogTitle from '@mui/material/DialogTitle';

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
            <Slider
                aria-label="Restricted values"
                defaultValue={roomParams.frequenceInteraction}
                valueLabelFormat={valueLabelFormat}
                getAriaValueText={valuetext}
                step={null}
                valueLabelDisplay="auto"
                marks={marks}
            />
        </Box>
    )
};

export default ModalRoomParams;