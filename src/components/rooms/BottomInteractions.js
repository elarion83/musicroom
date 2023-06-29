import CelebrationIcon from '@mui/icons-material/Celebration';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import { Box, Fab, Grid, Snackbar, Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
import React from "react";

import TuneIcon from '@mui/icons-material/Tune';
import Badge from '@mui/material/Badge';
import Chat from './Chat';
import DisplayMenu from './DisplayMenu';
import { Icon } from '@iconify/react';
import { useState } from 'react';

import {returnAnimateReplace } from './../../services/animateReplace';

import {CreateGoogleAnalyticsEvent} from './../../services/googleAnalytics';

import { withTranslation } from 'react-i18next';

const BottomInteractions = ({ t, layoutDisplay, setLayoutdisplay, paramDrawerIsOpen, handleOpenDrawerParam, currentUser, roomId, roomParams, roomNotifs, userCanMakeInteraction, createNewRoomInteraction, setOpenAddToPlaylistModal,handleOpenShareModal,handleOpenLeaveRoomModal, OpenAddToPlaylistModal, checkRoomExist, checkInterractionLength,checkNotificationsLength }) => {

    const [isChatExpanded, setIsChatExpanded] = useState(false);
    const animatedElementsRef = [];

    async function expandTchatAnimation() {
        returnAnimateReplace(animatedElementsRef, {In:"Out",Up:'Down', animate__delay:''}, /In|Up|animate__delay/gi);
        setTimeout(() => {
            setIsChatExpanded(true);
            CreateGoogleAnalyticsEvent('Actions','Expand chat','Expand chat');
        }, 500);
    }

    return(
        <Grid 
         className={`room_bottom_interactions ${isChatExpanded ? "chatExpanded" : ""}`}
        >
            
            {!isChatExpanded && <div>
                <Tooltip 
                    ref={el => animatedElementsRef.push(el)} 
                    className={!roomParams.interactionsAllowed ? 'hiddenButPresent' : 'animate__animated animate__fadeInUp animate__delay-1s animate__faster'}
                    title={!userCanMakeInteraction ? t('GeneralEvery')+' '+ (roomParams.interactionFrequence/1000) +" "+t('GeneralSeconds'): ''}>  
                    <Fab size="small" variant="extended" className='room_small_button_interactions' 
                        sx={{ ml:1, boxShadow:20,mr:1, ...(userCanMakeInteraction && {bgcolor: 'orange'}) }} 
                        onClick={(e) => userCanMakeInteraction ? createNewRoomInteraction('laugh') : ''}>
                        <EmojiEmotionsIcon fontSize="small" sx={{color:'var(--white)'}} />
                        {!userCanMakeInteraction && <HourglassBottomIcon className="icon_overlay"/>}
                    </Fab>
                </Tooltip>
                <Tooltip ref={el => animatedElementsRef.push(el)} className={!roomParams.interactionsAllowed ? 'hiddenButPresent' : 'animate__animated animate__fadeInUp animate__delay-1s animate__fast'}
                    title={!userCanMakeInteraction ? t('GeneralEvery')+' '+ (roomParams.interactionFrequence/1000) +" "+t('GeneralSeconds'): ''}>  
                    <Fab size="small" variant="extended" className='room_small_button_interactions' 
                        sx={{mr:1, ...(userCanMakeInteraction && {bgcolor: '#ff9c22 !important'}) }} 
                        onClick={(e) => userCanMakeInteraction ? createNewRoomInteraction('party') : ''}>
                        <CelebrationIcon fontSize="small" sx={{color:'var(--white)'}} />
                        {!userCanMakeInteraction && <HourglassBottomIcon className="icon_overlay"/>}
                    </Fab>
                </Tooltip>
                <Tooltip ref={el => animatedElementsRef.push(el)} className={!roomParams.interactionsAllowed ? 'hiddenButPresent' : 'animate__animated animate__fadeInUp animate__delay-1s '}
                    title={!userCanMakeInteraction ? t('GeneralEvery')+' '+ (roomParams.interactionFrequence/1000) +" "+t('GeneralSeconds'): ''}>  
                    <Fab size="small" variant="extended" className='room_small_button_interactions' 
                        sx={{ mr:0, ...(userCanMakeInteraction && {bgcolor: 'var(--red-2) !important'}) }} 
                        onClick={(e) => userCanMakeInteraction ? createNewRoomInteraction('heart') : ''}>
                        <FavoriteIcon fontSize="small" sx={{color:'var(--white)'}} />
                        {!userCanMakeInteraction && <HourglassBottomIcon className="icon_overlay"/>}
                    </Fab>
                </Tooltip>

                <Fab ref={el => animatedElementsRef.push(el)}
                    sx={{width:'56px',height:'56px', mt:'-4em'}}
                    className='main_bg_color animate__animated animate__fadeInUp'
                    aria-label="add" onClick={(e) => setOpenAddToPlaylistModal(true)}>
                    <Icon className='addMediaIcon' icon="iconoir:music-double-note-add" />
                </Fab>

                <Tooltip ref={el => animatedElementsRef.push(el)} className={!roomParams.isChatActivated ? 'hiddenButPresent' : 'animate__animated animate__fadeInUp animate__delay-1s'} title={t('RoomBottomButtonChatShow')}>  
                    <Fab size="small" variant="extended" className='room_small_button_interactions'  
                        sx={{justifyContent: 'center', ml:0}} onClick={e => expandTchatAnimation()} >
                        <Icon icon="tabler:messages" width='20'/>
                    </Fab>
                </Tooltip>
                <Tooltip ref={el => animatedElementsRef.push(el)} className='animate__animated animate__fadeInUp animate__delay-1s' title={t('RoomLeftMenuRoomParams')}>  
                    <Badge invisible={roomParams.spotifyIsLinked} variant="dot" sx={{'& .MuiBadge-badge': {
                            right:'10px',
                            bgcolor:'var(--red-2)',
                            zIndex:10000
                        }}} >
                        <Fab size="small" variant="extended" className='room_small_button_interactions' 
                        sx={{justifyContent: 'center', ml:1}} onClick={e => handleOpenDrawerParam(!paramDrawerIsOpen)} >
                            <TuneIcon fontSize="small" />
                        </Fab>
                    </Badge>
                </Tooltip>
                <Tooltip  ref={el => animatedElementsRef.push(el)} className='animate__animated animate__fadeInUp animate__delay-1s'>  
                    <Fab size="small" variant="extended" className='room_small_button_interactions'  
                        sx={{justifyContent: 'center', ml:1}}  >
                        <DisplayMenu 
                            layoutDisplay={layoutDisplay}
                            setLayoutdisplay={setLayoutdisplay}
                        />
                    </Fab>
                </Tooltip>
            

            </div>}
            {isChatExpanded && 
                <Chat currentUser={currentUser} roomId={roomId} createNewRoomInteraction={createNewRoomInteraction} userCanMakeInteraction={userCanMakeInteraction} roomParams={roomParams} className='chatBox' hideTchat={e => setIsChatExpanded(false)} />
            }
            
           
            
            {checkNotificationsLength && roomNotifs[roomNotifs.length - 1].type === 'userArrived' && 
                (roomNotifs[roomNotifs.length - 1].createdBy !== currentUser.displayName) && 
                <Snackbar
                open={((Date.now() - roomNotifs[roomNotifs.length - 1].timestamp) < 2000)}
                key={'notif'+roomNotifs[roomNotifs.length - 1].timestamp}
                autoHideDuration={2000}
                sx={{ borderRadius:'2px'}}
                message={roomNotifs[roomNotifs.length - 1].createdBy+" a rejoins la room !"}
            />}
            {checkNotificationsLength && roomNotifs[roomNotifs.length - 1].type === 'userLeaved' && 
                (roomNotifs[roomNotifs.length - 1].createdBy !== currentUser.displayName) && 
                <Snackbar
                open={((Date.now() - roomNotifs[roomNotifs.length - 1].timestamp) < 2000)}
                key={'notif'+roomNotifs[roomNotifs.length - 1].timestamp}
                autoHideDuration={2000}
                sx={{ borderRadius:'2px'}}
                message={roomNotifs[roomNotifs.length - 1].createdBy+" a quitté la room !"}
            />}
            {checkNotificationsLength && roomNotifs[roomNotifs.length - 1].type === 'userSync' && 
                (roomNotifs[roomNotifs.length - 1].createdBy !== currentUser.displayName) && 
                <Snackbar
                open={((Date.now() - roomNotifs[roomNotifs.length - 1].timestamp) < 2000)}
                key={'notif'+roomNotifs[roomNotifs.length - 1].timestamp}
                autoHideDuration={2000}
                sx={{ borderRadius:'2px'}}
                message={roomNotifs[roomNotifs.length - 1].createdBy+" s'est synchronisé!"}
            />}
            {checkNotificationsLength && roomNotifs[roomNotifs.length - 1].type === 'userUnSync' && 
                (roomNotifs[roomNotifs.length - 1].createdBy !== currentUser.displayName) && 
                <Snackbar
                open={((Date.now() - roomNotifs[roomNotifs.length - 1].timestamp) < 2000)}
                key={'notif'+roomNotifs[roomNotifs.length - 1].timestamp}
                autoHideDuration={2000}
                sx={{ borderRadius:'2px'}}
                message={roomNotifs[roomNotifs.length - 1].createdBy+" s'est désynchronisé !"}
            />}

            <Snackbar
                open={((Date.now() - roomParams.spotifyTokenTimestamp) < 8000) && roomParams.spotifyAlreadyHaveBeenLinked}
                autoHideDuration={8000}
                sx={{ borderRadius:'2px'}}
                message={roomParams.spotifyIsLinked ? roomParams.spotifyUserConnected + " a ajouté Spotify a la room !" : "La connexion spotify a expirée"}
            />
        </Grid>
    )
};

export default withTranslation()(BottomInteractions);