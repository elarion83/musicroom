import Box from '@mui/material/Box';
import React, { useState } from "react";

import TuneIcon from '@mui/icons-material/Tune';
import LoginIcon from '@mui/icons-material/Login';
import Logout from '@mui/icons-material/Logout';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import AppsIcon from '@mui/icons-material/Apps';
import UserParamModal from './modals/UserParamModal';
import UserRoomListModal from './modals/UserRoomListModal';
import { ReactSVG } from "react-svg";
import { withTranslation } from 'react-i18next';
const UserTopBar = ({ t, user, setUserInfo, handleLogout, handleOpenLoginModal, joinRoomByRoomId }) => {

  // menu
    function handleClickMenu(event) {
        setAnchorEl(event.currentTarget);
    };

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClose = () => {
        setAnchorEl(null);
    };


    const [userParamModalOpen, setUserParamModalOpen] = useState(false);
    const [userRoomListModalOpen, setUserRoomListModalOpen] = useState(false);
    return(
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', textAlign: 'center', width:'100%' }}>
          
          {user.displayName && <Tooltip title={t('ModalUserSettingsTitle')} sx={{ bgColor:'#30363c'}}>
            <IconButton
              onClick={e => handleClickMenu(e)}
              size="small"
              sx={{  color:'white', }}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <ReactSVG src={"./img/avatars/botts"+user.avatarId+".svg"} 
                style={{'width': '35px','height': '35px', 'outline': '2px solid rgba(255, 255, 255, 0.53)', 'background': '#756b6b',  'border-radius': '50%',  'padding': '4px'}}
               />
            </IconButton>
          </Tooltip>}
              
          {!user.displayName && 
            <Button 
              variant="outlined" 
              sx={{color:'var(--white)', borderColor:'var(--white)'}}
              startIcon={<LoginIcon sx={{color:'var(--white)'}}/>}
              onClick={(e) => {handleOpenLoginModal(true)}} > {t('GeneralLogin')} </Button>
            }
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
            <MenuItem onClick={e => setUserParamModalOpen(true)}>
                <ListItemIcon>
                  <TuneIcon fontSize="small" />
                </ListItemIcon>
                <Typography>
                  {t('UserMenuMyProfile')} 
                </Typography>
            </MenuItem>
            {!localStorage.getItem("Play-It_AnonymouslyLoggedIn") && <MenuItem onClick={e => setUserRoomListModalOpen(true)}>
                <ListItemIcon>
                  <AppsIcon fontSize="small" />
                </ListItemIcon>
                <Typography>        
                  {t('UserMenuMyRooms')} 
                </Typography>
            </MenuItem>}
            <Divider />
            <MenuItem onClick={e => handleLogout()}>
                <ListItemIcon>
                <Logout fontSize="small" />
                  </ListItemIcon>
                {t('GeneralLogout')}
            </MenuItem>
          </Menu>
          <UserParamModal open={userParamModalOpen} changeOpen={setUserParamModalOpen} user={user} setUserInfo={setUserInfo} />
          <UserRoomListModal open={userRoomListModalOpen} changeOpen={setUserRoomListModalOpen} user={user} joinRoomByRoomId={joinRoomByRoomId} />
        </Box>
            
    )
};

export default withTranslation()(UserTopBar);