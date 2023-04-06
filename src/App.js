import { useEffect, useState } from "react";
import Room from './components/Room';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { redirect } from "react-router-dom";
import { v4 as uuid } from 'uuid';

function App() {
  const [roomId, setRoomId] = useState(localStorage.getItem("MusicRoom_RoomId"));

	const queryParameters = new URLSearchParams(window.location.search)
	const rid = queryParameters.get("rid");

  // It is to determine that the is user already logged in or not if yes then set the user
  useEffect(() => {
    
    if(rid) {
      setRoomId(rid);
    }
  });

  function createNewRoom() {
    var unique_id = uuid();
    var small_id = unique_id.slice(0,8)
    setRoomId(small_id);
    localStorage.setItem("MusicRoom_RoomId", small_id);
  }

  return (
      <Container maxWidth="sm">
        {!roomId && <Box sx={{ bgcolor: '#cfe8fc', height: '100vh' }} >
          <Button variant="contained" onClick={createNewRoom}> Créer une Room </Button> 
        </Box>
        }
        {roomId && <Room roomId={roomId}></Room>}
      </Container>
  );
}

export default App;