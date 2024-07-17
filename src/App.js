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

import { Typography } from "@mui/material";
import { PseudoGenerated } from './services/pseudoGenerator';

import { CreateGoogleAnalyticsEvent } from './services/googleAnalytics';
import { GFontIcon, UserIsFromApp, appApkFileUrl, checkStorageRoomId, envAppNameHum, isVarExist, isVarExistNotEmpty, saveSpotifyToken, setPageTitle,  showLocalNotification,  userSpotifyTokenObject } from "./services/utils";

import { withTranslation } from 'react-i18next';
import { createUserDataObject } from "./services/utilsArray";
import {  createUserWithEmailAndPassword, getAdditionalUserInfo, onAuthStateChanged,  signInAnonymously, signInWithEmailAndPassword,  signInWithPopup, signOut } from "firebase/auth";
import {  doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getCleanRoomId, updateFirebaseUser } from "./services/utilsRoom";
import { useNavigate, useParams } from 'react-router-dom';
import ModalAuthPhone from "./components/rooms/modalsOrDialogs/ModalAuthPhone";

import shareImage from './assets/img/share_img.jpg';
import MetaTags from "./components/generalsTemplates/MetaTags";
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

  // phone auth
  const [phoneAuthModalOpen, setPhoneAuthModalOpen] = useState(false);

  const urlHash = window.location.hash; 
  const haveSpotifyTokenInUrl = urlHash.includes("access_token"); // spotify hash
  useEffect(() => {
    if(haveSpotifyTokenInUrl && !isAppLoading && userInfos) {
      let SpotifyToken = urlHash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];
      let userRef = doc(db, process.env.REACT_APP_USERS_COLLECTION, userInfos.uid);
      showLocalNotification('Lecteur Spotify', 'Connexion établie !', 'success', 2500 );
      saveSpotifyToken(userRef,userSpotifyTokenObject(SpotifyToken),userInfos, setUserInfo, joinRoomByRoomId);
    } 
    if(!haveSpotifyTokenInUrl && !isAppLoading && userInfos) { 
      checkStorageRoomId(roomId, joinRoomByRoomId);
    }
  }, [urlHash, isAppLoading])


  // phone modal login (maybe to move ?)
  useEffect(() => {
    setIsLoginLoading(phoneAuthModalOpen);
  }, [phoneAuthModalOpen]);

  function createNewRoom() {
    var newRoomId = getCleanRoomId();
    joinRoomByRoomId(newRoomId, true);

    CreateGoogleAnalyticsEvent('Actions','Création playlist','Playlist id :'+newRoomId);
  }

  function joinRoomByRoomId(idRoom, isAfterCreation = false) {
    var cleanRoomId = getCleanRoomId(idRoom);
    setRoomId(cleanRoomId);
    
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
   // await setPersistence(auth, browserLocalPersistence);
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
          await finishAuthProcess(entireUserDatas, userFirebaseData.data(), 'newAuth', newUser, userRef);
        });
      });
    }  else {
      await getDoc(userRef).then(async (userFirebaseData) => {
        await finishAuthProcess(entireUserDatas, userFirebaseData.data(), 'newAuth', newUser, userRef);
      });
    }
  }

  /* END-LOGIN-FUNCTION */
  async function finishAuthProcess(globalDatas, customDatas, actionType, newUser=false, userRef) {
    let signInDate = Date.now();
    updateFirebaseUser(userRef,{lastSignInTime:signInDate});
    globalDatas.displayName = customDatas.displayName;
    globalDatas.lastSignInTime = signInDate;
    globalDatas.customDatas = customDatas;

    setUserInfo(globalDatas);
    setIsSignedIn(true);

    if('newAuth' === actionType) { // new login action, not a refresh of page
      showLocalNotification('Connexion réussie !', 'Bienvenue '+auth.currentUser.customDatas.displayName+' :)', 'success', 2500 )

      CreateGoogleAnalyticsEvent('Actions',globalDatas.providerId+' login',globalDatas.providerId+' login');
    }

    setPhoneAuthModalOpen(false);
    setLoginErrorMessage();
    setIsLoginLoading(false);
    setLoginModalOpen(false);
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
    showLocalNotification('Connexion échouée !', error, 'error', 4500 )

    setIsLoginLoading(false);
  }

  /* LOGIN-KEEP-ALIVE */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser && !isLoginLoading) {
        const userDocRef = doc(db, process.env.REACT_APP_USERS_COLLECTION, currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          finishAuthProcess(currentUser, userDocSnap.data(), 'persistentAuth', false, userDocRef)
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
    signOut(auth).then(() => {
      setUserInfo({});
      localStorage.removeItem("Play-It_RoomId");
      showLocalNotification('A très bientôt !', 'Vous nous manquez déjà <3', 'info', 2500 );
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

    const [metaData, setMetaData] = useState({
        title: 'Play-It - Playlists à plusieurs',
        description: 'Youtube et Spotify au même endroit et entre potes !',
        image: shareImage,
    });


  // META DATAS OG ET TWITTER
  return (
    <>                
      <MetaTags metaData={metaData} />
        <CssBaseline />
        <Container maxWidth={false} className={isVarExistNotEmpty(roomId) ? 'main_container' : 'main_container homecontainer'} sx={{  paddingLeft: '0px !important', paddingRight: '0px !important', bgcolor:'rgba(79, 79, 79, 0.3) !important', borderRadius:'15px' }}>
          <AppBar className={(isVarExistNotEmpty(roomId) && isSignedIn) ? stickyDisplay ? '' : 'topBarIsInRoom appBar' : 'topBarClassic appBar'} position="static" sx={{bgcolor: '#202124'}}>
              <Toolbar>
                  {!(isVarExistNotEmpty(roomId) && isSignedIn) && <img className="appLogo" src="img/logo__new.png" alt={envAppNameHum+" logo"} />}
                  <UserTopBar loginLoading={loginModalOpen} loggedIn={isSignedIn} user={userInfos} setUserInfo={setUserInfoEdit} joinRoomByRoomId={joinRoomByRoomId} handleOpenLoginModal={setLoginModalOpen} handleLogout={logOut} />
              </Toolbar>
            </AppBar>
            {!isVarExistNotEmpty(roomId) && 
              <Box sx={{  paddingBottom:'10px !important', bgcolor:'rgba(48, 48, 48, 0)',height: 'auto', pl:2, pr:2}} >
                <Container maxWidth="sm" sx={{pt:3}}>
                  <Contentslider />
                  <Button variant="filled" className='main_bg_color  varelaFontTitle texturaBgButton' sx={{width:'100%',color:'var(--white)', height:'50px', mt:'2em'}} 
                    onClick={(e) => isSignedIn ? createNewRoom() : handleLoginAndRoom('createRoom')}>
                      <Icon icon="carbon:intent-request-create" width="30" style={{marginRight:'20px'}}/> 
                      <Typography variant="button" sx={{pt:'3px'}}>{t('HomePageButtonsCreateRoom')} </Typography>
                  </Button> 
                  <Button variant="filled" className='main_bg_color varelaFontTitle texturaBgButton' sx={{width:'100%',color:'var(--white)', height:'50px', mt:'2em'}} 
                    onClick={(e) => isSignedIn ? setJoinRoomModalOpen(true) : handleLoginAndRoom('joinRoom')}> 
                      <Icon icon="icon-park-outline:connect"  width="30" style={{marginRight:'20px'}}/>
                      <Typography variant="button" sx={{pt:'3px'}}>{t('HomePageButtonsJoinRoom')} </Typography>
                  </Button> 

                  {!UserIsFromApp && 
                  <Button size="small" target="_blank" href={appApkFileUrl} className='varelaFontTitle buttonBorder' sx={{width:'100%',transform:'scale(0.8)',color:'var(--white)',bgcolor:'var(--grey-dark)', height:'50px', mt:'2em', mb:'2em'}} > 
                    <GFontIcon icon="install_mobile"/>
                    <Typography variant="button" sx={{pl:2, textTransform:'uppercase'}}> {t('GeneralDownloadAPK')} </Typography>
                  </Button> }
                  
                  <JoinRoomModal open={joinRoomModalOpen} changeOpen={setJoinRoomModalOpen} handleJoinRoom={joinRoomByRoomId} />
                
                </Container>
              </Box>
            }
          {isVarExistNotEmpty(roomId) && isSignedIn && 
            <Room currentUser={userInfos} className='room_bloc' roomId={roomId} handleQuitRoom={handleQuitRoomMain} setStickyDisplay={setStickyDisplay}></Room>     
          }

          {(!isSignedIn && phoneAuthModalOpen) &&<><div id="recaptcha-container"></div>
          <ModalAuthPhone
            close={(e) => setPhoneAuthModalOpen(false)}
            open={(phoneAuthModalOpen && !isSignedIn)}
            loginLoading={isVarExistNotEmpty(roomId) ? isAppLoading : isLoginLoading}
            doActionAfterAuth={doActionAfterAuth}
          />
          </>}
          <LoginModal 
            open={!isSignedIn && (isVarExistNotEmpty(roomId) || loginModalOpen)} 
            changeOpen={(e) => setLoginModalOpen(false)}
            handleAnonymousLogin={anonymousLogin}
            handleGoogleLogin={handleGoogleLogin}
            handlePhoneLogin={(e) => setPhoneAuthModalOpen(true)}
            handlePasswordAndMailLogin={handlePasswordAndMailLogin}
            loginErrorMessage={loginErrorMessage}
            loginLoading={isVarExistNotEmpty(roomId) ? isAppLoading : isLoginLoading}
            redirectToHome={handleQuitRoomMain}
            roomId={roomId}
          />
          
          {!roomId && false && <Footer />}
        </Container>
    </>
  );
}

export default withTranslation()(App);