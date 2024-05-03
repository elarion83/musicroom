import CelebrationIcon from '@mui/icons-material/Celebration';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import { Fab, Grid, Snackbar, Tooltip } from '@mui/material';
import React from "react";

import TuneIcon from '@mui/icons-material/Tune';
import Badge from '@mui/material/Badge';
import Chat from './Chat';
import DisplayMenu from '../DisplayMenu';
import { Icon } from '@iconify/react';
import { useState } from 'react';

import {returnAnimateReplace } from '../../../services/animateReplace';

import { waitingTextReaction } from '../../../services/utils';
import {CreateGoogleAnalyticsEvent} from '../../../services/googleAnalytics';

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

    const reactsArray = {
        laugh: {
            name:'laugh',
            color:'orange',
            animation:'animate__animated animate__fadeInUp animate__delay-1s animate__faster',
            icon:<EmojiEmotionsIcon fontSize="small" sx={{color:'var(--white)'}} />
        },
        heart: {
            name:'heart',
            color:'var(--red-2) !important',
            animation:'animate__animated animate__fadeInUp animate__delay-1s',
            icon:<FavoriteIcon fontSize="small" sx={{color:'var(--white)'}} />
        },
        party: {
            name:'party',
            color:'#ff9c22 !important',
            animation:'animate__animated animate__fadeInUp animate__delay-1s animate__fast',
            icon:<CelebrationIcon fontSize="small" sx={{color:'var(--white)'}} />
        }
    }

    const notifsTextArray = {
        userArrived:'//AUTHOR// a rejoins la room !',
        userLeaved: '//AUTHOR// a quitté la room !',
        userSync:'//AUTHOR// s\'est synchronisé!',
        userUnSync: '//AUTHOR// s\'est désynchronisé!',
        AccNotPremium: "Le compte utilisé n'est pas premium."
    };  

    const lastNotifType = roomNotifs.length > 0 ? roomNotifs[roomNotifs.length - 1].type : 'none';
    
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
                                sx={{ ml:1, boxShadow:20,mr:1, ...(userCanMakeInteraction && {bgcolor: react.color}) }} 
                                onClick={(e) => userCanMakeInteraction ? createNewRoomInteraction(key) : ''}>
                                {react.icon}
                                {!userCanMakeInteraction && <HourglassBottomIcon className="icon_overlay"/>}
                            </Fab>
                        </Tooltip>
                    );
                })}
               
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
                    <Badge invisible={roomParams.spotify.IsLinked} variant="dot" sx={{'& .MuiBadge-badge': {
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
            {(isChatExpanded || layoutDisplay === 'interactive') && 
                <Chat currentUser={currentUser} layoutDisplay={layoutDisplay} setLayoutdisplay={setLayoutdisplay} roomId={roomId} createNewRoomInteraction={createNewRoomInteraction} userCanMakeInteraction={userCanMakeInteraction} roomParams={roomParams} className='chatBox' hideTchat={e => setIsChatExpanded(false)} />
            }
            
            {checkNotificationsLength && (roomNotifs[roomNotifs.length - 1].createdBy !== currentUser.displayName) && notifsTextArray[roomNotifs[roomNotifs.length - 1].type] &&
                <Snackbar
                    open={((Date.now() - roomNotifs[roomNotifs.length - 1].timestamp) < 2000)}
                    key={'notif'+roomNotifs[roomNotifs.length - 1].timestamp}
                    autoHideDuration={2000}
                    sx={{ borderRadius:'2px'}}
                    message={ notifsTextArray[lastNotifType].replace('//AUTHOR//', roomNotifs[roomNotifs.length - 1].createdBy)}
                />
            }
            <Snackbar
                open={((Date.now() - roomParams.spotify.TokenTimestamp) < 8000) && roomParams.spotify.AlreadyHaveBeenLinked}
                autoHideDuration={8000}
                sx={{ borderRadius:'2px'}}
                message={roomParams.spotify.IsLinked ? roomParams.spotify.UserConnected + " a ajouté Spotify a la room !" : "La connexion Spotify a expirée"}
            />


            <Snackbar
                open={((Date.now() - roomParams.deezer.TokenTimestamp) < 8000) && roomParams.deezer.AlreadyHaveBeenLinked}
                autoHideDuration={8000}
                sx={{ borderRadius:'2px'}}
                message={roomParams.deezer.IsLinked ? roomParams.deezer.UserConnected + " a ajouté Deezer a la room !" : "La connexion Deezer a expirée"}
            />
        </Grid>
    )
};

export default withTranslation()(BottomInteractions);