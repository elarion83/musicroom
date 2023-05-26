import React, { useEffect, useRef } from "react";

import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import Fade from '@mui/material/Fade';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import LinearProgress from '@mui/material/LinearProgress';
import { Diversity1TwoTone } from '@mui/icons-material';

const RoomPlaylist = ({ roomPlaylist, roomIdActuallyPlaying, handleChangeIdActuallyPlaying, roomIsActuallyPlaying, roomPlayedActuallyPlayed}) => {

    const scrollRef = useRef(null);
    useEffect(() => {
        // 👇️ scroll to bottom every time messages change
//        scrollRef.current?.scrollTo(0 , scrollRef.current?.scrollHeight);
    }, [roomIdActuallyPlaying]);

    return (
        <Paper ref={scrollRef} className={'scroll'} style={{maxHeight: '500px', overflowY: 'scroll', overflowX: 'hidden',borderRadius:0}}>
            <List sx={{height: '100%', padding:0}}>
                <Grid item xs={12}>
                    
                    {roomPlaylist.map(function(d, idx){
                    return (
                        <Fade in={true} xs={12} sx={{ width:'100%', padding:0, margin:0}}>
                            <Grid item sx={{ width:'100%', padding:0,pl:2, margin:0}}> 
                                
                                <ListItemButton sx={{ width:'100%', padding:0,pl:0,margin:0, backgroundColor:'#4f4f4f',borderBottom: '2px solid #3e464d', color:'white', "&.Mui-selected": {
                                    backgroundColor: "#cda389"
                                    },
                                    "&.Mui-focusVisible": {
                                    backgroundColor: "#cda389"
                                    },
                                    ":hover": {
                                    backgroundColor: "#cda389"
                                    } }} onClick={e => handleChangeIdActuallyPlaying(idx)} key={'playlist_'+idx} xs={12} selected={roomIdActuallyPlaying === idx}>
                                
                                    <ListItemIcon sx={{ pl:2,color:'white', zIndex:2}}>
                                            {idx !== roomIdActuallyPlaying && <PlayCircleOutlineIcon />}
                                            {idx === roomIdActuallyPlaying && roomIsActuallyPlaying && <PauseCircleOutlineIcon  />}
                                            {idx === roomIdActuallyPlaying && !roomIsActuallyPlaying && <PlayCircleOutlineIcon />}
                                    </ListItemIcon>
                                    <Grid item sx={{display:'block', zIndex:2, pb:0.5}}>
                                        { d.title && <ListItemText sx={{ pl:0, mb:0, wordBreak: 'break-all'}} primary={d.title.substring(0, 50)+'...'} />}
                                        { (d.title && d.title.length === 0) || !d.title && <ListItemText sx={{ pl:0,mb:0, wordBreak: 'break-all'}} primary={d.url.substring(0, 40)+'...'} />}
                                        <Typography sx={{ display:'block', width:'100%',ml:0, mb: 0, fontSize: '10px', textTransform:'uppercase' }}>
                                            Ajouté par : <b>{ roomPlaylist[idx].addedBy }</b>
                                        </Typography>
                                        {idx === roomIdActuallyPlaying && <Typography sx={{ display:'block', width:'100%',ml:0, mb: 1, fontSize: '8px', textTransform:'uppercase' }}>
                                            Source : { roomPlaylist[idx].source } 
                                        </Typography>}
                                        {idx === roomIdActuallyPlaying && roomIsActuallyPlaying && <Typography sx={{ display:'block', width:'100%',ml:0, mb: .5, fontSize: '10px', textTransform:'uppercase' }}>
                                            En lecture
                                        </Typography>}
                                        {idx === roomIdActuallyPlaying && !roomIsActuallyPlaying && <Typography sx={{ display:'block', width:'100%',ml:0, mb: .5, fontSize: '10px', textTransform:'uppercase' }}>
                                            En pause
                                        </Typography>}
                                    </Grid>

                                   {idx === roomIdActuallyPlaying && <LinearProgress sx={{height:'10px', position:'absolute', width:'100%', height:'100%', zIndex:1, opacity:0.5}} variant="determinate" value={roomPlayedActuallyPlayed} /> }
                                </ListItemButton>
                                
                            </Grid>
                        </Fade>)
                    }) }
                </Grid>
            </List>
        </Paper>
    )
};

export default RoomPlaylist;