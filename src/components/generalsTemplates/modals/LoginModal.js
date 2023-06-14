import { Icon } from "@iconify/react";
import { Alert, AlertTitle, Box, Button, Card, Chip, Dialog, DialogContent, DialogContentText, DialogTitle, Divider, Grid, InputAdornment, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";

import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import TextField from '@mui/material/TextField';

import { auth, googleProvider } from "../../../services/firebase";
import { LoadingButton } from "@mui/lab";

const LoginModal = ({ open, changeOpen, handleAnonymousLogin, signInWithGoogle, googleLoginLoading}) => {
    
    const [errorMessage, setErrorMessage] = useState();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
        
    async function onSubmit() {
        await auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
            })
            .catch((error) => {
                if(error.code === "auth/email-already-in-use") {
                    auth.signInWithEmailAndPassword(email, password)
                        .then((userCredential) => {
                            // Signed in
                            return userCredential.user;
                        })
                        .catch((error) => {
                            setErrorMessage(error.message);
                        })
                } else {
                    setErrorMessage(error.message);
                }
            })
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
                
                {errorMessage && <Alert severity="error" sx={{mb:2}}>{errorMessage}</Alert>}     
                    <Grid container direction="column" >
                        <Box sx={{display:'flex', flexDirection:'column'}}>     
                            <TextField
                                helperText="bienlebonjour@mail.fr"
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
                                helperText="Mot de passe"
                                sx={{mt:2}}
                                id="loginMailAndPass_PassField"
                                label="Mot de passe"
                            />           
                            <Button variant="contained" className='main_bg_color buttonBorder' sx={{mt:2}} onClick={e => onSubmit()}> Go ! </Button>                  
                        </Box> 
                        
                        <Divider sx={{mt:2,mb:2}}>
                            OU
                        </Divider>  
                            <Button 
                                    className='borderMainColor'
                                    variant="outlined"
                                    startIcon={<Icon icon="mdi:anonymous" />}
                                    onClick={e => handleAnonymousLogin()}>
                                    Connexion anonyme
                            </Button>
                        <Divider sx={{mt:2,mb:2}}>
                            OU
                        </Divider>  
                            <LoadingButton
                                    loading={googleLoginLoading}
                                    className='borderMainColor'
                                    startIcon={<Icon icon="ri:google-fill" />}
                                    variant="outlined"
                                    onClick={signInWithGoogle}>
                                Connexion Google
                            </LoadingButton>    
                             
                    </Grid> 
                </DialogContentText>
            </DialogContent>
        </Dialog>
    )
};

export default LoginModal;