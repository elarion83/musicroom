import React, { useState } from "react";

import { Alert, Box, Dialog, DialogContent, Grid, Typography } from "@mui/material";
import SwitchAccountIcon from '@mui/icons-material/SwitchAccount';
import { withTranslation } from 'react-i18next';
import { SlideUp } from '../../../services/materialSlideTransition/Slide';
import useDigitInput from "react-digit-input";
import ModalsHeader from "../../generalsTemplates/modals/ModalsHeader";

const ModalChangePlaylistAdmin = ({ t,open,playlistAdminPass,changeOpen,adminView, changeAdmin }) => {
    const [value, onChange] = React.useState('');

    const digits = useDigitInput({
        acceptedCharacters: /^[a-zA-Z0-9]$/,
        length: 4,
        value,
        onChange,
    });
    
    React.useEffect(() => {   
        if(digits[0].value !== '' && digits[1].value !== '' && digits[2].value !== '' && digits[3].value !== '') {
            if(value.toLowerCase() == playlistAdminPass.toLowerCase()) {
                changeAdmin();
                changeOpen(false);
            }
        }
    }, [value]);

    return (
        <Dialog open={open} TransitionComponent={SlideUp} onClose={(e) => changeOpen(false)} className='modal_share_playlist'>
            <ModalsHeader icon={() => <SwitchAccountIcon />} title={adminView ? t('ModalChangePlaylistAdmin') : t('ModalChangePlaylistAdmin2')} />

            <DialogContent dividers sx={{ pt: 2 }}>
                 
                <Typography className="varelaFontTitle">
                    Mot de passe administrateur :
                </Typography> 
                
                {adminView &&
                    <>
                        <Typography component="span" sx={{mt:1, fontSize:'2em', mb:'0.5em'}} className="playlistAdminPass">{playlistAdminPass}</Typography>

                        <Alert severity="info" >
                            Donnez le mot de passe ci-dessus a quelqu'un pour qu'il devienne hôte de la playlist à votre place.
                        </Alert>
                    </>
                }
                {!adminView &&
                    <>
                        <Box className='joinRoomForm adminForm'>
                            <div className='input'>
                                <input {...digits[0]} />
                            </div>
                            <div className='input'>
                                <input {...digits[1]} />
                            </div>
                            <div className='input'>
                                <input {...digits[2]} />
                            </div>
                            <div className='input'>
                                <input {...digits[3]} />
                            </div>
                        </Box>
                        <Alert severity="info">
                            Récupérez le mot de passe auprès de l'hôte actuel de la playlist et entrez le ci-dessus pour devenir hôte.
                        </Alert>
                    </>
                }
            </DialogContent>
        </Dialog>
    )
};

export default withTranslation()(ModalChangePlaylistAdmin);