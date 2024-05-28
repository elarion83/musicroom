import React from "react";

import { Dialog, DialogContent, Typography } from "@mui/material";
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import { db } from '../../../services/firebase'; 
import { useState } from "react";
import { Box } from "@mui/system";
import AppsIcon from '@mui/icons-material/Apps';

import { withTranslation } from 'react-i18next';
import ModalsHeader from "./ModalsHeader";
import { timestampToDateoptions } from "../../../services/utilsArray";

const UserRoomListModal = ({t, open, changeOpen, user, joinRoomByRoomId}) => {

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

    async function joinRoomByRoomIdInComp(roomId) {
        joinRoomByRoomId(roomId);
        changeOpen(false);
    }

    return(
        <Dialog open={open} onClose={(e) => changeOpen(false)}>

            <ModalsHeader icon={() => <AppsIcon fontSize="small" sx={{mr:1}} />} title={t('UserMenuMyRooms')} />

            <DialogContent dividers sx={{pt:2, pl:1, pr:1}}>
                {Object.keys(roomList).length === 0 &&
                    <Typography fontSize='small'> 
                        {t('ModalUserRoomListEmpty')}.
                    </Typography>
                }
                {Object.entries(roomList).map(([key, room]) => {

                    var createdDate = new Date(room.creationTimeStamp).toLocaleDateString('fr-FR', timestampToDateoptions);
                    return(
                    <Box title={t('ModalUserRoomListJoinRoomText')} onClick={(e) => joinRoomByRoomIdInComp(room.id)} key={key} 
                    sx={{mb:1, p:1,justifyContent:'start',position:'relative', overflow:'hidden',boxShadow: 2,minWidth:'350px', cursor:'pointer',bgcolor:'var(--main-color)',border:'1px solid var(--grey-light)', borderRadius:'4px'}}>
                        <QueueMusicIcon className="iconPlaylistList" fontSize="small" sx={{mr:1}} />
                        <Typography fontSize='medium' sx={{textTransform: 'uppercase',color:'var(--white)'}}> 
                          ID : <b>{room.id}</b>
                        </Typography>
                        <Typography fontSize='small' sx={{color:'var(--white)'}}> 
                            {t('ModalUserRoomListCreated')} <b>{createdDate}</b>
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

export default withTranslation()(UserRoomListModal);