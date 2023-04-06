import React, { useState, useEffect } from "react";
import { db } from "../services/firebase";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Toolbar from '@mui/material/Toolbar';
import ReactPlayer from 'react-player'
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import Alert from '@mui/material/Alert';
import Fab from '@mui/material/Fab';

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
import CopyToClipboard from "react-copy-to-clipboard";

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
    const [copiedToClipboard, setCopiedToClipboard] = useState(false);
	const roomRef = db.collection("rooms").doc(roomId);
    const delay = ms => new Promise(res => setTimeout(res, ms));


    const ref = player => {
      player = player
    }

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
	}, [room]);
    

    function handlePlay(playStatus) {
        roomRef.set({actuallyPlaying: playStatus}, { merge: true });
    }
  
    function handleChangeActuallyPlaying(numberToPlay) {
        roomRef.set({playing: numberToPlay}, { merge: true });
        handlePlay(true);
    }

    function handleAddToPlaylist() {
        if (validator.isURL(addingUrl)) {
            room.playlistUrls.push(addingUrl);
            roomRef.set({playlistUrls: room.playlistUrls, playlistEmpty: false}, { merge: true });
            setOpenAddToPlaylistModal(false);
        }
        setAddingUrl('');
    }

    function handleSearchForMedia() {
        if(searchTerm !== '') {
            YTSearch({key: 'AIzaSyAcFecOONJZvjwMnTB9Fv9x753KWsVUvWM', term: searchTerm}, (videos) => {
                setMediaSearchResultYoutube(videos);
            });

            fetch('https://api.dailymotion.com/videos?fields=id,thumbnail_url%2Ctitle&country=fr&search='+searchTerm+'&limit=15')
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

    function handleAddToPlaylistFromUrl(urlToAdd) {
        room.playlistUrls.push(urlToAdd);
        roomRef.set({playlistUrls: room.playlistUrls, playlistEmpty: false}, { merge: true });
        setOpenAddToPlaylistModal(false);
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
        setPercentagePlayed(event.played*100);
    }
  return (
    <div className="flex flex-col w-full gap-0 h-screen relative lg:mx-auto lg:my-0 ">
      
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                >
                    <LibraryMusicIcon />
                </IconButton>
                <h1 sx={{ flexGrow: 1}}> Room n° <b>{ roomId } </b> </h1> -- <span> { loaded && room.playlistUrls.length } médias en playlist</span>
            </Toolbar>
        </AppBar>

        <Container maxWidth="sm" sx={{ padding: '2em 0' }} >
            {loaded && <div> 
                { room.playlistEmpty && 
                    <Alert severity="success"> Bienvenue dans la room ! Ajoutez quelque chose dans la playlist !</Alert>
                }
                { !room.playlistEmpty && 
                    <Box>
                        <Grid container spacing={2}>
                            <Grid sm={4}>
                                <ReactPlayer
                                    ref={ref}
                                    className='react-player'
                                    width='100%'
                                    height='100%'
                                    onProgress={e => handleProgress(e)}
                                    url={room.playlistUrls[room.playing]}
                                    pip={true}
                                    playing={room.actuallyPlaying}
                                    controls={false}
                                    light="false"
                                />
                            </Grid>
                            <Grid sm={8}>
                                <Typography sx={{ ml:2, mb: 1.5 }} color="text.secondary">
                                    { room.playlistUrls[room.playing]}
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
                                <IconButton  color="secondary">
                                    { <RestartAltIcon fontSize="large" onClick={e => handleChangeActuallyPlaying(0)} />}
                                </IconButton>
                            </Grid>
                            <Grid sm={12}>
                                <LinearProgress variant="determinate" value={room.mediaActuallyPlayingAlreadyPlayed} />
                            </Grid>
                        </Grid>
                    </Box>
                }
                
            </div>
            } 
            <List >
                {loaded && room.playlistUrls.length > 0 && <Grid container spacing={2}>
                  <Grid item>
                    <h3>Playlist</h3>
                    <hr />
                    {loaded && room.playlistUrls.map(function(d, idx){
                    return (
                        
                        <ListItemButton  xs={12} sx={{ ml:0, mt: 1.5 }} selected={room.playing === idx}>
                            <ListItemIcon>
                                    {idx !== room.playing && <PlayCircleOutlineIcon onClick={e => handleChangeActuallyPlaying(idx)} />}
                                    {idx === room.playing && room.actuallyPlaying && <PauseCircleOutlineIcon onClick={e => handlePlay(false)} />}
                                    {idx === room.playing && !room.actuallyPlaying && <PlayCircleOutlineIcon onClick={e => handlePlay(true)} />}
                            </ListItemIcon>
                            { d }
                        </ListItemButton>)
                    }) }
                  </Grid>
                </Grid>}
            </List>
        </Container>
        <Dialog onClose={(e) => setOpenAddToPlaylistModal(false)} open={OpenAddToPlaylistModal}>
            <Box sx={{ padding: '1em 2em 1em 1em' }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <h3>Depuis une URL</h3>
                    <hr />
                  </Grid>
                  <Grid item xs={8}>
                    <TextField id="filled-basic" label="Url du lien" helperText="Ajoutez une url youtube, soundcloud ou dailymotion" value={addingUrl} onChange={e => setAddingUrl(e.target.value)} variant="filled" />
                  </Grid>
                  <Grid item xs={4}>
                    <Button variant="contained" onClick={handleAddToPlaylist}>Ajouter</Button>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <h3>Rechercher un média sur Youtube ou DailyMotion</h3>
                    <hr />
                  </Grid>
                  
                  <Grid item xs={8}>
                    <TextField id="filled-basic" label="Rechercher un média" helperText="Par Ex : Vald, Lomepal, Rammstein, Dua Lipa, .." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} variant="filled" />
                  </Grid>
                  <Grid item xs={4}>
                    <Button variant="contained" onClick={handleSearchForMedia}>Rechercher</Button>
                  </Grid>


                  {mediaSearchResultYoutube.length > 1 && <Grid item xs={12}>
                    <List component="nav"
                    subheader={
                        <ListSubheader component="div" id="nested-list-subheader">
                        Résultats de recherche Youtube
                        </ListSubheader>
                    }
                    >
                        { mediaSearchResultYoutube.map(function(media, idx){
                            return (<ListItemButton onClick={(e) => handleAddToPlaylistFromUrl('https://www.youtube.com/watch?v='+media.id.videoId)}><ListItemIcon><LibraryMusicIcon /></ListItemIcon><ListItemText primary={media.snippet.title} /></ListItemButton>)
                        }) }
                    </List>
                    
                  </Grid>}

                  {mediaSearchResultDailyMotion.length > 1 && <Grid item xs={12}>
                    <hr />
                    <List component="nav"
                    subheader={
                        <ListSubheader component="div" id="nested-list-subheader">
                        Résultats de recherche DailyMotion
                        </ListSubheader>
                    }
                    >
                        { mediaSearchResultDailyMotion.map(function(media, idx){
                            return (<ListItemButton onClick={(e) => handleAddToPlaylistFromUrl('https://www.dailymotion.com/video/'+media.id)}><ListItemIcon><LibraryMusicIcon /></ListItemIcon><ListItemText primary={media.title} /></ListItemButton>)
                        }) }
                    </List>
                  </Grid>}
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

        <Fab variant="extended" onClick={(e) => setOpenAddToPlaylistModal(true)}>
            <SpeedDialIcon sx={{ mr: 1 }} />
            Ajouter à la playlist
        </Fab>
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
