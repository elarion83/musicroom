import Alert from '@mui/material/Alert';
import React, { useState } from "react";

import { AlertTitle, Dialog, DialogContent, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import PasswordIcon from '@mui/icons-material/Password';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import { withTranslation } from 'react-i18next';
import ModalsHeader from '../../generalsTemplates/modals/ModalsHeader';

const ModalEnterRoomPassword = ({ t, password, open, changeOpen }) => {

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
            <ModalsHeader icon={() => <PasswordIcon />} title={t('ModalLoginFormPlaceholderPassword')} />

            <DialogContent dividers sx={{pt:0}}>
               
                <Alert sx={{pl:1, mb:2, mt:1, alignItems: 'center'}} severity='warning'>
                    <AlertTitle sx={{fontWeight:'bold'}}>Playlist protégée par mot de passe</AlertTitle>
                    <Typography fontSize='small'>La playlist est protégée par un mot de passe. Vous devez le renseigner.</Typography>
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
                            <InputAdornment sx={{ml:'-10px', maxHeight:0 }} position="start">
                                <IconButton
                                    aria-label="Afficher / Cacher le mot de passe de la playlist"
                                    onClick={(e) => setShowPassword(!showPassword)}
                                    edge="end"
                                    >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end"  sx={{ maxHeight:0 }}>
                                <IconButton
                                    onClick={(e) => joinRoomByPassword()} 
                                    aria-label="Afficher / Cacher le mot de passe de la playlist"
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