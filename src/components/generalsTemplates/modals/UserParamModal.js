import React from "react";

import DialogTitle from '@mui/material/DialogTitle';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Alert, AlertTitle, Dialog, DialogContent, FormGroup, Grid, IconButton, TextField, Typography } from "@mui/material";
import { useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import { LoadingButton } from "@mui/lab";

import { withTranslation } from 'react-i18next';

const UserParamModal = ({ t, open, changeOpen, user, setUserInfo}) => {

  const delay = ms => new Promise(res => setTimeout(res, ms));
  const [pseudo, setPseudo] = useState('');
  const [isEditingPseudo, setIsEditingPseudo] = useState(false);
  const [isEditingUserLoading, setIsEditingUserLoading ] = useState(false);

    async function updateUser() {
        setIsEditingUserLoading(true);
        if(pseudo.trim().length >= 5 && pseudo.trim().length <= 15) {
            user.displayName = pseudo.charAt(0).toUpperCase() + pseudo.slice(1);
            setUserInfo(user);
        }
        await delay(500);
        setIsEditingUserLoading(false);
        changeOpen(false);
    }
    return(
        <Dialog open={open} onClose={(e) => changeOpen(false)}>
            <DialogTitle className='flexRowCenterH' sx={{ m: 0,p:1 }}>
                <AccountCircleIcon fontSize="small" sx={{mr:1}} />{t('ModalUserSettingsTitle')}
            </DialogTitle>  
            <DialogContent dividers sx={{pt:2}}>
                <FormGroup>
                    {user.loginType === "anon" && 
                        <Alert sx={{mb:2, alignItems: 'center'}}  severity='warning'>
                            <AlertTitle sx={{fontWeight:'bold'}}>{t('ModalUserSettingsEditNotAllowedTitle')}</AlertTitle>
                            <Typography fontSize='small'>{t('ModalUserSettingsEditNotAllowedText')}</Typography>
                        </Alert>
                    }
                    {!isEditingPseudo && <Grid container>
                        
                        <Grid item xs={11} md={11}>
                            <Typography> Pseudo : 
                                <Typography component={'b'}>
                                    {user.displayName}
                                </Typography>
                            </Typography>
                        </Grid>
                        <Grid item xs={1} md={1}>
                            
                            {user.loginType !== "anon" && <IconButton aria-label="delete" sx={{p:0}} color="primary" onClick={(e) => setIsEditingPseudo(true)} >
                                <EditIcon />
                            </IconButton>}
                        </Grid>
                    </Grid>}
                    {isEditingPseudo && <Grid>
                        
                        <Grid item sx={12} md={12}>
                            <TextField id="outlined-basic" 
                                value={pseudo} onChange={(e) => setPseudo(e.target.value)} 
                                helperText= {t('GeneralLength')+" min : 5 | Max : 15"}
                                placeholder="Entrez un pseudo" label="Pseudo" variant="outlined" />
                            </Grid>
                        {pseudo.length >= 5 && pseudo.length <= 15 && <Grid item sx={12} md={12}>
                            <LoadingButton loading={isEditingUserLoading} variant="outlined" onClick={(e) => updateUser()} sx={{mt:1}}> {t('GeneralSave')} </LoadingButton>
                        </Grid>}
                    </Grid>}
                </FormGroup>
            </DialogContent>
        </Dialog>
    )
};

export default withTranslation()(UserParamModal);