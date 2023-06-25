import Box from '@mui/material/Box';
import React, { useState } from "react";

import TuneIcon from '@mui/icons-material/Tune';
import LoginIcon from '@mui/icons-material/Login';
import Logout from '@mui/icons-material/Logout';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';

import UserParamModal from './modals/UserParamModal';

const UserTopBar = ({ user, setUserInfo, handleLogout, handleOpenLoginModal }) => {

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
    return(
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', textAlign: 'center', width:'100%' }}>
          
          {user.displayName && <Tooltip title="Paramètres du compte" sx={{ bgColor:'#30363c'}}>
            <IconButton
              onClick={e => handleClickMenu(e)}
              size="small"
              sx={{  color:'white', }}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <Avatar sx={{ bgcolor: 'var(--red-2)', textTransform:'uppercase' }} >{user.displayName.substring(0, 1) }</Avatar>
            </IconButton>
          </Tooltip>}
          {!user.displayName && 
            <Button 
              variant="outlined" 
              sx={{color:'var(--white)', borderColor:'var(--white)'}}
              startIcon={<LoginIcon sx={{color:'var(--white)'}}/>}
              onClick={(e) => {handleOpenLoginModal(true)}} > Login </Button>
            }
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
                elevation: 0,
                sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                },
                '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                },
                },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
            <MenuItem onClick={e => setUserParamModalOpen(true)}>
                <ListItemIcon>
                <TuneIcon fontSize="small" />
                </ListItemIcon>
                <Typography>
                { user.displayName }
                </Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={e => handleLogout()}>
                <ListItemIcon>
                <Logout fontSize="small" />
                </ListItemIcon>
                Déconnexion
            </MenuItem>
          </Menu>
          <UserParamModal open={userParamModalOpen} changeOpen={setUserParamModalOpen} user={user} setUserInfo={setUserInfo} />
        </Box>
            
    )
};

export default UserTopBar;