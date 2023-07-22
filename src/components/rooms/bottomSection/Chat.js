import CelebrationIcon from '@mui/icons-material/Celebration';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import { Box, Fab, Grid, TextField, Tooltip, Typography } from "@mui/material";
import React, { useRef, useState } from "react";

import { Icon } from '@iconify/react';

import ViewModuleIcon from '@mui/icons-material/ViewModule';
import { LoadingButton } from "@mui/lab";
import { db } from '../../../services/firebase';

import { returnAnimateReplace } from '../../../services/animateReplace';

import { withTranslation } from 'react-i18next';

const Chat = ({t, layoutDisplay, setLayoutdisplay, roomParams, currentUser, roomId, userCanMakeInteraction,createNewRoomInteraction, hideTchat}) => {

    const [isChatUltraExpanded, setIsChatUltraExpanded] = useState(false);
    const chatBoxRef = useRef([]);
    const animatedElementsRef = [];
    const scrollToLastMessage = () => {
        const lastChildElement = chatBoxRef.current?.lastElementChild;
        lastChildElement?.scrollIntoView({ behavior: 'smooth' });
    };

    const [alreadyScrolledOnInit, setAlreadyScrolledOnInit] = useState(false);

    const [messagesToDisplay, setMessagesToDisplay] = useState({});
    db.collection(process.env.REACT_APP_MESSAGE_COLLECTION).where('roomId', '==', roomId).orderBy("timestamp", "asc").get().then((querySnapshot) => {
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
            setCantSendMessageReason(t('GeneralWait')+' '+sendMessageTimeToWait+' '+t('GeneralSeconds'));
            db.collection(process.env.REACT_APP_MESSAGE_COLLECTION).add({
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
                    setCantSendMessageReason(t('GeneralWait')+' '+sendMessageTimeToWait+' '+t('GeneralSeconds'));
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
            <Grid container spacing={2} sx={{alignItems:'end'}}>
                <Grid item xs={2} md={1} 
                sx={{display:'flex', flexDirection:'column', 
                justifyContent:'space-between', alignItems:'center'}}>
                    {layoutDisplay !== 'interactive' && <Tooltip  ref={el => animatedElementsRef.push(el)} className='animate__animated animate__fadeInLeft animate__faster' title={t('RoomBottomButtonChatHide')}>  
                        <Fab size="small" variant="extended" className='room_small_button_interactions'  
                            sx={{justifyContent: 'center', ml:0}} onClick={e => hideTchatInComp()} >
                            <Icon icon="tabler:messages-off" width='20' />
                        </Fab>
                    </Tooltip>}
                    {layoutDisplay === 'interactive' && <Tooltip  ref={el => animatedElementsRef.push(el)} className='animate__animated animate__fadeInLeft animate__faster' title={t('RoomBottomButtonChatHide')}>  
                        <Fab size="small" variant="extended" className='room_small_button_interactions'  
                            sx={{justifyContent: 'center', ml:0}} onClick={e => setLayoutdisplay('default')} >
                            <ViewModuleIcon sx={{color:'rgb(25, 118, 210)'}} />
                        </Fab>
                    </Tooltip>}
                    <Tooltip  ref={el => animatedElementsRef.push(el)} className={!roomParams.interactionsAllowed ? 'hiddenButPresent' : 'animate__animated animate__fadeInLeft animate__fast'}
                        title={!userCanMakeInteraction ? t('GeneralEvery')+' '+ (roomParams.interactionFrequence/1000)  +" "+t('GeneralSeconds'): ''}>  
                        <Fab size="small" variant="extended" className='room_small_button_interactions' sx={{ mt:1,mr:0, ...(userCanMakeInteraction && {bgcolor: 'orange'}) }} onClick={(e) => userCanMakeInteraction ? createNewRoomInteraction('laugh') : ''}>
                            <EmojiEmotionsIcon fontSize="small" sx={{color:'var(--white)'}} />
                            {!userCanMakeInteraction && <HourglassBottomIcon className="icon_overlay"/>}
                        </Fab>
                    </Tooltip>
                    <Tooltip  ref={el => animatedElementsRef.push(el)} className={!roomParams.interactionsAllowed ? 'hiddenButPresent' : 'animate__animated animate__fadeInLeft '}
                        title={!userCanMakeInteraction ? t('GeneralEvery')+' '+ (roomParams.interactionFrequence/1000)  +" "+t('GeneralSeconds'): ''}>  
                        <Fab size="small" variant="extended" className='room_small_button_interactions' sx={{mt:1,mr:0, ...(userCanMakeInteraction && {bgcolor: '#ff9c22 !important'}) }} onClick={(e) => userCanMakeInteraction ? createNewRoomInteraction('party') : ''}>
                            <CelebrationIcon fontSize="small" sx={{color:'var(--white)'}} />
                            {!userCanMakeInteraction && <HourglassBottomIcon className="icon_overlay"/>}
                        </Fab>
                    </Tooltip>
                    <Tooltip  ref={el => animatedElementsRef.push(el)} className={!roomParams.interactionsAllowed ? 'hiddenButPresent' : 'animate__animated animate__fadeInLeft'}
                        title={!userCanMakeInteraction ? t('GeneralEvery')+' '+ (roomParams.interactionFrequence/1000)  +" "+t('GeneralSeconds'): ''}>  
                        <Fab size="small" variant="extended" className='room_small_button_interactions' sx={{ mt:1,mr:0, ...(userCanMakeInteraction && {bgcolor: 'var(--red-2) !important'}) }} onClick={(e) => userCanMakeInteraction ? createNewRoomInteraction('heart') : ''}>
                            <FavoriteIcon fontSize="small" sx={{color:'var(--white)'}} />
                            {!userCanMakeInteraction && <HourglassBottomIcon className="icon_overlay"/>}
                        </Fab>
                    </Tooltip>  
                </Grid>
                <Grid item xs={10} md={11} sx={{pr:'4vw'}} 
                className="chatBoxGrid" >
                    <Box 
                    ref={el => animatedElementsRef.push(el)} 
                    className='animate__animated animate__fadeInUp animate__fast chatBox' 
                    sx={{
                        bgcolor:isChatUltraExpanded ? 'rgba(var(--grey-dark-rgb) ,0.9)': 'rgba(var(--grey-dark-rgb) ,0.8)' , 
                        p:1,
                        borderTop:'4px solid var(--grey-dark-rgb)', 
                        boxShadow:20
                        }} >
                        <Box sx={{height:isChatUltraExpanded ? '70vh': '150px',p:0,m:0, overflowY:'scroll', transition:'var(--transition-smooth-all)'}} ref={chatBoxRef}>
                            <Box key='welCome' sx={{display:'flex',mb:1, justifyContent:'start'}}>
                                <Typography fontSize='small' sx={{color:'var(--grey-light)', fontWeight:'bold'}}> 
                                    {t('RoomChatWelcomeMessage')}
                                </Typography>
                            </Box>
                            {Object.entries(messagesToDisplay).map(([key, value]) => {
                                return(
                                <Box key={key} sx={{display:'flex',mb:1, justifyContent:'start'}}>
                                    <Typography fontSize='small' sx={{color:'var(--main-color)', fontWeight:'bold'}}> 
                                        {value.author}: 
                                    </Typography>
                                    <Typography fontSize='small' sx={{ml:1, color:'var(--white)'}}>
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
                                borderColor: isMessageSentOk ? 'var(--green) !important' : 'var(--grey-light) !important' 
                            },
                            input: {
                                color:'var(--white) !important',
                                fontSize:'13px',
                            },
                            pr:0,
                            position:'sticky', 
                            bottom:0, 
                            width:'100%', 
                            bgcolor:'rgba(var(--grey-dark-rgb) ,0.9)'
                            }}
                        placeholder={canSendMessage ? t('RoomChatPlaceholder') : cantSendMessageReason}
                        type="text"
                        id="chatSendMessageText"
                        value={messageToSend}  
                        onKeyPress={(ev) => {if (ev.key === 'Enter' && canSendMessage)  { sendMessage()}}}   
                        onChange={(e) => canSendMessage ? setMessageToSend(e.target.value): ''} 
                        InputProps={{
                            startAdornment: (
                                <Box sx={{
                                    pr:'7px',
                                    mr:2,
                                    ml:'-5px', 
                                    pt:'5px', 
                                    cursor:'pointer', 
                                    transition: 'var(--transition-fast-easeIn)',
                                    borderRight:'1px solid var(--grey-light)',
                                    borderColor: isMessageSentOk ? 'var(--green)' : 'var(--grey-light)',
                                    }}>
                                        <Icon 
                                            onClick={(e) => setIsChatUltraExpanded(!isChatUltraExpanded)}
                                            icon={ isChatUltraExpanded ? 'material-symbols:unfold-less-double-rounded' :'material-symbols:unfold-more-double-rounded'}
                                            width='20'
                                            style={{
                                                transition: 'var(--transition-fast-easeIn)',
                                                color: isMessageSentOk ? 'var(--green)' : 'var(--grey-light)',
                                            }}
                                            />
                                </Box>
                            ),
                            endAdornment: (
                                <LoadingButton 
                                    loading={isSendingMessage || !canSendMessage} 
                                    onClick={(e) => sendMessage()}
                                    size="small"
                                    sx={{
                                        mr:-3,
                                        transition: 'var(--transition-fast-easeIn)',
                                        bgcolor: isMessageSentOk ? 'var(--green)' : '',
                                        borderColor: isMessageSentOk ? 'var(--green)' : 'var(--white)',
                                        color:'var(--white)'}} 
                                        position="end"
                                    >
                                        <Icon 
                                            icon='material-symbols:send'
                                            width='20'
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


export default withTranslation()(Chat);