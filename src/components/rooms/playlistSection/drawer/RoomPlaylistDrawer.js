
import { Divider, Drawer, List, ListItem, ListItemText, Typography } from "@mui/material";
import React from "react";
import {isFromSpotify} from '../../../../services/utils';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import { Box } from "@mui/system";
import { withTranslation } from 'react-i18next';
import DrawerPlayPauseButton from './DrawerPlayPauseButton';

const RoomPlaylistDrawer = ({t,isSpotifyAvailable,roomPlayedActuallyPlayed, room,roomRef,open, changeOpen, isAdminView, userVoteArray, roomPlaylist, setIdPlaying, handleVoteChange,handleRemoveMediaFromPlaylist, setIsPlaying,  data, roomIsActuallyPlaying, roomIdActuallyPlaying, roomIdActuallyDisplaying }) => {
    
    const delay = ms => new Promise(res => setTimeout(res, ms));
    function handleVoteChangeInComp(idMedia, mediaHashId, type) {
        roomPlaylist[idMedia].vote[type]++;
        handleVoteChange(idMedia, roomPlaylist[idMedia].vote, mediaHashId, type);
    }
    
    async function removeMediaFromPlaylist(indexToRemove) {
        changeOpen(false);
        await delay(500);
        handleRemoveMediaFromPlaylist(indexToRemove);
    }

    return(
      <Drawer
            id="mediaInfoDrawer"
            anchor='bottom'
            onClose={(e) => changeOpen(false)}
            open={open}
            sx={{zIndex:2000}}
        >
            <Box className="DrawerBackButton" onClick={(e) => changeOpen(false)} ></Box>
            <Divider />                        

            {data && <>
                <Box className="DrawerGradient" sx={{backgroundImage:'url('+roomPlaylist[roomIdActuallyDisplaying].visuel+')'}}>
                </Box>
                    
               {/* <img className="DrawerImg" src={roomPlaylist[roomIdActuallyDisplaying].visuel} alt={roomPlaylist[roomIdActuallyDisplaying].title} /> */}
                <List sx={{ width: '100%', mb:'15em', p:0}}>
                    <ListItem sx={{pt:0, mt:0}}>
                        <DrawerPlayPauseButton 
                            room={room}
                            roomRef={roomRef}
                            isAdminView={isAdminView}
                            isPlayable={(isFromSpotify(data) && !isSpotifyAvailable) ? false : true}
                            isPlaying={roomIsActuallyPlaying}
                            setIsPlaying={setIsPlaying}
                            mediaDisplayingData={roomPlaylist[roomIdActuallyDisplaying]}
                            setIdPlaying={setIdPlaying}
                            idActuallyPlaying={roomIdActuallyPlaying}
                            idActuallyDisplaying={roomIdActuallyDisplaying} />
                        <ListItemText 
                             
                            primary={
                                <React.Fragment>
                                    <Typography className="varelaFontTitle"sx={{textShadow:'1px 1px 1px #423d3d'}}  >
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
                       
                    </ListItem>
                    {isFromSpotify(data) && !isSpotifyAvailable && 
                        <>
                            <Divider />
                            <ListItem sx={{pt:0, mt:0}}>
                                <ListItemText primary="Lecture Impossible" secondary="Spotify déconnecté de la playlist" />
                            </ListItem>
                        </>
                    }
                    <Divider variant="middle" light={true} sx={{width:'40%'}} />
                    <ListItemText sx={{m:1,ml:2}}>
                        <Button size="small" variant="text" 
                            onClick={e => userVoteArray.up.includes(data.hashId) ? '' : handleVoteChangeInComp(roomIdActuallyDisplaying, data.hashId, 'up')}
                            sx={{zIndex:5, ml:0, fontSize:'0.8em', color: userVoteArray.up.includes(data.hashId) ? '#66BB6A' : 'var(--grey-dark)'}}>
                            <ThumbUpIcon  fontSize="small" sx={{mr:1, color: userVoteArray.up.includes(data.hashId) ? '#66BB6A' : 'var(--grey-dark)'}}/>
                            <Typography>{data.vote.up }</Typography>
                        </Button>

                        <Button size="small" variant="text" 
                            onClick={e => userVoteArray.down.includes(data.hashId) ? '' : handleVoteChangeInComp(roomIdActuallyDisplaying, data.hashId, 'down')}
                            sx={{zIndex:5, ml:0, fontSize:'0.8em', color: userVoteArray.down.includes(data.hashId) ? '#E91E63' : 'var(--grey-dark)'}}>
                            <ThumbDownAltIcon  fontSize="small" sx={{mr:1, color: userVoteArray.down.includes(data.hashId) ? '#E91E63' : 'var(--grey-dark)'}}/>
                            <Typography>{data.vote.down }</Typography>
                        </Button>

                        {isAdminView && (roomIdActuallyDisplaying > roomIdActuallyPlaying) &&
                            <Button size="small" variant="text" sx={{zIndex:5, ml:1, fontSize:'0.8em',  color:'#66BB6A'}} onClick={e => removeMediaFromPlaylist(roomIdActuallyDisplaying)}>
                                <DeleteIcon fontSize="small" sx={{color:'#E91E63'}}/>
                            </Button>
                        }
                    </ListItemText>
            </List></>}
    </Drawer>
    )
};

export default withTranslation()(RoomPlaylistDrawer);