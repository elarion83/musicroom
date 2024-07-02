import React, { useEffect } from "react";

import { Alert, Button, Dialog, DialogActions, DialogContent, Grid, Typography } from "@mui/material";
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import { db } from '../../../services/firebase'; 
import { useState } from "react";
import { Box } from "@mui/system";
import AppsIcon from '@mui/icons-material/Apps';

import { withTranslation } from 'react-i18next';
import ModalsHeader from "./ModalsHeader";
import { timestampToDateoptions } from "../../../services/utilsArray";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { getCleanRoomId } from "../../../services/utilsRoom";
import { SlideUp } from "../../../services/materialSlideTransition/Slide";
import ModalsFooter from "./ModalsFooter";
import RoomListItem from "../../rooms/RoomListItem";

const UserRoomListModal = ({t, open, changeOpen, user, joinRoomByRoomId}) => {

    const [roomList, setRooms] = useState([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if(open) {
            const fetchRooms = async () => {
                const q = query(collection(db, process.env.REACT_APP_ROOM_COLLECTION), where('adminUid', '==', user.uid), orderBy('creationTimeStamp', 'desc') );
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
        <Dialog open={open} onClose={(e) => changeOpen(false)} TransitionComponent={SlideUp} sx={{
            "& .MuiDialog-container": {
                "& .MuiPaper-root": {
                width: "100%",
                maxWidth: "500px",  // Set your width here
                },
            },
        }}>

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
                    <Grid container sx={{gap:'5px'}}>
                    {Object.entries(roomList).map(([key, room]) => {

                        var createdDate = new Date(room.creationTimeStamp).toLocaleDateString('fr-FR', timestampToDateoptions);
                        return(
                            <RoomListItem key={key} room={room} joinRoom={joinRoomByRoomIdInComp} />

                        )
                    }
                    )}</Grid>
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