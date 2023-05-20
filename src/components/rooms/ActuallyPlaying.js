import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

const ActuallyPlaying = ({ roomRef }) => {
    
  return (
    <Grid item sx={{ width:'100%', padding:0, margin:0}}>
        <Typography sx={{bgcolor:'#645a47', color:'white', padding:'0.5em'}}> Lecture en cours </Typography>
    </Grid>
  )
};

export default ActuallyPlaying;