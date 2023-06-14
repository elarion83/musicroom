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

  // general app infos
  const [isAppLoading, setIsAppLoading] = useState(true);

  // room infos
	const queryParameters = new URLSearchParams(window.location.search)
  const [roomId, setRoomId] = useState(queryParameters.get("rid") ? queryParameters.get("rid") : '');

  // user infos
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userInfos, setUserInfo] = useState({});
  const [userInfoPseudo, setUserInfoPseudo] = useState(localStorage.getItem("MusicRoom_UserInfoPseudo"));
  
  // modal infos
  const [joinRoomModalOpen, setJoinRoomModalOpen] = useState(false);

  useEffect(() => {
    const unregisterAuthObserver = auth.onAuthStateChanged(user => {

      if (user) {
        setUserInfo(user);
        setIsSignedIn(true);
      }
      else if(localStorage.getItem("MusicRoom_AnonymouslyLoggedIn")) {
        setUserInfo({email:localStorage.getItem("MusicRoom_AnonymouslyPseudo")});
        setIsSignedIn(true);
      }
      else {
        setIsSignedIn(false);
      }
      setIsAppLoading(false);
    }
    )
    return () => unregisterAuthObserver()
  }, [])
  
  function createNewRoom() {
    var newRoomId = uuid().slice(0,5).toLowerCase()
    joinRoomByRoomId(newRoomId);
  }

  function joinRoomByRoomId(idRoom) {
    setRoomId(idRoom);
    replaceCurrentUrlWithRoomUrl(idRoom);
    window.scrollTo(0, 0);
  }
  

  function anonymousLogin(temporaryPseudo) {
    setUserInfo({email:temporaryPseudo});

    localStorage.setItem("MusicRoom_AnonymouslyPseudo",  temporaryPseudo);
    localStorage.setItem("MusicRoom_AnonymouslyLoggedIn",  true);

    setIsSignedIn(true);
    window.scrollTo(0, 0);
  }

  function logOut() {
    setRoomId();
    setUserInfo({});
    setIsSignedIn(false);
    localStorage.removeItem("MusicRoom_SpotifyToken");
    localStorage.removeItem("MusicRoom_AnonymouslyLoggedIn");
    localStorage.removeItem("MusicRoom_AnonymouslyPseudo");
    auth.signOut();
    replaceCurrentUrlWithHomeUrl();    
  }

  function handleQuitRoomMain() {
    setRoomId();
    localStorage.removeItem("MusicRoom_SpotifyToken");
    replaceCurrentUrlWithHomeUrl();
  }

  function replaceCurrentUrlWithHomeUrl() {
    window.history.replaceState('string','', window.location.protocol+'//'+window.location.hostname+(window.location.port ? ":" + window.location.port : ''));
  }

  function replaceCurrentUrlWithRoomUrl(roomId) {
    window.history.replaceState('string','', window.location.href+"?rid="+roomId.replace(/\s/g,''));
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

                <JoinRoomModal open={joinRoomModalOpen} changeOpen={setJoinRoomModalOpen} handleJoinRoom={joinRoomByRoomId} />
           
            </Container>
        </Box>
        }
        {roomId && <Room className='room_bloc' roomId={roomId} handleQuitRoom={handleQuitRoomMain}></Room>}

        {!isSignedIn && !isAppLoading && <LoginModal 
        open={true} 
        handleSetPseudo={anonymousLogin} 
        />}

      </Container>
    </>
  );
}

export default App;