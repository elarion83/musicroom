import Typography from '@mui/material/Typography';
import { useEffect, useState } from "react";

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import InfoIcon from '@mui/icons-material/Info';
import ListItemIcon from '@mui/material/ListItemIcon';
import 'animate.css';

const RoomTopBar = ({roomId, roomAdmin }) => {
    
    
    const [openLeaveRoomModal, setOpenLeaveRoomModal] = useState(false);

    function handleClickMenu(event) {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const [anchorEl, setAnchorEl] = useState(null);
    
  return (
    <AppBar position="sticky" className='sticky_top' >
        <Toolbar xs={12}sx={{ bgcolor: '#262626',borderBottom: '2px solid #3e464d', minHeight: '45px !important', fontFamily: 'Monospace', pl:'5px', pr:'25 px' }}>
                
                <Tooltip  className='animate__animated animate__fadeInLeft animate__delay-2s animate__fast' title="Paramètres de la room" sx={{ bgColor:'#30363c'}}>
                        <MoreVertIcon 
                        onClick={e => handleClickMenu(e)} 
                        sx={{mr:1, cursor:'pointer'}}/>
                </Tooltip>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                    }}
                    
                    onClose={handleClose}
                    onClick={handleClose}
                    open={Boolean(anchorEl)}
                >
                    <MenuItem>
                        <ListItemIcon>
                            <InfoIcon  fontSize="small" />
                        </ListItemIcon>
                        <Typography>
                        Hosté par <b>{roomAdmin}</b>
                        </Typography>
                    </MenuItem>
                </Menu>

            <Typography  className='animate__animated animate__fadeInLeft animate__delay-1s animate__fast' component="div" sx={{ flexGrow: 1 , textTransform:'uppercase', fontSize:'12px',}}>
                Room : <b><span>{ roomId }</span> </b> 
            </Typography>
            
        </Toolbar>
        
       
    </AppBar>
  )
};

export default RoomTopBar;