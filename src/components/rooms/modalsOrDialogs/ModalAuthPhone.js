// App.js
import React, { useState, useEffect } from 'react';
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Icon, Alert, Typography } from '@mui/material';
import { auth } from '../../../services/firebase';
import ModalsHeader from '../../generalsTemplates/modals/ModalsHeader';
import { isEmpty, isVarExistNotEmpty } from '../../../services/utils';
import { LoadingButton } from '@mui/lab';
import { withTranslation } from 'react-i18next';
import MuiPhoneNumber from "mui-phone-number";

const ModalAuthPhone = ({t, open,close, doActionAfterAuth, loginLoading}) => {
    const [isMessageSent, setIsMessageSent] = useState(false);
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);
    const [phoneLoginError, setPhoneLoginError] = useState('');

    //auth.settings.appVerificationDisabledForTesting = true;
  useEffect(() => {
    if (!recaptchaVerifier && !isMessageSent) {
        setPhoneLoginError('');
        const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: (response) => {
        },
        'expired-callback': () => {
            setPhoneLoginError("Le reCAPTCHA a expiré. Veuillez réessayer.");
        }
        });
        verifier.render().then(() => {
        setRecaptchaVerifier(verifier);
        });
    }
  }, [recaptchaVerifier,open]);

  const handleSignIn = async () => {
    try {
      if (!recaptchaVerifier) {
        return;
      }

      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      setConfirmationResult(confirmation);
      setIsMessageSent(true);
    } catch (error) {
      setPhoneLoginError('Error sending code:'+ error.message);
    }
  };

  const handleVerifyCode = async () => {
    try {
      const credential = await confirmationResult.confirm(verificationCode);
      setIsMessageSent(false);        
      setPhoneLoginError('');      
      doActionAfterAuth(credential, 'userInUser');
    } catch (error) {
      setPhoneLoginError('Error verifying code:'+ error.message);
    }
  };

    const onPhoneNumberChanged = (userPhoneNumber, country) => {
        setPhoneNumber(userPhoneNumber); // +4176 123 45 67
    };
  return (
    <>
      <Dialog open={open}  className="loginPhoneModal" >            
        <ModalsHeader icon={() => <Icon icon='mdi:phone' style={{marginRight:'10px'}} />} title={'Par SMS'} />

        <DialogContent dividers sx={{pt:2,minHeight:'250px !important'}}>
            <Grid container direction="column" >
                <>
                {!isMessageSent && <>
                    
                    <MuiPhoneNumber className="phoneField" defaultCountry="fr" onlyCountries={['fr','gf','pf','la','th','be','dz','ma']} onChange={onPhoneNumberChanged} />
                     
                    <LoadingButton 
                        loading={loginLoading}
                        sx={{mt:1}}
                        loadingPosition='start'
                        className='main_bg_color buttonBorder btnIconFixToLeft varelaFontTitle texturaBgButton colorWhite' 
                        variant="contained"
                        startIcon={<Icon icon="mdi:phone" />}
                        onClick={handleSignIn}>
                        <Typography fontSize="small">{loginLoading ? t('GeneralLoading') : 'Envoyer SMS'} </Typography>
                    </LoadingButton>
                    <LoadingButton 
                        loading={loginLoading}
                        sx={{mt:1}}
                        loadingPosition='start'
                        className='main_bg_color buttonBorder btnIconFixToLeft varelaFontTitle texturaBgButton colorWhite' 
                        variant="contained"
                        startIcon={<Icon icon="mdi:phone" />}
                        onClick={() => close(false)}>
                        <Typography fontSize="small">{loginLoading ? t('GeneralLoading') : 'Cancel'} </Typography>
                    </LoadingButton>
                </>
                }
                
            {isMessageSent && 
                <>
                    <TextField
                        label="Verification Code"
                        variant="outlined"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                    />
                    <LoadingButton 
                        loading={loginLoading}
                        sx={{mt:1}}
                        loadingPosition='start'
                        className='main_bg_color buttonBorder btnIconFixToLeft varelaFontTitle texturaBgButton colorWhite' 
                        variant="contained"
                        startIcon={<Icon icon="mdi:phone" />}
                        onClick={handleVerifyCode}>
                        <Typography fontSize="small">{loginLoading ? t('GeneralLoading') : 'Verify'} </Typography>
                    </LoadingButton>
                    <LoadingButton 
                        loading={loginLoading}
                        sx={{mt:1}}
                        loadingPosition='start'
                        className='main_bg_color buttonBorder btnIconFixToLeft varelaFontTitle texturaBgButton colorWhite' 
                        variant="contained"
                        startIcon={<Icon icon="mdi:phone" />}
                        onClick={() => setIsMessageSent(false)}>
                        <Typography fontSize="small">{loginLoading ? t('GeneralLoading') : 'Cancel'} </Typography>
                    </LoadingButton>
                </>
            }</>
            </Grid>            
            {isVarExistNotEmpty(phoneLoginError) && <Alert severity="error" sx={{mt:2}}>{phoneLoginError}</Alert>}     

        </DialogContent>
        
      </Dialog>
    </>
  );
};

export default withTranslation()(ModalAuthPhone);
