import React, { useEffect, useRef, useState } from "react";

import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';

import Fade from '@mui/material/Fade';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import LinearProgress from '@mui/material/LinearProgress';


import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import IconButton from '@mui/material/IconButton';
import { Diversity1TwoTone } from '@mui/icons-material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Icon } from '@iconify/react';

const RoomPlaylist = ({ isAdminView, roomPlaylist, roomIdActuallyPlaying, handleVoteChange, userVoteArray, handleChangeIdActuallyPlaying, roomIsActuallyPlaying, roomPlayedActuallyPlayed}) => {

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
    return (
        <Paper className={'scroll'} style={{borderRadius:0}}>
            <List sx={{height: '100%', padding:0}}>
                
                    {roomPlaylist.map(function(d, idx){
                    return (
                        <Fade key={idx} in={true} xs={12} sx={{  width:'100%', padding:0, margin:0}}>
                            <Grid item sx={{width:'100%', padding:0,pl:2, margin:0}} className='playlist_bloc'> 
                                
                                <ListItemButton sx={{ alignItems:'flex-start',position:'relative',width:'100%', pt:1,pl:0,margin:0, backgroundColor:'var(--main-bg-color)',borderBottom: '2px solid #3e464d', color:'white', "&.Mui-selected": {
                                        backgroundColor: "#262626",
                                        transition: 'all 0.3s ease-out'
                                        },
                                        "&.Mui-focusVisible": {
                                        backgroundColor: "#262626",
                                        transition: 'all 0.3s ease-out'
                                        },
                                        ":hover": {
                                        backgroundColor: "#262626",
                                        transition: 'all 0.3s ease-out'
                                        } }} key={'playlist_'+idx} xs={12} selected={roomIdActuallyPlaying === idx}>
                                    <ListItemIcon sx={{ pl:2,paddingTop:'5px',color:'white', zIndex:2, display:'flex', flexDirection:'column'}}>        
                                            {idx !== idDisplaying && idx !== roomIdActuallyPlaying && <ExpandMoreIcon sx={{display:'inline-block'}}  onClick={e => handleChangeIdActuallyDisplaying(idx)}/>}
                                            {idx === idDisplaying && idx !== roomIdActuallyPlaying && <ExpandLessIcon sx={{display:'inline-block'}} onClick={e => handleChangeIdActuallyDisplaying(-1)}  />}
                                            {idx === idDisplaying && idx !== roomIdActuallyPlaying && isAdminView && <PlayCircleOutlineIcon sx={{mt:1}} onClick={e => handleChangeIdActuallyPlaying(idx)}  />}
                                            {idx === roomIdActuallyPlaying && 
                                                <>
                                                    <div className={roomIsActuallyPlaying ? 'animated soundWaveContainer' : 'waiting soundWaveContainer'}>
                                                        <div class="box boxQuiet"></div>
                                                        <div class="box boxNormal"></div>
                                                        <div class="box boxQuiet"></div>
                                                        <div class="box boxLoud"></div>
                                                        <div class="box boxQuiet"></div>
                                                        <div class="box boxNormal"></div>
                                                        <div class="box boxLoud"></div>
                                                    </div>
                                                </>
                                            }

                                    </ListItemIcon>
                                    <Grid item sx={{display:'block', zIndex:2, pl: 0, pb:0.5, flexGrow:1}}>
                                        { d.title && <ListItemText onClick={e => (idx === idDisplaying) ? handleChangeIdActuallyDisplaying(-1) : handleChangeIdActuallyDisplaying(idx)} sx={{ pl:0,mb:0, wordBreak: 'break-all'}}>
                                            {d.source === 'spotify' && <Icon style={{display:'inline', marginRight:'0.5em'}} icon="mdi:spotify" />}
                                            {d.source === 'youtube' && <Icon style={{display:'inline', marginRight:'0.5em'}} icon="mdi:youtube" />}
                                            {d.source === 'dailymotion' && <Icon style={{display:'inline', marginRight:'0.5em'}} icon="bxl:dailymotion" />}
                                            {d.source === 'soundcloud' && <Icon style={{display:'inline', marginRight:'0.5em'}} icon="mdi:soundcloud" />}
                                            {d.source === 'url' && <Icon style={{display:'inline', marginRight:'0.5em'}} icon="mdi:link-variant" />}
                                            {d.title.length > 50 ? d.title.substring(0, 50)+'...' : d.title}
                                        </ListItemText>}
                                        { (d.title && d.title.length === 0) || !d.title && 
                                        <ListItemText onClick={e => (idx === idDisplaying) ? handleChangeIdActuallyDisplaying(-1) : handleChangeIdActuallyDisplaying(idx)} sx={{ pl:0,mb:0, wordBreak: 'break-all'}} primary={d.url.substring(0, 40)+'...'} />}
                                        
                                        {(idx === idDisplaying  || roomIdActuallyPlaying == idx)  && 
                                            <Typography sx={{ display:'block', width:'100%',ml:0, mb: 0, pt:1, fontSize: '10px', textTransform:'uppercase' }}>
                                                Ajouté par : <b>{ roomPlaylist[idx].addedBy }</b>
                                            </Typography>
                                        }
                                        {(idx === idDisplaying || roomIdActuallyPlaying == idx)  && <Typography sx={{ display:'block', width:'100%',ml:0, mb: 1, fontSize: '8px', textTransform:'uppercase' }}>
                                                Source : { roomPlaylist[idx].source } 
                                            </Typography>
                                        }
                                        {idx === roomIdActuallyPlaying && <Typography sx={{ display:'block', width:'100%',ml:0, mb: 0, fontSize: '10px', textTransform:'uppercase' }}>
                                            {roomIsActuallyPlaying ? 'En lecture' : 'En pause'}
                                        </Typography>}
                                    </Grid>
                                   {idx === roomIdActuallyPlaying && <LinearProgress sx={{height:'10px',top:0, position:'absolute', width:'100%', height:'100%', zIndex:1, opacity:0.5, "& .MuiLinearProgress-barColorPrimary": {
                                        backgroundColor: "#262626",
                                    }}} variant="determinate" value={roomPlayedActuallyPlayed} /> }
                                </ListItemButton>
                                
                                {(idx === idDisplaying || idx === roomIdActuallyPlaying) && <Grid className='votebuttons' sx={{position:'absolute', right:'5px', bottom:'10px'}}>
                                        {!userVoteArray.up.includes(roomPlaylist[idx].hashId) && 
                                            <Button size="small" variant="contained" sx={{zIndex:5,mr:2, fontSize:'0.8em', color:'white', bgcolor:'#262626'}}  onClick={e => handleVotePositif(idx, roomPlaylist[idx].hashId)}>
                                                <ThumbUpIcon  fontSize="small" sx={{mr:1}}/>
                                                {roomPlaylist[idx].vote.up }
                                            </Button>
                                        }
                                        {userVoteArray.up.includes(roomPlaylist[idx].hashId) && 
                                            <Button size="small" variant="contained" sx={{zIndex:5,mr:2, fontSize:'0.8em', color:'white', bgcolor:'#262626'}}>
                                                <ThumbUpIcon  fontSize="small" sx={{mr:1, color:'#66BB6A'}}/>
                                                {roomPlaylist[idx].vote.up }
                                            </Button>
                                        }
                                        {!userVoteArray.down.includes(roomPlaylist[idx].hashId) &&
                                                <Button size="small" variant="contained" sx={{zIndex:5, fontSize:'0.8em',  color:'white', bgcolor:'#262626'}}  onClick={e => handleVoteNegatif(idx, roomPlaylist[idx].hashId)}>
                                                    <ThumbDownAltIcon fontSize="small"  sx={{mr:1}}/>
                                                    {roomPlaylist[idx].vote.down }
                                                </Button>
                                        }
                                        {userVoteArray.down.includes(roomPlaylist[idx].hashId) &&
                                                <Button size="small" variant="contained" sx={{zIndex:5, fontSize:'0.8em',  color:'white', bgcolor:'#262626'}}>
                                                    <ThumbDownAltIcon fontSize="small"  sx={{mr:1,color:'#E91E63'}}/>
                                                    {roomPlaylist[idx].vote.down }
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