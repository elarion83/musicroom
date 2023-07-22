
import { Divider, Drawer, LinearProgress, List, ListItem, ListItemText, Typography } from "@mui/material";
import React from "react";

import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import Button from '@mui/material/Button';
import { Box } from "@mui/system";
import { withTranslation } from 'react-i18next';
import DrawerPlayPauseButton from './DrawerPlayPauseButton';

const RoomPlaylistDrawer = ({t,isSpotifyAvailable,roomPlayedActuallyPlayed, open, changeOpen, isAdminView, userVoteArray, roomPlaylist, changeIsPlaying, handleVoteChange, changeIdPlaying,  data, roomIsActuallyPlaying, roomIdActuallyPlaying, roomIdActuallyDisplaying }) => {
    
    function handleVotePositif(idMedia, mediaHashId) {
        roomPlaylist[idMedia].vote.up++;
        handleVoteChange(idMedia, roomPlaylist[idMedia].vote, mediaHashId, 'up');
    }

    function handleVoteNegatif(idMedia, mediaHashId) {
        roomPlaylist[idMedia].vote.down++;
        handleVoteChange(idMedia, roomPlaylist[idMedia].vote, mediaHashId, 'down');
    }
    
    return(
      <Drawer
            id="mediaInfoDrawer"
            anchor='bottom'
            onClose={(e) => changeOpen(false)}
            open={open}
            sx={{zIndex:2000, borderTopLeftRadius:'5px'}}
        >
            <Box className="DrawerBackButton" onClick={(e) => changeOpen(false)} ></Box>
            <Divider />
            {data && <List sx={{ width: '100%', mb:'15em', p:0}}>
                <ListItem sx={{pt:0, mt:0}}>
                    <DrawerPlayPauseButton 
                        isAdminView={isAdminView}
                        isPlayable={(data.source === 'spotify' && !isSpotifyAvailable) ? false : true}
                        isPlaying={roomIsActuallyPlaying}
                        changeIsPlaying={changeIsPlaying}
                        mediaDisplayingData={roomPlaylist[roomIdActuallyDisplaying]}
                        changeIdPlaying={changeIdPlaying}
                        idActuallyPlaying={roomIdActuallyPlaying}
                        idActuallyDisplaying={roomIdActuallyDisplaying} />
                    <ListItemText 
                        sx={{zIndex:2}} 
                        primary={
                            <React.Fragment>
                                <Typography className="varelaFontTitle">
                                    {data.title} 
                                </Typography>
                            </React.Fragment>
                        }
                        secondary={
                            <React.Fragment>
                                <Typography>
                                    {t('GeneralVia')} <b>{data.source}</b> {t('GeneralBy')} <b>{data.addedBy}</b>
                                </Typography>
                            </React.Fragment>
                        }
                    />
                    {roomIdActuallyPlaying === roomIdActuallyDisplaying &&
                    <LinearProgress className="DrawerMediaLinearProgress" sx={{top:0, left:0,position:'absolute', width:'100%', height:'100%', zIndex:1, opacity:0.5, "& .MuiLinearProgress-barColorPrimary": {
                        backgroundColor: 'var(--grey-lighter)',
                    }}} variant="determinate" value={roomPlayedActuallyPlayed} />}
                </ListItem>
                {data.source === 'spotify' && !isSpotifyAvailable && 
                    <><Divider />
                    <ListItem sx={{pt:0, mt:0}}>
                        <ListItemText primary="Lecture Impossible" secondary="Spotify déconnecté de la room" />
                    </ListItem></>
                }
                <Divider />
                <ListItemText sx={{m:1,ml:2}}>
                    {!userVoteArray.up.includes(data.hashId) && 
                        <Button size="small"variant="text" sx={{ color:'var(--grey-dark)'}}  onClick={e => handleVotePositif(roomIdActuallyDisplaying, data.hashId)}>
                            <ThumbUpIcon  fontSize="small" sx={{mr:1, color:'var(--grey-dark)'}} />
                            {data.vote.up }
                        </Button>
                    }
                    {userVoteArray.up.includes(data.hashId) && 
                        <Button size="small"variant="text" sx={{zIndex:5, ml:0, fontSize:'0.8em',  color:'#66BB6A'}}>
                            <ThumbUpIcon  fontSize="small" sx={{mr:1, color:'#66BB6A'}}/>
                            {data.vote.up }
                        </Button>
                    }

                    {!userVoteArray.down.includes(data.hashId) &&
                        <Button size="small" variant="text" sx={{zIndex:5, ml:2, fontSize:'0.8em',  color:'var(--grey-dark)'}}  onClick={e => handleVoteNegatif(roomIdActuallyDisplaying, data.hashId)}>
                            <ThumbDownAltIcon fontSize="small"  sx={{mr:1, color:'var(--grey-dark)'}} />
                            {data.vote.down }
                        </Button>
                    }
                    {userVoteArray.down.includes(data.hashId) &&
                            <Button size="small" variant="text" sx={{zIndex:5, ml:1, fontSize:'0.8em',  color:'#E91E63'}}>
                                <ThumbDownAltIcon fontSize="small"  sx={{mr:1,color:'#E91E63'}}/>
                                {data.vote.down }
                            </Button>
                    }
                </ListItemText>
            </List>}
            </Drawer>
    )
};

export default withTranslation()(RoomPlaylistDrawer);