import { Icon } from "@iconify/react";
import { Box, Button, Card, Chip, Dialog, DialogContent, DialogContentText, DialogTitle, Divider, Grid, InputAdornment, Tab, Tabs } from "@mui/material";
import { useState } from "react";

import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import TextField from '@mui/material/TextField';

import { createUserWithEmailAndPassword  } from 'firebase/firebase-auth';
import { auth, googleProvider } from "../../../services/firebase";

const LoginModal = ({ open, handleSetPseudo}) => {
    
    const [tabIndex, setTabIndex] = useState(0);
    const [errorMessage, setErrorMessage] = useState();
    const handleTabChange = (newTabIndex) => {
        setTabIndex(newTabIndex);
    };
    const regex = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g;

    const [pseudoInput, setPseudoInput] = useState('');

    async function handleSetPseudoInComp() {
        if(pseudoInput.length > 1) {
            var cleanPseudo = pseudoInput.replace(regex, '');
            handleSetPseudo(cleanPseudo);
        }
    }
    
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
 
    async function signInWithGoogle() {
        await auth.signInWithPopup(googleProvider)
        .then(() => {
        })
        .catch((err) => {
            setErrorMessage('Une erreur est survenue');
        });
    }
       
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


        <Dialog open={open}>
            <DialogTitle className='flexRowCenterH' sx={{ m: 0,p:1 }}>
                    <Icon icon='carbon:user-avatar' style={{marginRight:'10px'}} /> Connexion
            </DialogTitle>  
            <DialogContent dividers sx={{pt:0}}>
                {errorMessage}
                <Grid container sx={{pr:1, pt:1, pb:2}} direction="row" justifyContent={tabIndex === 0 ? "flex-end": "flex-start"}  alignItems="center" >
                    
                    {tabIndex == 1 && 
                        <Button 
                            startIcon={<Icon icon="raphael:arrowleft" /> }
                            size="small" 
                            onClick={e => handleTabChange(0)}>
                        Connexion Classique
                    </Button>}
                </Grid>
                <DialogContentText sx={{p:0,ml:7,mr:7}}>
                
                {tabIndex == 0 && 
                
                    <Grid container direction="column" >
                        <Box sx={{display:'flex', flexDirection:'column'}}>     
                            <TextField
                                helperText="bienlebonjour@mail.fr"
                                id="loginMailAndPass_EmailField"
                                label="Adresse Email"
                                value={email}    
                                onChange={(e) => setEmail(e.target.value)}  
                            />    
                            <TextField
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}   
                                helperText="Mot de passe"
                                id="loginMailAndPass_PassField"
                                label="Mot de passe"
                            />           
                            <Button variant="filled" className='main_bg_color buttonBorder' sx={{mt:2}} onClick={e => onSubmit()}>Go </Button>                  
                        </Box> 
                        
                        <Divider sx={{mt:2,mb:2}}>
                            OU
                        </Divider>  
                        <Button 
                                startIcon={<Icon icon="devicon:google" />}
                                size="large" 
                                variant="contained"
                                onClick={signInWithGoogle}>
                            Connexion Google
                        </Button>   
                        <Divider sx={{mt:2,mb:2}}>
                        </Divider> 
                        <Button 
                                endIcon={<Icon icon="raphael:arrowright" />}
                                size="small" 
                                onClick={e => handleTabChange(1)}>
                            Connexion anonyme
                        </Button>  
                </Grid>}
                
                {tabIndex == 1 && 
                        <TextField
                            id="UserChoosePseudoInput"
                            type="text"
                            onKeyPress={(ev) => {
                            if (ev.key === 'Enter')  { handleSetPseudoInComp()}
                            }}
                            label="Entre un pseudo"
                            helperText="Ton pseudo est a titre indicatif et est affiché dans l'interface."
                            value={pseudoInput}
                            onChange={e => setPseudoInput(e.target.value)}
                            sx={{ width: '100%', MarginTop:1, paddingRight:'0', "& .MuiOutlinedInput-root": {
                                paddingRight: 0
                            } }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment  sx={{
                                    padding: "27.5px 14px",
                                    backgroundColor: "#23282d",
                                    color:'var(--white)',
                                    cursor:'pointer',
                                    }} position="end" onClick={e=> handleSetPseudoInComp()}>
                                    <DoubleArrowIcon  />
                                    </InputAdornment>
                                ),
                            }}
                        />}
                </DialogContentText>
            </DialogContent>
        </Dialog>
    )
};

export default LoginModal;