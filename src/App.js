import { useEffect, useState } from "react";
import Room from './components/Room';
import UserTopBar from './components/generalsTemplates/userTopBar';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import { v4 as uuid } from 'uuid';
import axios from "axios";

import { Icon } from '@iconify/react';
import LoginModal from './components/generalsTemplates/modals/LoginModal';

import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import JoinRoomModal from "./components/generalsTemplates/modals/JoinRoomModal";
import Contentslider from "./components/homePage/ContentSlider";

import Footer from './components/generalsTemplates/Footer';

import { db, auth, googleProvider } from "./services/firebase";

import {PseudoGenerated} from './services/pseudoGenerator';
import { Snackbar } from "@mui/material";

import {CreateGoogleAnalyticsEvent} from './services/googleAnalytics';

import { withTranslation } from 'react-i18next';
function App( {t} ) {
  

  // general app statuts
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState();
  const [stickyDisplay, setStickyDisplay] = useState(false);

  // for login + action
  const [funcAfterLogin, setFuncAfterLogin] = useState('');

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
        db.collection(process.env.REACT_APP_USERS_COLLECTION).doc(user.uid).get().then((userDB) => {
          setUserInfo(userDB.data());
          setIsSignedIn(true);
        });
      }
      else if(localStorage.getItem("Play-It_AnonymouslyLoggedIn")) {
        setUserInfo({displayName:localStorage.getItem("Play-It_AnonymouslyPseudo")});
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
          var token_spotify = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]
          if(localStorage.getItem("Play-It_RoomId")) {
            joinRoomByRoomId(localStorage.getItem("Play-It_RoomId"));
            replaceCurrentUrlWithRoomUrlForSpotify(localStorage.getItem("Play-It_RoomId"), token_spotify);
          }
      }
      
      if(queryParameters.get("code")) {
        var token_deezer = queryParameters.get("code");
        getDeezerAccessToken(token_deezer);
      }
  }, [])


  async function getDeezerAccessToken(token) {
      await axios.get(process.env.REACT_APP_BACK_FOLDER_URL+'/deezer/accessToken.php?appID='+process.env.REACT_APP_ROOM_DEEZER_APP_ID+'&appSecret='+process.env.REACT_APP_ROOM_DEEZER_APP_SECRET_KEY+'&code='+token)
        .then(function(response) {
          var deezerResult = response.data;
          var firstSplit = deezerResult.split('=');
          var tokenSplit = firstSplit[1].split('&');
          if(tokenSplit[0]) {
            joinRoomByRoomId(localStorage.getItem("Play-It_RoomId"));
            replaceCurrentUrlWithRoomUrlForDeezer(localStorage.getItem("Play-It_RoomId"), tokenSplit[0]);
          }
        })
        .catch(function(error) {
        });          
  }

  function createNewRoom() {
    var newRoomId = uuid().slice(0,5).toLowerCase()
    joinRoomByRoomId(newRoomId);

    CreateGoogleAnalyticsEvent('Actions','Création room','Room id :'+newRoomId);
  }

  function joinRoomByRoomId(idRoom) {
    setRoomId(idRoom.toLowerCase().trim());
    replaceCurrentUrlWithRoomUrl(idRoom.toLowerCase().trim());
    setJoinRoomModalOpen(false);
    CreateGoogleAnalyticsEvent('Actions','Rejoin. Room','Room id :'+idRoom);
  }
  
  // when join room or create room button pressed, if not logged in we need to do the right action after login
  function handleLoginAndRoom(action) {
    setFuncAfterLogin(action);
    setLoginModalOpen(true);
  }

  function doActionAfterLogin() {
    if(funcAfterLogin == 'createRoom') {
      createNewRoom();
    }

    if(funcAfterLogin == 'joinRoom') {
      setJoinRoomModalOpen(true);
    }

    setFuncAfterLogin('');
  }

  async function anonymousLogin() {
    setIsLoginLoading(true);
    await delay(500);
    setIsLoginLoading(false);
    setUserInfo({displayName:PseudoGenerated,
    loginType:'anon'});

    localStorage.setItem("Play-It_AnonymouslyPseudo",  PseudoGenerated);
    localStorage.setItem("Play-It_AnonymouslyLoggedIn",  true);

    setIsSignedIn(true);
    handleLoginOkSnackNewUser();
    window.scrollTo(0, 0);

    doActionAfterLogin();

    CreateGoogleAnalyticsEvent('Actions','Anonym. login','Anonym. login');
  }

  async function newUserRegisterAfterFirebaseAuth(userUid, registerType) {
      var userData={
        displayName:PseudoGenerated, 
        creationTime:Date.now(),
        uid:userUid,
        loginType:registerType,
        userParams:{
          NotifsActivated:true
        }
      }
      setUserInfo(userData);
      db.collection(process.env.REACT_APP_USERS_COLLECTION).doc(userUid).set(userData).then((doc) => {
        setIsLoginLoading(false);
        handleLoginOkSnackNewUser();
        doActionAfterLogin();
        CreateGoogleAnalyticsEvent('Actions',registerType+' register',registerType+' register');
      });
  }

  async function handleGoogleLogin() {
    setIsLoginLoading(true);
    await auth.signInWithPopup(googleProvider)
        .then((result) => { 
          if(result.additionalUserInfo.isNewUser) {
            newUserRegisterAfterFirebaseAuth(result.user.uid, 'Google');
          } else {
            setIsLoginLoading(false);
            handleLoginOkSnack();
            doActionAfterLogin();
            CreateGoogleAnalyticsEvent('Actions','Google login','Google login');
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
                newUserRegisterAfterFirebaseAuth(userCredential.user.uid, 'Mail');
            })
            .catch((error) => {
                if(error.code === "auth/email-already-in-use") {
                    auth.signInWithEmailAndPassword(email, password)
                        .then((userCredential) => {
                            // Signed in
                            handleLoginOkSnack();
                            setIsLoginLoading(false);
                            doActionAfterLogin();
                            CreateGoogleAnalyticsEvent('Actions','Mail login','Mail login');
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
    localStorage.removeItem("Play-It_RoomId");
    localStorage.removeItem("Play-It_SpotifyToken");
    localStorage.removeItem("Play-It_AnonymouslyLoggedIn");
    localStorage.removeItem("Play-It_AnonymouslyPseudo");
    auth.signOut();
    setLogoutOkSnackBarOpen(true);
    replaceCurrentUrlWithHomeUrl();    

    CreateGoogleAnalyticsEvent('Actions','Logout','Logout');
  }

  function handleQuitRoomMain() {
    setRoomId();
    localStorage.removeItem("Play-It_RoomId");
    localStorage.removeItem("Play-It_SpotifyToken");
    replaceCurrentUrlWithHomeUrl();
    
    CreateGoogleAnalyticsEvent('Actions','Quit room','Quit room');
  }

  function replaceCurrentUrlWithHomeUrl() {
    window.history.replaceState('string','', window.location.protocol+'//'+window.location.hostname+(window.location.port ? ":" + window.location.port : ''));
  }

  function replaceCurrentUrlWithRoomUrl(roomId) {
    window.history.replaceState('string','', window.location.protocol+'//'+window.location.hostname+(window.location.port ? ":" + window.location.port : '')+'?rid='+roomId.replace(/\s/g,''));
  }

  function replaceCurrentUrlWithRoomUrlForSpotify(roomId, token) {
    window.history.replaceState('string','', window.location.protocol+'//'+window.location.hostname+(window.location.port ? ":" + window.location.port : '')+'?rid='+roomId.replace(/\s/g,'')+'&spotoken='+token);
  }

  function replaceCurrentUrlWithRoomUrlForDeezer(roomId, token) {
    window.history.replaceState('string','', window.location.protocol+'//'+window.location.hostname+(window.location.port ? ":" + window.location.port : '')+'?rid='+roomId.replace(/\s/g,'')+'&deetoken='+token);
  }

  function setUserInfoEdit(user) {
      db.collection(process.env.REACT_APP_USERS_COLLECTION).doc(user.uid).set(user).then();
      setUserInfo(user);
  }

  return (
    <>
      <CssBaseline />
      <Container maxWidth={false} className='main_container' sx={{  paddingLeft: '0px !important', paddingRight: '0px !important', bgcolor:'rgba(79, 79, 79, 0.3) !important', borderRadius:'15px' }}>
         <AppBar className={roomId ? stickyDisplay ? 'topBarIsInRoomSticky' : 'topBarIsInRoom' : 'topBarClassic'} position="static" sx={{bgcolor: '#202124'}}>
            <Toolbar>
              <img src="img/logo_py1.png" style={{ width: 'auto', maxWidth:'50%', maxHeight:'30px'}} alt="Play-It logo"/>
              {!isAppLoading && (
                <UserTopBar user={userInfos} setUserInfo={setUserInfoEdit} joinRoomByRoomId={joinRoomByRoomId} handleOpenLoginModal={setLoginModalOpen} handleLogout={logOut} />
              )}
            </Toolbar>
          </AppBar>
        {!roomId && <Box sx={{  paddingBottom:'10px !important', bgcolor:'rgba(48, 48, 48, 0)',height: 'auto', pl:2, pr:2}} >
          <Container maxWidth="sm" sx={{pt:3}}>
            <Contentslider />
            
            <Button variant="filled" className='main_bg_color  buttonBorder' sx={{width:'100%',color:'var(--white)', height:'50px', mt:'2em'}} 
              onClick={(e) => isSignedIn ? createNewRoom() : handleLoginAndRoom('createRoom')}>
                <Icon icon="carbon:intent-request-create" width="30" style={{marginRight:'20px'}}/> 
                {t('HomePageButtonsCreateRoom')} </Button> 
            <Button variant="filled" className='main_bg_color  buttonBorder' sx={{width:'100%',color:'var(--white)', height:'50px', mt:'2em', mb:'2em'}} 
              onClick={(e) => isSignedIn ? setJoinRoomModalOpen(true) : handleLoginAndRoom('joinRoom')}> 
                <Icon icon="icon-park-outline:connect"  width="30" style={{marginRight:'20px'}}/>
                {t('HomePageButtonsJoinRoom')}  </Button> 

                <JoinRoomModal open={joinRoomModalOpen} changeOpen={setJoinRoomModalOpen} handleJoinRoom={joinRoomByRoomId} />
           
            </Container>
        </Box>
        }
        {roomId && isSignedIn && <Room currentUser={userInfos} className='room_bloc' roomId={roomId} handleQuitRoom={handleQuitRoomMain} setStickyDisplay={setStickyDisplay}></Room>}

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
          message={t('GeneralSnackWelcome') +' '+ userInfos.displayName+" !"}
        />
        <Snackbar
          open={loginNewUserOkSnackBarOpen}
          autoHideDuration={3000}
          onClose={() => setLoginNewUserOkSnackBarOpen(false)}
          sx={{borderRadius:'2px'}}
          message={t('GeneralSnackWelcome') +' '+ userInfos.displayName+", 1e connexion !"}
        />
        <Snackbar
          open={logoutOkSnackBarOpen}
          autoHideDuration={3000}
          onClose={() => setLogoutOkSnackBarOpen(false)}
          sx={{borderRadius:'2px'}}
          message={t('GeneralSnackSeeYouSoon')}
        />

        {!roomId && false && <Footer />}
      </Container>
    </>
  );
}

export default withTranslation()(App);