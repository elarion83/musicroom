import React, { useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';

import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

const ModalShareRoom = ({ roomUrl }) => {

    const [copiedToClipboard, setCopiedToClipboard] = useState(false);

    const delay = ms => new Promise(res => setTimeout(res, ms));
    async function setCopiedToClipboardToTrueAndFalse() {
        setCopiedToClipboard(true);
        await delay(2000);
        setCopiedToClipboard(false);
    }
    return(
        <Box sx={{ padding: '1em 2em 1em 1em' }}>
            <DialogTitle>Invitez des gens à rejoindre cette room ! </DialogTitle>  
            <DialogContent>
            <DialogContentText>
                <CopyToClipboard onCopy={(e) => setCopiedToClipboardToTrueAndFalse()} text={( roomUrl)}>
                    <Button variant="contained"> Click to copy url ! </Button> 
                </CopyToClipboard>
                {copiedToClipboard && <Alert severity="success"  sx={{ mt: 1.5 }} > Copié dans le presse papier !</Alert>}
            </DialogContentText>
            </DialogContent>
        </Box>
    )
};

export default ModalShareRoom;