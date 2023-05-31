
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';

const Notifications = ({ notifsList }) => {
   
  return (
    
    <Stack className='notif_bloc'spacing={2}>
        <Snackbar
            open={true} >
            <Alert severity="success">Elarion a ajouté un lien</Alert>
        </Snackbar>
        <Snackbar
            open={true}
            message="Elarion a rejoins la room"
        />
        <Snackbar
            open={true}
            message="Elarion a rejoins la room"
        />
             
    </Stack>
  )
};

export default Notifications;