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
        db.collection('users').doc(user.uid).get().then((userDB) => {
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
      console.log('aa');
      if (hash) {
          var token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]
          
          if(localStorage.getItem("Play-It_SpotifyRoomId")) {
            joinRoomByRoomId(localStorage.getItem("Play-It_SpotifyRoomId"));
         //   replaceCurrentUrlWithRoomUrl(localStorage.getItem("Play-It_SpotifyRoomId"));
            replaceCurrentUrlWithRoomUrlForSpotify(localStorage.getItem("Play-It_SpotifyRoomId"), token);
          }
      }
  }, [])


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

    CreateGoogleAnalyticsEvent('Actions','Anonym. login','Anonym. login');
  }

  async function newUserRegisterAfterFirebaseAuth(userUid, registerType) {
      var userData={
        displayName:PseudoGenerated, 
        creationTime:Date.now(),
        uid:userUid,
        loginType:registerType
      }
      setUserInfo(userData);
      db.collection('users').doc(userUid).set(userData).then((doc) => {
        setIsLoginLoading(false);
        handleLoginOkSnackNewUser();
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
    localStorage.removeItem("Play-It_SpotifyRoomId");
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
    localStorage.removeItem("Play-It_SpotifyRoomId");
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
    window.history.replaceState('string','', window.location.protocol+'//'+window.location.hostname+(window.location.port ? ":" + window.location.port : '')+'?rid='+roomId.replace(/\s/g,'')+'&token='+token);
  }

  function setUserInfoEdit(user) {
      db.collection('users').doc(user.uid).set(user).then();
      setUserInfo(user);
  }

  return (
    <>
      <CssBaseline />
      <Container maxWidth={false} className='main_container' sx={{  paddingLeft: '0px !important', paddingRight: '0px !important', bgcolor:'rgba(79, 79, 79, 0.3) !important', borderRadius:'15px' }}>
         <AppBar position="static" sx={{bgcolor: '#202124'}}>
            <Toolbar>
              <img src="img/logo_py1.png" style={{ width: 'auto', maxWidth:'50%', maxHeight:'30px'}} alt="Play-It logo"/>
              {!isAppLoading && (
                <UserTopBar user={userInfos} setUserInfo={setUserInfoEdit} joinRoomByRoomId={joinRoomByRoomId} handleOpenLoginModal={setLoginModalOpen} handleLogout={logOut} />
              )}
            </Toolbar>
          </AppBar>
        {!roomId && <Box sx={{  paddingBottom:'10px !important', bgcolor:'rgba(48, 48, 48, 0)',height: 'auto', pl:2, pr:2}} >
          <Container maxWidth="sm">
            <Grid container sx={{display:'flex', justifyContent:'center', pt:3,mb:5}}>
              <Contentslider />
            </Grid>
            
            <Button variant="filled" className='main_bg_color  buttonBorder' sx={{width:'100%',color:'var(--white)', height:'50px', mt:'2em'}} 
              onClick={(e) => isSignedIn ? createNewRoom() : setLoginModalOpen(true)}>
                <Icon icon="carbon:intent-request-create" width="30" style={{marginRight:'20px'}}/> 
                {t('HomePageButtonsCreateRoom')} </Button> 
            <Button variant="filled" className='main_bg_color  buttonBorder' sx={{width:'100%',color:'var(--white)', height:'50px', mt:'2em', mb:'2em'}} 
              onClick={(e) => isSignedIn ? setJoinRoomModalOpen(true) : setLoginModalOpen(true)}> 
                <Icon icon="icon-park-outline:connect"  width="30" style={{marginRight:'20px'}}/>
                {t('HomePageButtonsJoinRoom')}  </Button> 

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