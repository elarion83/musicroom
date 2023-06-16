import Button from '@mui/material/Button';
import React from "react";

import { Dialog, DialogActions, DialogContent, DialogContentText, Typography } from "@mui/material";
import DialogTitle from '@mui/material/DialogTitle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const ModalForceSpotifyDisconnect = ({ open , changeOpen,handleQuitRoom }) => {

    return(
        <Dialog open={open} keepMounted onClose={(e) => changeOpen(false)} > 
        
            <DialogTitle className='flexRowCenterH' sx={{ m: 0,p:1 }}>
                <ExitToAppIcon fontSize="small" sx={{mr:1}} /> Quitter la room ? 
            </DialogTitle>  
            <DialogContent dividers>
                <DialogContentText>
                        Vous êtes sur le point de quitter la room pour retourner à l'accueil.
                </DialogContentText>
                <DialogContentText>
                        Êtes-vous sûrs ?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={(e) => handleQuitRoom()}>
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