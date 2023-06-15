import { Grid, IconButton } from "@mui/material";

import FirstPageIcon from '@mui/icons-material/FirstPage';

const ControlButtons = () => {
   
    return(
          <Grid item sm={12} sx={{ bgcolor:'red', position:'sticky', top:'30px', zIndex:8000}}   >
                    <Grid item sm={12} sx={{ display:'flex',justifyContent: 'space-between', padding:0,pt:1,ml:0,mr:1,pr:2, mb: 1.5 }}>
                        
                        <IconButton >
                            <FirstPageIcon  fontSize="large" />
                        </IconButton>
                    </Grid></Grid>
    )
};

export default ControlButtons;