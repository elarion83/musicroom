import { Fab, Grid, Snackbar, Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
import React from "react";
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import CelebrationIcon from '@mui/icons-material/Celebration';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import FavoriteIcon from '@mui/icons-material/Favorite';

import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ShareIcon from '@mui/icons-material/Share';
import TuneIcon from '@mui/icons-material/Tune';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import Badge from '@mui/material/Badge';

import { Icon } from '@iconify/react';

const BottomInteractions = ({ roomParams,userCanMakeInteraction, createNewRoomInteraction, setOpenAddToPlaylistModal, handleOpenRoomParamModal,handleOpenShareModal,handleOpenLeaveRoomModal, OpenAddToPlaylistModal, checkRoomExist, checkInterractionLength }) => {

    return(
        <Grid className='room_bottom_interactions' item xs={3}>
            <Tooltip className='animate__animated animate__fadeInUp animate__delay-2s animate__faster' title={!userCanMakeInteraction ? "Toutes les "+  (roomParams.interactionFrequence/1000) +" secondes": ''}>  
                <Fab size="small" variant="extended" className='room_small_button_interactions' sx={{ mr:1, ...(userCanMakeInteraction && {bgcolor: 'orange'}) }} onClick={(e) => userCanMakeInteraction ? createNewRoomInteraction('laugh') : ''}>
                    <EmojiEmotionsIcon fontSize="small" sx={{color:'var(--white)'}} />
                    {!userCanMakeInteraction && <HourglassBottomIcon className="icon_overlay"/>}
                </Fab>
            </Tooltip>
            <Tooltip className='animate__animated animate__fadeInUp animate__delay-2s animate__fast' title={!userCanMakeInteraction ? "Toutes les "+  (roomParams.interactionFrequence/1000) +" secondes": ''}>  
                <Fab size="small" variant="extended" className='room_small_button_interactions' sx={{mr:1, ...(userCanMakeInteraction && {bgcolor: '#ff9c22 !important'}) }} onClick={(e) => userCanMakeInteraction ? createNewRoomInteraction('party') : ''}>
                    <CelebrationIcon fontSize="small" sx={{color:'var(--white)'}} />
                    {!userCanMakeInteraction && <HourglassBottomIcon className="icon_overlay"/>}
                </Fab>
            </Tooltip>
            <Tooltip className='animate__animated animate__fadeInUp animate__delay-2s' title={!userCanMakeInteraction ? "Toutes les "+  (roomParams.interactionFrequence/1000) +" secondes": ''}>  
                <Fab size="small" variant="extended" className='room_small_button_interactions' sx={{ mr:0, ...(userCanMakeInteraction && {bgcolor: '#ff5722 !important'}) }} onClick={(e) => userCanMakeInteraction ? createNewRoomInteraction('heart') : ''}>
                    <FavoriteIcon fontSize="small" sx={{color:'var(--white)'}} />
                    {!userCanMakeInteraction && <HourglassBottomIcon className="icon_overlay"/>}
                </Fab>
            </Tooltip>

            <Tooltip className='animate__animated animate__fadeInUp animate__delay-1s' placement="top" open={checkRoomExist && !OpenAddToPlaylistModal ? true : false} sx={{mt:-2}} title="Ajouter à la playlist" arrow>
                <Fab sx={{width:'56px',height:'56px', transform:'translateY(-20px) !important'}} color="primary" className={`main_bg_color `} aria-label="add" onClick={(e) => setOpenAddToPlaylistModal(true)}>
                    <Icon className='addMediaIcon' icon="iconoir:music-double-note-add" />
                </Fab>
            </Tooltip>
            
            <Tooltip className='animate__animated animate__fadeInUp animate__delay-2s' title="Paramètres">  
            <Badge invisible={roomParams.spotifyIsLinked} variant="dot" sx={{'& .MuiBadge-badge': {
                    right:'10px',
                    bgcolor:'#ff5722',
                    zIndex:10000
                }}} >
                <Fab size="small" variant="extended" className='room_small_button_interactions'  sx={{justifyContent: 'center', ml:0}} onClick={e => handleOpenRoomParamModal(true)} >
                    <TuneIcon  fontSize="small" />
                </Fab>
            </Badge>
            </Tooltip>
            <Tooltip className='animate__animated animate__fadeInUp animate__delay-2s animate__fast' title="Partager la room">  
                <Fab size="small" variant="extended" className='room_small_button_interactions'  sx={{justifyContent: 'center', ml:1}} onClick={e => handleOpenShareModal(true)} >
                    <ShareIcon  fontSize="small" />
                </Fab>
            </Tooltip>
            <Tooltip className='animate__animated animate__fadeInUp animate__delay-2s animate__faster' title="Quitter la room">  
                <Fab size="small" variant="extended" className='room_small_button_interactions'  sx={{justifyContent: 'center', ml:1}} onClick={e => handleOpenLeaveRoomModal(true)} >
                    <ExitToAppIcon  fontSize="small" />
                </Fab>
            </Tooltip>
            {checkInterractionLength && <Snackbar
                key = {roomParams.interactionsArray[roomParams.interactionsArray.length-1].timestamp+'_'+roomParams.interactionsArray[roomParams.interactionsArray.length-1].createdBy}
                open={ (((Date.now() - roomParams.interactionsArray[roomParams.interactionsArray.length-1].timestamp) < 1000)) ? true:false}
                autoHideDuration={1000}
                sx={{borderRadius:'2px'}}
                message= {roomParams.interactionsArray[roomParams.interactionsArray.length-1].createdBy +' a réagi :'+roomParams.interactionsArray[roomParams.interactionsArray.length-1].type+':' }
            />}
            <Snackbar
                open={((Date.now() - roomParams.spotifyTokenTimestamp) < 8000) && roomParams.spotifyAlreadyHaveBeenLinked}
                autoHideDuration={8000}
                sx={{bgcolor:'#2e7d32 !important', borderRadius:'2px'}}
                message={roomParams.spotifyIsLinked ? roomParams.spotifyUserConnected + " a ajouté Spotify a la room !" : "La connexion spotify a expirée"}
                action = {
                    <Button variant="extended" className='room_small_button_interactions' sx={{mr:1, ...(userCanMakeInteraction && {bgcolor: '#ff9c22 !important'}), ...(!roomParams.spotifyIsLinked && {display:'none'}) }} onClick={(e) => userCanMakeInteraction ? createNewRoomInteraction('party') : ''}>
                        <CelebrationIcon fontSize="small" sx={{color:'var(--white)'}} />
                    </Button>
                }
            />
        </Grid>
    )
};

export default BottomInteractions;