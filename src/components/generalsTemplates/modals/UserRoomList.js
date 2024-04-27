import React from "react";

import DialogTitle from '@mui/material/DialogTitle';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Dialog, DialogContent, Typography } from "@mui/material";

import { db } from '../../../services/firebase'; 
import { useState } from "react";
import { Box, shadows } from "@mui/system";

import { withTranslation } from 'react-i18next';

const UserRoomList = ({t, open, changeOpen, user, joinRoomByRoomId}) => {

    const [roomList] = useState({});
    if(user.uid) {
        db.collection(process.env.REACT_APP_ROOM_COLLECTION).where('adminUid', '==', user.uid).orderBy("creationTimeStamp", "asc").get().then((querySnapshot) => {
            var i =0;
            querySnapshot.forEach(doc => {
                roomList[i] = doc.data();
                i++;
            });
        });
    }
    return(
        <Dialog open={open} onClose={(e) => changeOpen(false)}>
            <DialogTitle className='flexRowCenterH' sx={{ m: 0,p:1 }}>
                <AccountCircleIcon fontSize="small" sx={{mr:1}} /> {t('UserMenuMyRooms')}
            </DialogTitle>  
            <DialogContent dividers sx={{pt:2}}>
                {Object.entries(roomList).map(([key, room]) => {
                    return(
                    <Box onClick={(e) => joinRoomByRoomId(room.id)} key={key} 
                    sx={{mb:1, p:1,justifyContent:'start',boxShadow: 2,minWidth:'250px', cursor:'pointer',bgcolor:'var(--main-color)',border:'1px solid var(--grey-light)', borderRadius:'4px'}}>
                        <Typography fontSize='medium' sx={{textTransform: 'uppercase',color:'var(--white)', fontWeight:'bold'}}> 
                            {room.id} 
                        </Typography>
                        <Typography fontSize='small' sx={{color:'var(--white)'}}> 
                            {t('GeneralStatus')} : {room.actuallyPlaying ? t('GeneralPlaying') : t('GeneralPause')}
                        </Typography>
                        <Typography fontSize='small' sx={{color:'var(--white)'}}> 
                            {room.playlistUrls.length } {t('GeneralMediasInPlaylist')}
                        </Typography>
                    </Box>
                    )
                }
                )}
            </DialogContent>
        </Dialog>
    )
};

export default withTranslation()(UserRoomList);