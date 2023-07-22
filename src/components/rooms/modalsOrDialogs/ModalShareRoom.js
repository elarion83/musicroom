import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import React, { useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";

import {
    EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  InstapaperIcon,
  InstapaperShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShareIcon from '@mui/icons-material/Share';
import { Dialog, DialogContent, Grid } from "@mui/material";
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
            <DialogContent dividers sx={{pt:2}}>
                <EmailShareButton
                    url={roomUrl}
                    subject='ee'
                    body="body"
                    className="Demo__some-network__share-button"
                >
                    <EmailIcon size={45} round />
                </EmailShareButton>

                <RedditShareButton
                    url={roomUrl}
                    title='ee'
                    windowWidth={660}
                    windowHeight={460}
                    className="Demo__some-network__share-button"
                >
                    <RedditIcon size={45} round />
                </RedditShareButton>

                <WhatsappShareButton
                    url={roomUrl}
                    title='ee'
                    separator=":: "
                    className="Demo__some-network__share-button"
                >
                    <WhatsappIcon size={45} round />
                </WhatsappShareButton>

                <TelegramShareButton
                    url={roomUrl}
                    title='ee'
                    className="Demo__some-network__share-button"
                >
                    <TelegramIcon size={45} round />
                </TelegramShareButton>

                <TwitterShareButton
                    url={roomUrl}
                    title='ee'
                    className="Demo__some-network__share-button"
                >
                    <TwitterIcon size={45} round />
                </TwitterShareButton>

                <FacebookShareButton
                    url={roomUrl}
                    quote='ee'
                    className="Demo__some-network__share-button"
                >
                    <FacebookIcon size={45} round />
                </FacebookShareButton>

                <InstapaperShareButton
                    url={roomUrl}
                    title='ee'
                    className="Demo__some-network__share-button"
                >
                    <InstapaperIcon size={45} round />
                </InstapaperShareButton>
                <Grid sx={{mt:2}}>
                    <CopyToClipboard onCopy={(e) => setCopiedToClipboardToTrueAndFalse()} text={( roomUrl)}>
                            <Button variant="contained"><ContentCopyIcon sx={{ mr: 1.5 }} /> {t('ModalShareRoomCopyUrl')} </Button> 
                    </CopyToClipboard>
                    {copiedToClipboard && <Alert severity="success" sx={{ mt: 1.5 }} > {t('ModalShareRoomUrlCopiedText')} </Alert>}
                </Grid>
            </DialogContent>
        </Dialog>
    )
};

export default withTranslation()(ModalShareRoom);