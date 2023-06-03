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

const RoomPlaylist = ({ roomPlaylist, roomIdActuallyPlaying, handleVoteChange, userVoteArray, handleChangeIdActuallyPlaying, roomIsActuallyPlaying, roomPlayedActuallyPlayed}) => {

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
            <List sx={{height: '100%', padding:0, mb:0}}>
                
                    {roomPlaylist.map(function(d, idx){
                    return (
                        <Fade key={idx} in={true} xs={12} sx={{  width:'100%', padding:0, margin:0}}>
                            <Grid item sx={{width:'100%', padding:0,pl:2, margin:0}} className='playlist_bloc'> 
                                
                                <ListItemButton sx={{ position:'relative',width:'100%', padding:0,pl:0,margin:0, backgroundColor:'#4f4f4f',borderBottom: '2px solid #3e464d', color:'white', "&.Mui-selected": {
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
                                    } }} onClick={e => handleChangeIdActuallyDisplaying(idx)} key={'playlist_'+idx} xs={12} selected={roomIdActuallyPlaying === idx}>
                                
                                    <ListItemIcon sx={{ pl:2,color:'white', zIndex:2}} className="hidden-xs">
                                            {idx !== roomIdActuallyPlaying && <PlayCircleOutlineIcon />}
                                            {idx === roomIdActuallyPlaying && roomIsActuallyPlaying && <PauseCircleOutlineIcon  />}
                                            {idx === roomIdActuallyPlaying && !roomIsActuallyPlaying && <PlayCircleOutlineIcon />}
                                    </ListItemIcon>
                                    <Grid item sx={{display:'block', zIndex:2, pl: 2, pb:0.5, flexGrow:1}}>
                                        { d.title && <ListItemText sx={{ pl:0, mb:0, wordBreak: 'break-all'}} primary={d.title.length > 50 ? d.title.substring(0, 50)+'...' : d.title} />}
                                        { (d.title && d.title.length === 0) || !d.title && <ListItemText sx={{ pl:0,mb:0, wordBreak: 'break-all'}} primary={d.url.substring(0, 40)+'...'} />}
                                        
                                        {(idx === idDisplaying || idx === roomIdActuallyPlaying)  && 
                                            <Typography sx={{ display:'block', width:'100%',ml:0, mb: 0, fontSize: '10px', textTransform:'uppercase' }}>
                                                Ajouté par : <b>{ roomPlaylist[idx].addedBy }</b>
                                            </Typography>
                                        }
                                        {(idx === idDisplaying || idx === roomIdActuallyPlaying)  && <Typography sx={{ display:'block', width:'100%',ml:0, mb: 1, fontSize: '8px', textTransform:'uppercase' }}>
                                                Source : { roomPlaylist[idx].source } 
                                            </Typography>
                                        }
                                        {idx === roomIdActuallyPlaying && roomIsActuallyPlaying && <Typography sx={{ display:'block', width:'100%',ml:0, mb: .5, fontSize: '10px', textTransform:'uppercase' }}>
                                            En lecture
                                        </Typography>}
                                        {idx === roomIdActuallyPlaying && !roomIsActuallyPlaying && <Typography sx={{ display:'block', width:'100%',ml:0, mb: .5, fontSize: '10px', textTransform:'uppercase' }}>
                                            En pause
                                        </Typography>}
                                        
                                    </Grid>
                                   {idx === roomIdActuallyPlaying && <LinearProgress sx={{height:'10px', position:'absolute', width:'100%', height:'100%', zIndex:1, opacity:0.5, "& .MuiLinearProgress-barColorPrimary": {
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