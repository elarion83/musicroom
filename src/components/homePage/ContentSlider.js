import { Typography } from "@mui/material";
import { Box } from "@mui/system";


import AwesomeSlider from 'react-awesome-slider';
import withAutoplay from 'react-awesome-slider/dist/autoplay';
import 'react-awesome-slider/dist/styles.css';
const Contentslider = ({ }) => {
 
    const AutoplaySlider = withAutoplay(AwesomeSlider);
    return(
        <AutoplaySlider
        fillParent={false}
            play={true}
            interval={6000}
            organicArrows={false}
        >
            <Box> 
                <Typography  sx={{pl:2,pr:2}} variant="h5" gutterBottom>
                    Une playlist a plusieurs en temps réel
                </Typography>
                <Typography sx={{pl:2,pr:2, color:'var(--white)'}} >
                    Chaque Room dispose d'une playlist lue en temps réel et modifiable par tous les participants ! Chacun peut voter et interagir avec les autres membres de la room
                </Typography>
            </Box>
            <Box > 
                <Typography sx={{pl:2,pr:2}} variant="h5" gutterBottom>
                    N'importe quel support
                </Typography>
                <Typography sx={{pl:2,pr:2, color:'var(--white)'}} >
                    Ajoutez des vidéo Youtube, Dailymotion et Viméo ou bien des musiques Soundcloud ou Spotify via Spotify Premium.
                </Typography>
            </Box>
            <Box > 
                <Typography sx={{pl:2,pr:2}} variant="h5" gutterBottom>
                    L'outil parfait pour les soirées
                </Typography>
                <Typography sx={{pl:2,pr:2, color:'var(--white)'}} >
                    Créez une room, partagez la à vos amis et laissez les ajouter des sons depuis leur téléphone ! 
                </Typography>
            </Box>
        </AutoplaySlider>
    )
};

export default Contentslider;