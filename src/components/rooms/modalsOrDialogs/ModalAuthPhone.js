// App.js
import React, { useState, useEffect } from 'react';
import { signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
import { TextField, Dialog, DialogContent, Grid, Icon, Alert, Typography, AlertTitle } from '@mui/material';
import { auth } from '../../../services/firebase';
import ModalsHeader from '../../generalsTemplates/modals/ModalsHeader';
import { getLocale, isVarExistNotEmpty } from '../../../services/utils';
import { LoadingButton } from '@mui/lab';
import { withTranslation } from 'react-i18next';
import MuiPhoneNumber from "mui-phone-number";
import { SlideUp } from '../../../services/materialSlideTransition/Slide';
import ModalsFooter from '../../generalsTemplates/modals/ModalsFooter';

const ModalAuthPhone = ({t, open,close, doActionAfterAuth, loginLoading}) => {
  const [isMessageSent, setIsMessageSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);
  const [phoneLoginError, setPhoneLoginError] = useState('');
  const [loadingBeforeCode, setLoadingBeforeCode] = useState(false);
  const [loadingAfterCode, setLoadingAfterCode] = useState(false);

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
          setLoadingBeforeCode(false);
        }
        });
        verifier.render().then(() => {
          setRecaptchaVerifier(verifier);
        });
    }
  }, [recaptchaVerifier,open]);

  const handleSignIn = async () => {
    setLoadingBeforeCode(true);
    try {
      if (!recaptchaVerifier) {
        return;
      }

      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      setConfirmationResult(confirmation);
      setIsMessageSent(true);
      setPhoneLoginError('');
    } catch (error) {
      setPhoneLoginError('Error sending code:'+ error.message);
    } finally {
      setLoadingBeforeCode(false);
    }
  };

  const handleVerifyCode = async () => {
    setLoadingAfterCode(true);
    try {      
      setPhoneLoginError('');      
      const credential = await confirmationResult.confirm(verificationCode);
      doActionAfterAuth(credential, 'userInUser');
      setLoadingAfterCode(false);
      setIsMessageSent(false);  
    } catch (error) {
      setPhoneLoginError('Error verifying code:'+ error.message);
    } finally {    
      setLoadingAfterCode(false);
    }
  };

  const onPhoneNumberChanged = (userPhoneNumber, country) => {
      setPhoneNumber(userPhoneNumber); // +4176 123 45 67
  };
  return (
    <>
      <Dialog open={open}  className="loginPhoneModal"
                TransitionComponent={SlideUp}
                onClose={(e) => close(false)} sx={{
            "& .MuiDialog-container": {
                "& .MuiPaper-root": {
                width: "100%",
                maxWidth: "350px",  // Set your width here
                },
            },
        }}>            
        <ModalsHeader icon={() => <Icon icon='mdi:phone' style={{overflow:'visible',marginRight:'10px'}} />} title={t('ModalLoginButtonSMSBy')} />

        <DialogContent dividers sx={{pt:2,minHeight:'150px !important'}}>
            <Grid container direction="column" >
              {!isMessageSent && 
                <>
                    
                    <MuiPhoneNumber placeholder="0 00 00 00 00" className="phoneField" defaultCountry={getLocale()} onlyCountries={['fr','gf','pf','th','be']} onChange={onPhoneNumberChanged} />
                    
                    <LoadingButton 
                        loading={loadingBeforeCode}
                        sx={{mt:1}}
                        loadingPosition='start'
                        className='main_bg_color buttonBorder btnIconFixToLeft varelaFontTitle texturaBgButton colorWhite' 
                        variant="contained"
                        startIcon={<Icon icon="mdi:phone" />}
                        onClick={handleSignIn}>
                        <Typography fontSize="small">{loadingBeforeCode ? t('GeneralLoading') : t('ModalLoginButtonSMSSend')} </Typography>
                    </LoadingButton> 
                    
                    <Alert severity='info' sx={{mt:1}}>
                        <AlertTitle sx={{fontWeight:"bold"}}>Informations</AlertTitle>
                        <Typography fontSize="small" component="p">
                            {t('ModalLoginButtonSMSTuto1')}
                        </Typography>
                    </Alert>
                </>
              }
                
              {isMessageSent && 
                  <>
                    <TextField
                        label={t('ModalLoginButtonSMSCode')}
                        variant="outlined"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                    />

                    <LoadingButton 
                        loading={loadingAfterCode}
                        sx={{mt:1}}
                        loadingPosition='start'
                        className='main_bg_color buttonBorder btnIconFixToLeft varelaFontTitle texturaBgButton colorWhite' 
                        variant="contained"
                        startIcon={<Icon icon="mdi:phone" />}
                        onClick={handleVerifyCode}>
                        <Typography fontSize="small">{loadingAfterCode ? t('GeneralLoading') : t('GeneralContinue')} </Typography>
                    </LoadingButton>
                  </>
              }
            </Grid>            
            {isVarExistNotEmpty(phoneLoginError) && <Alert severity="error" sx={{mt:2}}>{phoneLoginError}</Alert>}     

        </DialogContent>
      
        <ModalsFooter 
          backButton={false}
          secondButtonText={t('GeneralClose')} 
          secondButtonFunc={(e) => !isMessageSent ? close(false) : setIsMessageSent(false)} 
        />
           
      </Dialog>
    </>
  );
};

export default withTranslation()(ModalAuthPhone);
