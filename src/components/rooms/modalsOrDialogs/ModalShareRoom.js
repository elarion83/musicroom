import React, { useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import {ShareSocial} from 'react-share-social' 

import DialogTitle from '@mui/material/DialogTitle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Dialog } from "@mui/material";

const ModalShareRoom = ({ roomUrl, open, changeOpen }) => {

    const [copiedToClipboard, setCopiedToClipboard] = useState(false);

    const delay = ms => new Promise(res => setTimeout(res, ms));
    async function setCopiedToClipboardToTrueAndFalse() {
        setCopiedToClipboard(true);
        await delay(2000);
        setCopiedToClipboard(false);
    }

    return(
        <Dialog open={open} onClose={(e) => changeOpen(false)}>
            <Box sx={{ padding: '1em 2em 1em 1em' }} className='modal_share_room'>
                <DialogTitle sx={{padding:0}}>Partager la room ! </DialogTitle>  

                <ShareSocial sx={{margin:0, padding:0,maxHeight:'none'}}
                    url ={roomUrl}
                    socialTypes={['facebook','whatsapp','twitter','reddit','email']}
                ></ShareSocial>
                <CopyToClipboard onCopy={(e) => setCopiedToClipboardToTrueAndFalse()} text={( roomUrl)}>
                        <Button variant="contained"><ContentCopyIcon sx={{ mr: 1.5 }} /> Copier l'url </Button> 
                </CopyToClipboard>
                {copiedToClipboard && <Alert severity="success" sx={{ mt: 1.5 }} > Copié dans le presse papier </Alert>}
            </Box>
        </Dialog>
    )
};

export default ModalShareRoom;