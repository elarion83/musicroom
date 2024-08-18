import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import { Accordion, AccordionDetails, AccordionSummary, Divider, Drawer, Link, List, ListItem, ListItemText, Typography } from "@mui/material";
import React, { useState } from "react";
import {cleanMediaTitle, delay, isVarExistNotEmpty} from '../../../../services/utils';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import { Box } from "@mui/system";
import { withTranslation } from 'react-i18next';
import DrawerPlayPauseButton from './DrawerPlayPauseButton';
import LaunchIcon from '@mui/icons-material/Launch';

const RoomPlaylistDrawer = ({t,room,roomRef,open, changeOpen, isAdminView, userVoteArray, roomPlaylist, setIdPlaying, handleVoteChange,handleRemoveMediaFromPlaylist, setIsPlaying,  data, roomIsActuallyPlaying, roomIdActuallyPlaying, roomIdActuallyDisplaying }) => {
    
    const [descriptionOpen, setDescriptionOpen] = useState(false);
    
    const handleOpenDescription =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setDescriptionOpen(descriptionOpen ? false : true);
    };  

    function handleVoteChangeInComp(idMedia, mediaHashId, type) {
        roomPlaylist[idMedia].vote[type]++;
        handleVoteChange(idMedia, roomPlaylist[idMedia].vote, mediaHashId, type);
    }
    
    async function removeMediaFromPlaylist(indexToRemove) {
        changeOpen(false);
        await delay(200);
        handleRemoveMediaFromPlaylist(indexToRemove);
    }

    return(
      <Drawer
            id="mediaInfoDrawer"
            anchor='bottom'
            onClose={(e) => changeOpen(false)}
            open={open}
            PaperProps={{
                sx: {
                    height: descriptionOpen ? 'auto':'35vh',
                },
            }}
            sx={{zIndex:2000 }}
        >
            <Box className="DrawerBackButton" onClick={(e) => changeOpen(false)} ></Box>
            <Divider />                        

            {data && <>
                <Box className="DrawerGradient" sx={{backgroundImage:'url('+roomPlaylist[roomIdActuallyDisplaying].visuel+')'}}>
                </Box>
                    
                <List sx={{ width: '100%', mb:'15em', p:0}}>
                    <ListItem sx={{pt:0, mt:0}}>
                        <DrawerPlayPauseButton 
                            room={room}
                            roomRef={roomRef}
                            isAdminView={isAdminView}
                            isPlaying={roomIsActuallyPlaying}
                            setIsPlaying={setIsPlaying}
                            mediaDisplayingData={roomPlaylist[roomIdActuallyDisplaying]}
                            setIdPlaying={setIdPlaying}
                            idActuallyPlaying={roomIdActuallyPlaying}
                            idActuallyDisplaying={roomIdActuallyDisplaying} />
                        <ListItemText 
                             
                            primary={
                                    <Typography component="h6" className="varelaFontTitle" fontWeight='bold' sx={{color:'var(--grey-dark)', textShadow:'1px 1px 1px var(--white)'}}  >
                                        {cleanMediaTitle(data.title)} 
                                    </Typography>
                            }
                            secondary={
                                        <Typography component="p" fontSize='small' className="fontFamilyNunito">
                                            {t('GeneralOn')} <span><b>{data.source}</b></span> {t('GeneralBy')} <span><b>{data.addedBy}</b></span>
                                            
                                            <Link href={data.url} target="_blank" rel="noopener">
                                                <LaunchIcon fontSize='small' sx={{ml:1, mb:'-5px'}} />
                                            </Link>
                                        </Typography>
                            }
                        />
                       
                    </ListItem>
                     
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
                    {isVarExistNotEmpty(data.description) && 
                        <Box sx={{pl:2,pr:2,pb:1}}>
                            <Accordion  expanded={descriptionOpen} onChange={handleOpenDescription('panel1')} className='mediaDescriptionAccordion'>
                                <AccordionSummary
                                aria-controls="panel1-content"
                                id="panel1-header"
                                >
                                {descriptionOpen ? <ExpandLessIcon sx={{mr:1}} /> : <ExpandMoreIcon sx={{mr:1}} />} 
                                <Typography  className="varelaFontTitle">Description</Typography>
                                </AccordionSummary>
                                <AccordionDetails onClick={handleOpenDescription(false)} className="fontFamilyNunito">
                                    <Typography fontSize="smaller">{data.description}</Typography>
                                </AccordionDetails>
                            </Accordion>
                        </Box>
                    }
                </List>
            </>}
    </Drawer>
    )
};

export default withTranslation()(RoomPlaylistDrawer);