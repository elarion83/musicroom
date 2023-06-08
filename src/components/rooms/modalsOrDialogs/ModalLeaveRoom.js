import React, { useState } from "react";
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';

import DialogTitle from '@mui/material/DialogTitle';
import { Dialog, DialogActions, DialogContent, DialogContentText } from "@mui/material";

const ModalForceSpotifyDisconnect = ({ open , changeOpen,handleQuitRoom }) => {

    return(
        <Dialog open={open} keepMounted onClose={(e) => changeOpen(false)} > 
            <DialogTitle id="alert-dialog-title">
                Quitter la room ?
            </DialogTitle>
            <DialogContent>
                <DialogContentText >
                Vous êtes sur le point de quitter la room pour retourner à l'accueil.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={(e) => handleQuitRoom(false)}>
                    Quitter
                </Button>
                <Button variant="outlined" onClick={(e) => changeOpen(false)} autoFocus>
                    Rester
                </Button>
            </DialogActions>
        </Dialog>
    )
};

export default ModalForceSpotifyDisconnect;