import React, { useState } from "react";

import { Dialog, DialogContent, Grid, Typography } from "@mui/material";
import DialogTitle from '@mui/material/DialogTitle';

import { withTranslation } from 'react-i18next';
import { SlideUp } from '../../../services/materialSlideTransition/Slide';

const ModalChangePlaylistAdmin = ({ t,open,playlistAdminPass,changeOpen,adminView }) => {

    return (
        <Dialog open={open} TransitionComponent={SlideUp} onClose={(e) => changeOpen(false)} className='modal_share_playlist'>
            <DialogTitle className='flexRowCenterH' sx={{ m: 0, p: 1 }}>
                Changement d'admin
            </DialogTitle>
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