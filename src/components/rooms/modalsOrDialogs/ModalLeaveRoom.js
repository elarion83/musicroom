import Button from '@mui/material/Button';
import React from "react";

import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Alert, AlertTitle, Dialog, DialogActions, DialogContent, DialogContentText } from "@mui/material";

import { withTranslation } from 'react-i18next';
import { SlideUp } from '../../../services/materialSlideTransition/Slide';
import ModalsHeader from '../../generalsTemplates/modals/ModalsHeader';
import ModalsFooter from '../../generalsTemplates/modals/ModalsFooter';

const ModalLeaveRoom = ({ t, open, changeOpen, handleQuitRoom }) => {

    return (
        <Dialog open={open} TransitionComponent={SlideUp} keepMounted onClose={(e) => changeOpen(false)} sx={{zIndex:1350}}>
            <ModalsHeader icon={() => <ExitToAppIcon />} title={t('ModalLeaveRoomTitle')} />

            <DialogContent dividers>
                <Alert severity="info">
                    <AlertTitle sx={{fontWeight:"bold"}}>{t('ModalLeaveRoomTitle')} ?</AlertTitle>
                    {t('ModalLeaveRoomText')}
                </Alert>
            </DialogContent>
            
            <ModalsFooter 
                backButtonText={t('GeneralStay')} 
                backFunc={(e) => changeOpen(false)} 
                secondButtonFunc={handleQuitRoom} 
            />
        </Dialog>
    )
};

export default withTranslation()(ModalLeaveRoom);