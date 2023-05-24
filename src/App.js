import { useEffect, useState } from "react";
import Room from './components/Room';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import AddIcon from '@mui/icons-material/Add';
import { v4 as uuid } from 'uuid';

import SearchIcon from '@mui/icons-material/Search';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Typography from '@mui/material/Typography';


import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';


import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';

import CssBaseline from '@mui/material/CssBaseline';
import SettingsIcon from '@mui/icons-material/Settings';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid';
import CardContent from '@mui/material/CardContent';

function App() {
  const [roomId, setRoomId] = useState(localStorage.getItem("MusicRoom_RoomId"));
  const [userInfoPseudo, setUserInfoPseudo] = useState(localStorage.getItem("MusicRoom_UserInfoPseudo"));
  const [joinRoomRoomId, setJoinRoomRoomId] = useState('');
  const [userInfoPseudoInput, setUserInfoPseudoInput] = useState('');

	const queryParameters = new URLSearchParams(window.location.search)
	const rid = queryParameters.get("rid");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {    
    if(rid) {
      setRoomId(rid);
    }
  }, [rid]);

  function createNewRoom() {
    var unique_id = uuid();
    var small_id = unique_id.slice(0,5)
    setRoomId(small_id);
    localStorage.setItem("MusicRoom_RoomId", small_id);
    window.scrollTo(0, 0);
  }

  function handleJoinRoomByRoomId() {
    window.location.href = "/?rid="+joinRoomRoomId.replace(/\s/g,'');
    window.scrollTo(0, 0);
  }

  function checkForNewPseudo() {
    if(userInfoPseudoInput.length > 1) {
      setUserInfoPseudo(userInfoPseudoInput);
      localStorage.setItem("MusicRoom_UserInfoPseudo", userInfoPseudoInput);
      window.scrollTo(0, 0);
    }
  }

  function handleClickMenu(event) {
    setAnchorEl(event.currentTarget);
  };

  function handleLogout() {
      localStorage.setItem("MusicRoom_UserInfoPseudo", userInfoPseudoInput);
      window.location.reload();
  }

  const handleClose = () => {
    setAnchorEl(null);
  };
  // App.js
  const font =  "'Quicksand', sans-serif";
  const theme = createTheme({
  container:{bgcolor:'red'},
  typography: {
    fontFamily: [
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(',')
  }})

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ bgcolor: '#f1ede2', paddingLeft: '0px !important' ,paddingRight: '0px !important' }}>
        {userInfoPseudo && <Grid container sx={{display:'flex', justifyContent:'flex-end', padding:'5px 10px', bgcolor:'#3e464d'}}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', textAlign: 'center' }}>
              <Tooltip title="Paramètres du compte" sx={{ bgColor:'30363c'}}>
                <IconButton
                  onClick={e => handleClickMenu(e)}
                  size="small"
                  sx={{ ml: 2 , borderRadius:2, color:'white', fontSize:'12px', textTransform:'uppercase'}}
                  aria-controls={open ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                >
                  { userInfoPseudo }
                  <AccountCircleIcon sx={{ ml:2,width: 32, height: 32 }}></AccountCircleIcon>
                </IconButton>
              </Tooltip>
            </Box>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={e => handleLogout()}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Déconnexion
              </MenuItem>
            </Menu>
        </Grid>}
        {!roomId && <Box sx={{ bgcolor: '#f1ede2', height: '100vh', pl:2 }} >
          <Grid container sx={{display:'flex', justifyContent:'center', pt:3,mb:5}}>
            <img src="img/logo.png" style={{ width: '250px'}} alt="MusicRoom logo"/>
          </Grid>
          
        <Stepper alternativeLabel activeStep={4} >
            <Step>
              <StepLabel>
                <Card>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      Créé une Room
                    </Typography>
                  </CardContent>
                </Card>
              </StepLabel>
            </Step>
            <Step>
              <StepLabel>
                <Card>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      Invite tes potes
                    </Typography>
                  </CardContent>
                </Card>
              </StepLabel>
            </Step>
            <Step>
              <StepLabel>
                <Card>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      Créez une playlist ensemble !
                    </Typography>
                    <p> Ajoutez des sons depuis youtube, spotify ou dailymotion depuis votre mobile </p>
                  </CardContent>
                </Card>
              </StepLabel>
            </Step>
        </Stepper>
          <Button variant="outlined" sx={{width:'100%',border:'2px solid #1976d2 !important', height:'50px', mt:'2em', mb:'2em'}} onClick={createNewRoom}> Créer une Room </Button> 
          <Typography>Rejoindre une room </Typography>
          <TextField
                id="joinRoomIdField"
                type="text"
                label="ID de la room"
                helperText="Insérez l'id d'une room"
                value={joinRoomRoomId}
                onChange={e => setJoinRoomRoomId(e.target.value)}
                sx={{ width: '100%', paddingRight:'0', "& .MuiOutlinedInput-root": {
                    paddingRight: 0
                } }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment  sx={{
                        padding: "27.5px 14px",
                        backgroundColor: "#b79f6e",
                        color:'white',
                        cursor:'pointer'}} position="end" onClick={e => handleJoinRoomByRoomId()}>
                        <DoubleArrowIcon />
                        </InputAdornment>
                    ),
                }}
            />
        </Box>
        }
        {roomId && <Room roomId={roomId}></Room>}
        {!userInfoPseudo || userInfoPseudo == 'null' &&
        <Dialog open={true}>
            <DialogTitle>Hey ! Choisis toi un pseudo temporaire ! </DialogTitle>  
            <DialogContent>
              <DialogContentText>
                <TextField
                    id="UserChoosePseudoInput"
                    type="text"
                    label="Créez votre pseudo !"
                    helperText="Bien qu'anonyme, il est nécessaire d'avoir un pseudo !"
                    value={userInfoPseudoInput}
                    onChange={e => setUserInfoPseudoInput(e.target.value)}
                    sx={{ width: '100%', paddingRight:'0', "& .MuiOutlinedInput-root": {
                        paddingRight: 0
                    } }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment  sx={{
                            padding: "27.5px 14px",
                            backgroundColor: "#b79f6e",
                            color:'white',
                            cursor:'pointer',
                            }} position="end" onClick={e=> checkForNewPseudo()}>
                            <SearchIcon  />
                            </InputAdornment>
                        ),
                    }}
                />
              </DialogContentText>
            </DialogContent>
        </Dialog>}
      </Container></ThemeProvider>
  );
}

export default App;