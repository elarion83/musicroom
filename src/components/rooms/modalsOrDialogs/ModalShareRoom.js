import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import React, { useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { shareArray } from '../../../services/utilsArray';

import DoneIcon from '@mui/icons-material/Done';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShareIcon from '@mui/icons-material/Share';
import { AlertTitle, Dialog, DialogContent, Grid, Typography } from "@mui/material";

import { withTranslation } from 'react-i18next';
import { SlideUp } from '../../../services/materialSlideTransition/Slide';
import ModalsHeader from '../../generalsTemplates/modals/ModalsHeader';
import { delay } from '../../../services/utils';

const ModalShareRoom = ({ t, open, changeOpen }) => {

    const roomUrl = window.location.href;
    const [copiedToClipboard, setCopiedToClipboard] = useState(false);

    async function setCopiedToClipboardToTrueAndFalse() {
        setCopiedToClipboard(true);
        await delay(2000);
        setCopiedToClipboard(false);
    }

    return (
        <Dialog open={open} TransitionComponent={SlideUp} onClose={(e) => changeOpen(false)} className='modal_share_room'>
            <ModalsHeader icon={() => <ShareIcon />} title={t('ModalShareRoomTitle')} />
            
            <DialogContent dividers sx={{ pt: 2 }}>

                {/*Object.entries(shareArray).map(([key, share]) => {
                    const ShareButtonComponent = share.button;
                    const ShareIconComponent = share.icon;
                    return(
                        <ShareButtonComponent
                            url={roomUrl}
                            key={key}
                            subject='Join my playlist on play-it !'
                            title='Join my playlist on play-it !'
                            quote='Join my playlist on play-it !'
                            separator=":: "
                            className="Demo__some-network__share-button"
                        >
                            <ShareIconComponent size={45} round />
                        </ShareButtonComponent>
                    );
                })*/}
                <CopyToClipboard className={`texturaBgButton border bordSolid bord2 ${copiedToClipboard ? 'bordGreenLight' : 'bordLight'}`} onCopy={(e) => setCopiedToClipboardToTrueAndFalse()} text={(roomUrl)}>
                    <Alert
                     icon={
                        copiedToClipboard ? <DoneIcon /> : <ContentCopyIcon /> 
                    }
                    severity={copiedToClipboard ? "success" : "info"} sx={{cursor:'pointer'}}>
                        <AlertTitle  sx={{fontWeight:'bold'}}>{t('ModalShareRoomCopyUrl')}</AlertTitle>
                        <Typography className='fontFamilyNunito'>
                            {copiedToClipboard ? 
                                t('ModalShareRoomUrlCopiedText') : 
                                roomUrl
                            }
                        </Typography>
                    </Alert>
                </CopyToClipboard>
            </DialogContent>
        </Dialog>
    )
};

export default withTranslation()(ModalShareRoom);