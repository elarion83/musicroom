import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import React, { useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { ShareSocial } from 'react-share-social';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShareIcon from '@mui/icons-material/Share';
import { Dialog, DialogContent } from "@mui/material";
import DialogTitle from '@mui/material/DialogTitle';

import { withTranslation } from 'react-i18next';
import { SlideUp } from '../../../services/materialSlideTransition/Slide';

const ModalShareRoom = ({ t, roomUrl, open, changeOpen }) => {

    const [copiedToClipboard, setCopiedToClipboard] = useState(false);

    const delay = ms => new Promise(res => setTimeout(res, ms));
    async function setCopiedToClipboardToTrueAndFalse() {
        setCopiedToClipboard(true);
        await delay(2000);
        setCopiedToClipboard(false);
    }

    return(
        <Dialog open={open} TransitionComponent={SlideUp}  onClose={(e) => changeOpen(false)} className='modal_share_room'>
            <DialogTitle className='flexRowCenterH' sx={{ m: 0,p:1 }}>
                <ShareIcon fontSize="small" sx={{mr:1}} /> {t('ModalShareRoomTitle')}
            </DialogTitle>  
            <DialogContent dividers sx={{pt:0}}>
                <ShareSocial sx={{maxHeight:'none', p:0}}
                    url ={roomUrl}
                    socialTypes={['facebook','whatsapp','twitter','reddit','email']}
                />
                <CopyToClipboard onCopy={(e) => setCopiedToClipboardToTrueAndFalse()} text={( roomUrl)}>
                        <Button variant="contained"><ContentCopyIcon sx={{ mr: 1.5 }} /> {t('ModalShareRoomCopyUrl')} </Button> 
                </CopyToClipboard>
                {copiedToClipboard && <Alert severity="success" sx={{ mt: 1.5 }} > {t('ModalShareRoomUrlCopiedText')} </Alert>}
            </DialogContent>
        </Dialog>
    )
};

export default withTranslation()(ModalShareRoom);