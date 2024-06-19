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
import { GFontIcon, delay, getRandomHexColor, isEmpty, randomInt, setPageTitle } from "./services/utils";
import {replaceCurrentUrlWithHomeUrl, replaceCurrentUrlWithRoomUrl, replaceCurrentUrlWithRoomUrlForDeezer, replaceCurrentUrlWithRoomUrlForSpotify} from './services/redirects';

import { withTranslation } from 'react-i18next';
import { createUserDataObject } from "./services/utilsArray";
import { browserLocalPersistence, createUserWithEmailAndPassword, getAdditionalUserInfo, onAuthStateChanged, setPersistence, signInAnonymously, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
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

  useEffect(() => {
      const hash = window.location.hash
      if (hash) {
          var token_spotify = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]
          if(localStorage.getItem("Play-It_RoomId")) {
            joinRoomByRoomId(localStorage.getItem("Play-It_RoomId"));
            replaceCurrentUrlWithRoomUrlForSpotify(localStorage.getItem("Play-It_RoomId"), token_spotify);
          }
      }
  })

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
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser && !isLoginLoading) {
          const userDocRef = doc(db, process.env.REACT_APP_USERS_COLLECTION, currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            finishAuthProcess(currentUser, userDocSnap.data(), 'persistentAuth')
          } 
        } else {
          console.log('loug ?')
        }
    });

    return () => unsubscribe();
    }, []);

  /***********
   * AUTH // LOGIN HANDLER FUNCTION IN ORDER THEY'RE USED
   * 
   * OPEN AUTH MODAL : handleLoginAndRoom()
   * PRE-LOGIN-FUNCTION : preLoginFunc()
   * GOOGLE LOGIN HANDLER : handleGoogleLogin()
   * ANONYMOUS LOGIN HANDLER : anonymousLogin()
   * POST-LOGIN-FUNCTION doActionAfterAuth()
   * END-LOGIN-FUNCTION finishAuthProcess()
   * CALLBACK AFTER LOGIN : doActionAfterLogin()
   * 
   * LOGIN HELPERS
   * LOGIN-FAILED-HELPER setLoginFailed()
  */

  /* OPEN AUTH MODAL */
  function handleLoginAndRoom(callback) { // can handle a callback function
    setFuncAfterLogin(callback);
    setLoginModalOpen(true);
  }

  /* PRE-LOGIN-FUNCTION */
  async function preLoginFunc() {
    setIsLoginLoading(true);
    await setPersistence(auth, browserLocalPersistence);
  }

  /* GOOGLE LOGIN HANDLER */
  async function handleGoogleLogin() {
    preLoginFunc();
    signInWithPopup(auth, googleProvider)
        .then((result) => { 
          doActionAfterAuth(result, 'userInUser');
        })
        .catch((err) => {
            setLoginFailed('Une erreur est survenue');
        });
  }

  /* ANONYMOUS LOGIN HANDLER */
  async function anonymousLogin() {
    preLoginFunc();
    signInAnonymously(auth).then((result) => { 
        doActionAfterAuth(result, 'userInUser');
      })
      .catch((err) => {
          setLoginFailed('Une erreur est survenue');
      });
  }

  /* POST-LOGIN-FUNCTION */
  async function doActionAfterAuth(user, objectType = 'simple') {

    var entireUserDatas = (objectType == 'simple') ? user : user.user;

    let userRef = doc(db, process.env.REACT_APP_USERS_COLLECTION, entireUserDatas.uid);
    if(getAdditionalUserInfo(user).isNewUser) {
      var userInfosTemp = createUserDataObject(null, entireUserDatas.providerId ?? 'anon', PseudoGenerated, entireUserDatas.isAnonymous);
      await setDoc(userRef, userInfosTemp);
    } 
    await getDoc(userRef).then((userFirebaseData) => {
      finishAuthProcess(entireUserDatas, userFirebaseData.data(), 'newAuth');
    });
  }

  /* END-LOGIN-FUNCTION */
  function finishAuthProcess(globalDatas, customDatas, actionType) {
    globalDatas.displayName = customDatas.displayName;
    globalDatas.customDatas = customDatas;
    setUserInfo(globalDatas);
    setIsSignedIn(true);

    if('newAuth' === actionType) {
      handleLoginSnack(true);
      CreateGoogleAnalyticsEvent('Actions',globalDatas.providerId+' login',globalDatas.providerId+' login');
    }

    setIsAppLoading(false);
    doActionAfterLogin();
  }

  /* CALLBACK AFTER LOGIN */
  function doActionAfterLogin() {
    switch(funcAfterLogin) {
      case 'createRoom':
        createNewRoom();
        break;
      case 'joinRoom':
        setJoinRoomModalOpen(true);
        break;
      default:
    }
    setFuncAfterLogin('');
  }

  /* LOGIN-FAILED-HELPER */
  async function setLoginFailed(error) {
    setLoginErrorMessage(error);
    setIsLoginLoading(false);
  }

  /* LOGOUT FUNCTION */
  function logOut() {
    setIsSignedIn(false);
    setUserInfo({});
    signOut(auth).then(() => {
      replaceCurrentUrlWithHomeUrl(); 
      setRoomId();
      setLogoutOkSnackBarOpen(true);   
      CreateGoogleAnalyticsEvent('Actions','Logout','Logout');
    });
  }

  async function handlePasswordAndMailLogin(email,password) {
    setIsLoginLoading(true);
    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
          doActionAfterAuth(userCredential);
      })
      .catch((error) => {
        if(error.code === "auth/email-already-in-use") {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    doActionAfterAuth(userCredential);
                })
                .catch((error) => {
                  setLoginFailed(error.message);
                })
        } else {
          setLoginFailed(error.message);
        }
      })
  }

  function handleLoginSnack(newUser = false) {
    setLoginErrorMessage();
    setIsLoginLoading(false);
    newUser ? setLoginNewUserOkSnackBarOpen(true) : setLoginOkSnackBarOpen(true);
  }

  function handleQuitRoomMain() {
    setRoomId();
    replaceCurrentUrlWithHomeUrl();
    localStorage.removeItem("Play-It_RoomId");
    localStorage.removeItem("Play-It_SpotifyToken");
    
    CreateGoogleAnalyticsEvent('Actions','Quit playlist','Quit playlist');
  }

  async function setUserInfoEdit(user) {
      setUserInfo(user);
      let userRef = doc(db, process.env.REACT_APP_USERS_COLLECTION, user.uid);
      await updateDoc(userRef, user.customDatas);
  }

  return (
    <>
      <CssBaseline />
      <Container maxWidth={false} className={roomId ? 'main_container' : 'main_container homecontainer'} sx={{  paddingLeft: '0px !important', paddingRight: '0px !important', bgcolor:'rgba(79, 79, 79, 0.3) !important', borderRadius:'15px' }}>
         <AppBar className={roomId ? stickyDisplay ? 'topBarIsInRoomSticky' : 'topBarIsInRoom' : 'topBarClassic'} position="static" sx={{bgcolor: '#202124'}}>
            <Toolbar>
              <img src="img/logo_py1.png" style={{ width: 'auto', maxWidth:'50%', maxHeight:'30px'}} alt="Play-It logo"/>
                <UserTopBar loggedIn={isSignedIn} user={userInfos} setUserInfo={setUserInfoEdit} joinRoomByRoomId={joinRoomByRoomId} handleOpenLoginModal={setLoginModalOpen} handleLogout={logOut} />
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

        {!isSignedIn && (roomId || loginModalOpen) && 
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