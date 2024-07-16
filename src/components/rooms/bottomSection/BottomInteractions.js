import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import { Fab, Grid, Snackbar, Tooltip } from '@mui/material';
import React, { useEffect } from "react";

import TuneIcon from '@mui/icons-material/Tune';
import Badge from '@mui/material/Badge';
import Chat from './Chat';
import DisplayMenu from '../DisplayMenu';
import { Icon } from '@iconify/react';
import { useState } from 'react';

import {returnAnimateReplace } from '../../../services/animateReplace';
import { waitingTextReaction, GFontIcon, isEmpty } from '../../../services/utils';
import { notifsTextArray , reactsArray} from '../../../services/utilsArray';
import {CreateGoogleAnalyticsEvent} from '../../../services/googleAnalytics';

import { withTranslation } from 'react-i18next';
import { getLastNotif } from '../../../services/utilsRoom';

const BottomInteractions = ({ t,roomRef, layoutDisplay, setLayoutdisplay, paramDrawerIsOpen, handleOpenDrawerParam, currentUser, roomId, roomParams, roomNotifs,roomMessages, userCanMakeInteraction, createNewRoomInteraction, setOpenAddToPlaylistModal,checkNotificationsLength }) => {

    const [isChatExpanded, setIsChatExpanded] = useState(false);
    const [newMessages,setNewMessages] = useState(false);
    const [messagesCount, setMessagesCount] = useState(0);
    const [messagesReadedCount, setMessagesReadedCount] = useState(0);
    const animatedElementsRef = [];
    async function expandTchatAnimation() {
        returnAnimateReplace(animatedElementsRef, {In:"Out",Up:'Down', animate__delay:''}, /In|Up|animate__delay/gi);
        setTimeout(() => {
            setIsChatExpanded(true);
            CreateGoogleAnalyticsEvent('Actions','Expand chat','Expand chat');
        }, 500);
    }

    async function closeTchatFunc() {
        setNewMessages(false);
        setMessagesReadedCount(roomMessages.length);
        setIsChatExpanded(false);
    }

	useEffect(() => {
        if(!isEmpty(roomMessages)) {
            if(!isChatExpanded && (roomMessages.length != messagesCount)) {
                setNewMessages(true);
            }
            setMessagesCount(roomMessages.length)
        }
	}, [roomMessages]); 
    

    const lastNotifType = roomNotifs.length > 0 ? getLastNotif(roomNotifs).type : 'none';

    return(
        <Grid className={`room_bottom_interactions ${isChatExpanded ? "chatExpanded" : ""}`} >
            {(!isChatExpanded && layoutDisplay !== 'interactive') && <div>
                {Object.entries(reactsArray).map(([key, react]) => {
                    return(
                        <Tooltip 
                            key={key}
                            ref={el => animatedElementsRef.push(el)} 
                            className={!roomParams.interactionsAllowed ? 'hiddenButPresent' : react.animation}
                            title={!userCanMakeInteraction ? waitingTextReaction(roomParams.interactionFrequence): ''}>  
                            <Fab size="small" variant="extended" className='room_small_button_interactions' 
                                sx={{ ml:0.5, boxShadow:20,zIndex:99999,mr:0.5, ...(userCanMakeInteraction && {bgcolor: react.color}) }} 
                                onClick={(e) => userCanMakeInteraction ? createNewRoomInteraction(key) : ''}>
                                {react.icon}
                                {!userCanMakeInteraction && <HourglassBottomIcon className="icon_overlay"/>}
                            </Fab>
                        </Tooltip>
                    );
                })}
               
                <Fab ref={el => animatedElementsRef.push(el)}
                    sx={{width:'56px',height:'56px', mt:'-4em'}}
                    className='main_bg_color buttonBorder animate__animated animate__fadeInUp'
                    aria-label="add" onClick={(e) => setOpenAddToPlaylistModal(true)}>
                    <GFontIcon icon='format_list_bulleted_add' customClass='addMediaIcon' />
                </Fab>

                <Tooltip ref={el => animatedElementsRef.push(el)} className={!roomParams.isChatActivated ? 'hiddenButPresent' : 'animate__animated animate__fadeInUp animate__delay-1s'} title={t('RoomBottomButtonChatShow')}>  
                     <Badge  max={9} badgeContent={(messagesCount - messagesReadedCount)} slotProps={{ badge: { className: 'colorWhite fontFamilyNunito'} }} sx={{'& .MuiBadge-badge': {
                                            right:'5px',
                                            zIndex:1200,
                                            bgcolor:'var(--red-2)'
                                        }}}  invisible={!newMessages}>
                        <Fab size="small" variant="extended" className='room_small_button_interactions'  
                        sx={{justifyContent: 'center', ml:0}} onClick={e => expandTchatAnimation()} >
                        <Icon icon="tabler:messages" width='20'/>
                    </Fab>
                    </Badge>
                </Tooltip>

                <Tooltip ref={el => animatedElementsRef.push(el)} className='animate__animated animate__fadeInUp animate__delay-1s' title={t('RoomLeftMenuRoomParams')}>  
                   
                    <Fab size="small" variant="extended" className='room_small_button_interactions' 
                    sx={{justifyContent: 'center', ml:0.5}} onClick={e => handleOpenDrawerParam(!paramDrawerIsOpen)} >
                        <TuneIcon fontSize="small" />
                    </Fab>
                </Tooltip>
                <Tooltip  ref={el => animatedElementsRef.push(el)} className='animate__animated animate__fadeInUp animate__delay-1s'>  
                    <Fab size="small" variant="extended" className='room_small_button_interactions'  
                        sx={{justifyContent: 'center', ml:0.5}}  >
                        <DisplayMenu 
                            layoutDisplay={layoutDisplay}
                            setLayoutdisplay={setLayoutdisplay}
                        />
                    </Fab>
                </Tooltip>
            

            </div>}
            {(isChatExpanded || layoutDisplay === 'interactive') && 
                <Chat openAddToPlaylistModal={setOpenAddToPlaylistModal} roomRef={roomRef} currentUser={currentUser} layoutDisplay={layoutDisplay} setLayoutdisplay={setLayoutdisplay} roomId={roomId} createNewRoomInteraction={createNewRoomInteraction} userCanMakeInteraction={userCanMakeInteraction} roomParams={roomParams} className='chatBox' hideTchat={e => closeTchatFunc(false)} />
            }
            
            {checkNotificationsLength && (getLastNotif(roomNotifs).createdBy !== currentUser.displayName) && notifsTextArray[getLastNotif(roomNotifs).type] &&
                <Snackbar
                    open={((Date.now() - getLastNotif(roomNotifs).timestamp) < 2000)}
                    key={'notif'+getLastNotif(roomNotifs).timestamp}
                    autoHideDuration={2000}
                    sx={{ borderRadius:'2px'}}
                    message={ notifsTextArray[lastNotifType].replace('//AUTHOR//', getLastNotif(roomNotifs).createdBy)}
                />
            }

        </Grid>
    )
};

export default withTranslation()(BottomInteractions);