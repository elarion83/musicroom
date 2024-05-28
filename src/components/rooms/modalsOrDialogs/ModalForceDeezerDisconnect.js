import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import React, { useState } from "react";

import { Dialog, DialogActions, DialogContent, DialogContentText } from "@mui/material";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import { withTranslation } from 'react-i18next';
import ModalsHeader from '../../generalsTemplates/modals/ModalsHeader';

const ModalForceDeezerDisconnect = ({ t, open, changeOpen, handleDisconnectDeezer }) => {

    const [loading, setLoading] = useState(false);
    const delay = ms => new Promise(res => setTimeout(res, ms));
    
    async function handleDisconnectDeezerInComp() {
        setLoading(true);
        await delay(500)
        handleDisconnectDeezer();
    }

    return(
        <Dialog open={open} keepMounted onClose={(e) => changeOpen(false)} sx={{zIndex:10000}}> 
            <ModalsHeader icon={() => <ExitToAppIcon />} title={t('ModalRoomForceDeezerDisconnectTitle')} />

            <DialogContent dividers>
                <DialogContentText >
                    {t('ModalRoomForceDeezerDisconnectText')}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <LoadingButton loading={loading} variant="outlined" onClick={(e) => handleDisconnectDeezerInComp()}>
                    {t('GeneralYes')}
                </LoadingButton>
                <Button variant="outlined" onClick={(e) => changeOpen(false)} autoFocus>
                    {t('GeneralNo')}
                </Button>
            </DialogActions>
        </Dialog>
    )
};

export default withTranslation()(ModalForceDeezerDisconnect);