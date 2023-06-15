
import { Badge, Box, Fab, Grid, TextField, Tooltip, Typography } from "@mui/material";
import React from "react";
import TuneIcon from '@mui/icons-material/Tune';
import CelebrationIcon from '@mui/icons-material/Celebration';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';

import { Icon } from '@iconify/react';
import { useState } from "react";

import { db } from './../../services/firebase';
import { useEffect } from "react";

const Chat = ({roomParams, currentUser, roomId, userCanMakeInteraction,createNewRoomInteraction, hideTchat}) => {

    const [messagesToDisplay, setMessagesToDisplay] = useState({});
    
        db.collection("messages").where('roomId', '==', roomId).orderBy("timestamp", "asc").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if(messagesToDisplay[doc.id]) {}
                else {
                    messagesToDisplay[doc.id] = doc.data();
                    setMessagesToDisplay(messagesToDisplay);
                }
            });
        });
        
    const [messageToSend, setMessageToSend] = useState();
    async function sendMessage() {
        db.collection("messages").add({
            author: currentUser.displayName,
            roomId: roomId,
            text:messageToSend,
            timestamp: Date.now(),
        }).then(() => {
            setMessageToSend('');
        });
    }

    return(
        <Box sx={{ flexGrow: 1 , pl:1, pr:1, mb:1}}>
            <Grid container spacing={0} >
                <Grid item xs={2} md={1} sx={{display:'flex', flexDirection:'column', justifyContent:'space-evenly', alignItems:'center'}}>
                    <Tooltip className='animate__animated animate__fadeInLeft animate__faster' title="Fermer le chat">  
                        <Fab size="small" variant="extended" className='room_small_button_interactions'  
                            sx={{justifyContent: 'center', ml:0}} onClick={e => hideTchat()} >
                            <Icon icon="tabler:messages-off" width='20' />
                        </Fab>
                    </Tooltip> 
                    <Tooltip className={!roomParams.interactionsAllowed ? 'hiddenButPresent' : 'animate__animated animate__fadeInLeft animate__fast'}
                        title={!userCanMakeInteraction ? "Toutes les "+  (roomParams.interactionFrequence/1000) +" secondes": ''}>  
                        <Fab size="small" variant="extended" className='room_small_button_interactions' sx={{ mr:0, ...(userCanMakeInteraction && {bgcolor: 'orange'}) }} onClick={(e) => userCanMakeInteraction ? createNewRoomInteraction('laugh') : ''}>
                            <EmojiEmotionsIcon fontSize="small" sx={{color:'var(--white)'}} />
                            {!userCanMakeInteraction && <HourglassBottomIcon className="icon_overlay"/>}
                        </Fab>
                    </Tooltip>
                    <Tooltip className={!roomParams.interactionsAllowed ? 'hiddenButPresent' : 'animate__animated animate__fadeInLeft '}
                        title={!userCanMakeInteraction ? "Toutes les "+  (roomParams.interactionFrequence/1000) +" secondes": ''}>  
                        <Fab size="small" variant="extended" className='room_small_button_interactions' sx={{mr:0, ...(userCanMakeInteraction && {bgcolor: '#ff9c22 !important'}) }} onClick={(e) => userCanMakeInteraction ? createNewRoomInteraction('party') : ''}>
                            <CelebrationIcon fontSize="small" sx={{color:'var(--white)'}} />
                            {!userCanMakeInteraction && <HourglassBottomIcon className="icon_overlay"/>}
                        </Fab>
                    </Tooltip>
                    <Tooltip className={!roomParams.interactionsAllowed ? 'hiddenButPresent' : 'animate__animated animate__fadeInLeft animate__delay-1s '}
                        title={!userCanMakeInteraction ? "Toutes les "+  (roomParams.interactionFrequence/1000) +" secondes": ''}>  
                        <Fab size="small" variant="extended" className='room_small_button_interactions' sx={{ mr:0, ...(userCanMakeInteraction && {bgcolor: 'var(--red-2) !important'}) }} onClick={(e) => userCanMakeInteraction ? createNewRoomInteraction('heart') : ''}>
                            <FavoriteIcon fontSize="small" sx={{color:'var(--white)'}} />
                            {!userCanMakeInteraction && <HourglassBottomIcon className="icon_overlay"/>}
                        </Fab>
                    </Tooltip>  
                </Grid>
                <Grid item xs={10} md={11}>
                    <Box className='animate__animated animate__fadeInUp animate__fast' sx={{height:'150px', overflowY:'scroll', bgcolor:'var(--main-bg-color)', p:1,borderTop:'4px solid var(--main-bg-color)', boxShadow:3}} >
                        {Object.entries(messagesToDisplay).map(([key, value]) => {
                            return(
                            <Box sx={{display:'flex',mb:1, justifyContent:'start'}}>
                                <Typography fontSize='small' sx={{color:'var(--main-color)', fontWeight:'bold'}}> 
                                    {value.author}: 
                                </Typography>
                                <Typography fontSize='small' sx={{ml:1, color:'var(--white-2)'}}>
                                    {value.text}
                                </Typography>
                            </Box>
                            )
                        }
                        )}
                    </Box>
                    <TextField
                        size="small"
                        className='animate__animated animate__fadeInUp animate__faster'
                        sx={{position:'sticky', bottom:0, width:'100%', bgcolor:'var(--main-bg-color)'}}
                        placeholder='Envoyer un message'
                        type="text"
                        id="chatSendMessageText"
                        value={messageToSend}  
                        onChange={(e) => setMessageToSend(e.target.value)} 
                        InputProps={{
                            endAdornment: (
                                <Icon icon='material-symbols:send' onClick={(e) => sendMessage()} />
                            ),
                        }} 
                    />
                </Grid>
            </Grid>
        </Box>
    )
};

export default Chat;