import React, { useState, useEffect, useRef } from "react";
import { db } from "../services/firebase";
import { findDOMNode } from 'react-dom'

import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Toolbar from '@mui/material/Toolbar';
import ReactPlayer from 'react-player';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import Alert from '@mui/material/Alert';
import Fab from '@mui/material/Fab';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';

import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import YTSearch from 'youtube-api-search';
import LinearProgress from '@mui/material/LinearProgress';

import ListSubheader from '@mui/material/ListSubheader';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import validator from 'validator';
import Typography from '@mui/material/Typography';

import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Settings from '@mui/icons-material/Settings';
import ShareIcon from '@mui/icons-material/Share';
import SearchIcon from '@mui/icons-material/Search';
import CopyToClipboard from "react-copy-to-clipboard";
import LinkIcon from '@mui/icons-material/Link';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AddIcon from '@mui/icons-material/Add';
import FastForwardIcon from '@mui/icons-material/FastForward';

import Slider from '@mui/material/Slider';
import VolumeDown from '@mui/icons-material/VolumeDown';
import VolumeUp from '@mui/icons-material/VolumeUp';

const Room = ({ roomId }) => {

    const [localData, setLocalData] = useState({volume:0.5});
	const [loaded, setLoaded] = useState(false);
	const [room, setRoom] = useState({});
    const [mediaSearchResultYoutube, setMediaSearchResultYoutube] = useState([]);
    const [mediaSearchResultDailyMotion, setMediaSearchResultDailyMotion] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [addingUrl, setAddingUrl] = useState('');
    const [OpenInvitePeopleToRoomModal, setOpenInvitePeopleToRoomModal] = useState(false);
    const [OpenAddToPlaylistModal, setOpenAddToPlaylistModal] = useState(false);
    const [roomUrl, setRoomUrl]= useState(document.URL);
    const [recentlyAdded, setRecentlyAdded]= useState(false);
    const [copiedToClipboard, setCopiedToClipboard] = useState(false);
    const [isPlayerAtLeastStarted, setIsPlayerAtLeastStarted] = useState(false);
	const roomRef = db.collection("rooms").doc(roomId);
    const playerRef = useRef();

    var addingUrlObject = {source:'unknown',url:''};
    const [playerSeeking, setPlayerSeeking] = useState(false);

    const delay = ms => new Promise(res => setTimeout(res, ms));

    const [tabIndex, setTabIndex] = useState(0);

    const handleTabChange = (event, newTabIndex) => {
        setTabIndex(newTabIndex);
    };


    const getRoomData = (roomId) => {
		roomRef.get().then((doc) => {
			if (doc.exists) {
				setRoom(doc.data());
			} else {
				var docData = {
					id: roomId,
                    playing:0,
                    mediaActuallyPlayingAlreadyPlayed:0,
                    actuallyPlaying:false,
					playlistUrls: [],
					playlistEmpty: true,
					creationTimeStamp	: Date.now()
				};
				db.collection("rooms").doc(roomId).set(docData).then(() => {});
				setRoom(docData);
			}
            setLoaded(true);
		});
	};
	
	useEffect(() => {
		getRoomData(roomId);
        document.title = 'Room n°' + roomId + ' - MusicRoom';
	}, [room, roomId]);

    function handlePlay(playStatus) {
        roomRef.set({actuallyPlaying: playStatus}, { merge: true });
        setIsPlayerAtLeastStarted(true);
    }
    function handlePlayerStart() {
//        playerRef.current.played = room.mediaActuallyPlayingAlreadyPlayed;
        setIsPlayerAtLeastStarted(true);
    }

    function handleMediaEnd() {
        if(room.playlistUrls[room.playing+1]) {
            handleChangeActuallyPlaying(room.playing+1);
        } else {
            handlePlay(false);
        }
    }
  
    function handleChangeActuallyPlaying(numberToPlay) {
        roomRef.set({playing: numberToPlay}, { merge: true });
    }

    async function handleAddToPlaylist() {
        if (validator.isURL(addingUrl)) {
            if(addingUrl.includes('youtube')) {
                addingUrlObject.source = "youtube";
            }
            if(addingUrl.includes('dailymotion')) {
                addingUrlObject.source = "dailymotion";
            }
            if(addingUrl.includes('soundcloud')) {
                addingUrlObject.source = "soundcloud";
            }

            addingUrlObject.url = addingUrl;
            room.playlistUrls.push(addingUrlObject);
            
            roomRef.set({playlistUrls: room.playlistUrls, playlistEmpty: false}, { merge: true });
            setOpenAddToPlaylistModal(false);

            setRecentlyAdded(true);
            await delay(3000);
            setRecentlyAdded(false);
        }
        setAddingUrl('');
        addingUrlObject = {source:'unknown', url:'', title:''};
        
    }
    
    async function handleAddToPlaylistFromUrl(urlToAdd) {
        
        room.playlistUrls.push(urlToAdd);
        roomRef.set({playlistUrls: room.playlistUrls, playlistEmpty: false}, { merge: true });
        setOpenAddToPlaylistModal(false);
            setRecentlyAdded(true);
            await delay(3000);
            setRecentlyAdded(false);
    }

    function handleSearchForMedia() {
        if(searchTerm !== '') {
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
    
    function handleQuitRoom() {

        if(localStorage.getItem("MusicRoom_RoomId")) {
            localStorage.removeItem("MusicRoom_RoomId");
            window.location.reload(false);
        } 
        window.location.href = "/";
    }


    async function setCopiedToClipboardToTrueAndFalse() {
        setCopiedToClipboard(true);
        await delay(2000);
        setCopiedToClipboard(false);
    }

    function setPercentagePlayed(percentagePlayed) {
        roomRef.set({mediaActuallyPlayingAlreadyPlayed: percentagePlayed}, { merge: true });
    }

    function handleProgress(event) {
            roomRef.set({mediaActuallyPlayingAlreadyPlayed: event.played*100}, { merge: true });
    }

    function handleVolumeChange(e) {
        setLocalData({volume: e.target.value});
    }
    async function fastForward(timeToGo) {
     /*   setPlayerSeeking(true);
        roomRef.set({mediaActuallyPlayingAlreadyPlayed: timeToGo}, { merge: true });
        playerRef.current.seekTo(timeToGo);
        setPlayerSeeking(false);*/
    }
    
  /*function handleSeekChange(e) {
    console.log(e);
        if(playerRef) {
            setPlayerSeeking(true);
            console.log(playerRef);
            roomRef.set({mediaActuallyPlayingAlreadyPlayed: e}, { merge: true });
            console.log(e);
            playerRef.current.seekTo(parseFloat(e/100))
            setPlayerSeeking(false);
        }
  }*/
  
  return (
    <div className="flex flex-col w-full gap-0 h-screen relative ">
      
        <AppBar position="static">
            <Toolbar sx={{ bgcolor: '#b79f6e', fontFamily: 'Monospace' }}>
                
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Room n° <b>{ roomId } </b>
                </Typography>
                <Tooltip title="Partager la room" >
                    <IconButton
                        onClick={e => setOpenInvitePeopleToRoomModal(true)}
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <ShareIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title='Quitter la room' >
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: '-15px' }}
                        onClick={e => handleQuitRoom()}
                    >
                        <ExitToAppIcon />
                    </IconButton>
                </Tooltip>
                
            </Toolbar>
        </AppBar>

        <Container maxWidth="sm" sx={{ padding: '0 !important'}} >
            { !room.playlistEmpty && <Typography sx={{bgcolor:'#645a47', color:'white', padding:'0.5em'}}> Lecture en cours </Typography>}
            {loaded && <div> 
                { !room.playlistEmpty && 
                    <Box sx={{bgcolor:'#c8b795', padding:"0px 0em"}}>
                        <Grid container spacing={0}>
                            <Grid item sm={4} sx={{ pl:0,ml:0, pt: 0}}>
                               
                                {loaded && room.playlistUrls &&<ReactPlayer sx={{ padding:0, bgcolor:"red"}}
                                    ref={playerRef}
                                    className='react-player'
                                    width='100%'
                                    pip={true}
                                    height='100%'
                                    volume={localData.volume}
                                    onProgress={e => handleProgress(e)}
                                    onStart={e => handlePlayerStart()}
                                    onPlay={e => handlePlay(true)}
                                    onPause={e => handlePlay(false)}
                                    onEnded={e => handleMediaEnd()}
                                    url={room.playlistUrls[room.playing].url}
                                    pip={true}
                                    playing={room.actuallyPlaying} // is player actually playing
                                    controls={false}
                                    light="false"
                                />}
                            </Grid>
                            <Grid item sm={8} sx={{ padding:0,pl:0,ml:0, mb: 0 }}>
                                <Grid item sm={12} sx={{ padding:0,pl:1.5,ml:0, mb: 0 }}>
                                    <Typography component={'span'} sm={12} >
                                        
                                        { room.playlistUrls[room.playing].title && <ListItemText primary={room.playlistUrls[room.playing].title} />}
                                        { room.playlistUrls[room.playing].title && room.playlistUrls[room.playing].title.length == 0 || !room.playlistUrls[room.playing].title && <ListItemText primary={room.playlistUrls[room.playing].url.substring(0, 50)+'...'} />}

                                    </Typography>
                                    
                                    <Typography sx={{ ml:0, mb: 1.5, fontSize: '10px', textTransform:'uppercase' }}>
                                        Source : { room.playlistUrls[room.playing].source }
                                    </Typography>
                                </Grid>
                                <LinearProgress sx={{height:'10px'}} variant="determinate" value={room.mediaActuallyPlayingAlreadyPlayed} />
                                <Grid item sm={12} sx={{bgcolor:'#aa9c7f', padding:0,pl:1.5,ml:0, mb: 0 }}>
                                    <Grid item sm={12} sx={{ display:'flex',justifyContent: 'space-between', padding:0,pt:1,ml:0,mr:1,pr:2, mb: 1.5 }}>
                                        {room.playing > 0 && <IconButton onClick={e => handleChangeActuallyPlaying(room.playing - 1)}>
                                            <SkipPreviousIcon fontSize="large"  />
                                        </IconButton>}
                                        { room.actuallyPlaying && <IconButton variant="contained" onClick={e => handlePlay(false)} >
                                            <PauseCircleOutlineIcon fontSize="large"/>
                                        </IconButton>}
                                        { !room.actuallyPlaying && <IconButton variant="contained" onClick={e => handlePlay(true)} >
                                            <PlayCircleOutlineIcon fontSize="large"/>
                                        </IconButton>}
                                        {(room.playlistUrls.length -1) !== room.playing && <IconButton onClick={e => handleChangeActuallyPlaying(room.playing + 1)}>
                                            <SkipNextIcon fontSize="large"  />
                                        </IconButton>}
                                        <IconButton onClick={e => setPercentagePlayed(0)} >
                                            <SettingsBackupRestoreIcon fontSize="large" />
                                        </IconButton>
                                        {<IconButton onClick={e => handleChangeActuallyPlaying(0)}>
                                             <RestartAltIcon fontSize="large" />
                                        </IconButton>}
                                    </Grid>
                                    
                                    <Grid item sm={12} sx={{ pt:0,pl:2,pr:2,ml:0, mb: 0, pb:1 }}>
                                        <Stack spacing={2} sm={8} direction="row" sx={{ mb: 1, mr:2 }} alignItems="center">
                                            <VolumeDown />
                                            <Slider step={0.01} min={0.1}  max={1} aria-label="Volume" value={localData.volume} onChange={e => handleVolumeChange(e)} />
                                            <VolumeUp />
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                }
                <Typography sx={{bgcolor:'#645a47', color:'white', padding:'0.5em'}}> Playlist <span> ({ loaded && room.playlistUrls && room.playlistUrls.length } médias en playlist)</span>
                </Typography>
            { room.playlistEmpty && 
                <Alert severity="success"> Bienvenue dans la room ! <a href="#" onClick={(e) => setOpenAddToPlaylistModal(true)} >Ajoutez quelque chose dans la playlist !</a></Alert>
            }
            <Box sx={{ padding:"0em",marginBottom:2, paddingLeft:0}}>
                <List sx={{padding:0}}>
                    {loaded && room.playlistUrls && room.playlistUrls.length > 0 && <Grid item xs={12}>
                        {loaded && room.playlistUrls.map(function(d, idx){
                        return (

                            <Fade in={true} xs={12} sx={{ width:'100%', padding:0, margin:0}}>
                                <Grid item sx={{ width:'100%', padding:0,pl:2, margin:0}}>
                                    
                                    <ListItemButton onClick={e => handleChangeActuallyPlaying(idx)} key={idx} xs={12} sx={{ width:'100%', padding:0,pl:0,margin:0 }} selected={room.playing === idx}>
                                    
                                        <ListItemIcon sx={{ pl:2, zIndex:2}}>
                                                {idx !== room.playing && <PlayCircleOutlineIcon />}
                                                {idx === room.playing && room.actuallyPlaying && <PauseCircleOutlineIcon  />}
                                                {idx === room.playing && !room.actuallyPlaying && <PlayCircleOutlineIcon />}
                                        </ListItemIcon>
                                        <Grid item sx={{display:'block', zIndex:2}}>
                                            { d.title && <ListItemText sx={{ pl:0}} primary={d.title} />}
                                            { d.title && d.title.length == 0 || !d.title && <ListItemText sx={{ pl:0}} primary={d.url.substring(0, 50)+'...'} />}
                                            <Typography sx={{ display:'block', width:'100%',ml:0, mb: 1.5, fontSize: '10px', textTransform:'uppercase' }}>
                                                Source : { room.playlistUrls[room.playing].source }
                                            </Typography>
                                            {idx === room.playing && room.actuallyPlaying && isPlayerAtLeastStarted && <Typography sx={{ display:'block', width:'100%',ml:0, mb: 1.5, fontSize: '10px', textTransform:'uppercase' }}>
                                                En lecture actuellement
                                            </Typography>}
                                            
                                            {idx === room.playing && !room.actuallyPlaying && isPlayerAtLeastStarted && <Typography sx={{ display:'block', width:'100%',ml:0, mb: 1.5, fontSize: '10px', textTransform:'uppercase' }}>
                                                En lecture actuellement mais le Lecteur est en pause
                                            </Typography>}
                                            {idx === room.playing && !isPlayerAtLeastStarted && <Typography sx={{ display:'block', width:'100%',ml:0, mb: 1.5, fontSize: '10px', textTransform:'uppercase' }}>
                                                En lecture actuellement mais le Lecteur est éteint.
                                            </Typography>}
                                        </Grid>
                                            
                                        {idx === room.playing && <LinearProgress sx={{height:'10px', position:'absolute', width:'100%', height:'100%', zIndex:1, opacity:0.5}} variant="determinate" value={room.mediaActuallyPlayingAlreadyPlayed} />}
                                    </ListItemButton>
                                </Grid>
                            </Fade>)
                        }) }
                    </Grid>}
                </List>
            </Box>
            </div>
            } 
        </Container>
        <Dialog onClose={(e) => setOpenAddToPlaylistModal(false)} open={OpenAddToPlaylistModal}>
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
                        label="Recherche sur Youtube"
                        helperText="Effectuez une recherche sur Youtube ou DailyMotion url youtube, soundcloud ou dailymotion (Ex : Vald, Lomepal, Rammstein, Dua Lipa, ..)"
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
                    <Box sx={{ padding: 2,lineHeight:"15px", padding:0, pt:1, mb:3 }}>
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
                                        return (<ListItemButton sx={{margin:0, padding:0}}  key={idx} onClick={(e) => handleAddToPlaylistFromUrl({title:media.snippet.title, source:'youtube', url:'https://www.youtube.com/watch?v='+media.id.videoId})}><ListItemIcon><LibraryMusicIcon /></ListItemIcon><ListItemText primary={media.snippet.title} /></ListItemButton>)
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
                                    return (<ListItemButton sx={{margin:0, padding:0}} key={idx} onClick={(e) => handleAddToPlaylistFromUrl({title:media.title, source:'dailymotion', url:'https://www.dailymotion.com/video/'+media.id})}><ListItemIcon><LibraryMusicIcon /></ListItemIcon><ListItemText primary={media.title} /></ListItemButton>)
                                }) }
                            </List>
                        </Grid>}
                        </Box>
                        )}
                    </Box>
                  </Grid>}
                  <Grid item xs={12}>
                    <h3>Depuis une URL</h3>
                    <hr />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                        id="addMediaFromUrlInput"
                        type="text"
                        label="Url du lien"
                        helperText="Insérez une url youtube, soundcloud ou dailymotion (Ex : https://www.youtube.com/watch?v=vslZZLpQZz0)"
                        value={addingUrl}
                        onChange={e => setAddingUrl(e.target.value)}
                        sx={{ width: '100%', paddingRight:'0', "& .MuiOutlinedInput-root": {
                            paddingRight: 0
                        } }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment  sx={{
                                padding: "27.5px 14px",
                                backgroundColor: "#b79f6e",
                                color:'white',
                                cursor:'pointer'}} position="end" onClick={handleAddToPlaylist}>
                                <AddIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                  </Grid>
                </Grid>
            </Box>
        </Dialog>
        
        <Dialog onClose={(e) => setOpenInvitePeopleToRoomModal(false)} open={OpenInvitePeopleToRoomModal}>
            <DialogTitle>Invitez des gens à rejoindre cette room ! </DialogTitle>  
            <DialogContent>
            <DialogContentText>
                <CopyToClipboard onCopy={(e) => setCopiedToClipboardToTrueAndFalse()} text={( roomUrl +'?rid='+roomId)}>
                    <Button variant="contained"> Click to copy url ! </Button> 
                </CopyToClipboard>
                {copiedToClipboard && <Alert severity="success"  sx={{ mt: 1.5 }} > Copié dans le presse papier !</Alert>}
            </DialogContentText>
            </DialogContent>
        </Dialog>

        <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: '100vh' }}
        >
            <Grid item xs={3} sx={{mt:2}}>
                <Stack direction="row" spacing={2}>
                    {!recentlyAdded && <Fab variant="extended" onClick={(e) => setOpenAddToPlaylistModal(true)}>
                        <SpeedDialIcon sx={{ mr: 1 }} />
                        Ajouter à la playlist
                    </Fab>}
                    
                    {recentlyAdded && <Fab sx={{bgcolor:"#53df53",color:'white'}} variant="extended">
                        <CheckCircleOutlineIcon sx={{ mr: 1 }} />
                        Ajouté à la playlist
                    </Fab>}
                </Stack>
            </Grid>   
        </Grid> 
        <SpeedDial
            ariaLabel="SpeedDial basic example"
            sx={{ position: 'absolute', bottom: 36, right: 16 }}
            icon={<Settings />}
        >
            <SpeedDialAction
                onClick={e => handleQuitRoom()}
                key='LeaveRoom'
                icon={<ExitToAppIcon />}
                tooltipTitle='Quitter la room'
            />
            
            <SpeedDialAction
                onClick={e => setOpenInvitePeopleToRoomModal(true)}
                key='ShareRoom'
                icon={<ShareIcon />}
                tooltipTitle='Partager la room'
            />
        </SpeedDial>
    </div>
  );
};

export default Room;
