import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Icon } from "@iconify/react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from "@mui/material";
import useDigitInput from 'react-digit-input';
import { Box } from '@mui/system';
import { LoadingButton } from '@mui/lab';


const JoinRoomModal = ({ open, handleJoinRoom, changeOpen}) => {
    const [value, onChange] = React.useState('');
    const [isJoining, setIsJoining] = React.useState(false);

    const digits = useDigitInput({
        acceptedCharacters: /^[a-zA-Z0-9]$/,
        length: 6,
        value,
        onChange,
    });
    
    React.useEffect(() => {   
        if(digits[0].value != '' && digits[1].value != '' && digits[2].value != '' && digits[3].value != '' && digits[4].value != '') {
            setIsJoining(true);
            handleJoinRoom(value);
        }
    }, [value]);
    
    return(
         <Dialog open={open} onClose={(e) => changeOpen(false)} >
            <DialogTitle className='flexRowCenterH' sx={{ m: 0,p:1 }}>
                <Icon icon='carbon:user-avatar' style={{marginRight:'10px'}} /> Rejoindre une room
            </DialogTitle>  
            <DialogContent dividers>
              <DialogContentText>
                <Typography sx={{mb:1}}> ID de la room a rejoindre</Typography>
                <Box className='joinRoomForm'>
                    <div className='input'>
                        <input inputMode="decimal" autoFocus {...digits[0]} />
                    </div>
                    <div className='input'>
                        <input inputMode="decimal" {...digits[1]} />
                    </div>
                    <div className='input'>
                        <input inputMode="decimal" {...digits[2]} />
                    </div>
                    <div className='input'>
                        <input inputMode="decimal" {...digits[3]} />
                    </div>
                    <div className='input'>
                        <input inputMode="decimal" {...digits[4]} />
                    </div>
                </Box>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
                <LoadingButton loading={isJoining}  variant="outlined" position="end">
                            Rejoindre
                </LoadingButton>
            </DialogActions>
        </Dialog>
    )
};

export default JoinRoomModal;