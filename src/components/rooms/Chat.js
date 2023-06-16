
import { Badge, Box, Fab, Grid, TextField, Tooltip, Typography } from "@mui/material";
import React , { useEffect, useRef, useState } from "react";
import TuneIcon from '@mui/icons-material/Tune';
import CelebrationIcon from '@mui/icons-material/Celebration';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';

import { Icon } from '@iconify/react';

import { db } from './../../services/firebase';
import { LoadingButton } from "@mui/lab";

import {returnAnimateReplace} from './../../services/animateReplace'

const Chat = ({roomParams, currentUser, roomId, userCanMakeInteraction,createNewRoomInteraction, hideTchat}) => {

    const chatBoxRef = useRef([]);
    const animatedElementsRef = [];
    const scrollToLastMessage = () => {
        const lastChildElement = chatBoxRef.current?.lastElementChild;
        lastChildElement?.scrollIntoView({ behavior: 'smooth' });
    };

    const [alreadyScrolledOnInit, setAlreadyScrolledOnInit] = useState(false);

    const [messagesToDisplay, setMessagesToDisplay] = useState({});
    db.collection("messages").where('roomId', '==', roomId).orderBy("timestamp", "asc").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if(messagesToDisplay[doc.id]) {}
            else {
                messagesToDisplay[doc.id] = doc.data();
                setMessagesToDisplay(messagesToDisplay);
            }
        });
        if(!alreadyScrolledOnInit) { scrollToLastMessage(); setAlreadyScrolledOnInit(true); }
    });
        
    const [messageToSend, setMessageToSend] = useState('');
    const [isSendingMessage, setIsSendingMessage] = useState(false);
    const [isMessageSentOk, setIsMessageSentOk] = useState(false);
    const [canSendMessage, setCanSendMessage] = useState(true);
    var sendMessageTimeToWait = 10;
    const [cantSendMessageReason, setCantSendMessageReason] = useState('');

    async function sendMessage() {
        if(messageToSend.length > 0) {
            setIsSendingMessage(true);
            setCantSendMessageReason('Attendre '+sendMessageTimeToWait+' secondes');
            db.collection("messages").add({
                author: currentUser.displayName,
                roomId: roomId,
                text:messageToSend,
                timestamp: Date.now(),
            }).then(() => {
                scrollToLastMessage();
                setMessageToSend('');
                setIsSendingMessage(false);
                setCanSendMessage(false);
                setIsMessageSentOk(true);
                setTimeout(() => {
                    setIsMessageSentOk(false);
                }, 500);

                setInterval(function() {
                    sendMessageTimeToWait--;
                    setCantSendMessageReason('Attendre '+sendMessageTimeToWait+' secondes');
                    if (sendMessageTimeToWait === 0) {
                        setCanSendMessage(true);
                        sendMessageTimeToWait = 10;
                    }
                }, 1000);
            });
        } 
    }

    async function hideTchatInComp() {
        returnAnimateReplace(animatedElementsRef, {In:"Out", Up:"Down", animate__delay:''}, /In|Up|animate__delay/gi);

        setTimeout(() => {
            hideTchat();
        }, 500);
    }

    return(
        <Box sx={{ flexGrow: 1 , pl:1, pr:1, mb:1}}>
            <Grid container spacing={0} >
                <Grid item xs={2} md={1} sx={{display:'flex', flexDirection:'column', justifyContent:'space-evenly', alignItems:'center'}}>
                    <Tooltip ref={el => animatedElementsRef.push(el)} className='animate__animated animate__fadeInLeft animate__faster' title="Fermer le chat">  
                        <Fab size="small" variant="extended" className='room_small_button_interactions'  
                            sx={{justifyContent: 'center', ml:0}} onClick={e => hideTchatInComp()} >
                            <Icon icon="tabler:messages-off" width='20' />
                        </Fab>
                    </Tooltip> 
                    <Tooltip ref={el => animatedElementsRef.push(el)} className={!roomParams.interactionsAllowed ? 'hiddenButPresent' : 'animate__animated animate__fadeInLeft animate__fast'}
                        title={!userCanMakeInteraction ? "Toutes les "+  (roomParams.interactionFrequence/1000) +" secondes": ''}>  
                        <Fab size="small" variant="extended" className='room_small_button_interactions' sx={{ mr:0, ...(userCanMakeInteraction && {bgcolor: 'orange'}) }} onClick={(e) => userCanMakeInteraction ? createNewRoomInteraction('laugh') : ''}>
                            <EmojiEmotionsIcon fontSize="small" sx={{color:'var(--white)'}} />
                            {!userCanMakeInteraction && <HourglassBottomIcon className="icon_overlay"/>}
                        </Fab>
                    </Tooltip>
                    <Tooltip ref={el => animatedElementsRef.push(el)} className={!roomParams.interactionsAllowed ? 'hiddenButPresent' : 'animate__animated animate__fadeInLeft '}
                        title={!userCanMakeInteraction ? "Toutes les "+  (roomParams.interactionFrequence/1000) +" secondes": ''}>  
                        <Fab size="small" variant="extended" className='room_small_button_interactions' sx={{mr:0, ...(userCanMakeInteraction && {bgcolor: '#ff9c22 !important'}) }} onClick={(e) => userCanMakeInteraction ? createNewRoomInteraction('party') : ''}>
                            <CelebrationIcon fontSize="small" sx={{color:'var(--white)'}} />
                            {!userCanMakeInteraction && <HourglassBottomIcon className="icon_overlay"/>}
                        </Fab>
                    </Tooltip>
                    <Tooltip ref={el => animatedElementsRef.push(el)} className={!roomParams.interactionsAllowed ? 'hiddenButPresent' : 'animate__animated animate__fadeInLeft'}
                        title={!userCanMakeInteraction ? "Toutes les "+  (roomParams.interactionFrequence/1000) +" secondes": ''}>  
                        <Fab size="small" variant="extended" className='room_small_button_interactions' sx={{ mr:0, ...(userCanMakeInteraction && {bgcolor: 'var(--red-2) !important'}) }} onClick={(e) => userCanMakeInteraction ? createNewRoomInteraction('heart') : ''}>
                            <FavoriteIcon fontSize="small" sx={{color:'var(--white)'}} />
                            {!userCanMakeInteraction && <HourglassBottomIcon className="icon_overlay"/>}
                        </Fab>
                    </Tooltip>  
                </Grid>
                <Grid item xs={10} md={11}>
                    <Box 
                    ref={el => animatedElementsRef.push(el)} 
                    className='animate__animated animate__fadeInUp animate__fast chatBox' 
                    sx={{
                        bgcolor:'rgba(var(--grey-dark-rgb) ,0.8)', 
                        p:1,
                        borderTop:'4px solid var(--grey-dark-rgb)', 
                        boxShadow:20
                        }} >
                        <Box sx={{height:'150px',p:0,m:0, overflowY:'scroll',}} ref={chatBoxRef}>
                            {Object.entries(messagesToDisplay).map(([key, value]) => {
                                return(
                                <Box key={key} sx={{display:'flex',mb:1, justifyContent:'start'}}>
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
                    </Box>
                    <TextField
                        size="small"
                        ref={el => animatedElementsRef.push(el)} 
                        className='animate__animated animate__fadeInUp animate__faster chatSendMessageText'
                        sx={{
                            "& fieldset": { 
                                transition: 'var(--transition-fast-easeIn)',
                                pr:0,
                                borderWidth:'2px !important', 
                                borderColor: isMessageSentOk ? 'var(--green) !important' : 'var(--white) !important' 
                            },
                            input: {
                                color:'var(--white) !important',
                                fontSize:'13px',
                            },
                            pr:0,
                            position:'sticky', 
                            bottom:0, 
                            width:'100%', 
                            bgcolor:'var(--main-bg-color)'}}
                        placeholder={canSendMessage ? 'Envoyer un message' : cantSendMessageReason}
                        type="text"
                        id="chatSendMessageText"
                        value={messageToSend}  
                        onKeyPress={(ev) => {if (ev.key === 'Enter' && canSendMessage)  { sendMessage()}}}   
                        onChange={(e) => canSendMessage ? setMessageToSend(e.target.value): ''} 
                        InputProps={{
                            endAdornment: (
                                <LoadingButton 
                                    loading={isSendingMessage} onClick={(e) => sendMessage()}
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                        transition: 'var(--transition-fast-easeIn)',
                                        bgcolor: isMessageSentOk ? 'var(--green)' : '',
                                        borderColor: isMessageSentOk ? 'var(--green)' : 'var(--white)',
                                        color:'var(--white)'}} 
                                    position="end"
                                    >
                                        <Icon 
                                            icon='material-symbols:send'
                                            width='17'
                                         />
                                </LoadingButton>
                            ),
                        }} 
                    />
                </Grid>
            </Grid>
        </Box>
    )
};


export default Chat;