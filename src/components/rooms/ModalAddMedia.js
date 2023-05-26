import React, { useState } from "react";

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';

import InputAdornment from '@mui/material/InputAdornment';
import AddIcon from '@mui/icons-material/Add';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import validator from 'validator';
import YTSearch from 'youtube-api-search';
import SearchIcon from '@mui/icons-material/Search';

const RoomModalAddMedia = ({ validatedObjectToAdd }) => {

    const [mediaSearchResultYoutube, setMediaSearchResultYoutube] = useState([]);
    const [mediaSearchResultDailyMotion, setMediaSearchResultDailyMotion] = useState([]);
    const [addingUrl, setAddingUrl] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [recentlyAdded, setRecentlyAdded]= useState(false);
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
        setRecentlyAdded(true);
        await delay(2000);
        setRecentlyAdded(false);
    }
        

    function handleSearchForMedia() {
        if(searchTerm !== '') {
            if (validator.isURL(searchTerm?.trim())) {
                addingObject.url = searchTerm;
                if(addingObject.url.includes('youtube')) {
                    addingObject.source = "youtube";
                }
                if(addingObject.url.includes('dailymotion')) {
                    addingObject.source = "dailymotion";
                }
                if(addingObject.url.includes('soundcloud')) {
                    addingObject.source = "soundcloud";
                }
                handleCheckAndAddObjectToPlaylistFromObject(addingObject);
            } else {
                YTSearch({key: 'AIzaSyAcFecOONJZvjwMnTB9Fv9x753KWsVUvWM', term: searchTerm}, (videos) => {
                    setMediaSearchResultYoutube(videos);
                });

                fetch('https://api.dailymotion.com/videos?fields=id,thumbnail_url%2Ctitle&country=fr&search='+searchTerm+'&limit=5')
                    .then((response) => response.json())
                    .then((responseJson) => {
                        setMediaSearchResultDailyMotion(responseJson.list);
                })
            }
        }
        
    }

    return(
        <Box sx={{ padding: '1em 2em 1em 1em' }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <h3>Recherche</h3>
                    <hr />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                        id="addMediaSearchInput"
                        type="text"
                        label="Votre recherche (les URL directes sont aussi acceptées)"
                        helperText="URL : (Ex: https://www.youtube.com/watch?v=vslZZLpQZz0) || Recherche : (Ex : Vald, Lomepal, Rammstein, Dua Lipa, ..)"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        sx={{ width: '100%', paddingRight:'0', "& .MuiOutlinedInput-root": {
                            paddingRight: 0
                        } }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment  sx={{
                                padding: "27.5px 14px",
                                backgroundColor: "#b79f6e",
                                color:'white',
                                cursor:'pointer',
                                }} position="end" onClick={handleSearchForMedia}>
                                <SearchIcon  />
                                </InputAdornment>
                            ),
                        }}
                    />
                  </Grid>
                  {mediaSearchResultYoutube.length > 1 && <Grid item xs={12}>
                    <Tabs value={tabIndex} onChange={handleTabChange}>
                        {mediaSearchResultYoutube.length > 1  && <Tab label="Youtube" />}
                        {mediaSearchResultDailyMotion.length > 1 && <Tab label="Dailymotion" />}
                    </Tabs>
                    <Box sx={{ lineHeight:"15px", padding:0, pt:1, mb:3 }}>
                        {tabIndex === 0 && (
                        <Box >  
                            {mediaSearchResultYoutube.length > 1 && <Grid item xs={12}>
                                <List component="nav"
                                    subheader={
                                        <ListSubheader component="div" id="nested-list-subheader" sx={{lineHeight:"15px", padding:0, mb:3}}>
                                        Résultats de recherche Youtube, cliquez sur un lien pour l'ajouter
                                        </ListSubheader>
                                    }
                                >
                                    { mediaSearchResultYoutube.map(function(media, idx){
                                        return (<ListItemButton sx={{margin:0, padding:0}}  key={idx} onClick={(e) => handleCheckAndAddObjectToPlaylistFromObject({title:media.snippet.title, source:'youtube', url:'https://www.youtube.com/watch?v='+media.id.videoId, addedBy: addingObject.addedBy})}><ListItemIcon><LibraryMusicIcon /></ListItemIcon><ListItemText primary={media.snippet.title} /></ListItemButton>)
                                    }) }
                                </List>
                            </Grid>}
                        </Box>
                        )}
                        {tabIndex === 1 && (
                        <Box>
                            {mediaSearchResultDailyMotion.length > 1 && <Grid item xs={12}>
                            <List component="nav"
                                subheader={
                                    <ListSubheader component="div" id="nested-list-subheader" sx={{lineHeight:"15px", padding:0, mb:3}}>
                                    Résultats de recherche DailyMotion, cliquez sur un lien pour l'ajouter
                                    </ListSubheader>
                                }
                            >
                                { mediaSearchResultDailyMotion.map(function(media, idx){
                                    return (<ListItemButton sx={{margin:0, padding:0}} key={idx} onClick={(e) => handleCheckAndAddObjectToPlaylistFromObject({title:media.title, source:'dailymotion', url:'https://www.dailymotion.com/video/'+media.id, addedBy: addingObject.addedBy})}><ListItemIcon><LibraryMusicIcon /></ListItemIcon><ListItemText primary={media.title} /></ListItemButton>)
                                }) }
                            </List>
                        </Grid>}
                        </Box>
                        )}
                    </Box>
                  </Grid>}
                  {recentlyAdded && <Alert severity="success" sx={{margin:2}}> Bien ajouté à la playlist !</Alert>}

            </Grid>
        </Box>
    )
};

export default RoomModalAddMedia;