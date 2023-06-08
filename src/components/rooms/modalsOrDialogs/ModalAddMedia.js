import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import axios from "axios";
import dateFormat from "dateformat";
import React, { useState } from "react";
import Typed from "react-typed";
import { v4 as uuid } from 'uuid';

import { Icon } from '@iconify/react';
import SearchIcon from '@mui/icons-material/Search';
import { LoadingButton } from "@mui/lab";
import { Button, Typography } from "@mui/material";
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Snackbar from '@mui/material/Snackbar';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import validator from 'validator';
import YTSearch from 'youtube-api-search';

const RoomModalAddMedia = ({ roomId, validatedObjectToAdd, spotifyTokenProps }) => {

    const [mediaSearchResultYoutube, setMediaSearchResultYoutube] = useState([]);
    const [mediaSearchResultDailyMotion, setMediaSearchResultDailyMotion] = useState([]);
    const [mediaSearchResultSpotify, setMediaSearchResultSpotify] = useState([]);
    const [addingUrl, setAddingUrl] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [recentlyAdded, setRecentlyAdded]= useState(false);
    const [recentlyAddedTitle, setRecentlyAddedTitle]= useState('');
    const [isSearching, setIsSearching]= useState(false);
    const delay = ms => new Promise(res => setTimeout(res, ms));

    const REDIRECT_URI = window.location.protocol+'//'+window.location.hostname+(window.location.port ? ":" + window.location.port : '');

    const [addingObject, setAddingObject] = useState({title:'',source:'',url:'', addedBy: localStorage.getItem("MusicRoom_UserInfoPseudo")})

    const handleTabChange = (event, newTabIndex) => {
        setTabIndex(newTabIndex);
    };

    const [tabIndex, setTabIndex] = useState(0);

    async function handleCheckAndAddObjectToPlaylistFromObject(objectFormatted) {
        validatedObjectToAdd(objectFormatted);
        
        setRecentlyAddedTitle(objectFormatted.title);
        addingObject.title='';
        addingObject.source='';
        addingObject.url='';
        setRecentlyAdded(false);
        await delay(100);
        setRecentlyAdded(true);
        await delay(6000);
        setRecentlyAdded(false);
    }
        
    async function getYoutubeVideoInfosFromId(videoId, addingObject) {
        var params = {
            part: 'snippet',
            key: process.env.REACT_APP_YOUTUBE_API_KEY,
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
                addingObject.source = "url";
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
                YTSearch({key: process.env.REACT_APP_YOUTUBE_API_KEY, term: searchTerm}, (videos) => {
                    setMediaSearchResultYoutube(videos);
                    console.log(videos);
                });

                fetch('https://api.dailymotion.com/videos?fields=id,thumbnail_url%2Ctitle&country=fr&search='+searchTerm+'&limit=5')
                    .then((response) => response.json())
                    .then((responseJson) => {
                        setMediaSearchResultDailyMotion(responseJson.list);
                        setIsSearching(false);
                });

                if(spotifyTokenProps.length !== 0) {
                    await axios.get("https://api.spotify.com/v1/search", {
                        headers: {Authorization: `Bearer ${spotifyTokenProps}`},
                        params: {
                            q: searchTerm,
                            type: "track"
                        }
                    }).then(function(response) {
                        setMediaSearchResultSpotify(response.data.tracks.items);
                    });
                }
            }
        }
    }

    return(
            <Container sx={{padding:'3em',pt:0, height:'100vh', zIndex:3}} className="full_width_modal_content_container">
                 <Grid item xs={12} sx={{margin:0,padding:0,display:'flex', justifyContent:'center'}}>
                    {spotifyTokenProps.length !== 0 && <Alert severity="success" sx={{mt:1,color:'#d5cdcd', border:'1px solid #F27C24'}}>La room est connectée a Spotify</Alert>}
                    {spotifyTokenProps.length === 0 && 
                    <Button startIcon={<Icon style={{display:'inline',  marginRight:'0.5em'}} icon="mdi:spotify" />} variant="contained" color="success" sx={{mt:2}} onClick={e => window.location.href = `${process.env.REACT_APP_ROOM_SPOTIFY_AUTH_ENDPOINT}?client_id=${process.env.REACT_APP_ROOM_SPOTIFY_CLIENT_ID}&scope=user-read-playback-state%20streaming%20user-read-email%20user-modify-playback-state%20user-read-private&redirect_uri=${REDIRECT_URI}&response_type=${process.env.REACT_APP_ROOM_SPOTIFY_RESPONSE_TYPE}`}>
                    Connecter la room a Spotify
                    </Button>
                    }
                 </Grid>


                  <Grid item xs={12} sx={{ mt:2, display:'flex', flexDirection:'row'}} className="autowriter_container">
                     <Typed
                        strings={[
                            'CHERCHE SUR YOUTUBE ',
                            'CHERCHE SUR SPOTIFY ',
                            'CHERCHE UNE MUSIQUE',
                            'CHERCHE UN CLIP',
                            'UNE VIDEO DE DOMINGO', 
                            'UNE VIDEO DE SQUEEZIE', 
                            'UN LIEN SOUNCLOUND',
                            'UN LIEN YOUTUBE',
                            'HTTPS://WWW.YOUTUBE.COM/WATCH?V=MAVIDEO',
                            'HTTPS://SOUNDCLOUD.COM/THOMS-12/EBRIUS']}
                        typeSpeed={10}
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
                    <LoadingButton loading={isSearching} 
                    sx={{
                        padding: "27.5px 14px",
                        backgroundColor: "#131416",
                        color:'white',
                        cursor:'pointer',
                        }} position="end" onClick={handleSearchForMedia}>
                             <SearchIcon  />
                    </LoadingButton>
                  </Grid>
                  {mediaSearchResultYoutube.length > 1 && <Grid item xs={12}>
                    <Tabs value={tabIndex} onChange={handleTabChange} sx={{bgcolor:'#202124'}}>
                        {mediaSearchResultYoutube.length > 1  && <Tab sx={{ color:'var(--white)'}} label="Youtube" />}
                        {mediaSearchResultSpotify.length > 1 && <Tab sx={{ color:'var(--white)'}} label="Spotify" />}
                        {mediaSearchResultDailyMotion.length > 1 && <Tab sx={{ color:'var(--white)'}} label="Dailymotion" />}
                    </Tabs>
                    <Box sx={{ lineHeight:"15px", padding:0, pt:1, mb:3 }}>
                        {tabIndex === 0 && (
                        <Box >  
                            {mediaSearchResultYoutube.length > 1 && <Grid item xs={12}>
                                <List component="nav">
                                    { mediaSearchResultYoutube.map(function(media, idyt){
                                        return (<ListItemButton sx={{margin:0, padding:0, pr:1,borderBottom: '2px solid #3e464d'}}  key={idyt} onClick={(e) => handleCheckAndAddObjectToPlaylistFromObject({title:media.snippet.title, source:'youtube', url:'https://www.youtube.com/watch?v='+media.id.videoId, addedBy: addingObject.addedBy, vote: {'up':0,'down':0}, hashId: uuid().slice(0,10).toLowerCase()})}>
                                            <img src={media.snippet.thumbnails.default.url} />
                                            <Grid sx={{display:'flex',flexDirection:'column',pl:2}}>
                                                <ListItemText primary={media.snippet.title.substring(0, 50)} className='video_title_list' sx={{ mt:0, fontSize:'0.9em'}}/>
                                                <Typography sx={{ ml:0, mb: 0, fontSize: '10px', textTransform:'uppercase' }}>Par <b>{media.snippet.channelTitle} </b></Typography>
                                                <Typography sx={{ ml:0, mb: 0, fontSize: '10px', textTransform:'uppercase' }}>Le <b>{dateFormat(media.snippet.publishedAt, 'd mmm yyyy à HH:MM')} </b></Typography>
                                            </Grid>
                                            </ListItemButton>)
                                    }) }
                                </List>
                            </Grid>}
                        </Box>
                        )}
                        {tabIndex === 1 && (
                        <Box>
                            {mediaSearchResultSpotify.length > 1 && <Grid item xs={12}>
                            <List component="nav">
                                { mediaSearchResultSpotify.map(function(media, idsp){
                                    return (<ListItemButton sx={{margin:0,padding:0, pr:1,borderBottom: '2px solid #3e464d'}} key={idsp} onClick={(e) => handleCheckAndAddObjectToPlaylistFromObject({title:media.artists[0].name + ' - ' +media.name, source:'spotify', url:media.uri, addedBy: addingObject.addedBy, vote: {'up':0,'down':0}, hashId: uuid().slice(0,10).toLowerCase()})}>
                                        <img src={media.album.images[2].url} />
                                        <Grid sx={{display:'flex',flexDirection:'column',pl:2}}>
                                            <ListItemText primary={media.name} sx={{ mt:0, fontSize:'0.9em'}}/>
                                            <Typography sx={{ ml:0, mb: 0, fontSize: '10px', textTransform:'uppercase' }}> 
                                                { media.artists.map(function(artist, ida){
                                                    return ( 
                                                        <b>{artist.name} / </b>
                                                    )
                                                })}
                                            </Typography>
                                            <Typography sx={{ ml:0, mb: 0, fontSize: '10px', textTransform:'uppercase' }}>Album {media.album.name} - <b>{dateFormat(media.album.release_date, 'd mmm yyyy ')} </b></Typography>
                                        </Grid>
                                    </ListItemButton>)
                                }) }
                            </List>
                        </Grid>}
                        </Box>
                        )}
                        {tabIndex === 2 && (
                        <Box>
                            {mediaSearchResultDailyMotion.length > 1 && <Grid item xs={12}>
                            <List component="nav">
                                { mediaSearchResultDailyMotion.map(function(media, iddm){
                                    return (<ListItemButton sx={{margin:0,padding:0, pr:1,borderBottom: '2px solid #3e464d'}} key={iddm} onClick={(e) => handleCheckAndAddObjectToPlaylistFromObject({title:media.title, source:'dailymotion', url:'https://www.dailymotion.com/video/'+media.id, addedBy: addingObject.addedBy, vote: {'up':0,'down':0}, hashId: uuid().slice(0,10).toLowerCase()})}>
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
                    sx={{bgcolor:'#2e7d32 !important', borderRadius:'2px'}}
                    message={recentlyAddedTitle +" ajouté !"}
                    />
    </Container>
    )
};

export default RoomModalAddMedia;