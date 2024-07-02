import * as React from 'react';
import { Icon } from "@iconify/react";
import { Alert, AlertTitle, Dialog, DialogActions, DialogContent, DialogContentText, Divider, Grid, Typography } from "@mui/material";
import useDigitInput from 'react-digit-input';
import { Box } from '@mui/system';
import NotListedLocationOutlinedIcon from '@mui/icons-material/WhereToVoteOutlined';
import { LoadingButton } from '@mui/lab';

import { withTranslation } from 'react-i18next';
import { SlideUp } from "../../../services/materialSlideTransition/Slide";
import ModalsHeader from './ModalsHeader';
import { getCleanRoomId } from '../../../services/utilsRoom';
import ModalsFooter from './ModalsFooter';
import JoinRoomCloseToMeModal from './JoinRoomCloseToMeModal';

const JoinRoomModal = ({ t, open, handleJoinRoom, changeOpen}) => {
    const [value, onChange] = React.useState('');
    const [isJoining, setIsJoining] = React.useState(false);
    const [nearbyModalOpen, setNearbyModalOpen] = React.useState(false);
    const [userPosition, setUserPosition] = React.useState(null);
    const [userPositionError, setUserPositionError] = React.useState(false);
    const [getPositionLoading, setGetPositionLoading] = React.useState(false);

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
    
    async function getUserPositionAndOpenModal() {
        setGetPositionLoading(true);         
        setUserPositionError(false);
        try {
            navigator.geolocation.getCurrentPosition(function(position) {
                let posObject = {
                    lat:position.coords.latitude,
                    long:position.coords.longitude,
                }
                setUserPosition(posObject);
                setNearbyModalOpen(true);
                setGetPositionLoading(false);            
                setUserPositionError(false);
            });
        } 
        catch {
            setUserPositionError(true);
            setNearbyModalOpen(false);        
            setGetPositionLoading(false);
        }
    }

    return(<>
         <Dialog open={open} TransitionComponent={SlideUp} onClose={(e) => changeOpen(false)} sx={{
            "& .MuiDialog-container": {
                "& .MuiPaper-root": {
                width: "100%",
                maxWidth: "500px",  // Set your width here
                },
            },
        }}>
            <ModalsHeader icon={() => <Icon icon='icon-park-outline:connect' style={{marginRight:'10px'}} />} title={t('HomePageButtonsJoinRoom')} />

            <DialogContent dividers>
                <Grid container direction="column" >
                    <Alert severity="info" sx={{mb:1, maxWidth:'350px'}}>
                        <AlertTitle sx={{fontWeight:"bold"}}>{t('ModalJoinRoomIDOfTheRoom')}</AlertTitle>
                        <Typography fontSize="small" component="p">{t('ModalJoinRoomIDOfTheRoomText')}</Typography>
                    </Alert>
                        <Box className='joinRoomForm' sx={{mb:1}}>
                            <div className='input'>
                                <input {...digits[0]} autoFocus/>
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
                    <Divider sx={{mt:2,mb:2}}>
                        {t('GeneralOr')} 
                    </Divider>  
                    <JoinRoomCloseToMeModal open={nearbyModalOpen} close={setNearbyModalOpen} handleJoinRoom={handleJoinRoom} userPosition={userPosition} />
                    <LoadingButton 
                        loading={getPositionLoading} 
                        size="small" 
                        loadingPosition='start'
                        startIcon={<NotListedLocationOutlinedIcon />}
                        onClick={(e) => getUserPositionAndOpenModal()} 
                        className='main_bg_color buttonBorder btnIconFixToLeft varelaFontTitle texturaBgButton colorWhite'  
                        position="end"
                    >
                        {t(getPositionLoading ? 'GeneralLoading' : 'Playlists '+ t('GeneralNearBy'))}
                    </LoadingButton>
                    {userPositionError && <p> t('GeneralErrorHappened') </p>}
                </Grid>
            </DialogContent>
           
            <ModalsFooter 
                secondButton={false}
                backButtonText={t('GeneralBack')} 
                backFunc={(e) => changeOpen(false)} 
            />
        </Dialog>

                   </>
    )
};

export default withTranslation()(JoinRoomModal);