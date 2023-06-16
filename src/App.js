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

import { auth, googleProvider } from "./services/firebase";

import {PseudoGenerated} from './services/pseudoGenerator';
import { Snackbar } from "@mui/material";

function App() {
  // general app statuts
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState();

  // room infos
	const queryParameters = new URLSearchParams(window.location.search)
  const [roomId, setRoomId] = useState(queryParameters.get("rid") ? queryParameters.get("rid") : '');

  // user infos
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userInfos, setUserInfo] = useState({});
  
  // modal statuts
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [joinRoomModalOpen, setJoinRoomModalOpen] = useState(false);

  // snackbar statuts
  const [loginNewUserOkSnackBarOpen, setLoginNewUserOkSnackBarOpen] = useState(false);
  const [loginOkSnackBarOpen, setLoginOkSnackBarOpen] = useState(false);
  const [logoutOkSnackBarOpen, setLogoutOkSnackBarOpen] = useState(false);

  // tools
  const delay = ms => new Promise(res => setTimeout(res, ms));
  
  useEffect(() => {
    const unregisterAuthObserver = auth.onAuthStateChanged(user => {

      if (user) {
        setUserInfo(user);
        if(user.displayName === null) {
          user.updateProfile({displayName: PseudoGenerated});
          setUserInfo({displayName:PseudoGenerated});
        }
        setIsSignedIn(true);
      }
      else if(localStorage.getItem("MusicRoom_AnonymouslyLoggedIn")) {
        setUserInfo({displayName:localStorage.getItem("MusicRoom_AnonymouslyPseudo")});
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
  

    useEffect(() => {
        const hash = window.location.hash
        if (hash) {
            var token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]
            if(localStorage.getItem("MusicRoom_SpotifyRoomId")) {
              joinRoomByRoomId(localStorage.getItem("MusicRoom_SpotifyRoomId"));
              replaceCurrentUrlWithRoomUrl(localStorage.getItem("MusicRoom_SpotifyRoomId"));
            }
        }
    }, [])

  function createNewRoom() {
    var newRoomId = uuid().slice(0,5).toLowerCase()
    joinRoomByRoomId(newRoomId);
  }

  function joinRoomByRoomId(idRoom) {
    setRoomId(idRoom.toLowerCase().trim());
    replaceCurrentUrlWithRoomUrl(idRoom.toLowerCase().trim());
    setJoinRoomModalOpen(false);
  }
  

  async function anonymousLogin() {
    setIsLoginLoading(true);
    await delay(500);
    setIsLoginLoading(false);
    setUserInfo({displayName:PseudoGenerated});

    localStorage.setItem("MusicRoom_AnonymouslyPseudo",  PseudoGenerated);
    localStorage.setItem("MusicRoom_AnonymouslyLoggedIn",  true);

    setIsSignedIn(true);
    handleLoginOkSnackNewUser();
    window.scrollTo(0, 0);
  }

  async function handleGoogleLogin() {
    setIsLoginLoading(true);
    await auth.signInWithPopup(googleProvider)
        .then((result) => { 
          if(result.additionalUserInfo.isNewUser) {
            result.user.updateProfile({displayName: PseudoGenerated}).then((result) => { 
              setIsLoginLoading(false);
              setUserInfo({displayName:PseudoGenerated});        
              handleLoginOkSnackNewUser();
            });
          } else {
            setIsLoginLoading(false);
            handleLoginOkSnack();
          }
        })
        .catch((err) => {
            setIsLoginLoading(false);
            setLoginErrorMessage('Une erreur est survenue');
        });
  }

  async function handlePasswordAndMailLogin(email,password) {
    setIsLoginLoading(true);
    await auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                handleLoginOkSnackNewUser();
            })
            .catch((error) => {
                if(error.code === "auth/email-already-in-use") {
                    auth.signInWithEmailAndPassword(email, password)
                        .then((userCredential) => {
                            // Signed in
                            handleLoginOkSnack();
                            setIsLoginLoading(false);
                            return userCredential.user;
                        })
                        .catch((error) => {
                            setLoginErrorMessage(error.message);
                            setIsLoginLoading(false);
                        })
                } else {
                    setLoginErrorMessage(error.message);
                    setIsLoginLoading(false);
                }
            })
  }

  function handleLoginOkSnack() {
    setLoginOkSnackBarOpen(true);
    resetLoginModalAfterSuccessfullLogin();
  }

  function handleLoginOkSnackNewUser() {
    setLoginNewUserOkSnackBarOpen(true);
    resetLoginModalAfterSuccessfullLogin();
  }

  function resetLoginModalAfterSuccessfullLogin() {
    setLoginErrorMessage();
    setIsLoginLoading(false);
  }

  function logOut() {
    setRoomId();
    setUserInfo({});
    setIsSignedIn(false);
    localStorage.removeItem("MusicRoom_SpotifyRoomId");
    localStorage.removeItem("MusicRoom_SpotifyToken");
    localStorage.removeItem("MusicRoom_AnonymouslyLoggedIn");
    localStorage.removeItem("MusicRoom_AnonymouslyPseudo");
    auth.signOut();
    setLogoutOkSnackBarOpen(true);
    replaceCurrentUrlWithHomeUrl();    
  }

  function handleQuitRoomMain() {
    setRoomId();
    localStorage.removeItem("MusicRoom_SpotifyRoomId");
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
              {!isAppLoading && (
                <UserTopBar userInfoPseudo={userInfos.displayName} handleOpenLoginModal={setLoginModalOpen} handleLogout={logOut} />
              )}
            </Toolbar>
          </AppBar>
        {!roomId && <Box sx={{  paddingBottom:'10px !important', bgcolor:'rgba(48, 48, 48, 0)',height: 'auto', pl:2, pr:2 }} >
          <Container maxWidth="sm">
            <Grid container sx={{display:'flex', justifyContent:'center', pt:3,mb:5}}>
              <Contentslider />
            </Grid>
            
            <Button variant="filled" className='main_bg_color  buttonBorder' sx={{width:'100%',color:'var(--white)', height:'50px', mt:'2em'}} 
              onClick={(e) => isSignedIn ? createNewRoom() : setLoginModalOpen(true)}>
                <Icon icon="carbon:intent-request-create" width="30" style={{marginRight:'20px'}}/> 
                Créer une Room </Button> 
            <Button variant="filled" className='main_bg_color  buttonBorder' sx={{width:'100%',color:'var(--white)', height:'50px', mt:'2em', mb:'2em'}} 
              onClick={(e) => isSignedIn ? setJoinRoomModalOpen(true) : setLoginModalOpen(true)}> 
                <Icon icon="icon-park-outline:connect"  width="30" style={{marginRight:'20px'}}/>
                Rejoindre une Room </Button> 

                <JoinRoomModal open={joinRoomModalOpen} changeOpen={setJoinRoomModalOpen} handleJoinRoom={joinRoomByRoomId} />
           
            </Container>
        </Box>
        }
        {roomId && isSignedIn && <Room currentUser={userInfos} className='room_bloc' roomId={roomId} handleQuitRoom={handleQuitRoomMain}></Room>}

        {!isSignedIn && !isAppLoading && (roomId || loginModalOpen) && <LoginModal 
        open={true} 
        changeOpen={(e) => setLoginModalOpen(false)}
        handleAnonymousLogin={anonymousLogin}
        handleGoogleLogin={handleGoogleLogin}
        handlePasswordAndMailLogin={handlePasswordAndMailLogin}
        loginErrorMessage={loginErrorMessage}
        loginLoading={isLoginLoading}
        redirectToHome={handleQuitRoomMain}
        roomId={roomId}
        />}

        <Snackbar
          open={loginOkSnackBarOpen}
          autoHideDuration={3000}
          onClose={() => setLoginOkSnackBarOpen(false)}
          sx={{borderRadius:'2px'}}
          message={"Bienvenue "+userInfos.displayName+" !"}
          />
          <Snackbar
          open={loginNewUserOkSnackBarOpen}
          autoHideDuration={3000}
          onClose={() => setLoginNewUserOkSnackBarOpen(false)}
          sx={{borderRadius:'2px'}}
          message={"Bienvenue "+userInfos.displayName+", 1e connexion !"}
          />
        <Snackbar
          open={logoutOkSnackBarOpen}
          autoHideDuration={3000}
          onClose={() => setLogoutOkSnackBarOpen(false)}
          sx={{borderRadius:'2px'}}
          message={"A bientôt !"}
          />
      </Container>
    </>
  );
}

export default App;