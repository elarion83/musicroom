import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { alpha, styled } from '@mui/material/styles';
import * as React from 'react';
import { useState } from 'react';

import AirplayIcon from '@mui/icons-material/Airplay';
import ChatIcon from '@mui/icons-material/Chat';
import DvrIcon from '@mui/icons-material/Dvr';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { useEffect } from 'react';

import { Box, Divider } from '@mui/material';
import { withTranslation } from 'react-i18next';
import { isLayoutCompact, isLayoutFullScreen, isLayoutDefault, isLayoutInteractive } from '../../services/utils';

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
      <Box
        size='small'
        onClick={handleClick}
        sx={{pt:0.8}}
      >
        {!isLayoutCompact(layoutDisplay) && <FullscreenIcon sx={{ml:0,mr:0}} />}
        {isLayoutCompact(layoutDisplay) && <DvrIcon sx={{fontSize:'1.4em', ml:0,mr:0}} />}
        {open ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
      </Box>
      <StyledMenu
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        dense="true"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem selected={isLayoutFullScreen(layoutDisplay)} onClick={(e) => setLayoutdisplay('fullscreen')} disableRipple>
          <FullscreenIcon />
          {t('RoomBottomDisplayFullScreen')}
        </MenuItem>
       {/* <MenuItem selected={isLayoutCompact(layoutDisplay)} onClick={(e) => setLayoutdisplay('compact')} disableRipple>
          <DvrIcon />
          Compact
        </MenuItem>
        <MenuItem selected={isLayoutInteractive(layoutDisplay)} onClick={(e) => setLayoutdisplay('interactive')} disableRipple>
          <ChatIcon />
          {t('RoomBottomDisplayInteractive')}
        </MenuItem> */}
        <Divider />
        <MenuItem selected={isLayoutDefault(layoutDisplay)} sx={{mt:'-8px', mb:'-3px'}} onClick={(e) => setLayoutdisplay('default')} disableRipple>
          <AirplayIcon />
          {t('RoomBottomDisplayClassic')}
        </MenuItem>
      </StyledMenu>
    </div>
    
  )
};

export default withTranslation()(DisplayMenu);
