import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import React, { useState } from "react";

import { Dialog, DialogActions, DialogContent, DialogContentText } from "@mui/material";
import DialogTitle from '@mui/material/DialogTitle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const ModalForceSpotifyDisconnect = ({ open, changeOpen, handleDisconnectSpotify }) => {

    const [loading, setLoading] = useState(false);
    const delay = ms => new Promise(res => setTimeout(res, ms));
    
    async function handleDisconnectSpotifyInComp() {
        setLoading(true);
        await delay(500)
        handleDisconnectSpotify();
    }

    return(
        <Dialog open={open} keepMounted onClose={(e) => changeOpen(false)} sx={{zIndex:10000}}> 
            <DialogTitle className='flexRowCenterH' sx={{ m: 0,p:1 }}>
                <ExitToAppIcon fontSize="small" sx={{mr:1}} />Forcer la deconnexion de Spotify ? 
            </DialogTitle>  
            <DialogContent dividers>
                <DialogContentText >
                La lecture et la recherche via Spotify ne sera plus disponible.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <LoadingButton loading={loading} variant="outlined" onClick={(e) => handleDisconnectSpotifyInComp()}>
                    Oui
                </LoadingButton>
                <Button variant="outlined" onClick={(e) => changeOpen(false)} autoFocus>
                    Non
                </Button>
            </DialogActions>
        </Dialog>
    )
};

export default ModalForceSpotifyDisconnect;