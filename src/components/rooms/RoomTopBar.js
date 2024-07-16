
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
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import 'animate.css';
import Groups3Icon from '@mui/icons-material/Groups3';

import { withTranslation } from 'react-i18next';
import VolumeButton from "./playerSection/VolumeButton";
import { GFontIcon, UserIsFromApp, appApkFileUrl, playingFirstInList, playingLastInList } from '../../services/utils';

const RoomTopBar = ({
                t,
                room,roomRef,
                isShowSticky,
                setIsPlaying,
                roomIsPlaying,
                playerIdPlayed,
                handleOpenChangeAdminModal,
                setPlayerIdPlayed,
                isAdminView,
                isSpotifyAndIsNotPlayableBySpotify,
                guestSynchroOrNot,
                playerControlsShown,
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
                hysteresis={0.2}
                swipeAreaWidth={20}
                onClose={(e) => handleOpenDrawerParam(false)}
                onOpen={(e) => handleOpenDrawerParam(true)}
                open={paramDrawerIsOpen}
            >
                <List sx={{pt:0}}>  
                    <ListItem sx={{bgcolor:'var(--white)'}} key='roomDrawClose' disablePadding>
                        <ListItemButton className="leftDrawerTop" onClick={(e) => handleOpenDrawerParam(false)} sx={{display:'flex',justifyContent:'flex-end'}}>
                            <ChevronLeftIcon />
                            <Typography fontSize="small" sx={{pl:1, textTransform:'uppercase'}}>Playlist <b style={{textTransform:'uppercase'}}>{ room.id } </b> </Typography>
                        
                        </ListItemButton>
                    </ListItem> 
                    <Divider />
                    <ListItem key='roomDrawHostedBy' disablePadding sx={{mt:1}} onClick={e => handleOpenChangeAdminModal(true)}>
                        <ListItemButton>
                            <ListItemIcon>
                                <InfoIcon />
                            </ListItemIcon>
                            <Typography className='varelaFontTitle'>{isAdminView ? t('RoomLeftMenuHost') : t('RoomLeftMenuHostedBy')} {!isAdminView ? <b>{room.admin}</b> : '' }</Typography>
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
                            <Typography className='varelaFontTitle'>{guestSynchroOrNot ? t('RoomLeftMenuSync') : t('RoomLeftMenuNotSync')}</Typography>
                        </ListItemButton>
                    </ListItem>}

                    <Divider sx={{mb:1, mt:1}}/>
                    
                    <ListItem key='roomDrawRoomParams' disablePadding>
                        <ListItemButton onClick={e => handleOpenRoomParamModal(true)}>
                            <ListItemIcon>
                                <TuneIcon />    
                            </ListItemIcon>
                            <Typography className='varelaFontTitle'>{t('RoomLeftMenuRoomParams')}</Typography>
                        </ListItemButton>
                    </ListItem>
                    {guestSynchroOrNot && <ListItem key='roomDrawRoomSharee' disablePadding>
                        <ListItemButton onClick={e => handleOpenChangeAdminModal(true)}>
                            <ListItemIcon>
                                <Groups3Icon />
                            </ListItemIcon>
                            <Typography className='varelaFontTitle'>
                                {isAdminView ? t('ModalChangePlaylistAdmin') : t('ModalChangePlaylistAdmin2') }</Typography>
                        </ListItemButton>
                    </ListItem>}
                    
                    <Divider  sx={{mt:1, mb:1}}/>
                    
                    <ListItem key='roomDrawRoomShare' disablePadding>
                        <ListItemButton onClick={e => handleOpenShareModal(true)}>
                            <ListItemIcon>
                                <ShareIcon />
                            </ListItemIcon>
                            <Typography className='varelaFontTitle'>{t('RoomLeftMenuRoomShare')}</Typography>
                        </ListItemButton>
                    </ListItem>

                </List>

                <Divider  sx={{mt:5, mb:1}}/>
                <ListItem key='roomDrawRoomLeave' disablePadding>
                    <ListItemButton onClick={e => handleOpenLeaveRoomModal(true)}>
                        <ListItemIcon>
                            <ExitToAppIcon />
                        </ListItemIcon>
                        <Typography className='varelaFontTitle'>{t('RoomLeftMenuRoomLeave')}</Typography>
                    </ListItemButton>
                </ListItem>
                
                {!UserIsFromApp && 
                    <>    
                        <ListItem key='playlistDrawAPK' className='texturaBgButton' sx={{position:'absolute', bottom:0,pb:0.5, pt:0.5, bgcolor:'var(--main-color-lighter)'}} disablePadding>
                            <ListItemButton href={appApkFileUrl}>
                                <ListItemIcon>
                                    {<GFontIcon icon="install_mobile" customClass='colorWhite'/>}
                                </ListItemIcon> 
                                <Typography className='varelaFontTitle colorWhite '>{t('GeneralDownloadAPK')}</Typography>
                            </ListItemButton>
                        </ListItem>
                    </>
                }
            </SwipeableDrawer>
            <Tooltip  className='animate__animated animate__fadeInLeft animate__delay-1s animate__fast' title={t('RoomLeftMenuRoomParams')} sx={{ bgColor:'#30363c'}}>
               
                    <TuneIcon 
                    onClick={e => handleOpenDrawerParam(!paramDrawerIsOpen)} 
                    sx={{mr:1, cursor:'pointer', color:'var(--white)'}}/>
            </Tooltip>
                
            <Typography  className='animate__animated animate__fadeInLeft animate__fast' component="div" sx={{ flexGrow: 1 , textTransform:'uppercase', fontSize:'12px',}}>
                Playlist <b style={{textTransform:'uppercase'}}><span>{ room.id }</span> </b> 
            </Typography>
            
            {isShowSticky && 
                <Grid className="animate__animated animate__fadeInDown stickyButtons"> 
                    {playerControlsShown && 
                        <>
                            <IconButton onClick={e => (playingFirstInList(playerIdPlayed) && isSpotifyAndIsNotPlayableBySpotify(playerIdPlayed-1, room.roomParams.isLinkedToSpotify)) ? setPlayerIdPlayed(playerIdPlayed - 1) : ''}>
                                <SkipPrevious sx={{color:(playingFirstInList(playerIdPlayed) && isSpotifyAndIsNotPlayableBySpotify(playerIdPlayed-1, room.roomParams.isLinkedToSpotify)) ? '#f0f1f0': '#303134'}} />
                            </IconButton>

                            <IconButton variant="contained" onClick={e => setIsPlaying(!roomIsPlaying)} sx={{position:'sticky', top:0, zIndex:2500}} >
                                { room.actuallyPlaying && <PauseCircleOutlineIcon  sx={{color:'#f0f1f0'}} />}
                                { !room.actuallyPlaying && <PlayCircleOutlineIcon sx={{color:'#f0f1f0'}} />}
                            </IconButton>

                            <IconButton onClick={e => !playingLastInList(room.playlistUrls.length,playerIdPlayed) ? setPlayerIdPlayed(playerIdPlayed + 1) : ''}>
                                <SkipNextIcon sx={{color: !playingLastInList(room.playlistUrls.length,playerIdPlayed) ? '#f0f1f0' : '#303134'}} />
                            </IconButton>
                        </>}
                    <VolumeButton volume={volume} setVolume={setVolume}/>
                </Grid>
            }
        </Toolbar>
    </AppBar>
  )
};

export default withTranslation()(RoomTopBar);