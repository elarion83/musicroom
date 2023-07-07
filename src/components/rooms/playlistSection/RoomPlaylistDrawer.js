
import { Avatar, Divider, Drawer, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, SwipeableDrawer } from "@mui/material";
import React from "react";
import ImageIcon from '@mui/icons-material/Image';

import { withTranslation } from 'react-i18next';
import DrawerPlayPauseButton from './drawer/DrawerPlayPauseButton';
import Button from '@mui/material/Button';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

const RoomPlaylistDrawer = ({t, open, changeOpen, isAdminView, userVoteArray, roomPlaylist, changeIsPlaying, handleVoteChange, changeIdPlaying,  data, roomIsActuallyPlaying, roomIdActuallyPlaying, roomIdActuallyDisplaying }) => {
    
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
            id="menu-appbar"
            anchor='bottom'
            onClose={(e) => changeOpen(false)}
            open={open}
        >
            {data && <List sx={{ width: '100%', mb:'15em' }}>
                <ListItem>
                    <DrawerPlayPauseButton 
                        isAdminView={isAdminView}
                        isPlaying={roomIsActuallyPlaying}
                        changeIsPlaying={changeIsPlaying}
                        changeIdPlaying={changeIdPlaying}
                        idActuallyPlaying={roomIdActuallyPlaying}
                        idActuallyDisplaying={roomIdActuallyDisplaying} />
                    <ListItemText primary={data.title} secondary={"Via "+data.source+" par "+data.addedBy} />
                    
                </ListItem>
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