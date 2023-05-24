import Typography from '@mui/material/Typography';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ShareIcon from '@mui/icons-material/Share';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const RoomTopBar = ({localData, roomId, handleOpenShareModal }) => {
    
    function handleQuitRoom() {

        if(localStorage.getItem("MusicRoom_RoomId")) {
            localStorage.removeItem("MusicRoom_RoomId");
            window.location.reload(false);
        } 
        window.location.href = "/";
    }
  return (
    <AppBar position="static">
            <Toolbar xs={12} sx={{ bgcolor: '#262626', minHeight: '45px !important', fontFamily: 'Monospace', pl:'5px', pr:'25px' }}>
                
                <Typography  component="div" sx={{ flexGrow: 1 }}>
                    Room n° <b>{ roomId } </b>
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