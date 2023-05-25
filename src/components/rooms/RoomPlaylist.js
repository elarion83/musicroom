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
const RoomPlaylist = ({ roomPlaylist, roomIdActuallyPlaying, handleChangeIdActuallyPlaying, roomIsActuallyPlaying, roomPlayedActuallyPlayed}) => {
    
    return (
        <Paper style={{maxHeight: '550px', overflow: 'scroll'}}>
            <List sx={{height: '100%', overflow: 'scroll', padding:0}}>
                <Grid item xs={12}>
                    
                    {roomPlaylist.map(function(d, idx){
                    return (
                        <Fade in={true} xs={12} sx={{ width:'100%', padding:0, margin:0}}>
                            <Grid item sx={{ width:'100%', padding:0,pl:2, margin:0}}> 
                                
                                <ListItemButton sx={{ width:'100%', padding:0,pl:0,margin:0, bgcolor:'#4f4f4f', color:'white', "&.Mui-selected": {
                                    backgroundColor: "#F27C24"
                                    },
                                    "&.Mui-focusVisible": {
                                    backgroundColor: "#F27C24"
                                    },
                                    ":hover": {
                                    backgroundColor: "#F27C24"
                                    } }} onClick={e => handleChangeIdActuallyPlaying(idx)} key={'playlist_'+idx} xs={12} selected={roomIdActuallyPlaying === idx}>
                                
                                    <ListItemIcon sx={{ pl:2,color:'white', zIndex:2}}>
                                            {idx !== roomIdActuallyPlaying && <PlayCircleOutlineIcon />}
                                            {idx === roomIdActuallyPlaying && roomIsActuallyPlaying && <PauseCircleOutlineIcon  />}
                                            {idx === roomIdActuallyPlaying && !roomIsActuallyPlaying && <PlayCircleOutlineIcon />}
                                    </ListItemIcon>
                                    <Grid item sx={{display:'block', zIndex:2}}>
                                        { d.title && <ListItemText sx={{ pl:0}} primary={d.title} />}
                                        { d.title && d.title.length == 0 || !d.title && <ListItemText sx={{ pl:0}} primary={d.url.substring(0, 50)+'...'} />}
                                        <Typography sx={{ display:'block', width:'100%',ml:0, mb: 0, fontSize: '10px', textTransform:'uppercase' }}>
                                            Ajouté par : <b>{ roomPlaylist[idx].addedBy }</b>
                                        </Typography>
                                        <Typography sx={{ display:'block', width:'100%',ml:0, mb: 1, fontSize: '8px', textTransform:'uppercase' }}>
                                            Source : { roomPlaylist[idx].source } 
                                        </Typography>
                                        {idx === roomIdActuallyPlaying && roomIsActuallyPlaying && <Typography sx={{ display:'block', width:'100%',ml:0, mb: .5, fontSize: '10px', textTransform:'uppercase' }}>
                                            En lecture actuellement
                                        </Typography>}
                                        
                                        {idx === roomIdActuallyPlaying && !roomIsActuallyPlaying && <Typography sx={{ display:'block', width:'100%',ml:0, mb: .5, fontSize: '10px', textTransform:'uppercase' }}>
                                            En lecture actuellement mais le Lecteur est en pause
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