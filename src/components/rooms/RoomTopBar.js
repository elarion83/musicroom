
import { Icon } from '@iconify/react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import InfoIcon from '@mui/icons-material/Info';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import ShareIcon from '@mui/icons-material/Share';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPrevious from '@mui/icons-material/SkipPrevious';
import TuneIcon from '@mui/icons-material/Tune';
import { Divider, SwipeableDrawer, Grid, List, ListItem, ListItemButton, Switch, Typography } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import 'animate.css';

import { withTranslation } from 'react-i18next';
import VolumeButton from "./playerSection/VolumeButton";
import { GFontIcon } from '../../services/utils';

const RoomTopBar = ({
                t,
                isShowSticky,
                handlePlay,
                roomIsPlaying,
                setRoomIsPlaying,
                roomIdPlayed,
                setRoomIdPlayed,
                isAdminView,
                room,
                handleChangeActuallyPlaying,
                isSpotifyAndIsNotPlayableBySpotify,
                guestSynchroOrNot,
                setGuestSynchroOrNot,
                volume,
                setVolume,
                paramDrawerIsOpen, handleOpenDrawerParam, isLinkedToSpotify,isLinkedToDeezer, handleOpenRoomParamModal,handleOpenShareModal,handleOpenLeaveRoomModal, }) => {

  return (
    <AppBar sx={{position: (isShowSticky) ? "fixed": 'initial', top:0, bgcolor: 'var(--grey-dark)',borderBottom: '2px solid var(--border-color)'}} >
        
        <Toolbar className={isShowSticky ? "stickyRoomTopBar": ''} xs={12} sx={{ minHeight: '45px !important', fontFamily: 'Monospace', paddingLeft:'10px !important' }}>
            <SwipeableDrawer
                id="menu-appbar"
                sx={{zIndex:1300}}
                anchor='left'
                onClose={(e) => handleOpenDrawerParam(false)}
                onOpen={(e) => handleOpenDrawerParam(true)}
                open={paramDrawerIsOpen}
            >
                <List sx={{pt:0}}>  
                    <ListItem sx={{bgcolor:'var(--white)'}} key='roomDrawClose' disablePadding>
                        <ListItemButton onClick={(e) => handleOpenDrawerParam(false)} sx={{display:'flex',justifyContent:'flex-end'}}>
                            <ChevronLeftIcon />
                            <Typography fontSize="small" sx={{pl:1, textTransform:'uppercase'}}>Playlist <b style={{textTransform:'uppercase'}}>{ room.id } </b> </Typography>
                        
                        </ListItemButton>
                    </ListItem> 
                    <Divider />
                    <ListItem key='roomDrawHostedBy' disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <InfoIcon />
                            </ListItemIcon>
                            <Typography>{isAdminView ? t('RoomLeftMenuHost') : t('RoomLeftMenuHostedBy')} {!isAdminView ? <b>{room.admin}</b> : '' }</Typography>
                        </ListItemButton>
                    </ListItem>
                    
                    <ListItem key='roomDrawSpotifyStatus' disablePadding>
                        <ListItemButton onClick={e => handleOpenRoomParamModal(true)}>
                            <ListItemIcon>
                                <Badge invisible={isLinkedToSpotify} variant="dot" 
                                    sx={{'& .MuiBadge-badge': {
                                            right:'0px',
                                            bgcolor:'var(--red-2)'
                                        }, ml:'-2px'}} >
                                        <Icon icon="mdi:spotify" width="27"  />
                                </Badge>
                            </ListItemIcon>
                            <Typography>Spotify {isLinkedToSpotify ? t('GeneralLinked') : t('GeneralNotLinked')}</Typography>
                        </ListItemButton>
                    </ListItem>

                    <ListItem key='roomDrawDeezerStatus' disablePadding>
                        <ListItemButton onClick={e => handleOpenRoomParamModal(true)}>
                            <ListItemIcon>
                                <Badge invisible={isLinkedToDeezer} variant="dot" 
                                    sx={{'& .MuiBadge-badge': {
                                            right:'0px',
                                            bgcolor:'var(--red-2)'
                                        }, ml:'-2px'}} >
                                        <Icon icon="jam:deezer" width="27"  />
                                </Badge>
                            </ListItemIcon>
                            <Typography>Deezer {isLinkedToDeezer ? t('GeneralLinked') : t('GeneralNotLinked')}</Typography>
                        </ListItemButton>
                    </ListItem>

                    <Divider sx={{mb:1, mt:1}}/>
                    
                    <ListItem key='roomDrawRoomParams' disablePadding>
                        <ListItemButton onClick={e => handleOpenRoomParamModal(true)}>
                            <ListItemIcon>
                                <TuneIcon />
                            </ListItemIcon>
                            <Typography>{t('RoomLeftMenuRoomParams')}</Typography>
                        </ListItemButton>
                    </ListItem>
                    <ListItem key='roomDrawRoomShare' disablePadding>
                        <ListItemButton onClick={e => handleOpenShareModal(true)}>
                            <ListItemIcon>
                                <ShareIcon />
                            </ListItemIcon>
                            <Typography>{t('RoomLeftMenuRoomShare')}</Typography>
                        </ListItemButton>
                    </ListItem>
                    
                    {!isAdminView && <ListItem key='roomDrawSync' disablePadding onClick={(e) => setGuestSynchroOrNot(!guestSynchroOrNot)}>
                        <ListItemButton>
                            <ListItemIcon>
                                <Switch
                                    size='small'
                                    sx={{ml:-1}}
                                    checked={guestSynchroOrNot}
                                    onChange={(e) => setGuestSynchroOrNot(!guestSynchroOrNot)}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                            </ListItemIcon>
                            <Typography>{guestSynchroOrNot ? t('RoomLeftMenuSync') : t('RoomLeftMenuNotSync')}</Typography>
                        </ListItemButton>
                    </ListItem>}

                    <Divider  sx={{mt:1, mb:1}}/>
                    <ListItem key='roomDrawRoomLeave' disablePadding>
                        <ListItemButton onClick={e => handleOpenLeaveRoomModal(true)}>
                            <ListItemIcon>
                                <ExitToAppIcon />
                            </ListItemIcon>
                            <Typography>{t('RoomLeftMenuRoomLeave')}</Typography>
                        </ListItemButton>
                    </ListItem>
                </List>

                <Divider  sx={{mt:5, mb:1}}/>
                <ListItem key='playlistDrawAPK' disablePadding>
                    <ListItemButton href="http://dev.play-it.fr/back/play-it-android.apk">
                        <ListItemIcon>
                            {<GFontIcon icon="install_mobile"/>}
                        </ListItemIcon> 
                        <Typography>Télécharger l'APK</Typography>
                    </ListItemButton>
                </ListItem>
            </SwipeableDrawer>
            <Tooltip  className='animate__animated animate__fadeInLeft animate__delay-1s animate__fast' title={t('RoomLeftMenuRoomParams')} sx={{ bgColor:'#30363c'}}>
                <Badge invisible={isLinkedToSpotify && isLinkedToDeezer} variant="dot" sx={{'& .MuiBadge-badge': {
                    right:'10px',
                    bgcolor:'var(--red-2)'
                }}} >
                    <TuneIcon 
                    onClick={e => handleOpenDrawerParam(!paramDrawerIsOpen)} 
                    sx={{mr:1, cursor:'pointer', color:'var(--white)'}}/>
                </Badge>
            </Tooltip>
                
            <Typography  className='animate__animated animate__fadeInLeft animate__fast' component="div" sx={{ flexGrow: 1 , textTransform:'uppercase', fontSize:'12px',}}>
                Playlist <b style={{textTransform:'uppercase'}}><span>{ room.id }</span> </b> 
            </Typography>
            
            {isShowSticky &&
                <Grid className="animate__animated animate__fadeInDown stickyButtons"> 
                    {isAdminView && 
                        <>
                            <IconButton onClick={e => ((room.playing > 0) && isSpotifyAndIsNotPlayableBySpotify(room.playing-1, room.roomParams.isLinkedToSpotify)) ? handleChangeActuallyPlaying(room.playing - 1) : ''}>
                                <SkipPrevious fontSize="large" sx={{color:((room.playing > 0) && isSpotifyAndIsNotPlayableBySpotify(room.playing-1, room.roomParams.isLinkedToSpotify)) ? '#f0f1f0': '#303134'}} />
                            </IconButton>

                            <IconButton variant="contained" onClick={e => handlePlay(!roomIsPlaying)} sx={{position:'sticky', top:0, zIndex:2500}} >
                                { room.actuallyPlaying && <PauseCircleOutlineIcon fontSize="large" sx={{color:'#f0f1f0'}} />}
                                { !room.actuallyPlaying && <PlayCircleOutlineIcon fontSize="large" sx={{color:'#f0f1f0'}} />}
                            </IconButton>

                            <IconButton onClick={e => (room.playlistUrls.length -1) !== room.playing ? handleChangeActuallyPlaying(room.playing + 1) : ''}>
                                <SkipNextIcon fontSize="large" sx={{color: (room.playlistUrls.length -1) !== room.playing ? '#f0f1f0' : '#303134'}} />
                            </IconButton>
                        </>
                    }

                    {!isAdminView && !guestSynchroOrNot && 
                        <>
                            <IconButton onClick={e => ((roomIdPlayed > 0) && isSpotifyAndIsNotPlayableBySpotify(roomIdPlayed-1, room.roomParams.isLinkedToSpotify)) ? setRoomIdPlayed(roomIdPlayed - 1) : ''}>
                                <SkipPrevious fontSize="large" sx={{color:((roomIdPlayed > 0) && isSpotifyAndIsNotPlayableBySpotify(roomIdPlayed-1, room.roomParams.isLinkedToSpotify)) ? '#f0f1f0': '#303134'}} />
                            </IconButton>
                            <IconButton variant="contained" onClick={e => setRoomIsPlaying(!roomIsPlaying)} sx={{position:'sticky', top:0, zIndex:2500}} >
                                { roomIsPlaying && <PauseCircleOutlineIcon fontSize="large" sx={{color:'#f0f1f0'}} />}
                                { !roomIsPlaying && <PlayCircleOutlineIcon fontSize="large" sx={{color:'#f0f1f0'}} />}
                            </IconButton>
                            <IconButton onClick={e => (room.playlistUrls.length -1) !== roomIdPlayed ? setRoomIdPlayed(roomIdPlayed + 1) : ''}>
                                <SkipNextIcon fontSize="large" sx={{color: (room.playlistUrls.length -1) !== roomIdPlayed ? '#f0f1f0' : '#303134'}} />
                            </IconButton>
                        </>
                    }
                    <VolumeButton volume={volume} setVolume={setVolume}/>
                </Grid>
            }
        </Toolbar>
    </AppBar>
  )
};

export default withTranslation()(RoomTopBar);