import React from "react";

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Alert, AlertTitle, Box, Dialog, DialogContent, FormGroup, Grid, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import { useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import { LoadingButton } from "@mui/lab";
import { timestampToDateoptions, timestampToHoursAndMinOptions } from "../../../services/utilsArray";

import { withTranslation } from 'react-i18next';
import ModalsHeader from "./ModalsHeader";
import { ReactSVG } from "react-svg";
import { AccountCircle, CancelOutlined, Save } from "@mui/icons-material";
import { cleanPseudoEntered, isPseudoEnteredValid } from "../../../services/utils";

const UserParamModal = ({ t, open, changeOpen, user, setUserInfo}) => {

  const delay = ms => new Promise(res => setTimeout(res, ms));
  const [pseudo, setPseudo] = useState('');
  const [isEditingPseudo, setIsEditingPseudo] = useState(false);
  const [isEditingUserLoading, setIsEditingUserLoading ] = useState(false);
    async function updateUser() {
        setIsEditingUserLoading(true);
        if(isPseudoEnteredValid(pseudo)) {
            user.displayName = cleanPseudoEntered(pseudo);
            user.customDatas.displayName = cleanPseudoEntered(pseudo);
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
                
                <ReactSVG src={"./img/avatars/botts"+user.customDatas.avatarId+".svg"}  className="userAvatarBig"/>
                <Box sx={{textAlign:'center', mb:2, fontWeight:'bold'}}>
                    {isEditingPseudo && 
                        <Grid item md={12}>
                            <TextField id="outlined-basic" 
                                size="small"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment sx={{ maxHeight:0, cursor:'pointer' }} position="end"  
                                            onClick={(e) => isPseudoEnteredValid(pseudo) ? updateUser() : setIsEditingPseudo(false)} >
                                            {isPseudoEnteredValid(pseudo) ? <Save /> : <CancelOutlined />}
                                        </InputAdornment>
                                    ),
                                }}
                                value={pseudo} onChange={(e) => setPseudo(e.target.value)} 
                                helperText= {t('GeneralLength')+" min : 5 | Max : 15"}
                                placeholder={user.displayName} label="Pseudo" variant="outlined" />
                        </Grid>}
                    {!isEditingPseudo && 
                        <Box sx={{mt:1, mb:1}}>
                            <Typography component="div"  fontSize="large" fontWeight="bold" className="fontFamilyNunito" sx={{display:'inline'}}>
                                {user.displayName}
                            </Typography>
                            {!user.isAnonymous && 
                                <IconButton aria-label="delete" sx={{p:0, ml:1}}  color="primary" onClick={(e) => setIsEditingPseudo(true)} >
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            }
                        </Box>
                    }
                    
                    {!user.isAnonymous && 
                        <>
                            <Typography className="fontFamilyNunito" fontSize="small" sx={{display:'block'}}>
                                {t('UserMemberSince')} {new Date(user.metadata.creationTime).toLocaleDateString('fr-FR', timestampToDateoptions)}
                            </Typography>
                            <Typography className="fontFamilyNunito" fontSize="small" sx={{display:'block'}}>
                                {t('UserMemberLastLogin')} {new Date(user.metadata.lastSignInTime).toLocaleDateString('fr-FR', timestampToHoursAndMinOptions)}
                            </Typography>
                        </>
                    }
                </Box>
                            
                <FormGroup>
                    {user.isAnonymous && 
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