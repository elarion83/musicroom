import Typography from '@mui/material/Typography';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ShareIcon from '@mui/icons-material/Share';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const RoomTopBar = ({roomId, handleOpenShareModal, roomAdmin }) => {
    
    function handleQuitRoom() {

        if(localStorage.getItem("MusicRoom_RoomId")) {
            localStorage.removeItem("MusicRoom_RoomId");
            window.location.reload(false);
        } 
        window.location.href = "/";
    }
  return (
    <AppBar position="static">
            <Toolbar xs={12} sx={{ bgcolor: '#262626',borderBottom: '2px solid #3e464d', minHeight: '45px !important', fontFamily: 'Monospace', pl:'5px', pr:'25 px' }}>
                
                <Typography  component="div" sx={{ flexGrow: 1 , textTransform:'uppercase', fontSize:'12px',}}>
                    Room : <b>{ roomId } </b> | Hosté par <b>{roomAdmin}</b><i class="fi fi-ro-square-right"></i>
                </Typography>
                <Tooltip title="Partager la room" >
                    <IconButton
                        onClick={e => handleOpenShareModal(true)}
                        size="small"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2,pt:0,pb:0,mt:0,mb:0 }}
                    >
                        <ShareIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title='Quitter la room' >
                    <IconButton
                        size="small"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: '-15px',pt:0,pb:0,mt:0,mb:0 }}
                        onClick={e => handleQuitRoom()}
                    >
                        <ExitToAppIcon />
                    </IconButton>
                </Tooltip>
                
            </Toolbar>
        </AppBar>
  )
};

export default RoomTopBar;