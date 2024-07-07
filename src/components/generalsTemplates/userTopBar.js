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
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import UserAvatarComponent from '../../services/utilsComponents';
import { LoadingButton } from '@mui/lab';
const UserTopBar = ({ t, user, loggedIn,loginLoading, setUserInfo, handleLogout, handleOpenLoginModal, joinRoomByRoomId }) => {

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
          
          {!loggedIn && 
            <LoadingButton
              loading={loginLoading} 
              loadingPosition='start'
              variant="outlined" 
              size='medium'
              className='loginButtonTop main_bg_color  varelaFontTitle texturaBgButton'
              startIcon={<LoginIcon className='colorWhite'/>}
              onClick={(e) => {handleOpenLoginModal(true)}} > 
                <Typography fontSize="small">{t('GeneralLogin')} </Typography>
            </LoadingButton>
            }

          {loggedIn && 
            <>
              <Tooltip title={t('ModalUserSettingsTitle')} sx={{ bgColor:'#30363c'}}>
                <IconButton
                  onClick={e => handleClickMenu(e)}
                  size="small"  
                  sx={{  color:'white', }}
                  aria-controls={open ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                >
                  <UserAvatarComponent user={user} cssClass='userAvatar' />
                </IconButton>
              </Tooltip>
                
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
                      <AccountCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography className='varelaFontTitle'>
                      {t('UserMenuMyProfile')} 
                    </Typography>
                </MenuItem>
                <MenuItem onClick={e => setUserRoomListModalOpen(true)}>
                    <ListItemIcon>
                      <AppsIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography className='varelaFontTitle'>        
                      {t('UserMenuMyRooms')} 
                    </Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={e => handleLogout()} className='varelaFontTitle'>
                    <ListItemIcon>
                    <Logout fontSize="small" />
                      </ListItemIcon>
                    {t('GeneralLogout')}
                </MenuItem>
              </Menu>
              <UserParamModal open={userParamModalOpen} changeOpen={setUserParamModalOpen} user={user} setUserInfo={setUserInfo} />
              <UserRoomListModal open={userRoomListModalOpen} changeOpen={setUserRoomListModalOpen} user={user} joinRoomByRoomId={joinRoomByRoomId} />
            </>}
        </Box>
            
    )
};

export default withTranslation()(UserTopBar);