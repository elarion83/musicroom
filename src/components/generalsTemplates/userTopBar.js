import React, { useState } from "react";
import Box from '@mui/material/Box';

import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Logout from '@mui/icons-material/Logout';
import Grid from '@mui/material/Grid';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Typography from '@mui/material/Typography';

import { auth } from './../../services/firebase';

const UserTopBar = ({ userInfoPseudo, handleLogout }) => {

    function handleClickMenu(event) {
        setAnchorEl(event.currentTarget);
    };

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClose = () => {
        setAnchorEl(null);
    };

    return(
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', textAlign: 'center', width:'100%' }}>
              
              <Tooltip title="Paramètres du compte" sx={{ bgColor:'#30363c'}}>
                <IconButton
                  onClick={e => handleClickMenu(e)}
                  size="small"
                  sx={{  color:'white', }}
                  aria-controls={open ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                >
                  <Avatar sx={{ bgcolor: 'var(--red-2)', textTransform:'uppercase' }} >{userInfoPseudo.substring(0, 1) }</Avatar>
                </IconButton>
              </Tooltip>
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
                <MenuItem>
                    <ListItemIcon>
                    <AccountCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography>
                    { userInfoPseudo }
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
            </Box>
            
    )
};

export default UserTopBar;