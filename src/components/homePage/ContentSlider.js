import { Container, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect } from "react";
import { useState } from "react";


import AwesomeSlider from 'react-awesome-slider';
import withAutoplay from 'react-awesome-slider/dist/autoplay';
import 'react-awesome-slider/dist/styles.css';
import { useSpringCarousel, useTransitionCarousel  } from 'react-spring-carousel'

const Contentslider = () => {
    
    const AutoplaySlider = withAutoplay(AwesomeSlider);
    const [activeItem, setActiveItem] = useState(0);

    useEffect(() => {
      const timer = setInterval(() => {
        if(getCurrentActiveItem().index < 3) {
            slideToNextItem();
        } else {
            slideToItem(0);
        }
      }, 10000);
      return () => {
        window.clearInterval(timer);
      };
      // You MUST add the slide methods to the dependency list useEffect!
    }, [slideToNextItem]);

    const { carouselFragment,useListenToCustomEvent,slideToItem,getCurrentActiveItem, slideToPrevItem, slideToNextItem } = useSpringCarousel({
        gutter: 0,
        items: [
            {
                id: '0',
                renderItem: 
                <Box className={activeItem == 0 ? 'slideBox activeSlideBox' : 'slideBox'}> 
                    <Typography sx={{pl:2,pr:2,mb:3}} variant="h5" gutterBottom>
                        Créez une playlist en temps réel et a plusieurs ..
                    </Typography>
                    <Typography sx={{pl:2,pr:2,mb:2, color:'var(--white)'}} >
                        Ajoutez des médias depuis <i>Spotify, Youtube, Deezer, et bien d'autre plateformes</i>.
                    </Typography>
                    <Typography sx={{pl:2,pr:2,mt:2, color:'var(--white)'}} >
                        Votez, tchatez, réagissez et vibrez ensemble au rythme de votre playlist. <b>Entre pote, en voiture, ou au sport, Play-it est l'outil indispensable !</b>
                    </Typography>
                </Box>,
            },
            {
                id: '1',
                renderItem: 
                <Box className={activeItem == 1 ? 'slideBox activeSlideBox' : 'slideBox'}> 
                    <Typography sx={{pl:2,pr:2}} variant="h5" gutterBottom>
                        Tous au même endroit ..
                    </Typography>
                    <Typography sx={{pl:2,pr:2, color:'var(--white)'}} >
                        Idéal pour les soirées, une room Play-it permet a chaque convive d'ajouter sa musique ou sa vidéo à la suite de la playlist, plus besoin d'utiliser le téléphone de l'hôte !
                    </Typography>
                </Box>,
            },
            {
                id: '2',
                renderItem: 
                <Box className={activeItem == 2 ? 'slideBox activeSlideBox' : 'slideBox'}> 
                    <Typography sx={{pl:2,pr:2}} variant="h5" gutterBottom>
                        .. Ou bien chacun chez soi
                    </Typography>
                    <Typography sx={{pl:2,pr:2, color:'var(--white)'}} >
                        Grâce à la synchronisation, il est possible de vibrer au rythme de tout tes potes à des endroits différents de la planète, chacun chez soi en révisant ou pour matter les dernières vidéos youtube sous la couette !
                    </Typography>
                </Box>,
            },
            {
                id: '3',
                renderItem: 
                <Box className={activeItem == 3 ? 'slideBox activeSlideBox' : 'slideBox'}> 
                    <Typography sx={{pl:2,pr:2}} variant="h5" gutterBottom>
                        Et bien plus !
                    </Typography>
                    <Typography sx={{pl:2,pr:2, color:'var(--white)'}} >
                        Grâce au chat, aux émoticones en temps réel et aux votes, les membres de la room font partie intégrante de l'ambiance !
                    </Typography>
                </Box>,
            },
        ],
    })

    
    useListenToCustomEvent((event) => {
      if (event.eventName === "onSlideStartChange") {
        setActiveItem(event.nextItem.id)
      } 
    });

    return(
        <Box className='homeSlider'>
            {carouselFragment}
        </Box>
    )
};

export default Contentslider;