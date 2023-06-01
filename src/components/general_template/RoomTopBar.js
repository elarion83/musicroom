import Typography from '@mui/material/Typography';
import { useEffect, useState } from "react";

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ShareIcon from '@mui/icons-material/Share';
import Divider from '@mui/material/Divider';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import TuneIcon from '@mui/icons-material/Tune';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import InfoIcon from '@mui/icons-material/Info';
import ListItemIcon from '@mui/material/ListItemIcon';

const RoomTopBar = ({roomId, handleOpenShareModal, roomAdmin }) => {
    
    function handleClickMenu(event) {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const [anchorEl, setAnchorEl] = useState(null);
    
    function handleQuitRoom() {

        if(localStorage.getItem("MusicRoom_RoomId")) {
            localStorage.removeItem("MusicRoom_RoomId");
            window.location.reload(false);
        } 
        window.location.href = "/";
    }
  return (
    <AppBar position="sticky" className='sticky_top' >
            <Toolbar xs={12}sx={{ bgcolor: '#262626',borderBottom: '2px solid #3e464d', minHeight: '45px !important', fontFamily: 'Monospace', pl:'5px', pr:'25 px' }}>
                
                    <Tooltip title="Paramètres de la room" sx={{ bgColor:'#30363c'}}>
                        <IconButton
                            size="small"
                            aria-haspopup="true"
                            onClick={e => handleClickMenu(e)}
                            color="inherit"
                            sx={{bgcolor:'#202124', mr:1}}
                        >
                            <TuneIcon />
                        </IconButton>
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
                        <Divider />
                        <MenuItem >
                            <ListItemIcon>
                                <TuneIcon fontSize="small" />
                            </ListItemIcon>
                            <Typography>
                            Paramètres 
                            </Typography>
                        </MenuItem>
                        <MenuItem onClick={e => handleOpenShareModal(true)}>
                            <ListItemIcon>
                                <ShareIcon fontSize="small" />
                            </ListItemIcon>
                            <Typography>
                            Partager la room
                            </Typography>
                        </MenuItem>
                        <MenuItem onClick={e => handleQuitRoom()}>
                            <ListItemIcon>
                                <ExitToAppIcon fontSize="small" />
                            </ListItemIcon>
                            <Typography>
                            Quitter la room
                            </Typography>
                        </MenuItem>
                    </Menu>

                <Typography  component="div" sx={{ flexGrow: 1 , textTransform:'uppercase', fontSize:'12px',}}>
                    Room : <b>{ roomId } </b> 
                </Typography>
               
            </Toolbar>
        </AppBar>
  )
};

export default RoomTopBar;