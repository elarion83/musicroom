import React, { useState, useEffect } from "react";
import axios from "axios";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';

import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import { v4 as uuid } from 'uuid';
import InputAdornment from '@mui/material/InputAdornment';
import AddIcon from '@mui/icons-material/Add';
import Typed from "react-typed"

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ListSubheader from '@mui/material/ListSubheader';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import validator from 'validator';
import YTSearch from 'youtube-api-search';
import SearchIcon from '@mui/icons-material/Search';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button, Typography } from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import InputBase from '@mui/material/InputBase';

const RoomModalAddMedia = ({ validatedObjectToAdd }) => {

    const [mediaSearchResultYoutube, setMediaSearchResultYoutube] = useState([]);
    const [mediaSearchResultDailyMotion, setMediaSearchResultDailyMotion] = useState([]);
    const [addingUrl, setAddingUrl] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [recentlyAdded, setRecentlyAdded]= useState(false);
    const [isSearching, setIsSearching]= useState(false);
    const delay = ms => new Promise(res => setTimeout(res, ms));
    
    const [addingObject, setAddingObject] = useState({title:'',source:'',url:'', addedBy: localStorage.getItem("MusicRoom_UserInfoPseudo")})

    const handleTabChange = (event, newTabIndex) => {
        setTabIndex(newTabIndex);
    };

    const [tabIndex, setTabIndex] = useState(0);

    async function handleCheckAndAddObjectToPlaylistFromObject(objectFormatted) {
        validatedObjectToAdd(objectFormatted);
        addingObject.title='';
        addingObject.source='';
        addingObject.url='';
        setRecentlyAdded(false);
        setRecentlyAdded(true);
        await delay(2000);
        setRecentlyAdded(false);
    }
        
    async function getYoutubeVideoInfosFromId(videoId, addingObject) {
                    var params = {
                        part: 'snippet',
                        key: 'AIzaSyAcFecOONJZvjwMnTB9Fv9x753KWsVUvWM',
                        id: videoId,
                    }; 
                    
                    await axios.get('https://www.googleapis.com/youtube/v3/videos', { params: params })
                    .then(function(response) {
                        addingObject.title = response.data.items[0].snippet.title;
                    })
                    .catch(function(error) {
                    });
    }

    async function handleSearchForMedia() {
        setIsSearching(true);
        if(searchTerm !== '') {
            if (validator.isURL(searchTerm.trim())) {
                addingObject.url = searchTerm.trim();
                if(addingObject.url.includes('youtube')) {
                    addingObject.source = "youtube";
                    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
                    var match = addingObject.url.match(regExp);

                    await getYoutubeVideoInfosFromId(match[7], addingObject);

                }
                if(addingObject.url.includes('dailymotion')) {
                    addingObject.source = "dailymotion";
                }
                if(addingObject.url.includes('soundcloud')) {
                    addingObject.source = "soundcloud";
                }

                addingObject.vote= {'up':0,'down':0};
                addingObject.hashId = uuid().slice(0,10).toLowerCase()
                handleCheckAndAddObjectToPlaylistFromObject(addingObject);
                setSearchTerm('');
                setIsSearching(false);
            } else {
                YTSearch({key: 'AIzaSyAcFecOONJZvjwMnTB9Fv9x753KWsVUvWM', term: searchTerm}, (videos) => {
                    setMediaSearchResultYoutube(videos);
                });

                fetch('https://api.dailymotion.com/videos?fields=id,thumbnail_url%2Ctitle&country=fr&search='+searchTerm+'&limit=5')
                    .then((response) => response.json())
                    .then((responseJson) => {
                        setMediaSearchResultDailyMotion(responseJson.list);
                        setIsSearching(false);
                })
            }
        }
    }

    return(
            <Container sx={{padding:'3em',pt:0, height:'100vh', zIndex:3}} className="full_width_modal_content_container">
                  <Grid item xs={12} sx={{ mt:2, display:'flex', flexDirection:'row'}} className="autowriter_container">
                     <Typed
                        strings={[
                            'TA MUSIQUE PREFEREE',
                            'DAFT PUNK, ORELSAN, BTS',
                            'UNE VIDEO YOUTUBE',
                            'DOMINGO, SQUEEZIE',
                            'UN ALBUM TENDANCE',
                            'UN LIEN SOUNCLOUND',
                            'UN LIEN YOUTUBE',
                            'DAFT PUNK - ALIVE (LIVE)',
                            'MKRB - DOM P',
                            'GAZO - LA RUE',
                            'PNL - AU DD',
                            'DOMINGO - REACT',
                            'HTTPS://WWW.YOUTUBE.COM/WATCH?V=MAVIDEO',
                            'HTTPS://SOUNDCLOUD.COM/THOMS-12/EBRIUS']}
                        typeSpeed={15}
                        showCursor={true}
                        backSpeed={15}
                        attr="placeholder"
                    loop >
                        <input 
                            id="addMediaSearchInput" 
                            className="input_big typed"
                            type='text' 
                            variant="standard" 
                            onKeyPress={(ev) => {
                            if (ev.key === 'Enter')  { handleSearchForMedia()}
                            }}                         
                            onChange={e => setSearchTerm(e.target.value)}
                            value={searchTerm} 
                            style={{ width: '100%', height:'100%', flexGrow:1,paddingRight:'0', bgcolor:'rgba(255, 255, 255, 0.1)', pl:2}}
                            />
                    </Typed> 
                    <Button  sx={{
                        padding: "27.5px 14px",
                        backgroundColor: "#131416",
                        color:'white',
                        cursor:'pointer',
                        }} position="end" onClick={handleSearchForMedia}>
                        {!isSearching ? <SearchIcon  /> : <RefreshIcon  />}
                    </Button>
                  </Grid>
                  {mediaSearchResultYoutube.length > 1 && <Grid item xs={12}>
                    <Tabs value={tabIndex} onChange={handleTabChange} sx={{bgcolor:'#202124'}}>
                        {mediaSearchResultYoutube.length > 1  && <Tab label="Youtube" />}
                        {mediaSearchResultDailyMotion.length > 1 && <Tab label="Dailymotion" />}
                    </Tabs>
                    <Box sx={{ lineHeight:"15px", padding:0, pt:1, mb:3 }}>
                        {tabIndex === 0 && (
                        <Box >  
                            {mediaSearchResultYoutube.length > 1 && <Grid item xs={12}>
                                <List component="nav">
                                    { mediaSearchResultYoutube.map(function(media, idx){
                                        return (<ListItemButton sx={{margin:0, padding:0, pr:1,borderBottom: '2px solid #3e464d'}}  key={idx} onClick={(e) => handleCheckAndAddObjectToPlaylistFromObject({title:media.snippet.title, source:'youtube', url:'https://www.youtube.com/watch?v='+media.id.videoId, addedBy: addingObject.addedBy, vote: {'up':0,'down':0}, hashId: uuid().slice(0,10).toLowerCase()})}>
                                            <img src={media.snippet.thumbnails.default.url} />
                                            <Grid sx={{display:'flex',flexDirection:'column',pl:2}}>
                                                <ListItemText primary={media.snippet.title.substring(0, 50)} className='video_title_list' sx={{ mt:0, fontSize:'0.9em'}}/>
                                                <Typography sx={{ ml:0, mb: 0, fontSize: '10px', textTransform:'uppercase' }}>Publié par <b>{media.snippet.channelTitle}</b></Typography>
                                            </Grid>
                                            </ListItemButton>)
                                    }) }
                                </List>
                            </Grid>}
                        </Box>
                        )}
                        {tabIndex === 1 && (
                        <Box>
                            {mediaSearchResultDailyMotion.length > 1 && <Grid item xs={12}>
                            <List component="nav">
                                { mediaSearchResultDailyMotion.map(function(media, idx){
                                    return (<ListItemButton sx={{margin:0,padding:0, pr:1,borderBottom: '2px solid #3e464d'}} key={idx} onClick={(e) => handleCheckAndAddObjectToPlaylistFromObject({title:media.title, source:'dailymotion', url:'https://www.dailymotion.com/video/'+media.id, addedBy: addingObject.addedBy, vote: {'up':0,'down':0}, hashId: uuid().slice(0,10).toLowerCase()})}>
                                        <img src={media.thumbnail_url} style={{width:'120px', height:'90px'}}/>
                                        <ListItemText primary={media.title} sx={{ml:2, mt:0, fontSize:'0.9em'}}/></ListItemButton>)
                                }) }
                            </List>
                        </Grid>}
                        </Box>
                        )}
                    </Box>
                  </Grid>}
                  <Snackbar
                    open={recentlyAdded}
                    autoHideDuration={6000}
                    sx={{bgcolor:'#2e7d32', borderRadius:'2px'}}
                    message="Bien ajouté à la playlist !"
                    />
    </Container>
    )
};

export default RoomModalAddMedia;