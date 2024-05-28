import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import React, { useState } from "react";

import { Dialog, DialogActions, DialogContent, DialogContentText } from "@mui/material";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import { withTranslation } from 'react-i18next';
import ModalsHeader from '../../generalsTemplates/modals/ModalsHeader';

const ModalForceSpotifyDisconnect = ({ t, open, changeOpen, handleDisconnectSpotify }) => {

    const [loading, setLoading] = useState(false);
    const delay = ms => new Promise(res => setTimeout(res, ms));
    
    async function handleDisconnectSpotifyInComp() {
        setLoading(true);
        await delay(500)
        handleDisconnectSpotify();
    }

    return(
        <Dialog open={open} keepMounted onClose={(e) => changeOpen(false)} sx={{zIndex:10000}}> 
            <ModalsHeader icon={() => <ExitToAppIcon />} title={t('ModalRoomForceSpotifyDisconnectTitle')} />

            <DialogContent dividers>
                <DialogContentText >
                    {t('ModalRoomForceSpotifyDisconnectText')}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <LoadingButton loading={loading} variant="outlined" onClick={(e) => handleDisconnectSpotifyInComp()}>
                    {t('GeneralYes')}
                </LoadingButton>
                <Button variant="outlined" onClick={(e) => changeOpen(false)} autoFocus>
                    {t('GeneralNo')}
                </Button>
            </DialogActions>
        </Dialog>
    )
};

export default withTranslation()(ModalForceSpotifyDisconnect);