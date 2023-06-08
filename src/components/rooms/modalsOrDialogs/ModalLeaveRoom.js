import Button from '@mui/material/Button';
import React from "react";

import { Dialog, DialogActions, DialogContent, DialogContentText } from "@mui/material";
import DialogTitle from '@mui/material/DialogTitle';

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