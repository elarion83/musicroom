import { useState } from "react";

import { Icon } from '@iconify/react';
import InfoIcon from '@mui/icons-material/Info';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Divider, Drawer, IconButton, List, ListItem, ListItemButton, Typography } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Badge from '@mui/material/Badge';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import TuneIcon from '@mui/icons-material/Tune';
import ShareIcon from '@mui/icons-material/Share';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Tooltip from '@mui/material/Tooltip';
import 'animate.css';


const RoomTopBar = ({roomId, roomAdmin, isLinkedToSpotify,handleOpenRoomParamModal,handleOpenShareModal,handleOpenLeaveRoomModal, }) => {

    const [roomDrawerOpen, setRoomDrawerOpen] = useState(false);
    function handleClickMenu() {
        setRoomDrawerOpen(true);
    };

  return (
    <AppBar position="sticky" className='sticky_top' >
        
        <Toolbar xs={12}sx={{ bgcolor: 'var(--grey-dark)',borderBottom: '2px solid var(--border-color)', minHeight: '45px !important', fontFamily: 'Monospace', pl:'5px', pr:'25 px' }}>
                <Drawer
            id="menu-appbar"
            anchor='left'
            onClick={(e) => setRoomDrawerOpen(false)}
            onClose={(e) => setRoomDrawerOpen(false)}
            open={roomDrawerOpen}
        >
            <List sx={{pt:0}}>  
                <ListItem key='roomDrawClose' disablePadding>
                    <ListItemButton onClick={(e) => setRoomDrawerOpen(false)} sx={{display:'flex',justifyContent:'flex-end'}}>
                        <ChevronLeftIcon />
                    </ListItemButton>
                </ListItem> 
                <Divider />
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
                <Divider />
                
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
                <Divider />
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
                            <MoreVertIcon 
                            onClick={e => handleClickMenu(e)} 
                            sx={{mr:1, cursor:'pointer'}}/>
                        </Badge>
                </Tooltip>
                

            <Typography  className='animate__animated animate__fadeInLeft animate__fast' component="div" sx={{ flexGrow: 1 , textTransform:'uppercase', fontSize:'12px',}}>
                Room : <b><span>{ roomId }</span> </b> 
            </Typography>
            
        </Toolbar>
        
       
    </AppBar>
  )
};

export default RoomTopBar;