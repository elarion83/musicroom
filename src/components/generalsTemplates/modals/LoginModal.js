import { Icon } from "@iconify/react";
import { Alert, Box, Button, Dialog, Link, DialogContent, DialogTitle, Divider, Grid, Typography } from "@mui/material";
import { useState } from "react";

import TextField from '@mui/material/TextField';

import { LoadingButton } from "@mui/lab";
import PrivacyPolicyModal from '../modals/PrivacyPolicyModal';

import { withTranslation } from 'react-i18next';
import { SlideUp } from "../../../services/materialSlideTransition/Slide";

const LoginModal = ({ t, open, changeOpen, handleAnonymousLogin, handleGoogleLogin, handlePasswordAndMailLogin, loginLoading, redirectToHome, roomId, loginErrorMessage}) => {
    
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const [PrivacyPolicyModalOpen, setPrivacyPolicyModalOpen] = useState(false);
        
    async function onEmailAndPasswordSubmit() {
        handlePasswordAndMailLogin(email, password); 
    }

    return(


        <Dialog open={open} TransitionComponent={SlideUp} onClose={() => changeOpen(false)}
        sx={{
            "& .MuiDialog-container": {
                "& .MuiPaper-root": {
                width: "100%",
                maxWidth: "500px",  // Set your width here
                },
            },
        }}
        >
            <DialogTitle className='flexRowCenterH varelaFontTitle' sx={{ m: 0,p:1}}>
                    <Icon width="15" icon='carbon:user-avatar' style={{marginRight:'10px'}} /> {t('ModalLoginTitle')} 
            </DialogTitle>  
            <DialogContent dividers sx={{pt:2}}>
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
                                    className='main_bg_color buttonBorder btnIconFixToLeft varelaFontTitle texturaBgButton' 
                                    sx={{mt:2}} 
                            onClick={e => onEmailAndPasswordSubmit()}> 
                            <Typography fontSize="small">{t('GeneralContinue')} </Typography>
                            </LoadingButton>                  
                        </Box> 
                        
                        <Divider sx={{mt:3,mb:2}}>
                            {t('GeneralOr')} 
                        </Divider>  
                            <LoadingButton 
                                    loading={loginLoading}
                                    loadingPosition='start'
                                    className='main_bg_color buttonBorder btnIconFixToLeft varelaFontTitle texturaBgButton' 
                                    variant="contained"
                                    startIcon={<Icon icon="mdi:anonymous" />}
                                    onClick={e => handleAnonymousLogin()}>
                                <Typography fontSize="small">{t('ModalLoginButtonAnon')} </Typography>
                            </LoadingButton>
                        <Divider sx={{mt:2,mb:2}}>
                            {t('GeneralOr')} 
                        </Divider>  
                            <LoadingButton
                                    loadingPosition='start'
                                    loading={loginLoading}
                                    className='main_bg_color buttonBorder btnIconFixToLeft varelaFontTitle texturaBgButton' 
                                    startIcon={<Icon icon="ri:google-fill" />}
                                    variant="contained"
                                    onClick={handleGoogleLogin}>
                                <Typography fontSize="small">{t('ModalLoginButtonGoogle')} </Typography>
                            </LoadingButton>  
                    </Grid> 
                    <Grid sx={{mt:2, mb:2}}>
                        {roomId && 
                            <Button
                                    startIcon={<Icon icon="raphael:arrowleft" />}
                                    size="small"
                                    onClick={redirectToHome}>
                                {t('GeneralHome')}
                            </Button> }
                    </Grid>

                    <Typography fontSize="small"> {t('ModalLoginTermsSentence')} 
                        <Link href="#" fontSize='small' underline="hover" sx={{pl:0.5,pr:0.5}} onClick={(e) => setPrivacyPolicyModalOpen(true)}>
                            {t('ModalLoginTermsPrivacyPolicy')}
                        </Link>
                        {t('GeneralAnd')} 
                        <Link rel="noreferrer" target="_blank" underline="hover" sx={{pl:0.5,pr:0.5}} href="https://www.youtube.com/t/terms">
                            {t('ModalLoginTermsYoutubeTerms')}
                        </Link>
                    </Typography>
                    <PrivacyPolicyModal open={PrivacyPolicyModalOpen} changeOpen={setPrivacyPolicyModalOpen} />
            </DialogContent>
        </Dialog>
    )
};

export default withTranslation()(LoginModal);