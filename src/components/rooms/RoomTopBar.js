import Typography from '@mui/material/Typography';
import { useState } from "react";

import { Icon } from '@iconify/react';
import InfoIcon from '@mui/icons-material/Info';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Divider } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Badge from '@mui/material/Badge';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import 'animate.css';


const RoomTopBar = ({roomId, roomAdmin, isLinkedToSpotify }) => {

    function handleClickMenu(event) {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const [anchorEl, setAnchorEl] = useState(null);
    
  return (
    <AppBar position="sticky" className='sticky_top' >
        <Toolbar xs={12}sx={{ bgcolor: 'var(--grey-dark)',borderBottom: '2px solid var(--border-color)', minHeight: '45px !important', fontFamily: 'Monospace', pl:'5px', pr:'25 px' }}>
                
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
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    onClick={handleClose}
                    open={Boolean(anchorEl)}
                >   
                    <MenuItem >
                        <ListItemIcon >
                            <InfoIcon />
                        </ListItemIcon>
                        <Typography>
                        Hosté par <b>{roomAdmin}</b>
                        </Typography>
                    </MenuItem>
                    <Divider />
                    <MenuItem >
                        <ListItemIcon sx={{ml:'-3px', mr:'3px'}}>
                            <Badge invisible={isLinkedToSpotify} variant="dot" 
                                sx={{'& .MuiBadge-badge': {
                                        right:'0px',
                                        bgcolor:'var(--red-2)'
                                    }}} >
                                    <Icon icon="mdi:spotify" width="27" />
                                </Badge>
                        </ListItemIcon>
                        <Typography> 
                            {isLinkedToSpotify ? 'Spotify relié' : 'Spotify non relié'}
                        </Typography> 
                    </MenuItem>
                </Menu>

            <Typography  className='animate__animated animate__fadeInLeft animate__fast' component="div" sx={{ flexGrow: 1 , textTransform:'uppercase', fontSize:'12px',}}>
                Room : <b><span>{ roomId }</span> </b> 
            </Typography>
            
        </Toolbar>
        
       
    </AppBar>
  )
};

export default RoomTopBar;