import React from "react";

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Alert, AlertTitle, Box, Dialog, DialogContent, FormGroup, Grid, IconButton, InputAdornment, List, ListItem, ListItemText, TextField, Typography } from "@mui/material";
import { useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import { timestampToDateoptions, timestampToHoursAndMinOptions } from "../../../services/utilsArray";
import { SlideUp } from "../../../services/materialSlideTransition/Slide";

import { withTranslation } from 'react-i18next';
import ModalsHeader from "./ModalsHeader";
import { ReactSVG } from "react-svg";
import { CancelOutlined , Save } from "@mui/icons-material";
import { cleanPseudoEntered, delay, goToSpotifyConnectUrl, isPseudoEnteredValid, isVarExist, isVarNull, showLocalNotification, userSpotifyTokenObject } from "../../../services/utils";
import UserAvatarComponent from "../../../services/utilsComponents";
import SpotifyConnectButton from "../buttons/SpotifyConnectButton";
import { auth } from "../../../services/firebase";
const UserParamModal = ({ t, open, changeOpen, user = null, setUserInfo = null, ownProfile = true}) => {

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

    async function resetSpotifyToken() {
        showLocalNotification('Lecteur spotify', 'Connexion désactivée.', 'warning', 2500 );
        user.customDatas.spotifyConnect = userSpotifyTokenObject(null, 'reset');
        setUserInfo(user);
        changeOpen(false);
    }

    return(
        <Dialog open={open} TransitionComponent={SlideUp} onClose={(e) => changeOpen(false)}>
            
            <ModalsHeader icon={() => <AccountCircleIcon />} title={t('UserMenuMyProfile')} />

            <DialogContent dividers sx={{pt:2}}>
                {isVarExist(user) &&
                    <>
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
                                        {user.customDatas.displayName}
                                    </Typography>
                                    {(!(user.isAnonymous) && ownProfile) &&
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
                                    <ListItemText primary={t('UserMemberSince')+' '+new Date(user.customDatas.creationTime).toLocaleDateString('fr-FR', timestampToDateoptions)} />
                                </ListItem>
                                <ListItem disablePadding className="small">
                                    <ListItemText primary={t('UserMemberLastLogin')+' '+new Date(user.customDatas.lastSignInTime).toLocaleDateString('fr-FR', timestampToHoursAndMinOptions)} />
                                </ListItem>
                            </List>
                            
                            {ownProfile && 
                                <SpotifyConnectButton 
                                    text={auth.currentUser.customDatas.spotifyConnect.connected ? 'Déconnexion de Spotify' : 'Connexion à Spotify'} 
                                    clickFunc={auth.currentUser.customDatas.spotifyConnect.connected ? resetSpotifyToken : goToSpotifyConnectUrl}
                                    expiration={auth.currentUser.customDatas.spotifyConnect.expiration}
                                />
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
                    </>
                }
            </DialogContent>
        </Dialog>
    )
};

export default withTranslation()(UserParamModal);