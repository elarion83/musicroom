import { Icon } from "@iconify/react";
import { Alert, AlertTitle, Box, Button, Card, Chip, Dialog, DialogContent, DialogContentText, DialogTitle, Divider, Grid, InputAdornment, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";

import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import TextField from '@mui/material/TextField';

import { auth, googleProvider } from "../../../services/firebase";
import { LoadingButton } from "@mui/lab";

const LoginModal = ({ open, changeOpen, handleAnonymousLogin, handleGoogleLogin, handlePasswordAndMailLogin, googleLoginLoading, anonymousLoginLoading, EmailandPassLoading, redirectToHome, roomId, loginErrorMessage}) => {
    
    const [errorMessage, setErrorMessage] = useState();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
        
    async function onEmailAndPasswordSubmit() {
        handlePasswordAndMailLogin(email, password); 
    }

    return(


        <Dialog open={open} onClose={() => changeOpen(false)}
        sx={{
            "& .MuiDialog-container": {
                "& .MuiPaper-root": {
                width: "100%",
                maxWidth: "500px",  // Set your width here
                },
            },
        }}
        >
            <DialogTitle className='flexRowCenterH' sx={{ m: 0,p:1}}>
                     <Icon icon='carbon:user-avatar' style={{marginRight:'10px'}} /> Connexion / Inscription
            </DialogTitle>  
            <DialogContent dividers sx={{pt:0}}>
                <DialogContentText sx={{pt:2}}>
                
                {loginErrorMessage && <Alert severity="error" sx={{mb:2}}>{loginErrorMessage}</Alert>}     
                    <Grid container direction="column" >
                        <Box sx={{display:'flex', flexDirection:'column'}}>     
                            <TextField
                                id="loginMailAndPass_EmailField"
                                label="Adresse Email"
                                value={email}  
                                type='email'  
                                onChange={(e) => setEmail(e.target.value)}  
                            />    
                            <TextField
                                value={password}
                                type='password'  
                                onChange={(e) => setPassword(e.target.value)}   
                                sx={{mt:2}}
                                id="loginMailAndPass_PassField"
                                label="Mot de passe"
                            />           
                            <LoadingButton
                                    loadingPosition='start'
                                    loading={EmailandPassLoading}
                                    variant="contained" 
                                    startIcon={<Icon icon="material-symbols:login" />}
                                    className='main_bg_color buttonBorder btnIconFixToLeft' 
                            sx={{mt:2}} onClick={e => onEmailAndPasswordSubmit()}> 
                            Continuer 
                            </LoadingButton>                  
                        </Box> 
                        
                        <Divider sx={{mt:3,mb:2}}>
                            OU
                        </Divider>  
                            <LoadingButton 
                                    loading={anonymousLoginLoading}
                                    className='borderMainColor btnIconFixToLeft'
                                    variant="outlined"
                                    startIcon={<Icon icon="mdi:anonymous" />}
                                    onClick={e => handleAnonymousLogin()}>
                                    Connexion anonyme
                            </LoadingButton>
                        <Divider sx={{mt:2,mb:2}}>
                            OU
                        </Divider>  
                            <LoadingButton
                                    loadingPosition='start'
                                    loading={googleLoginLoading}
                                    className='borderMainColor btnIconFixToLeft'
                                    startIcon={<Icon icon="ri:google-fill" />}
                                    variant="outlined"
                                    onClick={handleGoogleLogin}>
                                Connexion Google
                            </LoadingButton>  
                    </Grid> 
                    <Grid sx={{mt:2}}>
                        {roomId && 
                            <Button
                                    startIcon={<Icon icon="raphael:arrowleft" />}
                                    size="small"
                                    onClick={redirectToHome}>
                                Vers l'accueil
                            </Button> }
                    </Grid>
                </DialogContentText>
            </DialogContent>
        </Dialog>
    )
};

export default LoginModal;