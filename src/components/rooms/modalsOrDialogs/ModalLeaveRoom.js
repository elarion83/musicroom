import Button from '@mui/material/Button';
import React from "react";

import { Dialog, DialogActions, DialogContent, DialogContentText, Typography } from "@mui/material";
import DialogTitle from '@mui/material/DialogTitle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
 
import { withTranslation } from 'react-i18next';

const ModalLeaveRoom = ({ t, open , changeOpen,handleQuitRoom }) => {

    return(
        <Dialog open={open} keepMounted onClose={(e) => changeOpen(false)} > 
        
            <DialogTitle className='flexRowCenterH' sx={{ m: 0,p:1 }}>
                <ExitToAppIcon fontSize="small" sx={{mr:1}} /> {t('ModalLeaveRoomTitle')} 
            </DialogTitle>  
            <DialogContent dividers>
                <DialogContentText>
                        {t('ModalLeaveRoomText')}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={(e) => handleQuitRoom()}>
                    {t('GeneralLeave')}
                </Button>
                <Button variant="outlined" onClick={(e) => changeOpen(false)} autoFocus>
                    {t('GeneralStay')}
                </Button>
            </DialogActions>
        </Dialog>
    )
};

export default withTranslation()(ModalLeaveRoom);