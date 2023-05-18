import React, { useState, useEffect, useRef } from "react";
import { db } from "../services/firebase";

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

const Room = ({ roomId }) => {

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
            await delay(5000);
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
            await delay(5000);
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
        }
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
            <Toolbar sx={{ bgcolor: '#b79f6e' }}>
                <Tooltip title="Copy room URL" >
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <LinkIcon />
                    </IconButton>
                </Tooltip>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Room n° <b>{ roomId } </b>
                </Typography>
                <div>
                     <span> { loaded && room.playlistUrls && room.playlistUrls.length } médias en playlist</span>
                </div>
            </Toolbar>
        </AppBar>

        <Container maxWidth="sm" sx={{ padding: '0 !important', fontFamily: 'Monospace'}} >
            <Typography sx={{bgcolor:'#645a47', color:'white', padding:'0.5em'}}> Lecture en cours </Typography>
            {loaded && <div> 
                { room.playlistEmpty && 
                    <Alert severity="success"> Bienvenue dans la room ! <a href="#" onClick={(e) => setOpenAddToPlaylistModal(true)} >Ajoutez quelque chose dans la playlist !</a></Alert>
                }
                { !room.playlistEmpty && 
                    <Box sx={{bgcolor:'#c8b795', padding:"0.5em 2em"}}>
                        <Grid container spacing={2}>
                            <Grid item sm={4} sx={{ pl:0,ml:0, pt: 0}}>
                               
                                {loaded && room.playlistUrls &&<ReactPlayer sx={{ padding:0, bgcolor:"red"}}
                                    ref={playerRef}
                                    className='react-player'
                                    width='100%'
                                    height='100%'
                                    onProgress={e => handleProgress(e)}
                                    onStart={e => handlePlayerStart()}
                                    onPlay={e => handlePlay(true)}
                                    onPause={e => handlePlay(false)}
                                    onEnded={() => console.log('onEnded')}
                                    url={room.playlistUrls[room.playing].url}
                                    pip={true}
                                    playing={room.actuallyPlaying}
                                    controls={false}
                                    light="false"
                                />}
                            </Grid>
                            <Grid item sm={8} sx={{ paddingTop:0,ml:0, mb: 1.5 }}>
                                <Typography component={'span'}  >
                                    
                                    { room.playlistUrls[room.playing].title && <ListItemText primary={room.playlistUrls[room.playing].title} />}
                                    { room.playlistUrls[room.playing].title && room.playlistUrls[room.playing].title.length == 0 || !room.playlistUrls[room.playing].title && <ListItemText primary={room.playlistUrls[room.playing].url.substring(0, 50)+'...'} />}

                                </Typography>
                                <Typography sx={{ ml:0, mb: 1.5, fontSize: '10px', textTransform:'uppercase' }}>
                                    Source : { room.playlistUrls[room.playing].source }
                                </Typography>
                                <IconButton  color="secondary">
                                    {room.playing > 0 && <SkipPreviousIcon fontSize="large" onClick={e => handleChangeActuallyPlaying(room.playing - 1)} />}
                                </IconButton>
                                <IconButton  color="secondary" variant="contained">
                                    { room.actuallyPlaying && <PauseCircleOutlineIcon fontSize="large" onClick={e => handlePlay(false)} />}
                                    { !room.actuallyPlaying && <PlayCircleOutlineIcon fontSize="large" onClick={e => handlePlay(true)} />}
                                </IconButton>
                                <IconButton  color="secondary">
                                    {(room.playlistUrls.length -1) !== room.playing && <SkipNextIcon fontSize="large" onClick={e => handleChangeActuallyPlaying(room.playing + 1)} />}
                                </IconButton>
                                <IconButton color="secondary">
                                    <SettingsBackupRestoreIcon fontSize="large" onClick={e => setPercentagePlayed(0)} ></SettingsBackupRestoreIcon>
                                </IconButton>
                                <IconButton color="secondary">
                                    <FastForwardIcon fontSize="large" onClick={e => fastForward(room.mediaActuallyPlayingAlreadyPlayed+20)} ></FastForwardIcon>
                                </IconButton>
                                <IconButton  color="secondary">
                                    { <RestartAltIcon fontSize="large" onClick={e => handleChangeActuallyPlaying(0)} />}
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Box>
                }
                
            </div>
            } 
            <Typography sx={{bgcolor:'#645a47', color:'white', padding:'0.5em'}}> Playlist </Typography>
            <Box sx={{ padding:"0.5em 2em"}}>
                <List>
                    {loaded && room.playlistUrls && room.playlistUrls.length > 0 && <Grid container spacing={2}>
                        {loaded && room.playlistUrls.map(function(d, idx){
                        return (

                            <Fade in={true} xs={12}>
                                <Grid sx={{ width:'100%', padding:0}}>
                                    <ListItemButton key={idx} xs={12} sx={{ width:'100%', pl:0,ml:0, mt: 0.5, mr:0 }} selected={room.playing === idx}>
                                        <ListItemIcon sx={{ pl:0.5}}>
                                                {idx !== room.playing && <PlayCircleOutlineIcon onClick={e => handleChangeActuallyPlaying(idx)} />}
                                                {idx === room.playing && room.actuallyPlaying && <PauseCircleOutlineIcon onClick={e => handlePlay(false)} />}
                                                {idx === room.playing && !room.actuallyPlaying && <PlayCircleOutlineIcon onClick={e => handlePlay(true)} />}
                                        </ListItemIcon>
                                        <Typography sx={{display:'block'}}>
                                            { d.title && <ListItemText sx={{ pl:0}} primary={d.title} />}
                                            { d.title && d.title.length == 0 || !d.title && <ListItemText sx={{ pl:0}} primary={d.url.substring(0, 50)+'...'} />}
                                            <Typography sx={{ display:'block', width:'100%',ml:0, mb: 1.5, fontSize: '10px', textTransform:'uppercase' }}>
                                                Source : { room.playlistUrls[room.playing].source }
                                            </Typography>
                                            {idx === room.playing && room.actuallyPlaying && isPlayerAtLeastStarted && <Typography sx={{ display:'block', width:'100%',ml:0, mb: 1.5, fontSize: '10px', textTransform:'uppercase' }}>
                                                En écoute actuellement
                                            </Typography>}
                                            
                                            {idx === room.playing && !room.actuallyPlaying && isPlayerAtLeastStarted && <Typography sx={{ display:'inline', width:'100%',ml:1, mb: 1.5, fontSize: '10px', textTransform:'uppercase' }}>
                                                En écoute actuellement mais le Lecteur est en pause
                                            </Typography>}
                                            {idx === room.playing && !isPlayerAtLeastStarted && <Typography sx={{ display:'inline', width:'100%',ml:0.5, mb: 1.5, fontSize: '10px', textTransform:'uppercase' }}>
                                                En écoute actuellement mais le Lecteur est éteint.
                                            </Typography>}
                                        </Typography>
                                            
                                    </ListItemButton>
                                    {idx === room.playing && <LinearProgress sx={{height:'10px'}} variant="determinate" value={room.mediaActuallyPlayingAlreadyPlayed} />}
                                </Grid>
                            </Fade>)
                        }) }
                    </Grid>}
                </List>
            </Box>
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
                        sx={{ width: '100%', borderColor: "purple", paddingRight:'0', "& .MuiOutlinedInput-root": {
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
                        sx={{ width: '100%', borderColor: "purple", paddingRight:'0', "& .MuiOutlinedInput-root": {
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
            <Grid item xs={3}>
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
