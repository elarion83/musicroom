import Alert from '@mui/material/Alert';
import React, { useState } from "react";

import ShareIcon from '@mui/icons-material/Share';
import { AlertTitle, Dialog, DialogContent, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import DialogTitle from '@mui/material/DialogTitle';

import { Visibility, VisibilityOff } from '@mui/icons-material';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import { withTranslation } from 'react-i18next';

const ModalEnterRoomPassword = ({ password, open, changeOpen }) => {

    const [userPassword, setUserPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [passwordIsWrong, setPasswordIsWrong] = useState(false);

    async function joinRoomByPassword() {
        if(userPassword.length > 0 ) {
            if(password === userPassword) {
                changeOpen(false);
            } else {
                setPasswordIsWrong(true);
            }
        } else {
            setPasswordIsWrong(false);
        }
    }

    return(
       <Dialog open={open}>
            <DialogTitle className='flexRowCenterH' sx={{ m: 0,p:1 }}>
                <ShareIcon fontSize="small" sx={{mr:1}} /> Mot de passe
            </DialogTitle>  
            <DialogContent dividers sx={{pt:0}}>
               
                <Alert sx={{pl:1, mb:2, mt:1, alignItems: 'center'}} severity='warning'>
                    <AlertTitle sx={{fontWeight:'bold'}}>Room protégée par mot de passe</AlertTitle>
                    <Typography fontSize='small'>La room est protégée par un mot de passe. Vous devez le renseigner.</Typography>
                </Alert>
                <TextField
                    error={passwordIsWrong ? true : false}
                    helperText={passwordIsWrong ? "Mot de passe incorrect.": ''}
                    value={userPassword}
                    type={showPassword ? 'text' : 'password'} 
                    onChange={(e) => setUserPassword(e.target.value)} 
                    size="small" 
                    id="outlined-basic" 
                    label="Mot de passe" 
                    variant="outlined" 
                    InputProps={{
                        startAdornment: (
                            <InputAdornment sx={{ml:'-10px'}} position="start">
                                <IconButton
                                    aria-label="Afficher / Cacher le mot de passe de la room"
                                    onClick={(e) => setShowPassword(!showPassword)}
                                    edge="end"
                                    >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={(e) => joinRoomByPassword()} 
                                    aria-label="Afficher / Cacher le mot de passe de la room"
                                    edge="end"
                                    >
                                    <ArrowCircleRightIcon/>
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
            </DialogContent>
        </Dialog>
    )
};

export default withTranslation()(ModalEnterRoomPassword);