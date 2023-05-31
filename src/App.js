import { useEffect, useState } from "react";
import Room from './components/Room';
import UserTopBar from './components/general_template/userTopBar';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { v4 as uuid } from 'uuid';

import AwesomeSlider from 'react-awesome-slider';
import withAutoplay from 'react-awesome-slider/dist/autoplay';
import 'react-awesome-slider/dist/styles.css';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';


import { styled, createTheme, ThemeProvider } from '@mui/material/styles';



import CssBaseline from '@mui/material/CssBaseline';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import Grid from '@mui/material/Grid';

function App() {
  const [roomId, setRoomId] = useState(localStorage.getItem("MusicRoom_RoomId"));
  const [userInfoPseudo, setUserInfoPseudo] = useState(localStorage.getItem("MusicRoom_UserInfoPseudo"));
  const [joinRoomRoomId, setJoinRoomRoomId] = useState('');
  const [userInfoPseudoInput, setUserInfoPseudoInput] = useState('');

  const AutoplaySlider = withAutoplay(AwesomeSlider);
	const queryParameters = new URLSearchParams(window.location.search)
	const rid = queryParameters.get("rid");

  useEffect(() => {   
    if(rid) {
      setRoomId(rid);
    }
  }, [rid]);

  function createNewRoom() {
    var unique_id = uuid();
    var small_id = unique_id.slice(0,5).toLowerCase()
    setRoomId(small_id);
    localStorage.setItem("MusicRoom_RoomId", small_id);
    window.scrollTo(0, 0);
  }

  function handleJoinRoomByRoomId() {
    window.location.href = "/?rid="+joinRoomRoomId.replace(/\s/g,'');
    window.scrollTo(0, 0);
  }

  function checkForNewPseudo() {
    if(userInfoPseudoInput.length > 1) {
      setUserInfoPseudo(userInfoPseudoInput);
      localStorage.setItem("MusicRoom_UserInfoPseudo", userInfoPseudoInput);
      window.scrollTo(0, 0);
    }
  }

  // App.js
  const font =  "'Quicksand', sans-serif";
  const theme = createTheme({
  container:{bgcolor:'red'},
  typography: {
    fontFamily: [
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(',')
  }})

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth={false} className='main_container' sx={{  paddingLeft: '0px !important', paddingRight: '0px !important', bgcolor:'rgba(79, 79, 79, 0.3) !important', borderRadius:'15px' }}>
         <AppBar position="static" sx={{bgcolor: '#202124'}}>
            <Toolbar>
              <img src="img/logo_small.png" style={{ width: '250px', 'max-width':'50%'}} alt="MusicRoom logo"/>
              {userInfoPseudo && (
                <UserTopBar userInfoPseudo={userInfoPseudo} />
              )}
            </Toolbar>
          </AppBar>
        {!roomId && <Box sx={{  paddingBottom:'10px !important', bgcolor:'rgba(48, 48, 48, 0)',height: 'auto', pl:2, pr:2 }} >
          <Container maxWidth="sm">
            <Grid container sx={{display:'flex', justifyContent:'center', pt:3,mb:5}}>
              <AutoplaySlider
              fillParent={false}
                  play={true}
                  interval={6000}
                  organicArrows={false}
                >
                  <Box> 
                    <Typography  sx={{pl:2,pr:2}} variant="h5" gutterBottom>
                      Crée ta room ou rejoins en une !
                    </Typography>
                    <Typography sx={{pl:2,pr:2, color:'white'}} >
                      Tous les membres d'une room peuvent ajouter une musique ou une vidéo à la playlist quand ils le désirent depuis leur téléphone ! 
                      La playlist est partagée entre tout le monde en temps réel et l'hôte de la room est maître de la soirée !
                    </Typography>
                  </Box>
                  <Box > 
                    <Typography sx={{pl:2,pr:2}} variant="h5" gutterBottom>
                      Soyez tous synchronisés !
                    </Typography>
                    <Typography sx={{pl:2,pr:2, color:'white'}} >
                      La playlist est partagée en temps réel entre tous les utilisateurs, vous pouvez ainsi regarder la même chose, en même temps a des endroits différents !
                    </Typography>
                  </Box>
              </AutoplaySlider>
            </Grid>
            
            <Button variant="filled" className='main_bg_color' sx={{width:'100%',color:'white', height:'50px', mt:'2em', mb:'2em'}} onClick={createNewRoom}> Créer une Room </Button> 
            <Typography sx={{mb:2}}></Typography>
            <Typography variant="h5" gutterBottom>
              Rejoindre une room 
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Tu as l'ID d'une room qui existe déjà ? <br /> Renseignes-le ici pour la rejoindre !
            </Typography>
            <TextField
                  id="joinRoomIdField"
                  type="text"
                  label="ID de la room"
                  helperText="Insérez l'id d'une room"
                  value={joinRoomRoomId}
                  onKeyPress={(ev) => {
                  if (ev.key === 'Enter')  { handleJoinRoomByRoomId()}
                  }}
                  onChange={e => setJoinRoomRoomId(e.target.value)}
                  sx={{ width: '100%', paddingRight:'0', "& .MuiOutlinedInput-root": {
                      paddingRight: 0
                  } }}
                  InputProps={{
                      endAdornment: (
                          <InputAdornment  sx={{
                          padding: "27.5px 14px",
                          backgroundColor: "#23282d",
                          color:'white',
                          cursor:'pointer'}} position="end" onClick={e => handleJoinRoomByRoomId()}>
                          <DoubleArrowIcon />
                          </InputAdornment>
                      ),
                  }}
              />
            </Container>
             
        </Box>
        }
        {roomId && <Room className='room_bloc' roomId={roomId}></Room>}
        {(!userInfoPseudo || userInfoPseudo === '' || userInfoPseudo.length === 0 || userInfoPseudo == 'null') && 
        <Dialog open={true}>
            <DialogTitle>Hey ! Choisis toi un pseudo ! </DialogTitle>  
            <DialogContent>
              <DialogContentText>
                <TextField
                    id="UserChoosePseudoInput"
                    type="text"
                    onKeyPress={(ev) => {
                      if (ev.key === 'Enter')  { checkForNewPseudo()}
                    }}
                    label="Créez votre pseudo !"
                    helperText="Bien qu'anonyme, il est nécessaire d'avoir un pseudo pour utiliser les rooms!"
                    value={userInfoPseudoInput}
                    onChange={e => setUserInfoPseudoInput(e.target.value)}
                    sx={{ width: '100%', paddingRight:'0', "& .MuiOutlinedInput-root": {
                        paddingRight: 0
                    } }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment  sx={{
                            padding: "27.5px 14px",
                            backgroundColor: "#23282d",
                            color:'white',
                            cursor:'pointer',
                            }} position="end" onClick={e=> checkForNewPseudo()}>
                            <DoubleArrowIcon  />
                            </InputAdornment>
                        ),
                    }}
                />
              </DialogContentText>
            </DialogContent>
        </Dialog>}
      </Container></ThemeProvider>
  );
}

export default App;