import { useEffect, useState } from "react";
import Room from './components/Room';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { v4 as uuid } from 'uuid';

function App() {
  const [roomId, setRoomId] = useState(localStorage.getItem("MusicRoom_RoomId"));

	const queryParameters = new URLSearchParams(window.location.search)
	const rid = queryParameters.get("rid");

  useEffect(() => {    
    if(rid) {
      setRoomId(rid);
    }
  }, [rid]);

  function createNewRoom() {
    var unique_id = uuid();
    var small_id = unique_id.slice(0,8)
    setRoomId(small_id);
    localStorage.setItem("MusicRoom_RoomId", small_id);
  }

  return (
      <Container maxWidth="sm" sx={{ bgcolor: '#f1ede2', paddingLeft: '0px !important' ,paddingRight: '0px !important' }}>
        {!roomId && <Box sx={{ bgcolor: '#f1ede2', height: '100vh' }} >
          <img src="img/logo.png" alt="MusicRoom logo"/>
          <ul>
            <li> Fini d'attendre 2heures pour mettre ta musique en soirée !</li>
            <li> Fini de faire tourner ton téléphone car tu es le seul connecté au Bluetooth !</li>
            <li> Crée une room, invite tes amis et créez ensemble une playlist ensemble qui sera lu sur ton téléphone !</li>
          </ul>
          <Button variant="contained" onClick={createNewRoom}> Créer une Room </Button> 
        </Box>
        }
        {roomId && <Room roomId={roomId}></Room>}
      </Container>
  );
}

export default App;