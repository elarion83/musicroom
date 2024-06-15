import { useEffect, useState } from "react";
import Room from './components/Room';
import UserTopBar from './components/generalsTemplates/userTopBar';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import axios from "axios";
import { v4 as uuid } from 'uuid';

import { Icon } from '@iconify/react';
import LoginModal from './components/generalsTemplates/modals/LoginModal';

import CssBaseline from '@mui/material/CssBaseline';
import JoinRoomModal from "./components/generalsTemplates/modals/JoinRoomModal";
import Contentslider from "./components/homePage/ContentSlider";

import Footer from './components/generalsTemplates/Footer';

import { auth, db, googleProvider } from "./services/firebase";

import { Snackbar, Typography } from "@mui/material";
import { PseudoGenerated } from './services/pseudoGenerator';

import { CreateGoogleAnalyticsEvent } from './services/googleAnalytics';
import { GFontIcon, getRandomHexColor, randomInt, setPageTitle } from "./services/utils";
import {replaceCurrentUrlWithHomeUrl, replaceCurrentUrlWithRoomUrl, replaceCurrentUrlWithRoomUrlForDeezer, replaceCurrentUrlWithRoomUrlForSpotify} from './services/redirects';

import { withTranslation } from 'react-i18next';
import { createUserDataObject } from "./services/utilsArray";
import { createUserWithEmailAndPassword } from "firebase/auth";
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
        setUserInfo({displayName:localStorage.getItem("Play-It_AnonymouslyPseudo"),avatarId:localStorage.getItem("Play-It_AnonymouslyAvatarId"), loginType:'anon',color: localStorage.getItem("Play-It_AnonymouslyColor")});
        setIsSignedIn(true);
      }
      else {
        setIsSignedIn(false);
      }

      setIsAppLoading(false);
    })
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
  })


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

    CreateGoogleAnalyticsEvent('Actions','Création playlist','Playlist id :'+newRoomId);
  }

  function joinRoomByRoomId(idRoom) {
    setRoomId(idRoom.toLowerCase().trim());
    replaceCurrentUrlWithRoomUrl(idRoom.toLowerCase().trim());
    setPageTitle('Playlist ' + idRoom + ' - Play-It');
    setJoinRoomModalOpen(false);
    CreateGoogleAnalyticsEvent('Actions','Rejoin. playlist','Playlist id :'+idRoom);
  }
  
  // when join room or create room button pressed, if not logged in we need to do the right action after login
  function handleLoginAndRoom(action) {
    setFuncAfterLogin(action);
    setLoginModalOpen(true);
  }

  function doActionAfterLogin() {
    if(funcAfterLogin === 'createRoom') {
      createNewRoom();
    }

    if(funcAfterLogin === 'joinRoom') {
      setJoinRoomModalOpen(true);
    }

    setFuncAfterLogin('');
  }

  async function anonymousLogin() {
    setIsLoginLoading(true);
    await delay(500);
    setIsLoginLoading(false);
    var userInfosTemp = createUserDataObject(null, 'anon', PseudoGenerated, true);
    setUserInfo(userInfosTemp);

    localStorage.setItem("Play-It_AnonymouslyPseudo",  PseudoGenerated);
    localStorage.setItem("Play-It_AnonymouslyColor",  getRandomHexColor());
    localStorage.setItem("Play-It_AnonymouslyAvatarId",userInfosTemp.avatarId);
    
    localStorage.setItem("Play-It_AnonymouslyLoggedIn",  true);

    setIsSignedIn(true);
    handleLoginOkSnackNewUser();
    window.scrollTo(0, 0);

    doActionAfterLogin();

    CreateGoogleAnalyticsEvent('Actions','Anonym. login','Anonym. login');
  }

  async function setLoginFailed(error) {
    setLoginErrorMessage(error);
    setIsLoginLoading(false);
  }

  async function newUserRegisterAfterFirebaseAuth(userUid, registerType) {
      var userData = createUserDataObject(userUid, registerType, PseudoGenerated)
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
            setLoginFailed('Une erreur est survenue');
        });

  }

  async function handlePasswordAndMailLogin(email,password) {
    setIsLoginLoading(true);
    await createUserWithEmailAndPassword(auth, email, password)
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
                  setLoginFailed(error.message);
                })
        } else {
          setLoginFailed(error.message);
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
    replaceCurrentUrlWithHomeUrl();
    setRoomId();
    localStorage.removeItem("Play-It_RoomId");
    localStorage.removeItem("Play-It_SpotifyToken");
    
    CreateGoogleAnalyticsEvent('Actions','Quit playlist','Quit playlist');
  }

  function setUserInfoEdit(user) {
      db.collection(process.env.REACT_APP_USERS_COLLECTION).doc(user.uid).set(user).then();
      setUserInfo(user);
  }

  return (
    <>
      <CssBaseline />
      <Container maxWidth={false} className={roomId ? 'main_container' : 'main_container homecontainer'} sx={{  paddingLeft: '0px !important', paddingRight: '0px !important', bgcolor:'rgba(79, 79, 79, 0.3) !important', borderRadius:'15px' }}>
         <AppBar className={roomId ? stickyDisplay ? 'topBarIsInRoomSticky' : 'topBarIsInRoom' : 'topBarClassic'} position="static" sx={{bgcolor: '#202124'}}>
            <Toolbar>
              <img src="img/logo_py1.png" style={{ width: 'auto', maxWidth:'50%', maxHeight:'30px'}} alt="Play-It logo"/>
              {!isAppLoading && (
                <UserTopBar user={userInfos} setUserInfo={setUserInfoEdit} joinRoomByRoomId={joinRoomByRoomId} handleOpenLoginModal={setLoginModalOpen} handleLogout={logOut} />
              )}
            </Toolbar>
          </AppBar>
          {!roomId && 
            <Box sx={{  paddingBottom:'10px !important', bgcolor:'rgba(48, 48, 48, 0)',height: 'auto', pl:2, pr:2}} >
              <Container maxWidth="sm" sx={{pt:3}}>
                <Contentslider />
                
                <Button variant="filled" className='main_bg_color  varelaFontTitle buttonBorder texturaBgButton' sx={{width:'100%',color:'var(--white)', height:'50px', mt:'2em'}} 
                  onClick={(e) => isSignedIn ? createNewRoom() : handleLoginAndRoom('createRoom')}>
                    <Icon icon="carbon:intent-request-create" width="30" style={{marginRight:'20px'}}/> 
                    <Typography variant="button" sx={{pt:'3px'}}>{t('HomePageButtonsCreateRoom')} </Typography>
                </Button> 
                <Button variant="filled" className='main_bg_color varelaFontTitle buttonBorder texturaBgButton' sx={{width:'100%',color:'var(--white)', height:'50px', mt:'2em'}} 
                  onClick={(e) => isSignedIn ? setJoinRoomModalOpen(true) : handleLoginAndRoom('joinRoom')}> 
                    <Icon icon="icon-park-outline:connect"  width="30" style={{marginRight:'20px'}}/>
                    <Typography variant="button" sx={{pt:'3px'}}>{t('HomePageButtonsJoinRoom')} </Typography>
                </Button> 
                <Button variant="outlined" size="small" target="_blank" href="http://dev.play-it.fr/back/play-it-android.apk" className='varelaFontTitle buttonBorder' sx={{width:'100%',transform:'scale(0.8)',color:'var(--white)',bgcolor:'var(--grey-dark)', height:'50px', mt:'2em', mb:'2em'}} 
                > 
                  {<GFontIcon icon="install_mobile"/>}
                  <Typography variant="button" sx={{pl:2}}> TELECHARGER L'APPLICATION </Typography>
                </Button> 
                    <JoinRoomModal open={joinRoomModalOpen} changeOpen={setJoinRoomModalOpen} handleJoinRoom={joinRoomByRoomId} />
              
                </Container>
            </Box>
          }
        {roomId && isSignedIn && <Room currentUser={userInfos} className='room_bloc' roomId={roomId} handleQuitRoom={handleQuitRoomMain} setStickyDisplay={setStickyDisplay}></Room>}

        {!isSignedIn && !isAppLoading && (roomId || loginModalOpen) && 
        <LoginModal 
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