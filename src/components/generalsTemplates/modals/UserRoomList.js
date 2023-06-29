import React from "react";

import DialogTitle from '@mui/material/DialogTitle';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Dialog, DialogContent, Typography } from "@mui/material";

import { db } from '../../../services/firebase'; 
import { useState } from "react";
import { Box } from "@mui/system";

const UserRoomList = ({ open, changeOpen, user, joinRoomByRoomId}) => {

    const [roomList, setRoomList] = useState({});
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
                <AccountCircleIcon fontSize="small" sx={{mr:1}} /> Vos rooms
            </DialogTitle>  
            <DialogContent dividers sx={{pt:2}}>
                {Object.entries(roomList).map(([key, room]) => {
                    return(
                    <Box onClick={(e) => joinRoomByRoomId(room.id)} key={key} sx={{mb:1, p:1,justifyContent:'start', cursor:'pointer',border:'1px solid var(--grey-light)', borderRadius:'2px'}}>
                        <Typography fontSize='small' sx={{color:'var(--main-color)', fontWeight:'bold'}}> 
                            Id : {room.id} 
                        </Typography>
                        <Typography fontSize='small' sx={{color:'var(--main-color)'}}> 
                            Statut : {room.actuallyPlaying ? 'En lecture' : 'En pause'} 
                        </Typography>
                        <Typography fontSize='small' sx={{color:'var(--main-color)'}}> 
                            {room.playlistUrls.length } médias en playlist
                        </Typography>
                    </Box>
                    )
                }
                )}
            </DialogContent>
        </Dialog>
    )
};

export default UserRoomList;