import CelebrationIcon from '@mui/icons-material/Celebration';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import { Box, Fab, Grid, TextField, Tooltip, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

import { Icon } from '@iconify/react';

import ViewModuleIcon from '@mui/icons-material/ViewModule';
import { LoadingButton } from "@mui/lab";
import { db } from '../../../services/firebase';

import { returnAnimateReplace } from '../../../services/animateReplace';
import { waitingTextReaction, waitingTextChat, GFontIcon, delay } from '../../../services/utils';
import { withTranslation } from 'react-i18next';
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { createMessageObject } from '../../../services/utilsArray';
import UserParamModal from '../../generalsTemplates/modals/UserParamModal';


const Chat = ({t, roomRef, roomParams, currentUser, roomId, userCanMakeInteraction,createNewRoomInteraction, hideTchat, openAddToPlaylistModal}) => {

    const [isChatUltraExpanded, setIsChatUltraExpanded] = useState(false);
    const chatBoxRef = useRef([]);
    const animatedElementsRef = [];
    const scrollToLastMessage = () => {
        const lastChildElement = chatBoxRef.current?.lastElementChild;
        lastChildElement?.scrollIntoView({ behavior: 'smooth' });
    };

    const [messagesToDisplay, setMessagesToDisplay] = useState({});

	useEffect(() => {
        const chatUpdate = onSnapshot(roomRef, (doc) => {
            setMessagesToDisplay(doc.data().messagesArray);
            scrollToLastMessage();
        });
        return () => chatUpdate();
	}, [roomRef]); 

    const [messageToSend, setMessageToSend] = useState('');
    const [isSendingMessage, setIsSendingMessage] = useState(false);
    const [isMessageSentOk, setIsMessageSentOk] = useState(false);
    const [canSendMessage, setCanSendMessage] = useState(true);
    var sendMessageTimeToWait = 5;
    const [cantSendMessageReason, setCantSendMessageReason] = useState('');
        
    const [userParamModalOpen, setUserParamModalOpen] = useState(false);
    const [userInfoModalDatas, setUserInfoModalDatas] = useState(null);

    async function resetChatAfterMessage() {
        scrollToLastMessage();
        setMessageToSend('');
        setIsSendingMessage(false);
        setCanSendMessage(false);
        setIsMessageSentOk(true);
        setTimeout(() => {
            setIsMessageSentOk(false);
        }, 1500);

        var waitingLoop = setInterval(function() {
            sendMessageTimeToWait--;
            setCantSendMessageReason(waitingTextChat(sendMessageTimeToWait));
            if (sendMessageTimeToWait === 0) {
                setCanSendMessage(true);
                sendMessageTimeToWait = 5;
                clearInterval(waitingLoop);
            }
        }, 1000);
    }

    const sendMessage = async () => {
        if(messageToSend.length > 0) {
            setIsSendingMessage(true);
            setCantSendMessageReason(waitingTextChat(sendMessageTimeToWait));
            var messageObject = createMessageObject(currentUser, roomId, messageToSend);
            updateDoc(roomRef, {
                messagesArray: arrayUnion(messageObject)
            }).then(() => {
                resetChatAfterMessage();
            });
              
        } 
    }
    async function hideTchatInComp() {
        returnAnimateReplace(animatedElementsRef, {In:"Out", Up:"Down", animate__delay:''}, /In|Up|animate__delay/gi);
        await delay(500);
        hideTchat();
    }

    async function showUserInfo(userUid) {
        let userRef = doc(db, process.env.REACT_APP_USERS_COLLECTION, userUid);
        await getDoc(userRef).then(async (userFirebaseData) => {
            var userDatas= {
                customDatas:userFirebaseData.data()
            };
            setUserInfoModalDatas(userDatas);
            await delay(500);
            setUserParamModalOpen(true);
        });
    }

	useEffect(() => {
        scrollToLastMessage();
	}, [isChatUltraExpanded]); 

    return(
        <Box sx={{ flexGrow: 1 , pl:1, pr:1, mb:1}}>
            <Grid container spacing={2} sx={{alignItems:'end'}}>
                <Grid item xs={2} md={1} sx={{display:'flex', flexDirection:'column',justifyContent:'space-between',gap:'5px', paddingTop:'0px !important',alignItems:'center'}}>

                    <Fab ref={el => animatedElementsRef.push(el)} size="small" variant="extended" className='animate__animated animate__fadeInLeft animate__faster room_small_button_interactions main_bg_color'  
                        sx={{justifyContent: 'center', ml:0, mb:0.5}} onClick={e => openAddToPlaylistModal(true)} >
                        <GFontIcon icon='format_list_bulleted_add' width='20'/>
                    </Fab>
                                        
                    <Tooltip  ref={el => animatedElementsRef.push(el)} className={!roomParams.interactionsAllowed ? 'hiddenButPresent' : 'animate__animated animate__fadeInLeft animate__fast'}
                        title={!userCanMakeInteraction ? waitingTextReaction(roomParams.interactionFrequence): ''}>  
                        <Fab size="small" variant="extended" className='room_small_button_interactions' sx={{ mt:1,mr:0, ...(userCanMakeInteraction && {bgcolor: 'orange'}) }} onClick={(e) => userCanMakeInteraction ? createNewRoomInteraction('laugh') : ''}>
                            <EmojiEmotionsIcon fontSize="small" className="colorWhite" />
                            {!userCanMakeInteraction && <HourglassBottomIcon className="icon_overlay"/>}
                        </Fab>
                    </Tooltip>
                    <Tooltip  ref={el => animatedElementsRef.push(el)} className={!roomParams.interactionsAllowed ? 'hiddenButPresent' : 'animate__animated animate__fadeInLeft '}
                        title={!userCanMakeInteraction ? waitingTextReaction(roomParams.interactionFrequence): ''}>  
                        <Fab size="small" variant="extended" className='room_small_button_interactions' sx={{mt:1,mr:0, ...(userCanMakeInteraction && {bgcolor: '#ff9c22 !important'}) }} onClick={(e) => userCanMakeInteraction ? createNewRoomInteraction('party') : ''}>
                            <CelebrationIcon fontSize="small" className="colorWhite" />
                            {!userCanMakeInteraction && <HourglassBottomIcon className="icon_overlay"/>}
                        </Fab>
                    </Tooltip>
                    <Tooltip  ref={el => animatedElementsRef.push(el)} className={!roomParams.interactionsAllowed ? 'hiddenButPresent' : 'animate__animated animate__fadeInLeft'}
                        title={!userCanMakeInteraction ? waitingTextReaction(roomParams.interactionFrequence): ''}>  
                        <Fab size="small" variant="extended" className='room_small_button_interactions' sx={{ mt:1,mr:0, ...(userCanMakeInteraction && {bgcolor: 'var(--red-2) !important'}) }} onClick={(e) => userCanMakeInteraction ? createNewRoomInteraction('heart') : ''}>
                            <FavoriteIcon fontSize="small" className="colorWhite" />
                            {!userCanMakeInteraction && <HourglassBottomIcon className="icon_overlay"/>}
                        </Fab>
                    </Tooltip> 
                    
                    <Tooltip  ref={el => animatedElementsRef.push(el)} className='animate__animated animate__fadeInLeft animate__faster' title={t('RoomBottomButtonChatHide')}>  
                        <Fab size="small" variant="extended" className='room_small_button_interactions'  
                            sx={{justifyContent: 'center', ml:0, mt:1}} onClick={e => hideTchatInComp()} >
                            <Icon icon="tabler:messages-off" width='20' />
                        </Fab>
                    </Tooltip>
                </Grid>
                <Grid item xs={10} md={11} sx={{pr:'4vw'}} 
                className="chatBoxGrid" >
                    <Box 
                    ref={el => animatedElementsRef.push(el)} 
                    className='animate__animated animate__fadeInUp animate__fast chatBox' 
                    sx={{
                        bgcolor:'rgba(var(--grey-dark-rgb) ,0.95)',
                        p:1,
                        borderTop:'4px solid var(--grey-dark-rgb)', 
                        boxShadow:20
                        }} >
                        <Box sx={{height:isChatUltraExpanded ? '70vh': '180px',p:0,m:0, overflowY:'scroll', transition:'var(--transition-smooth-all)'}} ref={chatBoxRef}>
                            <Box key='welCome' sx={{display:'flex',mb:1, justifyContent:'start'}}>
                                <Typography fontSize='small' sx={{color:'var(--grey-light)', fontWeight:'bold'}}> 
                                    {t('RoomChatWelcomeMessage')}
                                </Typography>
                            </Box>
                            {Object.entries(messagesToDisplay).map(([key, value]) => {
                                var messageColor = value.authorColor ?? 'var(--main-color)';
                                return(
                                <Box key={key} sx={{display:'flex',mb:1, justifyContent:'start'}}>
                                    <Typography fontSize='small' sx={{cursor:'pointer', color:messageColor, fontWeight:'bold'}} onClick={(e) => showUserInfo(value.authorUid)}> 
                                        {value.author}: 
                                    </Typography>
                                    <Typography fontSize='small' className='colorWhite' sx={{ml:1}}>
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
                                    className='sendMessageButton'
                                    sx={{
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
            <UserParamModal open={userParamModalOpen} changeOpen={setUserParamModalOpen} user={userInfoModalDatas} ownProfile={false} />

        </Box>
    )
};


export default withTranslation()(Chat);