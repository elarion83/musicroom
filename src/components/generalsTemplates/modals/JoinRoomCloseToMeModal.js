import * as React from 'react';
import { Icon } from "@iconify/react";
import { Alert, AlertTitle, Card, CardContent, CardMedia, Dialog, DialogActions, DialogContent, DialogContentText, Divider, Grid, Typography } from "@mui/material";
import useDigitInput from 'react-digit-input';
import { Box } from '@mui/system';
import { LoadingButton } from '@mui/lab';
import { withTranslation } from 'react-i18next';
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { SlideUp } from "../../../services/materialSlideTransition/Slide";
import ModalsHeader from './ModalsHeader';
import { getCleanRoomId } from '../../../services/utilsRoom';
import ModalsFooter from './ModalsFooter';
import { useState , useEffect } from 'react';
import { getTimeStampOfMoment, haversineDistance, isVarNull } from '../../../services/utils';
import { db } from '../../../services/firebase';
import RoomListItem from '../../rooms/RoomListItem';
import { DateRange, LocationOn, PlaylistPlay } from '@mui/icons-material';

const JoinRoomCloseToMeModal = ({ t, open, close, handleJoinRoom, userPosition}) => {

    const [loadingPlaylistSearch, setLoadingPlaylistSearch] = useState(false);
    const [playlistList, setPlaylistList] = useState({});
    const [maxNumberShown, setMaxNumberShown] = useState(3);

    const fetchRooms = async () => {
        setLoadingPlaylistSearch(true);
        try {
            const q = query(collection(db, process.env.REACT_APP_ROOM_COLLECTION), where('roomParams.isLocalisable', '==', true),  where('creationTimeStamp', '>', getTimeStampOfMoment('1HourAgo')), orderBy('creationTimeStamp', 'desc') );
            const querySnapshot = await getDocs(q);
            const tempList = [];
            querySnapshot.forEach(doc => {
                const data = doc.data();
                data.distance = haversineDistance(userPosition.lat, userPosition.long, data.localisation.lat, data.localisation.long);
                tempList.push(data);
            });
            tempList.sort((a, b) => a.distance - b.distance);
            setPlaylistList(tempList);
            setLoadingPlaylistSearch(false);
        }
        catch {
            setLoadingPlaylistSearch(false);
        }
    };

    useEffect(() => {  
        if(open) {
            fetchRooms();
        }
    }, [open]);

    async function refreshList() {
        await fetchRooms();
    }

    async function joinRoomByRoomIdInComp(roomId) {
        close(false);
        handleJoinRoom(roomId);
    }

    return(
         <Dialog open={open}  TransitionComponent={SlideUp} onClose={(e) => close(false)}sx={{
            "& .MuiDialog-container": {
                "& .MuiPaper-root": {
                width: "100%",
                maxWidth: "500px",  // Set your width here
                },
            },
        }}>
            <ModalsHeader icon={() => <Icon icon='icon-park-outline:connect' style={{marginRight:'10px'}} />} title={'Playlists '+ t('GeneralNearBy')} />

            <DialogContent dividers>
                <Grid container direction="column" >
                   
                    {Object.keys(playlistList).length === 0 &&
                        <Alert severity="warning">{t('GeneralNoResult')}</Alert>
                    }
                    <LoadingButton 
                        loading={loadingPlaylistSearch}
                        size="small" 
                        loadingPosition='start'
                        onClick={(e) => refreshList()} 
                        className='main_bg_color buttonBorder btnIconFixToLeft varelaFontTitle texturaBgButton colorWhite'  
                        position="end"
                        sx={{flexBasis:'100%'}}
                    >
                        {t(loadingPlaylistSearch ? 'GeneralLoading' : 'GeneralRefresh')}  
                    </LoadingButton>

                    <Grid container direction="row" sx={{mt:2, mb:2}}>
                    
                        {Object.entries(playlistList).map(([key, room]) => {
                            if(key < maxNumberShown) {
                                return(
                                    <RoomListItem key={key} room={room} joinRoom={joinRoomByRoomIdInComp} layout="nearbyList" />
                                )
                            }
                        })}
                    </Grid>
                    {(playlistList.length > maxNumberShown) &&
                        <LoadingButton 
                        loading={loadingPlaylistSearch}
                            size="small" 
                            loadingPosition='start'
                            onClick={(e) => setMaxNumberShown(maxNumberShown+3)} 
                            className='btnIconFixToLeft varelaFontTitle texturaBgButton'  
                            position="end"
                            sx={{flexBasis:'100%'}}
                        >
                        {t(loadingPlaylistSearch ? 'GeneralLoading' : 'GeneralSeeMore')}  
                            
                        </LoadingButton>
                    }
                </Grid>
            </DialogContent>  
            <ModalsFooter 
                secondButton={false}
                backButtonText={t('GeneralBack')} 
                backFunc={(e) => close(false)} 
            />
        </Dialog>
    )
};

export default withTranslation()(JoinRoomCloseToMeModal);