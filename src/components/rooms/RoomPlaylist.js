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

    const [idMediaOpen, setIdMediaOpen] = useState(0);

    function handleVotePositif(idMedia, mediaHashId) {
        roomPlaylist[idMedia].vote.up++;
        handleVoteChange(idMedia, roomPlaylist[idMedia].vote, mediaHashId, 'up');
    }

    function handleVoteNegatif(idMedia, mediaHashId) {
        roomPlaylist[idMedia].vote.down++;
        handleVoteChange(idMedia, roomPlaylist[idMedia].vote, mediaHashId, 'down');
    }

    function handleChangeMediaOpen(idMedia) {
        setIdMediaOpen(idMedia);
    }


    return (
        <Paper className={'scroll'} style={{borderRadius:0}}>
            <List sx={{height: '100%', padding:0, mb:0}}>
                
                    {roomPlaylist.map(function(d, idx){
                    return (<Accordion expanded={idMediaOpen === idx} onChange={e => handleChangeMediaOpen(idx)} className='playlist_bloc' sx={{borderBottom: '2px solid #3e464d'}}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1d-content" id="panel1d-header" sx ={{backgroundColor:'#4f4f4f',color:'white'}}>
                                        <ListItemIcon sx={{ pl:2,color:'white', zIndex:2}} className="hidden-xs">
                                                {idx !== roomIdActuallyPlaying && <PlayCircleOutlineIcon />}
                                                {idx === roomIdActuallyPlaying && roomIsActuallyPlaying && <PauseCircleOutlineIcon  />}
                                                {idx === roomIdActuallyPlaying && !roomIsActuallyPlaying && <PlayCircleOutlineIcon />}
                                        </ListItemIcon>
                                        <Grid item sx={{display:'block', zIndex:2, pl: 2, pb:0.5, flexGrow:1}}>
                                            { d.title && <ListItemText sx={{ pl:0, mb:0, wordBreak: 'break-all'}} primary={d.title.length > 50 ? d.title.substring(0, 50)+'...' : d.title} />}
                                            { (d.title && d.title.length === 0) || !d.title && <ListItemText sx={{ pl:0,mb:0, wordBreak: 'break-all'}} primary={d.url.substring(0, 40)+'...'} />}
                                        </Grid>
                                        {idx === roomIdActuallyPlaying && <LinearProgress sx={{height:'10px', top:0, left:0, position:'absolute', width:'100%', height:'100%', zIndex:1, opacity:0.5, "& .MuiLinearProgress-barColorPrimary": {
                                            backgroundColor: "#262626",
                                        }}} variant="determinate" value={roomPlayedActuallyPlayed} /> }
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography>
                                            <Grid item sx={{display:'block', zIndx:2, pl: 2, pb:0.5, flexGrow:1}}>
                                                <Typography sx={{ display:'block', width:'100%',ml:0, mb: 0, fontSize: '10px', textTransform:'uppercase' }}>
                                                    Ajouté par : <b>{ roomPlaylist[idx].addedBy }</b>
                                                </Typography>
                                                <Typography sx={{ display:'block', width:'100%',ml:0, mb: 1, fontSize: '8px', textTransform:'uppercase' }}>
                                                    Source : { roomPlaylist[idx].source } 
                                                </Typography>
                                                {idx === roomIdActuallyPlaying && roomIsActuallyPlaying && <Typography sx={{ display:'block', width:'100%',ml:0, mb: .5, fontSize: '10px', textTransform:'uppercase' }}>
                                                    En lecture
                                                </Typography>}
                                                {idx === roomIdActuallyPlaying && !roomIsActuallyPlaying && <Typography sx={{ display:'block', width:'100%',ml:0, mb: .5, fontSize: '10px', textTransform:'uppercase' }}>
                                                    En pause
                                                </Typography>}
                                            </Grid>
                                            <Grid item sx={{display:'block', zIndx:2, pl: 2, pb:0.5, flexGrow:1}} >
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
                                            </Grid>
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>) })}

                          
            </List>
        </Paper>
    )
};

export default RoomPlaylist;