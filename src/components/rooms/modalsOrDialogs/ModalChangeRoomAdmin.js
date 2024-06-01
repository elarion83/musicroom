import React, { useState } from "react";

import { Alert, AlertTitle, Box, Button, Dialog, DialogActions, DialogContent, Grid, Typography } from "@mui/material";
import SwitchAccountIcon from '@mui/icons-material/SwitchAccount';
import { withTranslation } from 'react-i18next';
import { SlideUp } from '../../../services/materialSlideTransition/Slide';
import useDigitInput from "react-digit-input";
import ModalsHeader from "../../generalsTemplates/modals/ModalsHeader";

const ModalChangePlaylistAdmin = ({ t,open,playlistAdminPass,changeOpen,adminView, changeAdmin }) => {
    const [value, onChange] = React.useState('');
	const [wrongPass, setWrongPass] = useState(false);

    const digits = useDigitInput({
        acceptedCharacters: /^[a-zA-Z0-9]$/,
        length: 4,
        value,
        onChange,
    });
    
    React.useEffect(() => {   
        setWrongPass(false);
        if(digits[0].value !== '' && digits[1].value !== '' && digits[2].value !== '' && digits[3].value !== '') {
            if(value.toLowerCase() == playlistAdminPass.toLowerCase()) {
                changeAdmin();
                changeOpen(false);
                onChange('');
            } else {
                setWrongPass(true);
            }
        }
    }, [value]);

    return (
        <Dialog open={open} TransitionComponent={SlideUp} onClose={(e) => changeOpen(false)} className='modal_share_playlist'>
            <ModalsHeader icon={() => <SwitchAccountIcon />} title={t('ModalChangePlaylistAdmin')} />

            <DialogContent dividers sx={{ pt: 2 }}>
                {adminView &&
                    <>
                        <Alert severity="info" >
                            <AlertTitle sx={{fontWeight:"bold"}}>Nommer un nouvel hôte</AlertTitle>
                            Donnez le mot de passe ci-dessous a quelqu'un pour qu'il devienne hôte de cette playlist à votre place.
                        </Alert>

                        <Typography component="span" sx={{mt:1, fontSize:'2em', mb:'0.5em'}} className="playlistAdminPass">
                            {playlistAdminPass}
                        </Typography>
                    </>
                }
                {!adminView &&
                    <>
                        <Alert severity="info">
                            <AlertTitle sx={{fontWeight:"bold"}}>Devenez hôte de playlist</AlertTitle>
                            Récupérez le mot de passe auprès de l'hôte actuel de cette playlist, entrez le ci-dessous et devenez hôte à sa place.
                        </Alert>
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
                        {wrongPass && <Alert severity="error">
                            <AlertTitle sx={{fontWeight:"bold"}}>Incorrect</AlertTitle>
                            Vous avez entré un code incorrect.
                        </Alert>}
                    </>
                }
            </DialogContent>
            
            <DialogActions>
                <Button variant="outlined" onClick={(e) => changeOpen(false)} autoFocus>
                    {t('GeneralClose')}
                </Button>
            </DialogActions>
        </Dialog>
    )
};

export default withTranslation()(ModalChangePlaylistAdmin);