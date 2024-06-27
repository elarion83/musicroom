import { useEffect, useState } from "react";
import Room from './components/Room';
import UserTopBar from './components/generalsTemplates/userTopBar';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';

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
import { GFontIcon, appApkFileUrl, envAppNameHum, isEmpty, isVarExist, isVarExistNotEmpty, setPageTitle } from "./services/utils";
import {replaceCurrentUrlWithHomeUrl, replaceCurrentUrlWithRoomUrl } from './services/redirects';

import { withTranslation } from 'react-i18next';
import { createUserDataObject } from "./services/utilsArray";
import { browserLocalPersistence, createUserWithEmailAndPassword, getAdditionalUserInfo, onAuthStateChanged, setPersistence, signInAnonymously, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import {  doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getCleanRoomId } from "./services/utilsRoom";
import { useNavigate, useParams } from 'react-router-dom';
function App( {t} ) {
  
  // general app statuts
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState();
  const [stickyDisplay, setStickyDisplay] = useState(false);
  const navigate = useNavigate();
  // for login + action
  const [funcAfterLogin, setFuncAfterLogin] = useState('');

  // room infos
  const routeParams = useParams();
  var testRoomIdGetter = isVarExist(routeParams.roomId) ? routeParams.roomId : (window.location.pathname.substring(1).length === 5) ? window.location.pathname.substring(1) : '';
  const [roomId, setRoomId] = useState(testRoomIdGetter);

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
      if(localStorage.getItem("Play-It_RoomId") && isEmpty(roomId)) {
        joinRoomByRoomId(localStorage.getItem("Play-It_RoomId"));
      }
      if(localStorage.getItem("Play-It_RoomId") && !isEmpty(roomId)) {
        localStorage.setItem("Play-It_RoomId", getCleanRoomId(roomId));
      }
  })

  function createNewRoom() {
    var newRoomId = getCleanRoomId();
    joinRoomByRoomId(newRoomId, true);

    CreateGoogleAnalyticsEvent('Actions','Création playlist','Playlist id :'+newRoomId);
  }

  function joinRoomByRoomId(idRoom, isAfterCreation = false) {
    var cleanRoomId = getCleanRoomId(idRoom);
    setRoomId(cleanRoomId);
    
   // replaceCurrentUrlWithRoomUrl(getCleanRoomId(idRoom));
    localStorage.setItem("Play-It_RoomId", idRoom);

    if(!isAfterCreation) {
      setJoinRoomModalOpen(false);
      CreateGoogleAnalyticsEvent('Actions','Rejoin. playlist','Playlist id :'+idRoom);
    }
    navigate("/"+cleanRoomId);
  }
  

  /***********
   * AUTH // LOGIN HANDLER FUNCTION IN ORDER THEY'RE USED
   * 
   * OPEN AUTH MODAL : handleLoginAndRoom()
   * PRE-LOGIN-FUNCTION : preLoginFunc()
   * GOOGLE LOGIN HANDLER : handleGoogleLogin()
   * ANONYMOUS LOGIN HANDLER : anonymousLogin()
   * POST-LOGIN-FUNCTION : doActionAfterAuth()
   * END-LOGIN-FUNCTION : finishAuthProcess()
   * CALLBACK AFTER LOGIN : doActionAfterLogin()
   * 
   * LOGIN HELPERS //
   * LOGIN-FAILED-HELPER : setLoginFailed()
   * LOGIN-KEEP-ALIVE : UseEffect() -> regular snapshot of user
   * LOGOUT FUNCTION
  */

  /* OPEN AUTH MODAL */
  function handleLoginAndRoom(callback) { // can handle a callback function
    setFuncAfterLogin(callback);
    setLoginModalOpen(true);
  }

  /* PRE-LOGIN-FUNCTION */
  async function preLoginFunc() {
    setIsLoginLoading(true);
    setIsAppLoading(true);
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
            setLoginFailed(t('GeneralErrorHappened'));
        });
  }

  /* ANONYMOUS LOGIN HANDLER */
  async function anonymousLogin() {
    preLoginFunc();
    signInAnonymously(auth).then((result) => { 
        doActionAfterAuth(result, 'userInUser');
      })
      .catch((err) => {
          setLoginFailed(t('GeneralErrorHappened'));
      });
  }

  /* POST-LOGIN-FUNCTION */
  async function doActionAfterAuth(user, objectType = 'simple') {
    var entireUserDatas = (objectType == 'simple') ? user : user.user;
    var newUser = getAdditionalUserInfo(user).isNewUser;
    let userRef = doc(db, process.env.REACT_APP_USERS_COLLECTION, entireUserDatas.uid);
    if(newUser) {
      var userInfosTemp = createUserDataObject(entireUserDatas.uid, !entireUserDatas.providerData[0] ? 'anon' : entireUserDatas.providerData[0].providerId, PseudoGenerated, entireUserDatas.isAnonymous);
      await setDoc(userRef, userInfosTemp).then(async () => {
        await getDoc(userRef).then(async (userFirebaseData) => {
          await finishAuthProcess(entireUserDatas, userFirebaseData.data(), 'newAuth', newUser);
        });
      });
    }  else {
      await getDoc(userRef).then(async (userFirebaseData) => {
        await finishAuthProcess(entireUserDatas, userFirebaseData.data(), 'newAuth', newUser);
      });
    }
  }

  /* END-LOGIN-FUNCTION */
  async function finishAuthProcess(globalDatas, customDatas, actionType, newUser=false) {
    globalDatas.displayName = customDatas.displayName;
    globalDatas.customDatas = customDatas;
    setUserInfo(globalDatas);
    setIsSignedIn(true);

    if('newAuth' === actionType) {
      handleLoginSnack(newUser);
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
        setFuncAfterLogin('');
        break;
      case 'joinRoom':
        setJoinRoomModalOpen(true);
        setFuncAfterLogin('');
        break;
      default:
    }
  }

  /* LOGIN-FAILED-HELPER */
  async function setLoginFailed(error) {
    setLoginErrorMessage(error);
    setIsLoginLoading(false);
  }

  /* LOGIN-KEEP-ALIVE */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser && !isLoginLoading) {
        const userDocRef = doc(db, process.env.REACT_APP_USERS_COLLECTION, currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          finishAuthProcess(currentUser, userDocSnap.data(), 'persistentAuth')
        } 
      } else {
        setIsAppLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  /* LOGOUT FUNCTION */
  function logOut() {
    setIsSignedIn(false);
    setUserInfo({});
    localStorage.removeItem("Play-It_RoomId");
    signOut(auth).then(() => {
      goFromPlaylistToHome();
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
    goFromPlaylistToHome();
    localStorage.removeItem("Play-It_RoomId");
    localStorage.removeItem("Play-It_SpotifyToken");
    
    CreateGoogleAnalyticsEvent('Actions','Quit playlist','Quit playlist');
  }

  async function setUserInfoEdit(user) {
      setUserInfo(user);
      let userRef = doc(db, process.env.REACT_APP_USERS_COLLECTION, user.uid);
      await updateDoc(userRef, user.customDatas);
  }

  function goFromPlaylistToHome() {
      setRoomId();
      navigate("/");
      /* replaceCurrentUrlWithHomeUrl(); */
      setPageTitle(envAppNameHum+' - '+t('GeneralSlogan'));
  }

  return (
    <>
      <CssBaseline />
      <Container maxWidth={false} className={roomId ? 'main_container' : 'main_container homecontainer'} sx={{  paddingLeft: '0px !important', paddingRight: '0px !important', bgcolor:'rgba(79, 79, 79, 0.3) !important', borderRadius:'15px' }}>
         <AppBar className={(roomId && isSignedIn) ? stickyDisplay ? 'topBarIsInRoomSticky' : 'topBarIsInRoom' : 'topBarClassic'} position="static" sx={{bgcolor: '#202124'}}>
            <Toolbar>
                <img src="img/logo__new.png" style={{ width: 'auto', maxWidth:'50%', maxHeight:'40px', mt:'2px'}} alt={envAppNameHum+" logo"} />
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
                <Button variant="outlined" size="small" target="_blank" href={appApkFileUrl} className='varelaFontTitle buttonBorder' sx={{width:'100%',transform:'scale(0.8)',color:'var(--white)',bgcolor:'var(--grey-dark)', height:'50px', mt:'2em', mb:'2em'}} 
                > 
                  {<GFontIcon icon="install_mobile"/>}
                  <Typography variant="button" sx={{pl:2, textTransform:'uppercase'}}> {t('GeneralDownloadAPK')} </Typography>
                </Button> 
                    <JoinRoomModal open={joinRoomModalOpen} changeOpen={setJoinRoomModalOpen} handleJoinRoom={joinRoomByRoomId} />
              
                </Container>
            </Box>
          }
        {roomId && isSignedIn && 
          <Room currentUser={userInfos} className='room_bloc' roomId={roomId} handleQuitRoom={handleQuitRoomMain} setStickyDisplay={setStickyDisplay}></Room>     
        }

        {!isSignedIn && (roomId || loginModalOpen) && 
        <LoginModal 
          open={true} 
          changeOpen={(e) => setLoginModalOpen(false)}
          handleAnonymousLogin={anonymousLogin}
          handleGoogleLogin={handleGoogleLogin}
          handlePasswordAndMailLogin={handlePasswordAndMailLogin}
          loginErrorMessage={loginErrorMessage}
          loginLoading={isVarExistNotEmpty(roomId) ? isAppLoading : isLoginLoading}
          redirectToHome={handleQuitRoomMain}
          roomId={roomId}
        />}

        {isSignedIn && 
          <>
            <Snackbar
              open={loginOkSnackBarOpen}
              autoHideDuration={3000}
              onClose={() => setLoginOkSnackBarOpen(false)}
              sx={{borderRadius:'2px'}}
              message={t('GeneralSnackWelcome', {who:userInfos.displayName})}
            />
            <Snackbar
              open={loginNewUserOkSnackBarOpen}
              autoHideDuration={3000}
              onClose={() => setLoginNewUserOkSnackBarOpen(false)}
              sx={{borderRadius:'2px'}}
              message={t('GeneralSnackWelcome', {who:userInfos.displayName})+" 1e "+ t('GeneralLogin').toLowerCase()}
            />
          </>
        }
        
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