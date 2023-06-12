import { useEffect, useState } from "react";
import Room from './components/Room';
import UserTopBar from './components/generalsTemplates/userTopBar';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { v4 as uuid } from 'uuid';

import AwesomeSlider from 'react-awesome-slider';
import withAutoplay from 'react-awesome-slider/dist/autoplay';
import 'react-awesome-slider/dist/styles.css';

import LoginModal from './components/generalsTemplates/modals/LoginModal';

import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import { Icon } from "@iconify/react";
import JoinRoomModal from "./components/generalsTemplates/modals/JoinRoomModal";

function App() {
  const [roomId, setRoomId] = useState(localStorage.getItem("MusicRoom_RoomId"));
  const [userInfoPseudo, setUserInfoPseudo] = useState(localStorage.getItem("MusicRoom_UserInfoPseudo"));
  const [joinRoomRoomId, setJoinRoomRoomId] = useState('');
  const [joinRoomModalOpen, setJoinRoomModalOpen] = useState(false);

  const AutoplaySlider = withAutoplay(AwesomeSlider);
	const queryParameters = new URLSearchParams(window.location.search)
	const rid = queryParameters.get("rid");

  useEffect(() => {   
    if(rid) {
      setRoomId(rid);
      localStorage.setItem("MusicRoom_RoomId", rid);
    }
  }, [rid]);

  function createNewRoom() {
    var unique_id = uuid();
    var small_id = unique_id.slice(0,5).toLowerCase()
    setRoomId(small_id);
    localStorage.setItem("MusicRoom_RoomId", small_id);
    window.scrollTo(0, 0);
  }

  function handleJoinRoomByRoomId(idRoom) {
    window.location.href = "/?rid="+idRoom.replace(/\s/g,'');
    window.scrollTo(0, 0);
  }
  

  function logIn(newPseudo) {
    setUserInfoPseudo(newPseudo);
    localStorage.setItem("MusicRoom_UserInfoPseudo", newPseudo);
    window.scrollTo(0, 0);
  }

  return (
    <>
      <CssBaseline />
      <Container maxWidth={false} className='main_container' sx={{  paddingLeft: '0px !important', paddingRight: '0px !important', bgcolor:'rgba(79, 79, 79, 0.3) !important', borderRadius:'15px' }}>
         <AppBar position="static" sx={{bgcolor: '#202124'}}>
            <Toolbar>
              <img src="img/logo_small.png" style={{ width: '250px', maxWidth:'50%'}} alt="MusicRoom logo"/>
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
                    <Typography sx={{pl:2,pr:2, color:'var(--white)'}} >
                      Tous les membres d'une room peuvent ajouter une musique ou une vidéo à la playlist quand ils le désirent depuis leur téléphone ! 
                      La playlist est partagée entre tout le monde en temps réel et l'hôte de la room est maître de la soirée !
                    </Typography>
                  </Box>
                  <Box > 
                    <Typography sx={{pl:2,pr:2}} variant="h5" gutterBottom>
                      Soyez tous synchronisés !
                    </Typography>
                    <Typography sx={{pl:2,pr:2, color:'var(--white)'}} >
                      La playlist est partagée en temps réel entre tous les utilisateurs, vous pouvez ainsi regarder la même chose, en même temps a des endroits différents !
                    </Typography>
                  </Box>
              </AutoplaySlider>
            </Grid>
            
            <Button variant="filled" className='main_bg_color' sx={{width:'100%',color:'var(--white)', height:'50px', mt:'2em'}} 
              onClick={createNewRoom}> Créer une Room </Button> 
            <Button variant="filled" className='main_bg_color' sx={{width:'100%',color:'var(--white)', height:'50px', mt:'2em', mb:'2em'}} 
              onClick={(e) => setJoinRoomModalOpen(true)}> Rejoindre une Room </Button> 

            <JoinRoomModal open={joinRoomModalOpen} changeOpen={setJoinRoomModalOpen} handleJoinRoom={handleJoinRoomByRoomId} />
           
            </Container>
        </Box>
        }
        {roomId && <Room className='room_bloc' roomId={roomId}></Room>}

        {(!userInfoPseudo || userInfoPseudo === '' || userInfoPseudo.length === 0 || userInfoPseudo == 'null') && <LoginModal 
        open={true} 
        handleSetPseudo={logIn} 
        />}

      </Container>
    </>
  );
}

export default App;