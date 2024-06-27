import * as React from 'react';
import { Icon } from "@iconify/react";
import { Alert, AlertTitle, Dialog, DialogActions, DialogContent, DialogContentText, Typography } from "@mui/material";
import useDigitInput from 'react-digit-input';
import { Box } from '@mui/system';
import { LoadingButton } from '@mui/lab';

import { withTranslation } from 'react-i18next';
import { SlideUp } from "../../../services/materialSlideTransition/Slide";
import ModalsHeader from './ModalsHeader';
import { getCleanRoomId } from '../../../services/utilsRoom';

const JoinRoomModal = ({ t, open, handleJoinRoom, changeOpen}) => {
    const [value, onChange] = React.useState('');
    const [isJoining, setIsJoining] = React.useState(false);

    const digits = useDigitInput({
        acceptedCharacters: /^[a-zA-Z0-9]$/,
        length: 6,
        value,
        onChange,
    });
    
    React.useEffect(() => {   
        if(digits[0].value !== '' && digits[1].value !== '' && digits[2].value !== '' && digits[3].value !== '' && digits[4].value !== '') {
            setIsJoining(true);
            handleJoinRoom(getCleanRoomId(value));
        }
    }, [value]);
    
    return(
         <Dialog open={open} TransitionComponent={SlideUp} onClose={(e) => changeOpen(false)} >
            <ModalsHeader icon={() => <Icon icon='icon-park-outline:connect' style={{marginRight:'10px'}} />} title={t('HomePageButtonsJoinRoom')} />

            <DialogContent dividers>
                <Alert severity="info" sx={{mb:1, maxWidth:'350px'}}>
                    <AlertTitle sx={{fontWeight:"bold"}}>{t('ModalJoinRoomIDOfTheRoom')}</AlertTitle>
                    <Typography fontSize="small" component="p">{t('ModalJoinRoomIDOfTheRoomText')}</Typography>
                </Alert>
                <Box className='joinRoomForm'>
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
                    <div className='input'>
                        <input {...digits[4]} />
                    </div>
                </Box>
                
            </DialogContent>
            <DialogActions>
                <LoadingButton loading={isJoining}  variant="outlined" position="end">
                            {t('ModalJoinRoomButtonJoin')}
                </LoadingButton>
            </DialogActions>
        </Dialog>
    )
};

export default withTranslation()(JoinRoomModal);