import React from "react";

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Alert, AlertTitle, Box, Dialog, DialogContent, FormGroup, Grid, IconButton, InputAdornment, List, ListItem, ListItemButton, ListItemIcon, ListItemText, TextField, Typography } from "@mui/material";
import { useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import { LoadingButton } from "@mui/lab";
import { timestampToDateoptions, timestampToHoursAndMinOptions } from "../../../services/utilsArray";

import { withTranslation } from 'react-i18next';
import ModalsHeader from "./ModalsHeader";
import { ReactSVG } from "react-svg";
import { AccountCircle, CancelOutlined , Save } from "@mui/icons-material";
import { cleanPseudoEntered, isPseudoEnteredValid } from "../../../services/utils";
import CachedIcon from '@mui/icons-material/Cached';
import UserAvatarComponent from "../../../services/utilsComponents";
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
    }
    return(
        <Dialog open={open} onClose={(e) => changeOpen(false)}>
            
            <ModalsHeader icon={() => <AccountCircleIcon />} title={t('ModalUserSettingsTitle')} />

            <DialogContent dividers sx={{pt:2}}>
                <Box className='userAvatarBig' sx={{'outlineColor': 'rgba('+user.customDatas.colorRgb+',0.7)'}}>
                    <UserAvatarComponent user={user} needOutline={false} cssClass='animate__animated' />
                </Box>
                <Box sx={{textAlign:'center', mb:2, fontWeight:'bold'}}>
                    {isEditingPseudo && 
                        <Grid item md={12}>
                            <TextField id="outlined-basic" 
                                size="small"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment sx={{ maxHeight:0, cursor:'pointer' }} position="end"  
                                            onClick={(e) => isPseudoEnteredValid(pseudo) ? updateUser() : setIsEditingPseudo(false)} >
                                            {isPseudoEnteredValid(pseudo) ? isEditingUserLoading ?  <ReactSVG src={"../img/loading.svg"} className="inputLoadingSvg" /> : <Save /> : <CancelOutlined />}
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
                    
                    <List dense={true} className="userInfosList">
                        
                        <ListItem disablePadding>
                            <ListItemText primary={user.email} />
                        </ListItem>
                        <ListItem disablePadding className="small">
                            <ListItemText primary={t('UserMemberSince')+' '+new Date(user.metadata.creationTime).toLocaleDateString('fr-FR', timestampToDateoptions)} />
                        </ListItem>
                        <ListItem disablePadding className="small">
                            <ListItemText primary={t('UserMemberLastLogin')+' '+new Date(user.metadata.lastSignInTime).toLocaleDateString('fr-FR', timestampToHoursAndMinOptions)} />
                        </ListItem>
                    </List>
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