import { useEffect, useState } from "react";
import Room from './components/Room';
import UserTopBar from './components/generalsTemplates/userTopBar';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import { v4 as uuid } from 'uuid';

import { Icon } from '@iconify/react';
import LoginModal from './components/generalsTemplates/modals/LoginModal';

import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import JoinRoomModal from "./components/generalsTemplates/modals/JoinRoomModal";
import Contentslider from "./components/homePage/ContentSlider";

import { auth } from "./services/firebase";
import firebase from "firebase";

function App() {

  const [isSignedIn, setIsSignedIn] = useState(false);
  const [roomId, setRoomId] = useState(localStorage.getItem("MusicRoom_RoomId"));
  const [userInfos, setUserInfo] = useState({});
  const [userInfoPseudo, setUserInfoPseudo] = useState(localStorage.getItem("MusicRoom_UserInfoPseudo"));
  
  const [joinRoomModalOpen, setJoinRoomModalOpen] = useState(false);

	const queryParameters = new URLSearchParams(window.location.search)
	const rid = queryParameters.get("rid");
  
  useEffect(() => {
    const unregisterAuthObserver = auth.onAuthStateChanged(user => {
      if (user) {
        setUserInfo(user);
        setIsSignedIn(true);
      }
      else {
        setIsSignedIn(false);
      }
    }
    )
    return () => unregisterAuthObserver()
  }, [])

  useEffect(() => {  
    if(rid) {
      setRoomId(rid);
    }
  }, [rid]);

  function createNewRoom() {
    var unique_id = uuid();
    var small_id = unique_id.slice(0,5).toLowerCase()
    setRoomId(small_id);
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

  function logOut() {
    setRoomId();
    localStorage.removeItem("MusicRoom_SpotifyToken");
    auth.signOut();
  }

  return (
    <>
      <CssBaseline />
      <Container maxWidth={false} className='main_container' sx={{  paddingLeft: '0px !important', paddingRight: '0px !important', bgcolor:'rgba(79, 79, 79, 0.3) !important', borderRadius:'15px' }}>
         <AppBar position="static" sx={{bgcolor: '#202124'}}>
            <Toolbar>
              <img src="img/logo_small.png" style={{ width: '250px', maxWidth:'50%'}} alt="MusicRoom logo"/>
              {isSignedIn && (
                <UserTopBar userInfoPseudo={userInfos.email} handleLogout={logOut} />
              )}
            </Toolbar>
          </AppBar>
        {!roomId && <Box sx={{  paddingBottom:'10px !important', bgcolor:'rgba(48, 48, 48, 0)',height: 'auto', pl:2, pr:2 }} >
          <Container maxWidth="sm">
            <Grid container sx={{display:'flex', justifyContent:'center', pt:3,mb:5}}>
              <Contentslider />
            </Grid>
            
            <Button variant="filled" className='main_bg_color buttonBorder' sx={{width:'100%',color:'var(--white)', height:'50px', mt:'2em'}} 
              onClick={createNewRoom}>
                <Icon icon="carbon:intent-request-create" width="30" style={{marginRight:'20px'}}/> 
                Créer une Room </Button> 
            <Button variant="filled" className='main_bg_color buttonBorder' sx={{width:'100%',color:'var(--white)', height:'50px', mt:'2em', mb:'2em'}} 
              onClick={(e) => setJoinRoomModalOpen(true)}> 
                <Icon icon="icon-park-outline:connect"  width="30" style={{marginRight:'20px'}}/>
                Rejoindre une Room </Button> 

                <JoinRoomModal open={joinRoomModalOpen} changeOpen={setJoinRoomModalOpen} handleJoinRoom={handleJoinRoomByRoomId} />
           
            </Container>
        </Box>
        }
        {roomId && <Room className='room_bloc' roomId={roomId} handleQuitRoom={setRoomId()}></Room>}

        {!isSignedIn && <LoginModal 
        open={true} 
        handleSetPseudo={logIn} 
        />}

      </Container>
    </>
  );
}

export default App;