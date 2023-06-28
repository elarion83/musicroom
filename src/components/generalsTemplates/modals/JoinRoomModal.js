import * as React from 'react';
import { Icon } from "@iconify/react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from "@mui/material";
import useDigitInput from 'react-digit-input';
import { Box } from '@mui/system';
import { LoadingButton } from '@mui/lab';

import { withTranslation } from 'react-i18next';
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
            handleJoinRoom(value.toLowerCase());
        }
    }, [value]);
    
    return(
         <Dialog open={open} onClose={(e) => changeOpen(false)} >
            <DialogTitle className='flexRowCenterH' sx={{ m: 0,p:1 }}>
                <Icon icon='icon-park-outline:connect' style={{marginRight:'10px'}} /> {t('HomePageButtonsJoinRoom')}
            </DialogTitle>  
            <DialogContent dividers>
              <DialogContentText>
                <Typography sx={{mb:1}}> {t('ModalJoinRoomIDOfTheRoom')}</Typography>
                <Box className='joinRoomForm'>
                    <div className='input'>
                        <input  autoFocus {...digits[0]} />
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
                <Typography fontSize="small"> Ex : 5454S, E45FR</Typography>
              </DialogContentText>
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