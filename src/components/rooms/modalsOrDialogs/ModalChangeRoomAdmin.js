import React, { useState } from "react";

import { Dialog, DialogContent, Grid, Typography } from "@mui/material";
import SwitchAccountIcon from '@mui/icons-material/SwitchAccount';
import { withTranslation } from 'react-i18next';
import { SlideUp } from '../../../services/materialSlideTransition/Slide';

const ModalChangePlaylistAdmin = ({ t,open,playlistAdminPass,changeOpen,adminView }) => {

    return (
        <Dialog open={open} TransitionComponent={SlideUp} onClose={(e) => changeOpen(false)} className='modal_share_playlist'>
            <ModalsHeader icon={() => <SwitchAccountIcon />} title={t('ModalChangePlaylistAdmin')} />

            <DialogContent dividers sx={{ pt: 2 }}>
                 
                {adminView &&
                    <Typography>
                        Donnez ce mot de passe a quelqu'un pour qu'il devienne l'admin de la playlist: {playlistAdminPass}
                    </Typography> 
                }
                {!adminView &&
                    <>
                        <Typography>Entre le mot de passe pour devenir admin : (demande le a l'admin actuel)</Typography>
                    </>
                }
            </DialogContent>
        </Dialog>
    )
};

export default withTranslation()(ModalChangePlaylistAdmin);