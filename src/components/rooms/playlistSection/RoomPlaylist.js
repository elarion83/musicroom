import React, { useState } from "react";

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import Fade from '@mui/material/Fade';
import LinearProgress from '@mui/material/LinearProgress';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';


import { Icon } from '@iconify/react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SoundWave from "../SoundWave";

import { withTranslation } from 'react-i18next';


const RoomPlaylist = ({t, isSpotifyAvailable, handleChangeIdShownInDrawer, roomPlaylist, roomIdActuallyPlaying, roomIsActuallyPlaying, roomPlayedActuallyPlayed}) => {

    const [idDisplaying, setIdDisplaying] = useState(roomIdActuallyPlaying);

    function handleChangeIdActuallyDisplaying(idDisplaying) {
        setIdDisplaying(idDisplaying);
    }
    
    return (
        <Paper className={'scroll'} style={{borderRadius:0}}>
            <List sx={{height: '100%', padding:0}}>
                
                    {roomPlaylist.map(function(d, idx){
                    return (
                        <Fade key={idx} in={true} xs={12} sx={{  width:'100%', p:0, m:0}}>
                            <Grid item sx={{width:'100%', p:0,pl:2, m:0}} className={`playlist_bloc ${(d.source === 'spotify') ? !isSpotifyAvailable ? 'mediaUnavailable' : '' : 'mediaAvailable'}`}> 
                                
                                <ListItemButton 
                                    onClick={e => handleChangeIdShownInDrawer(idx)}
                                    sx={{ alignItems:'flex-start',position:'relative',width:'100%', pl:2,m:0, pr:'35px', backgroundColor:'var(--main-bg-color)',borderBottom: '2px solid var(--border-color)', color:'var(--white)', "&.Mui-selected": {
                                        backgroundColor: "var(--grey-dark)",
                                        transition: 'all 0.3s ease-out'
                                        }
                                         }} key={'playlist_'+idx} xs={12} selected={roomIdActuallyPlaying === idx}>
                                        {idx === roomIdActuallyPlaying && !(d.source === 'spotify' && !isSpotifyAvailable) && <ListItemIcon sx={{ pt:'10px',color:'var(--white)',pl: 1,pr:-2, zIndex:2, display:'flex', flexDirection:'column'}}>        
                                                <SoundWave waveNumber={7} isPlayingOrNo={roomIsActuallyPlaying} />
                                        </ListItemIcon>}
                                            {(d.source === 'spotify' && !isSpotifyAvailable) && <Icon style={{display:'inline', marginRight:'0.5em', marginTop:'0.5em', color:'red'}} icon="ps:forbidden" />}
                                    <Grid item sx={{display:'block', zIndex:2, pl: 0, pb:0.5,pt:0.5, flexGrow:1}}>
                                        { d.title && <ListItemText className="flexRowCenterHDirectChild" onClick={e => (idx === idDisplaying) ? handleChangeIdActuallyDisplaying(-1) : handleChangeIdActuallyDisplaying(idx)} sx={{ pl:0,mb:0,mt:0, wordBreak: 'break-all'}}>
                                            {d.title.length > 50 ? d.title.substring(0, 50)+'...' : d.title}
                                        </ListItemText>}
                                        { (d.title && d.title.length === 0) || !d.title && 
                                            <ListItemText onClick={e => (idx === idDisplaying) ? handleChangeIdActuallyDisplaying(-1) : handleChangeIdActuallyDisplaying(idx)} sx={{ pl:0,mb:0,mt:0, wordBreak: 'break-all'}} 
                                            primary={d.url.substring(0, 40)+'...'} />
                                        }
                                        {idx === roomIdActuallyPlaying && <Typography sx={{ display:'block', width:'100%',ml:0, mb: 0, fontSize: '10px', textTransform:'uppercase' }}>
                                            {roomIsActuallyPlaying ? t('GeneralPlaying') : t('GeneralPause')}
                                        </Typography>}
                                    </Grid>
                                    <MoreVertIcon sx={{position:'absolute',zIndex:1, right:'10px', top:'calc(50% - 12px)', opacity:0.5, color:'var(--grey-light)'}} />
                                   {idx === roomIdActuallyPlaying && <LinearProgress sx={{top:0, left:0,position:'absolute', width:'100%', height:'100%', zIndex:1, opacity:0.5, "& .MuiLinearProgress-barColorPrimary": {
                                        backgroundColor: "var(--grey-dark)",
                                    }}} variant="determinate" value={roomPlayedActuallyPlayed} /> }
                                </ListItemButton>
                            </Grid>
                        </Fade>)
                    }) }
            </List>
        </Paper>
    )
};

export default withTranslation()(RoomPlaylist);