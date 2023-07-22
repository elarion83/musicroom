import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";

import { Icon } from '@iconify/react';

import { useSpringCarousel } from 'react-spring-carousel';

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
                <Box className={activeItem == 0 ? 'slideBox activeSlideBox' : 'slideBox'} onClick={(e) => slideToItem(0)} > 
                    <Icon icon="iconoir:playlist" width="30" className='mainIcon' />
                    <Typography sx={{pl:2,pr:2,mb:3}} variant="h5" gutterBottom className='varelaFontTitle'>
                        Créez une playlist en temps réel a plusieurs
                    </Typography>
                    <Typography sx={{pl:2,pr:2,mb:2,mt:3, color:'var(--white)'}} className='fontFamilyOpenSans'>
                        Ajoutez des médias depuis <b>Spotify, Youtube, Deezer, Soundcloud, .. </b> à une playlist collective lue en temps réel.
                    </Typography>
                    <Typography sx={{pl:2,pr:2,mt:2, color:'var(--white)'}} className='fontFamilyOpenSans'>
                        Votez, tchatez, réagissez et vibrez ensemble au rythme de votre playlist. <b>Entre potes, en soirée, en voiture, en voyage, ou au sport, Play-it est l'outil indispensable !</b>
                    </Typography>
                </Box>,
            },
            {
                id: '1',
                renderItem: 
                <Box className={activeItem == 1 ? 'slideBox activeSlideBox' : 'slideBox'} onClick={(e) => slideToItem(1)}> 
                    <Icon icon="carbon:network-2" width="30" className='mainIcon' />
                    <Typography sx={{pl:2,pr:2}} variant="h5" gutterBottom>
                        En étant tous au même endroit ..
                    </Typography>
                    <Typography sx={{pl:2,pr:2, color:'var(--white)'}} className='fontFamilyOpenSans'>
                        <b>Idéal pour les soirées</b>, Play-it permet a chaque convive d'ajouter sa musique ou sa vidéo à la suite de la playlist, <b>plus besoin d'utiliser le téléphone de l'hôte de la soirée !</b>
                    </Typography>
                </Box>,
            },
            {
                id: '2',
                renderItem: 
                <Box className={activeItem == 2 ? 'slideBox activeSlideBox' : 'slideBox'} onClick={(e) => slideToItem(2)}> 
                    <Icon icon="carbon:network-4" width="30" className='mainIcon' />
                    <Typography sx={{pl:2,pr:2}} variant="h5" gutterBottom>
                        .. ou en étant chacun chez soi
                    </Typography>
                    <Typography sx={{pl:2,pr:2, color:'var(--white)'}} className='fontFamilyOpenSans'>
                        Vibre au même rythme que tes potes <b>à des endroits différents</b> de la planète ! 
                    </Typography>
                    <Typography sx={{pl:2,pr:2, color:'var(--white)'}} className='fontFamilyOpenSans'>
                        <b>En voyage, chacun dans sa voiture, chacun chez soi</b> en révisant ou en mattant les dernières vidéos youtube sous la couette !
                    </Typography>
                </Box>,
            },
            {
                id: '3',
                renderItem: 
                <Box className={activeItem == 3 ? 'slideBox activeSlideBox' : 'slideBox'} onClick={(e) => slideToItem(3)}> 
                    <Icon icon="lucide:party-popper" width="30" className='mainIcon' />
                    <Typography sx={{pl:2,pr:2}} variant="h5" gutterBottom>
                        Une playlist.. et bien plus !
                    </Typography>
                    <Typography sx={{pl:2,pr:2, color:'var(--white)'}} className='fontFamilyOpenSans'>
                        Grâce au <b>chat, aux émoticones et aux votes</b>, les membres de la room font partie intégrante de l'ambiance !
                    </Typography>
                    <Typography sx={{pl:2,pr:2, color:'var(--white)'}} className='fontFamilyOpenSans'>
                        Retrouvez et relisez les playlist qui vous on plu grâce à la <b>lecture désynchronisée</b> !
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