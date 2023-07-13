import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import Divider from '@mui/material/Divider';
import ArchiveIcon from '@mui/icons-material/Archive';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useState } from 'react';

import FullscreenIcon from '@mui/icons-material/Fullscreen';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ChatIcon from '@mui/icons-material/Chat';
import DvrIcon from '@mui/icons-material/Dvr';
import AirplayIcon from '@mui/icons-material/Airplay';
import { useEffect } from 'react';

import { withTranslation } from 'react-i18next';

const StyledMenu = styled((props) => (
  <Menu
    dense={true}
    elevation={0}
    sx={{ml:1,mt:-1}}
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 120,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 14,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

const DisplayMenu = ({t, layoutDisplay, setLayoutdisplay}) => {

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
    setAnchorEl(null);
    };

    useEffect(() => {
        setAnchorEl(null);
    }, [layoutDisplay]);

    
  return (
    
    <div>
      <Button
        size='small'
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        disableElevation
        sx={{m:0,p:0,minWidth:'0px',width:'40px'}}
        onClick={handleClick}
        endIcon={open ? <KeyboardArrowDownIcon sx={{ml:-1.5}}/> : <KeyboardArrowUpIcon sx={{ml:-1.5}}/>}
      >
      <FullscreenIcon sx={{ml:0.5,mr:0.5}} />
      </Button>
      <StyledMenu
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        dense={true}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem selected={layoutDisplay === 'fullscreen'} onClick={(e) => setLayoutdisplay('fullscreen')} disableRipple>
          <FullscreenIcon />
          {t('RoomBottomDisplayFullScreen')}
        </MenuItem>
        <MenuItem selected={layoutDisplay === 'compact'} onClick={(e) => setLayoutdisplay('compact')} disableRipple>
          <DvrIcon />
          Compact
        </MenuItem>
        <MenuItem selected={layoutDisplay === 'default'} onClick={(e) => setLayoutdisplay('default')} disableRipple>
          <AirplayIcon />
          {t('RoomBottomDisplayClassic')}
        </MenuItem>
        <MenuItem selected={layoutDisplay === 'interactive'} onClick={(e) => setLayoutdisplay('interactive')} disableRipple>
          <ChatIcon />
          Interactif
        </MenuItem>
      </StyledMenu>
    </div>
    
  )
};

export default withTranslation()(DisplayMenu);
