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
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const RoomTopBar = ({roomId, handleOpenShareModal, roomAdmin }) => {
    
    
    const [openLeaveRoomModal, setOpenLeaveRoomModal] = useState(false);

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
                    <MenuItem onClick={e => setOpenLeaveRoomModal(true)}>
                        <ListItemIcon>
                            <ExitToAppIcon fontSize="small" />
                        </ListItemIcon>
                        <Typography>
                        Quitter la room
                        </Typography>
                    </MenuItem>
                </Menu>

            <Typography  component="div" sx={{ flexGrow: 1 , textTransform:'uppercase', fontSize:'12px',}}>
                Room : <b><span>{ roomId }</span> </b> 
            </Typography>
            
        </Toolbar>
        
        <Dialog open={openLeaveRoomModal} keepMounted onClose={(e) => setOpenLeaveRoomModal(false)} >
            
            <DialogTitle id="alert-dialog-title">
                Quitter la room ?
            </DialogTitle>
            <DialogContent>
                <DialogContentText >
                Vous êtes sur le point de quitter la room pour retourner à l'accueil.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={(e) => handleQuitRoom(false)}>
                    Quitter
                </Button>
                <Button variant="outlined" onClick={(e) => setOpenLeaveRoomModal(false)} autoFocus>
                    Rester
                </Button>
            </DialogActions>
        </Dialog>
    </AppBar>
  )
};

export default RoomTopBar;