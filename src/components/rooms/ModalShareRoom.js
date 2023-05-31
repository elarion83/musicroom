import React, { useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import {ShareSocial} from 'react-share-social' 

import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

const ModalShareRoom = ({ roomUrl }) => {

    return(
        <Box sx={{ padding: '1em 2em 1em 1em' }}>
            <DialogTitle sx={{pb:0}}>Invitez des gens dans la room ! </DialogTitle>  
            <DialogContentText sx={{ml:3}}>
                Invitez vos guests en leur partagant cette room !

                <ShareSocial 
                    url ={roomUrl}
                    socialTypes={['facebook','twitter','reddit','linkedin']}
                />
            </DialogContentText>
        </Box>
    )
};

export default ModalShareRoom;