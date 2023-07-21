import { Container, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect } from "react";
import { useState } from "react";

import { Icon } from '@iconify/react';

import { useSpringCarousel, useTransitionCarousel  } from 'react-spring-carousel'

const Contentslider = () => {
    
    const [activeItem, setActiveItem] = useState(0);

    useEffect(() => {
      const timer = setInterval(() => {
        if(getCurrentActiveItem().index < 3) {
            slideToNextItem();
        } else {
            slideToItem(0);
        }
      }, 8000);
      return () => {
        window.clearInterval(timer);
      };
      // You MUST add the slide methods to the dependency list useEffect!
    }, [slideToNextItem]);

    const { carouselFragment,useListenToCustomEvent,slideToItem,getCurrentActiveItem, slideToPrevItem, slideToNextItem } = useSpringCarousel({
        gutter: -40,
        items: [
            {
                id: '0',
                renderItem: 
                <Box className={activeItem == 0 ? 'slideBox activeSlideBox' : 'slideBox'}> 
                    <Icon icon="iconoir:playlist" width="30" className='mainIcon' />
                    <Typography sx={{pl:2,pr:2,mb:3}} variant="h5" gutterBottom>
                        Créez une playlist en temps réel a plusieurs
                    </Typography>
                    <Typography sx={{pl:2,pr:2,mb:2,mt:3, color:'var(--white)'}} >
                        Ajoutez des médias depuis <i>Spotify, Youtube, Deezer, et bien d'autre plateformes</i> à une playlist collective lue en temps réel.
                    </Typography>
                    <Typography sx={{pl:2,pr:2,mt:2, color:'var(--white)'}} >
                        Votez, tchatez, réagissez et vibrez ensemble au rythme de votre playlist. <b>Entre potes, en soirée, en voiture, en voyage, ou au sport, Play-it est l'outil indispensable !</b>
                    </Typography>
                </Box>,
            },
            {
                id: '1',
                renderItem: 
                <Box className={activeItem == 1 ? 'slideBox activeSlideBox' : 'slideBox'}> 
                    <Icon icon="carbon:network-2" width="30" className='mainIcon' />
                    <Typography sx={{pl:2,pr:2}} variant="h5" gutterBottom>
                        En étant tous au même endroit ..
                    </Typography>
                    <Typography sx={{pl:2,pr:2, color:'var(--white)'}} >
                        <b>Idéal pour les soirées</b>, une room Play-it permet a chaque convive d'ajouter sa musique ou sa vidéo à la suite de la playlist, plus besoin d'utiliser le téléphone de l'hôte de la soirée !
                    </Typography>
                </Box>,
            },
            {
                id: '2',
                renderItem: 
                <Box className={activeItem == 2 ? 'slideBox activeSlideBox' : 'slideBox'}> 
                    <Icon icon="carbon:network-4" width="30" className='mainIcon' />
                    <Typography sx={{pl:2,pr:2}} variant="h5" gutterBottom>
                        .. ou en étant chacun chez soi
                    </Typography>
                    <Typography sx={{pl:2,pr:2, color:'var(--white)'}} >
                        Grâce à Play-it, vibre au même rythme que tes potes à des endroits différents de la planète ! 
                    </Typography>
                    <Typography sx={{pl:2,pr:2, color:'var(--white)'}} >
                        En voyage, chacun dans sa voiture, chacun chez soi en révisant ou en mattant les dernières vidéos youtube sous la couette !
                    </Typography>
                </Box>,
            },
            {
                id: '3',
                renderItem: 
                <Box className={activeItem == 3 ? 'slideBox activeSlideBox' : 'slideBox'}> 
                    <Icon icon="lucide:party-popper" width="30" className='mainIcon' />
                    <Typography sx={{pl:2,pr:2}} variant="h5" gutterBottom>
                        Une playlist.. et bien plus !
                    </Typography>
                    <Typography sx={{pl:2,pr:2, color:'var(--white)'}} >
                        Grâce au chat, aux émoticones et aux votes, les membres de la room font partie intégrante de l'ambiance !
                    </Typography>
                    <Typography sx={{pl:2,pr:2, color:'var(--white)'}} >
                        Retrouvez et relisez les playlist qui vous on plu grâce à la lecture désynchronisée !
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