import React, { useEffect } from "react";

import { Alert, Button, Dialog, DialogActions, DialogContent, Typography } from "@mui/material";
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import { db } from '../../../services/firebase'; 
import { useState } from "react";
import { Box } from "@mui/system";
import AppsIcon from '@mui/icons-material/Apps';

import { withTranslation } from 'react-i18next';
import ModalsHeader from "./ModalsHeader";
import { timestampToDateoptions } from "../../../services/utilsArray";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getCleanRoomId } from "../../../services/utilsRoom";
import { SlideUp } from "../../../services/materialSlideTransition/Slide";
import ModalsFooter from "./ModalsFooter";

const UserRoomListModal = ({t, open, changeOpen, user, joinRoomByRoomId}) => {

    const [roomList, setRooms] = useState([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if(open) {
            const fetchRooms = async () => {
                const q = query(collection(db, process.env.REACT_APP_ROOM_COLLECTION), where('adminUid', '==', user.uid));
                const querySnapshot = await getDocs(q);
                const roomsListQuery = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setRooms(roomsListQuery);
                setLoaded(true);
            };

            fetchRooms();
        }
    }, [open]);

   
 
        
    async function joinRoomByRoomIdInComp(roomId) {
        joinRoomByRoomId(roomId);
        changeOpen(false);
    }

    return(
        <Dialog open={open} onClose={(e) => changeOpen(false)} TransitionComponent={SlideUp}>

            <ModalsHeader icon={() => <AppsIcon fontSize="small" sx={{mr:1}} />} title={t('UserMenuMyRooms')} />

            <DialogContent dividers sx={{pt:1, pl:1, pr:1, pb:1}}>
                {!loaded && 
                    <Typography fontSize='small'> 
                        {t('GeneralLoading')}
                    </Typography>
                }
                {loaded &&
                <>
                    {Object.keys(roomList).length === 0 &&
                        <Alert severity="warning">{t('ModalUserRoomListEmpty')}.</Alert>
                    }
                    {Object.entries(roomList).map(([key, room]) => {

                        var createdDate = new Date(room.creationTimeStamp).toLocaleDateString('fr-FR', timestampToDateoptions);
                        return(
                        <Box title={t('ModalUserRoomListJoinRoomText')} onClick={(e) => joinRoomByRoomIdInComp(getCleanRoomId(room.id))} key={key} 
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
                </>}
            </DialogContent>

            
            <ModalsFooter 
                backButtonText={t('GeneralBack')} 
                backFunc={(e) => changeOpen(false)} 
                secondButton={false}
            />
            
        </Dialog>
    )
};

export default withTranslation()(UserRoomListModal);