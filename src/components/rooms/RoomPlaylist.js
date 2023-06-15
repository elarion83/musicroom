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
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import SoundWave from "./SoundWave";

const RoomPlaylist = ({isSpotifyAvailable, isAdminView, roomPlaylist, roomIdActuallyPlaying, handleVoteChange, userVoteArray, handleChangeIdActuallyPlaying, roomIsActuallyPlaying, roomPlayedActuallyPlayed}) => {

    const [idDisplaying, setIdDisplaying] = useState(roomIdActuallyPlaying);

    function handleVotePositif(idMedia, mediaHashId) {
        roomPlaylist[idMedia].vote.up++;
        handleVoteChange(idMedia, roomPlaylist[idMedia].vote, mediaHashId, 'up');
    }

    function handleVoteNegatif(idMedia, mediaHashId) {
        roomPlaylist[idMedia].vote.down++;
        handleVoteChange(idMedia, roomPlaylist[idMedia].vote, mediaHashId, 'down');
    }

    function handleChangeIdActuallyDisplaying(idDisplaying) {
        setIdDisplaying(idDisplaying);
    }
    
    function handleChangeIdActuallyPlayingInComp(id) {
        if(roomPlaylist[id].source === 'spotify' && !isSpotifyAvailable ) {
            handleChangeIdActuallyPlayingInComp(id+1);
        } else {
            handleChangeIdActuallyPlaying(id);
        }
    }
    return (
        <Paper className={'scroll'} style={{borderRadius:0}}>
            <List sx={{height: '100%', padding:0}}>
                
                    {roomPlaylist.map(function(d, idx){
                    return (
                        <Fade key={idx} in={true} xs={12} sx={{  width:'100%', p:0, m:0}}>
                            <Grid item sx={{width:'100%', p:0,pl:2, m:0}} className={`playlist_bloc ${(d.source === 'spotify') ? !isSpotifyAvailable ? 'mediaUnavailable' : '' : 'mediaAvailable'}`}> 
                                
                                <ListItemButton sx={{ alignItems:'flex-start',position:'relative',width:'100%', pt:1,pl:0,m:0, backgroundColor:'var(--main-bg-color)',borderBottom: '2px solid var(--border-color)', color:'var(--white)', "&.Mui-selected": {
                                        backgroundColor: "var(--grey-dark)",
                                        transition: 'all 0.3s ease-out'
                                        },
                                        "&.Mui-focusVisible": {
                                        backgroundColor: "var(--grey-dark)",
                                        transition: 'all 0.3s ease-out'
                                        },
                                        ":hover": {
                                        backgroundColor: "var(--grey-dark)",
                                        transition: 'all 0.3s ease-out'
                                        } }} key={'playlist_'+idx} xs={12} selected={roomIdActuallyPlaying === idx}>
                                    <ListItemIcon sx={{ pl:2,pt:'5px',color:'var(--white)', zIndex:2, display:'flex', flexDirection:'column'}}>        
                                            {idx !== idDisplaying && idx !== roomIdActuallyPlaying && <ExpandMoreIcon sx={{display:'inline-block'}}  onClick={e => handleChangeIdActuallyDisplaying(idx)}/>}
                                            {idx === idDisplaying && idx !== roomIdActuallyPlaying && <ExpandLessIcon sx={{display:'inline-block'}} onClick={e => handleChangeIdActuallyDisplaying(-1)}  />}
                                            {(idx === idDisplaying) && (idx !== roomIdActuallyPlaying) && isAdminView && <PlayCircleOutlineIcon sx={{mt:1}} onClick={e => handleChangeIdActuallyPlayingInComp(idx)}  />}
                                            
                                            {(d.source === 'spotify' && !isSpotifyAvailable) && (idx !== roomIdActuallyPlaying) && (idx === idDisplaying) && <Icon className='mediaForbiddenIcon' icon="ps:forbidden" />}
                                            {idx === roomIdActuallyPlaying && 
                                                <SoundWave waveNumber={7}  isPlayingOrNo={roomIsActuallyPlaying} />
                                            }

                                    </ListItemIcon>
                                    <Grid item sx={{display:'block', zIndex:2, pl: 0, pb:0.5, flexGrow:1}}>
                                        { d.title && <ListItemText className="flexRowCenterHDirectChild" onClick={e => (idx === idDisplaying) ? handleChangeIdActuallyDisplaying(-1) : handleChangeIdActuallyDisplaying(idx)} sx={{ pl:0,mb:0, wordBreak: 'break-all'}}>
                                            {d.source === 'spotify' && <Icon style={{display:'inline', marginRight:'0.5em'}} icon="mdi:spotify" />}
                                            {d.source === 'youtube' && <Icon style={{display:'inline', marginRight:'0.5em'}} icon="mdi:youtube" />}
                                            {d.source === 'dailymotion' && <Icon style={{display:'inline', marginRight:'0.5em'}} icon="bxl:dailymotion" />}
                                            {d.source === 'soundcloud' && <Icon style={{display:'inline', marginRight:'0.5em'}} icon="mdi:soundcloud" />}
                                            {d.source === 'url' && <Icon style={{display:'inline', marginRight:'0.5em'}} icon="mdi:link-variant" />}
                                            {(d.source === 'spotify' && !isSpotifyAvailable) && <Icon style={{display:'inline', marginRight:'0.5em', color:'red'}} icon="ps:forbidden" />}
                                            {d.title.length > 50 ? d.title.substring(0, 50)+'...' : d.title}
                                        </ListItemText>}
                                        { (d.title && d.title.length === 0) || !d.title && 
                                            <ListItemText onClick={e => (idx === idDisplaying) ? handleChangeIdActuallyDisplaying(-1) : handleChangeIdActuallyDisplaying(idx)} sx={{ pl:0,mb:0, wordBreak: 'break-all'}} 
                                            primary={d.url.substring(0, 40)+'...'} />
                                        }
                                        
                                        {(idx === idDisplaying  || roomIdActuallyPlaying === idx)  && 
                                            <Typography sx={{ display:'block', width:'100%',ml:0, mb: 0, pt:1, fontSize: '10px', textTransform:'uppercase' }}>
                                                Ajouté par <span>{ d.addedBy }</span>
                                            </Typography>
                                        }
                                        {(idx === idDisplaying || roomIdActuallyPlaying === idx)  && <Typography sx={{ display:'block', width:'100%',ml:0, mb: 1, fontSize: '8px', textTransform:'uppercase' }}>
                                                Source : { d.source } 
                                                {(d.source === 'spotify' && !isSpotifyAvailable) && <span style={{color:'var(--red) !important'}} > ( Non connecté )</span>}
                                            </Typography>
                                        }
                                        {idx === roomIdActuallyPlaying && <Typography sx={{ display:'block', width:'100%',ml:0, mb: 0, fontSize: '10px', textTransform:'uppercase' }}>
                                            {roomIsActuallyPlaying ? 'En lecture' : 'En pause'}
                                        </Typography>}
                                    </Grid>
                                   {idx === roomIdActuallyPlaying && <LinearProgress sx={{top:0, position:'absolute', width:'100%', height:'100%', zIndex:1, opacity:0.5, "& .MuiLinearProgress-barColorPrimary": {
                                        backgroundColor: "var(--grey-dark)",
                                    }}} variant="determinate" value={roomPlayedActuallyPlayed} /> }
                                </ListItemButton>
                                
                                {(idx === idDisplaying || idx === roomIdActuallyPlaying) && <Grid className='votebuttons' sx={{position:'absolute', right:'5px', bottom:'10px'}}>
                                        {!userVoteArray.up.includes(d.hashId) && 
                                            <Button size="small" variant="contained" sx={{zIndex:5,mr:2, fontSize:'0.8em', color:'var(--white)', bgcolor:'var(--grey-dark)'}}  onClick={e => handleVotePositif(idx, d.hashId)}>
                                                <ThumbUpIcon  fontSize="small" sx={{mr:1}}/>
                                                {d.vote.up }
                                            </Button>
                                        }
                                        {userVoteArray.up.includes(d.hashId) && 
                                            <Button size="small" variant="contained" sx={{zIndex:5,mr:2, fontSize:'0.8em', color:'var(--white)', bgcolor:'var(--grey-dark)'}}>
                                                <ThumbUpIcon  fontSize="small" sx={{mr:1, color:'#66BB6A'}}/>
                                                {d.vote.up }
                                            </Button>
                                        }
                                        {!userVoteArray.down.includes(d.hashId) &&
                                                <Button size="small" variant="contained" sx={{zIndex:5, fontSize:'0.8em',  color:'var(--white)', bgcolor:'var(--grey-dark)'}}  onClick={e => handleVoteNegatif(idx, d.hashId)}>
                                                    <ThumbDownAltIcon fontSize="small"  sx={{mr:1}}/>
                                                    {d.vote.down }
                                                </Button>
                                        }
                                        {userVoteArray.down.includes(d.hashId) &&
                                                <Button size="small" variant="contained" sx={{zIndex:5, fontSize:'0.8em',  color:'white', bgcolor:'var(--grey-dark)'}}>
                                                    <ThumbDownAltIcon fontSize="small"  sx={{mr:1,color:'#E91E63'}}/>
                                                    {d.vote.down }
                                                </Button>
                                        }
                                </Grid>}
                                
                            </Grid>
                        </Fade>)
                    }) }
            </List>
        </Paper>
    )
};

export default RoomPlaylist;