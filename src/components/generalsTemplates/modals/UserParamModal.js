import React from "react";

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Alert, AlertTitle, Dialog, DialogContent, FormGroup, Grid, IconButton, TextField, Typography } from "@mui/material";
import { useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import { LoadingButton } from "@mui/lab";

import { withTranslation } from 'react-i18next';
import ModalsHeader from "./ModalsHeader";
import { ReactSVG } from "react-svg";

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
            
            <ModalsHeader icon={() => <AccountCircleIcon />} title={t('ModalUserSettingsTitle')} />

            <DialogContent dividers sx={{pt:2}}>
                
                <ReactSVG src={"./img/avatars/botts"+user.avatarId+".svg"} 
                    style={{'width': '110px','height': '110px', 'margin':'1em auto 1em auto', 'background': '#cecece',  'border-radius': '50%',  'padding': '4px'}}
                />
                <Typography sx={{textAlign:'center', mb:2, fontWeight:'bold'}}>
                    {user.displayName}
                    {user.loginType !== "anon" && 
                    <IconButton aria-label="delete" sx={{p:0, ml:1}} color="primary" onClick={(e) => setIsEditingPseudo(true)} >
                        <EditIcon />
                    </IconButton>}
                </Typography>
                            
                <FormGroup>
                    {user.loginType === "anon" && 
                        <Alert sx={{mb:2, alignItems: 'center'}}  severity='warning'>
                            <AlertTitle sx={{fontWeight:'bold'}}>{t('ModalUserSettingsEditNotAllowedTitle')}</AlertTitle>
                            <Typography fontSize='small'>{t('ModalUserSettingsEditNotAllowedText')}</Typography>
                        </Alert>
                    }
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