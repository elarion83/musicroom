import React from "react";

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Alert, AlertTitle, Box, Dialog, DialogContent, FormGroup, Grid, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import { useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import { LoadingButton } from "@mui/lab";
import { timestampToDateoptions } from "../../../services/utilsArray";

import { withTranslation } from 'react-i18next';
import ModalsHeader from "./ModalsHeader";
import { ReactSVG } from "react-svg";
import { AccountCircle, CancelOutlined, Save } from "@mui/icons-material";

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
        setIsEditingPseudo(false);
        changeOpen(false);
    }
    return(
        <Dialog open={open} onClose={(e) => changeOpen(false)}>
            
            <ModalsHeader icon={() => <AccountCircleIcon />} title={t('ModalUserSettingsTitle')} />

            <DialogContent dividers sx={{pt:2}}>
                
                <ReactSVG src={"./img/avatars/botts"+user.avatarId+".svg"}  className="userAvatarBig"/>
                <Box sx={{textAlign:'center', mb:2, fontWeight:'bold'}}>
                    {isEditingPseudo && 
                    <Grid>
                        <Grid item sx={12} md={12}>
                            <TextField id="outlined-basic" 
                                size="small"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment sx={{ maxHeight:0, cursor:'pointer' }} position="end"  onClick={(e) => setIsEditingPseudo(false)} >
                                            <CancelOutlined />
                                        </InputAdornment>
                                    ),
                                }}
                                value={pseudo} onChange={(e) => setPseudo(e.target.value)} 
                                helperText= {t('GeneralLength')+" min : 5 | Max : 15"}
                                placeholder={user.displayName} label="Pseudo" variant="outlined" />

                                {pseudo.length >= 5 && pseudo.length <= 15 && 
                                    <LoadingButton sx={{maxWidth:'50px'}} loading={isEditingUserLoading} size="small" onClick={(e) => updateUser()}> 
                                        <Save fontSize="small" sx={{mt:'4px'}} />
                                    </LoadingButton>
                                }
                        </Grid>
                    </Grid>}
                    {!isEditingPseudo && 
                        <>
                            {user.displayName}
                            {user.loginType !== "anon" && 
                                <>
                                    <IconButton aria-label="delete" sx={{p:0, ml:1}}  color="primary" onClick={(e) => setIsEditingPseudo(true)} >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                </>
                            }
                        </>
                    }
                    
                    {user.loginType !== "anon" && <Typography component="span" className="fontFamilyNunito" fontSize="small" sx={{mt:1,display:'block'}}>
                        Membre depuis le {new Date(user.creationTime).toLocaleDateString('fr-FR', timestampToDateoptions)}
                    </Typography>}
                </Box>
                            
                <FormGroup>
                    {user.loginType === "anon" && 
                        <Alert sx={{mb:2, alignItems: 'center'}}  severity='warning'>
                            <AlertTitle sx={{fontWeight:'bold'}}>{t('ModalUserSettingsEditNotAllowedTitle')}</AlertTitle>
                            <Typography fontSize='small'>{t('ModalUserSettingsEditNotAllowedText')}</Typography>
                        </Alert>
                    }
                    
                </FormGroup>
            </DialogContent>
        </Dialog>
    )
};

export default withTranslation()(UserParamModal);