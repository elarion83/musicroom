import { useState } from "react";

import { Icon } from '@iconify/react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import InfoIcon from '@mui/icons-material/Info';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import ShareIcon from '@mui/icons-material/Share';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import TuneIcon from '@mui/icons-material/Tune';
import { Divider, Drawer, Grid, List, ListItem, ListItemButton, Typography } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Badge from '@mui/material/Badge';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPrevious from '@mui/icons-material/SkipPrevious';
import ListItemIcon from '@mui/material/ListItemIcon';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import 'animate.css';


const RoomTopBar = ({
                isShowSticky,
                handlePlay,
                isAdminView,
                room,
                handleChangeActuallyPlaying,
                isSpotifyAndIsNotPlayableBySpotify,
                handleChangeIdActuallyPlaying,
                paramDrawerIsOpen, handleOpenDrawerParam, roomId, roomAdmin, isLinkedToSpotify,handleOpenRoomParamModal,handleOpenShareModal,handleOpenLeaveRoomModal, }) => {

  return (
    <AppBar sx={{position: (isShowSticky) ? "fixed": 'initial', top:0, bgcolor: 'var(--grey-dark)',borderBottom: '2px solid var(--border-color)'}} >
        
        <Toolbar xs={12} sx={{ minHeight: '45px !important', fontFamily: 'Monospace', pl:'5px', 
        pr:(isShowSticky)? 0: '25 px' }}>
                <Drawer
            id="menu-appbar"
            anchor='left'
            onClick={(e) => handleOpenDrawerParam(false)}
            onClose={(e) => handleOpenDrawerParam(false)}
            open={paramDrawerIsOpen}
        >
            <List sx={{pt:0}}>  
                <ListItem sx={{bgcolor:'var(--white)'}} key='roomDrawClose' disablePadding>
                    <ListItemButton onClick={(e) => handleOpenDrawerParam(false)} sx={{display:'flex',justifyContent:'flex-end'}}>
                        <ChevronLeftIcon />
                        <Typography fontSize="small" sx={{pl:1, textTransform:'uppercase'}}>Room <b style={{textTransform:'uppercase'}}>{ roomId } </b> </Typography>
                    </ListItemButton>
                </ListItem> 
                <Divider sx={{mb:2}}/>
                <ListItem key='roomDrawHostedBy' disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <InfoIcon />
                        </ListItemIcon>
                        <Typography>Hosté par <b>{roomAdmin}</b></Typography>
                    </ListItemButton>
                </ListItem>
                
                <ListItem key='roomDrawSpotifyStatus' disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <Badge invisible={isLinkedToSpotify} variant="dot" 
                                sx={{'& .MuiBadge-badge': {
                                        right:'0px',
                                        bgcolor:'var(--red-2)'
                                    }, ml:'-2px'}} >
                                    <Icon icon="mdi:spotify" width="27"  />
                            </Badge>
                        </ListItemIcon>
                        <Typography>{isLinkedToSpotify ? 'Spotify relié' : 'Spotify non relié'}</Typography>
                    </ListItemButton>
                </ListItem>
                <Divider sx={{mb:2, mt:2}}/>
                
                <ListItem key='roomDrawRoomParams' disablePadding>
                    <ListItemButton onClick={e => handleOpenRoomParamModal(true)}>
                        <ListItemIcon>
                            <TuneIcon />
                        </ListItemIcon>
                        <Typography>Paramètres de room</Typography>
                    </ListItemButton>
                </ListItem>
                <ListItem key='roomDrawRoomShare' disablePadding>
                    <ListItemButton onClick={e => handleOpenShareModal(true)}>
                        <ListItemIcon>
                            <ShareIcon />
                        </ListItemIcon>
                        <Typography>Partager la room</Typography>
                    </ListItemButton>
                </ListItem>
                <Divider  sx={{mt:2}}/>
                <ListItem key='roomDrawRoomLeave' disablePadding>
                    <ListItemButton onClick={e => handleOpenLeaveRoomModal(true)}>
                        <ListItemIcon>
                            <ExitToAppIcon />
                        </ListItemIcon>
                        <Typography>Quitter la room</Typography>
                    </ListItemButton>
                </ListItem>
            </List>
        </Drawer>
                <Tooltip  className='animate__animated animate__fadeInLeft animate__delay-1s animate__fast' title="Paramètres de la room" sx={{ bgColor:'#30363c'}}>
                        <Badge invisible={isLinkedToSpotify} variant="dot" sx={{'& .MuiBadge-badge': {
                            right:'10px',
                            bgcolor:'var(--red-2)'
                        }}} >
                            <TuneIcon 
                            onClick={e => handleOpenDrawerParam(!paramDrawerIsOpen)} 
                            sx={{mr:1, cursor:'pointer', color:'var(--white)'}}/>
                        </Badge>
                </Tooltip>
                

            <Typography  className='animate__animated animate__fadeInLeft animate__fast' component="div" sx={{ flexGrow: 1 , textTransform:'uppercase', fontSize:'12px',}}>
                Room <b style={{textTransform:'uppercase'}}><span>{ roomId }</span> </b> 
            </Typography>
            
            {isShowSticky && isAdminView &&
                <Grid className="animate__animated animate__fadeInDown"> 
                    <IconButton onClick={e => ((room.playing > 0) && isSpotifyAndIsNotPlayableBySpotify(room.playing-1, room.roomParams.isLinkedToSpotify)) ? handleChangeActuallyPlaying(room.playing - 1) : ''}>
                        <SkipPrevious fontSize="large" sx={{color:((room.playing > 0) && isSpotifyAndIsNotPlayableBySpotify(room.playing-1, room.roomParams.isLinkedToSpotify)) ? '#f0f1f0': '#303134'}} />
                    </IconButton>

                    <IconButton variant="contained" onClick={e => handlePlay(!room.actuallyPlaying)} sx={{position:'sticky', top:0, zIndex:2500}} >
                        { room.actuallyPlaying && <PauseCircleOutlineIcon fontSize="large" sx={{color:'#f0f1f0'}} />}
                        { !room.actuallyPlaying && <PlayCircleOutlineIcon fontSize="large" sx={{color:'#f0f1f0'}} />}
                    </IconButton>
                    
                    <IconButton onClick={e => (room.playlistUrls.length -1) !== room.playing ? handleChangeActuallyPlaying(room.playing + 1) : ''}>
                        <SkipNextIcon fontSize="large" sx={{color: (room.playlistUrls.length -1) !== room.playing ? '#f0f1f0' : '#303134'}} />
                    </IconButton> 
                </Grid>}
        </Toolbar>
        
       
    </AppBar>
  )
};

export default RoomTopBar;