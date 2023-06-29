import { Icon } from "@iconify/react";
import { Alert, Box, Button, Dialog, DialogContent, DialogContentText, DialogTitle, Divider, Grid, Typography } from "@mui/material";
import { useState } from "react";

import TextField from '@mui/material/TextField';

import { LoadingButton } from "@mui/lab";
import PrivacyPolicyModal from '../modals/PrivacyPolicyModal';

import { withTranslation } from 'react-i18next';
const LoginModal = ({ t, open, changeOpen, handleAnonymousLogin, handleGoogleLogin, handlePasswordAndMailLogin, loginLoading, redirectToHome, roomId, loginErrorMessage}) => {
    
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const [PrivacyPolicyModalOpen, setPrivacyPolicyModalOpen] = useState(false);
        
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
                     <Icon width="15" icon='carbon:user-avatar' style={{marginRight:'10px'}} /> {t('ModalLoginTitle')} 
            </DialogTitle>  
            <DialogContent dividers sx={{pt:0}}>
                <DialogContentText sx={{pt:2}}>
                
                {loginErrorMessage && <Alert severity="error" sx={{mb:2}}>{loginErrorMessage}</Alert>}     
                    <Grid container direction="column" >
                        <Box sx={{display:'flex', flexDirection:'column'}}>     
                            <TextField
                                id="loginMailAndPass_EmailField"
                                label={t('ModalLoginFormPlaceholderEmailAdress')}
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
                                label={t('ModalLoginFormPlaceholderPassword')} 
                            />           
                            <LoadingButton
                                    loadingPosition='start'
                                    loading={loginLoading}
                                    variant="contained" 
                                    startIcon={<Icon icon="material-symbols:login" />}
                                    className='main_bg_color buttonBorder btnIconFixToLeft' 
                                    sx={{mt:2}} 
                            onClick={e => onEmailAndPasswordSubmit()}> 
                            {t('GeneralContinue')} 
                            </LoadingButton>                  
                        </Box> 
                        
                        <Divider sx={{mt:3,mb:2}}>
                            {t('GeneralOr')} 
                        </Divider>  
                            <LoadingButton 
                                    loading={loginLoading}
                                    loadingPosition='start'
                                    className='borderMainColor mainColor btnIconFixToLeft'
                                    variant="outlined"
                                    startIcon={<Icon icon="mdi:anonymous" />}
                                    onClick={e => handleAnonymousLogin()}>
                                    {t('ModalLoginButtonAnon')} 
                            </LoadingButton>
                        <Divider sx={{mt:2,mb:2}}>
                            {t('GeneralOr')} 
                        </Divider>  
                            <LoadingButton
                                    loadingPosition='start'
                                    loading={loginLoading}
                                    className='borderMainColor mainColor btnIconFixToLeft'
                                    startIcon={<Icon icon="ri:google-fill" />}
                                    variant="outlined"
                                    onClick={handleGoogleLogin}>
                                {t('ModalLoginButtonGoogle')} 
                            </LoadingButton>  
                    </Grid> 
                    <Grid sx={{mt:2}}>
                        {roomId && 
                            <Button
                                    startIcon={<Icon icon="raphael:arrowleft" />}
                                    size="small"
                                    onClick={redirectToHome}>
                                {t('GeneralHome')}
                            </Button> }
                    </Grid>

                    <Typography fontSize="small"> {t('ModalLoginTermsSentence')} <a href="#" onClick={(e) => setPrivacyPolicyModalOpen(true)}>{t('ModalLoginTermsPrivacyPolicy')}  </a> {t('GeneralAnd')} <a href="https://www.youtube.com/t/terms" target="_blank">{t('ModalLoginTermsYoutubeTerms')}  </a>
                    </Typography>
                    <PrivacyPolicyModal open={PrivacyPolicyModalOpen} changeOpen={setPrivacyPolicyModalOpen} />
                </DialogContentText>
            </DialogContent>
        </Dialog>
    )
};

export default withTranslation()(LoginModal);